from flask import Blueprint, request, jsonify

from api.models import db, Park


bp = Blueprint("mainbp", __name__)

# each path is bound with a processing method
@bp.route("/api/search", methods=["POST"])
def processSearch():
    data = request.get_json()    # values transferred between the servers are wrapped as json types
    if data["target"] == "":
        return jsonify({"success" : 0, "message" : "empty request is not procceeded."})
    else:
        return jsonify({"success" : 1, "message" : data["target"]})


# test method to insert sample data to the database
@bp.route("/api/insertSamples", methods=["POST"])
def insertSamples():
    parks = [
        Park(name="Jalan Pelatok Open Space", 
            longitude=103.96085701087, 
            latitude=1.34617500824454, 
            description="Jalan Pelatok",
            ref_id=2),
        Park(name="Turnhouse Park", 
            longitude=103.978978976056, 
            latitude=1.38990401870983, 
            description="Natheravon Road",
            ref_id=1),
        Park(name="Coney Island Park", 
            longitude=103.923130995416, 
            latitude=1.4099130157165, 
            description="Beside Punggol Promenade Nature Walk",
            ref_id=3),
    ]
    db.session.add_all(parks)
    db.session.commit()

    return jsonify({"success" : 1})


# test method to read data from the database
@bp.route("/api/listSamples", methods=["POST"])
def listSamples():
    samples = []
    for park_id, name, description in db.session.query(Park.park_id, Park.name, Park.description):
        samples.append({"park_id" : park_id, "name" : name, "description" : description})
    print(samples)

    return jsonify({"success" : 1, "values" : samples})


# test method to delete data in the database
@bp.route("/api/clearSamples", methods=["POST"])
def clearSamples():
    samples = Park.query.delete()
    db.session.commit()
    db.session.close()
    return jsonify({"success" : 1})