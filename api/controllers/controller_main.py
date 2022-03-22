from flask import Blueprint, request, jsonify


bp = Blueprint("mainbp", __name__)


@bp.route("/api/search", methods=["POST"])
def processSearch():
    data = request.get_json()
    if data["target"] == "":
        return jsonify({"success" : 0, "message" : "empty request is not procceeded."})
    else:
        return jsonify({"success" : 1, "message" : data["target"]})