from datetime import datetime

from extensions import db  # Import db instance from your run.py file

class Batch(db.Model):
    id = db.Column(db.Integer, primary_key=True) #Each bactch has a unique ID
    batch_number = db.Column(db.String(50), nullable=False, unique=True) # Each batch has a unique number
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    #One to many: one batch can have many fingers
    fingers = db.relationship('Finger', backref='batch, lazy=True')

    def __repr__(self):
        return f"<Batch {self.batch_number}>"

class Finger(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each finger
    version = db.Column(db.String(50), nullable=False)  # Version of the finger (e.g., '9.0', '9.5')
    type = db.Column(db.String(50), nullable=False)  # Type of finger (e.g., 'sensorized', 'unsensorized')
    size = db.Column(db.String(50), nullable=False)  # Size of the finger (e.g., 'large', 'small')
    mold_id = db.Column(db.String(50), nullable=False)  # ID of the mold used for the finger
    batch_id = db.Column(db.Integer, db.ForeignKey('batch.id'), nullable=False)  # Foreign key to the batch

    # One-to-many relationship: one finger can have many failures
    failures = db.relationship('Failure', backref='finger', lazy=True)

    def __repr__(self):
        return f"<Finger {self.version} {self.size} {self.type}>"
    
class Failure(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each failure
    phase = db.Column(db.String(50), nullable=False)  # Phase where failure occurred ('molding' or 'fsr')
    failure_type = db.Column(db.String(100), nullable=False)  # Specific type of failure (e.g., 'bone misalignment')
    finger_id = db.Column(db.Integer, db.ForeignKey('finger.id'), nullable=False)  # Foreign key to the finger

    def __repr__(self):
        return f"<Failure {self.phase} {self.failure_type}>"

