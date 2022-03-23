# add static configurations here

class Config():
    # database related
    SQLALCHEMY_DATABASE_URI = DATABASE_URL = "mysql+pymysql://dev_CS5224:dev_CS5224@localhost/exercise_plus"
    SQLALCHEMY_TRACK_MODIFICATIONS = False