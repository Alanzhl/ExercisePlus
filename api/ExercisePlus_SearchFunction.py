# import the json utility package since we will be working with a JSON object
import json
# import the AWS SDK (for Python the package name is boto3)
import boto3
# import 'request' package to handle API requests
import urllib3
# import regex package for datetime processing
import re
# import heapq to sort the areas by their distances to the destination
import heapq
# import 'datetime' package to help us with dates and date formatting
from datetime import datetime, timezone, timedelta
# import 'math' to calculate distance with longitudes and latitudes
from math import radians, cos, sin, asin, sqrt


API_WEATHER = "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast"
API_ONEMAP = "https://developers.onemap.sg/commonapi/search"
DEFAULT_DISTANCE = 2000

# create a DynamoDB object using the AWS SDK
dynamodb = boto3.resource('dynamodb')
# use the DynamoDB object to select our table
tableGyms = dynamodb.Table('ExercisePlus-Gyms')
tableParks = dynamodb.Table('ExercisePlus-Parks')

# define the handler function that the Lambda service will use as an entry point
def lambda_handler(event, context):
    # extract values from the event object we got from the Lambda service and store in a variable
    keyword = event['target']
    # differentiate places with differentiated names
    patterns = re.compile(" \((\d+)\)").split(keyword)
    dupIndex = 0
    if len(patterns) > 1:
        keyword, dupIndex = patterns[0], int(patterns[1])
            
    http = urllib3.PoolManager()
    weathers = []
    parks = []
    gyms = []
            
    # call to Onemap API
    response = http.request('GET', API_ONEMAP + "?searchVal=" + keyword + "&returnGeom=Y&getAddrDetails=Y&pageNum=1")
    searchResults = json.loads(response.data.decode('utf-8'))
    destination = {}
    if searchResults["found"] > 0:
        info = searchResults["results"][0]    # use the first search result as the default choice
        if dupIndex > 0:                      # find our selected place among duplicated result names
            for place in searchResults["results"]:
                if place["SEARCHVAL"] == keyword:
                    dupIndex -= 1
                    if dupIndex == 0:
                        info = place
                        break
        destination["name"] = info["SEARCHVAL"]
        destination["longitude"] = float(info["LONGITUDE"])
        destination["latitude"] = float(info["LATITUDE"])
            
        # call to weather API
        currentTime = datetime.now(timezone(timedelta(hours=8))).isoformat(sep='T')
        currentTimeWithoutMillis = re.search("[^\.]+", currentTime).group()    # strip milliseconds from the iso-formatted time
        response = http.request('GET', API_WEATHER + "?date_time=" + currentTimeWithoutMillis)
        weatherResults = json.loads(response.data.decode('utf-8'))
        # step 1: find out the 3 nearest areas
        distanceQueue = []    # (distance (in degrees), name)
        for area in weatherResults["area_metadata"]:
            distanceQueue.append((haversine(area["label_location"]["longitude"], area["label_location"]["latitude"], 
                                            destination["longitude"], destination["latitude"]), 
                                    area["name"]))
        heapq.heapify(distanceQueue)
        nearbyAreas = heapq.nsmallest(3, distanceQueue)
        while len(nearbyAreas) > 1 and nearbyAreas[-1][0] > 1.5 * DEFAULT_DISTANCE:
            nearbyAreas.pop(-1)
        # TODO: step 2: retrieve the nearyby weather forecasts
        for area in nearbyAreas:
            for item in weatherResults["items"][0]["forecasts"]:
                if item["area"] == area[1]:
                    weathers.append(item)
                    break
                
        allGyms = tableGyms.scan()
        allParks = tableParks.scan()
        
        # process and filter the gyms
        for gym in allGyms["Items"]:
            coordinates = gym["coordinates"]
            locations = re.findall(r"\d+\.?\d*", coordinates)
            x = float(locations[0])
            y = float(locations[1])
    
            distance = haversine(destination["longitude"], destination["latitude"], x, y)
            if distance <= DEFAULT_DISTANCE:
                gyms.append({
                    "id" : int(gym["id"]), 
                    "name" : gym["name"],
                    "longitude" : x, "latitude" : y,
                    "description" : gym["description"] if gym.get("description") else "",
                    "priority" : int(gym["priority"])
                })

        # process and filter the parks
        for park in allParks["Items"]:
            coordinates = park["coordinates"]
            locations = re.findall(r"\d+\.?\d*", coordinates)
            x = float(locations[0])
            y = float(locations[1])
    
            distance = haversine(destination["longitude"], destination["latitude"], x, y)
            if distance <= DEFAULT_DISTANCE:
                parks.append({
                    "id" : int(park["id"]), 
                    "name" : park["name"],
                    "longitude" : x, "latitude" : y,
                    "description" : park["description"] if park.get("description") else "",
                    "priority" : int(park["priority"])
                })

    gyms.sort(key = lambda i: i['priority'], reverse=True)
    parks.sort(key = lambda i: i['priority'], reverse=True)
            
    # return a properly formatted JSON object
    return {
        'statusCode': 200,
        'body': json.dumps({
            "success" : 1, 
            "destination" : destination,
            "weathers" : weathers,
            "parks" : parks,
            "gyms" : gyms
        })
    }
    
    
# helper function that calculates the distance between place 1 and 2
def haversine(lon1, lat1, lon2, lat2):
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371
    return c * r * 1000