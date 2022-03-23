from flask import Flask
from flask_cors import CORS
from sqlalchemy.engine.url import make_url
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.exc import OperationalError, ProgrammingError

from api.config import Config
from api.controllers.controller_main import bp
from api.models import db


# method to create a flask app instance
def create_app(configs="api.config.Config"):
    app = Flask(__name__)
    with app.app_context():
        app.config.from_object(configs)
        init_db(app)
        app.db = db

    CORS(app)
    app.register_blueprint(bp)

    return app


# method to initialize the SQLAlchemy handler (db)
def init_db(app):
    url = make_url(app.config["DATABASE_URL"])
    db.init_app(app)
    db.app = app
    try:
        if not database_exists(url):
            create_database(url)
        db.create_all()
    except OperationalError:
        db.create_all()
    except ProgrammingError:
        pass
    else:
        db.create_all()