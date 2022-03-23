from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

from .parks import Park    # database models are imported here for ease of reference in other directories