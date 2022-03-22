from flask import Flask
from flask_cors import CORS
from api.config import Config
from api.controllers.controller_main import bp


def create_app(configs="api.config.Config"):
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(configs)
    app.register_blueprint(bp)

    return app