from flask import Blueprint, request, jsonify

# from api.models import db, Park


bp = Blueprint("mainbp", __name__)

# each path is bound with a processing method
@bp.route("/api/search", methods=["POST"])
def processSearch():
    data = request.get_json()    # values transferred between the servers are wrapped as json types
    if data["target"] == "":
        return jsonify({"success" : 0, "message" : "empty request is not procceeded."})
    else:
        return jsonify({
            "success" : 1, 
            "weathers" : [{
                "name" : "Clementi", "weather" : "Showers"
            }, {
                "name" : "Queenstown", "weather" : "Partly Cloudy (Day)"
            }],
            "parks" : [{
                "name" : "one-north Park: Mediapolis",
                "longitude" : 103.792829540115, "latitude" : 1.29493834487393,
                "description" : "Media Circle, next to MediaCorp campus"
            }, {
                "name" : "one-north Park: Fusionopolis South",
                "longitude" : 103.790721343478, "latitude" : 1.29961302753491,
                "description" : "Along Central Exchange Green"
            }, {
                "name" : "Clementi Woods Park",
                "longitude" : 103.767616991901, "latitude" : 1.29893400799437,
                "description" : "Along West Coast Road next to West Coast Plaza"
            }, {
                "name" : "West Coast Park",
                "longitude" : 103.762999956965, "latitude" : 1.29615329873174,
                "description" : "Parallel to West Coast Highway"
            }, {
                "name" : "Kent Ridge Park",
                "longitude" : 103.790318992831, "latitude" : 1.28435300657627,
                "description" : "Vigilante Drive off South Buona Vista Road"
            }],
            "gyms" : [{
                "name" : "Clementi ClubFITT Gym",
                "longitude" : 103.764861415667, "latitude" : 1.31101498462879,
                "description" : """Facilities: Standard Gymnasium Equipment 
                    Operating Hours: 7.00 AM to 10.00 PM (Mon/Wed/Fri), 8.30 AM to 10.00 PM (Tue/Thur), 
                    8.30 AM to 8.00 PM (Sat), 9.00 AM to 8.00 Pm (Sun), 9.00 AM to 5.00 PM (Public Holiday)"""
            }, {
                "name" : "Pilates Bodyworks - Holland",
                "longitude" : 103.79254748678, "latitude" : 1.30918211194726,
                "description" : ""
            }, {
                "name" : "Jurong East ClubFITT Gym",
                "longitude" : 103.79254748678, "latitude" : 1.30918211194726,
                "description" : """Facilities: Standard Gymnasium Equipment and Exercise Equipment 
                    Operating Hours: 7.00 AM to 10.00 PM (Mon/Wed/Fri), 8.30 AM to 10.00 PM (Tue/Thur), 
                    8.30 AM to 8.00 PM (Sat), 9.00 AM to 8.00 Pm (Sun), 9.00 AM to 5.00 PM (Public Holiday)
                    Tel: 6896 3569"""
            }]})


# # test method to insert sample data to the database
# @bp.route("/api/insertSamples", methods=["POST"])
# def insertSamples():
#     parks = [
#         Park(name="Jalan Pelatok Open Space", 
#             longitude=103.96085701087, 
#             latitude=1.34617500824454, 
#             description="Jalan Pelatok",
#             ref_id=2),
#         Park(name="Turnhouse Park", 
#             longitude=103.978978976056, 
#             latitude=1.38990401870983, 
#             description="Natheravon Road",
#             ref_id=1),
#         Park(name="Coney Island Park", 
#             longitude=103.923130995416, 
#             latitude=1.4099130157165, 
#             description="Beside Punggol Promenade Nature Walk",
#             ref_id=3),
#     ]
#     db.session.add_all(parks)
#     db.session.commit()

#     return jsonify({"success" : 1})


# # test method to read data from the database
# @bp.route("/api/listSamples", methods=["POST"])
# def listSamples():
#     samples = []
#     for park_id, name, description in db.session.query(Park.park_id, Park.name, Park.description):
#         samples.append({"park_id" : park_id, "name" : name, "description" : description})
#     print(samples)

#     return jsonify({"success" : 1, "values" : samples})


# # test method to delete data in the database
# @bp.route("/api/clearSamples", methods=["POST"])
# def clearSamples():
#     samples = Park.query.delete()
#     db.session.commit()
#     db.session.close()
#     return jsonify({"success" : 1})