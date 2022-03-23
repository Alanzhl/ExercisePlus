from . import db


# definition of a database table
class Park(db.Model):
    __tablename__ = "parks"
    park_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), index=True)
    longitude = db.Column(db.Float)
    latitude = db.Column(db.Float)
    description = db.Column(db.Text)
    ref_id = db.Column(db.Integer)

    db.Index('idx_position', longitude, latitude)


    def __eq__(self, other):
        return self.park_id == other.park_id