from datetime import datetime
from extensions import db

class Batch(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    batch_number = db.Column(db.String(50), nullable=False, unique=True)
    technician_name = db.Column(db.String(50), nullable=False)
    mmd_version = db.Column(db.String(10), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    fingers = db.relationship('Finger', backref='batch', lazy=True)

    def __repr__(self):
        return f"<Batch {self.batch_number}>"

class Finger(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    version = db.Column(db.String(50), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    size = db.Column(db.String(50), nullable=False)
    mold_id = db.Column(db.String(50), nullable=False)
    batch_id = db.Column(db.Integer, db.ForeignKey('batch.id'), nullable=False)

    failures = db.relationship('Failure', backref='finger', lazy=True)

    def __repr__(self):
        return f"<Finger {self.version} {self.size} {self.type}>"

class Failure(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    phase = db.Column(db.String(50), nullable=False)
    failure_type = db.Column(db.String(100), nullable=False)
    finger_id = db.Column(db.Integer, db.ForeignKey('finger.id'), nullable=False)

    def __repr__(self):
        return f"<Failure {self.phase} {self.failure_type}>"
    
class Mold(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    version = db.Column(db.String(50), nullable=False)
    label = db.Column(db.String(50), nullable=False)
    size = db.Column(db.String(50), nullable=False)
    mold_uses = db.Column(db.Integer)
    
    def __repr__(self):
        return f"<{self.size} Mold {self.label} used {self.mold_uses} times>"
