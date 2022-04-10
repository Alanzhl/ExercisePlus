# ***ExercisePlus_GetSearchOptions***:
# 
# This lambda function is used to generate possible matching results for a fuzzy search.
# Every time the user changes the search keyword, a request to get the current matching
# results would be sent to this function, which forwards the request to OneMap API, 
# processes the response from the API and returns the displayable results back to the frontend.


# import the json utility package since we will be working with a JSON object
import json
# import 'request' package to handle API requests
import urllib3


API_ONEMAP = "https://developers.onemap.sg/commonapi/search"

# define the handler function that the Lambda service will use as an entry point
def lambda_handler(event, context):
    # extract values from the event object we got from the Lambda service and store in a variable
    keyword = event['target']
    
    # helper function to extract info from search results
    def extractResults(results):
        extracted = []
        dups = {}    # avoid duplicated names that might cause conflict in ant-design
        for result in results:
            info = {
                "name" : result["SEARCHVAL"],
                "address" : result["ADDRESS"],
                "longitude" : float(result["LONGITUDE"]),
                "latitude" : float(result["LATITUDE"])
            }
            if dups.get(info["name"]) == None:
                dups[info["name"]] = 1
            else:
                dups[info["name"]] += 1
                info["name"] += " (%s)" % (dups[info["name"]])
            extracted.append(info)
        return extracted
            
    # call to onemap API
    http = urllib3.PoolManager()
    response = http.request('GET', API_ONEMAP + "?searchVal=" + keyword + "&returnGeom=Y&getAddrDetails=Y&pageNum=1")
    searchResults = json.loads(response.data.decode('utf-8'))
    organizedResults = {
        "found" : searchResults["found"], 
        "results" : extractResults(searchResults["results"])
    }
            
    # return a properly formatted JSON object
    return {
        'statusCode': 200,
        'body': json.dumps({
            "success" : 1,
            "results" : organizedResults
        })
    }
