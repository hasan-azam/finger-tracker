from flask import Flask, jsonify, request
from flask_migrate import Migrate
from extensions import db
from models import Batch, Finger, Failure, Mold
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    Migrate(app, db)  # Enable Flask-Migrate
    CORS(app) #Allows CORS between frontend and backend
    # Define routes
    @app.route('/')
    def hello():
        return jsonify({"message": "Finger Tracker is running successfully!"})

    @app.route('/api/hello')
    def api_hello():
        return jsonify({"message": "Hello from the API!"})

    @app.route('/finger', methods=['POST'])
    def create_finger():
        data = request.get_json()
        version = data.get('version')
        finger_type = data.get('type')
        size = data.get('size')
        mold_id = data.get('mold_id')
        batch_id = data.get('batch_id')

        if not all([version, finger_type, size, mold_id, batch_id]):
            return jsonify({"message": "All fields are required"}), 400

        finger = Finger(version=version, type=finger_type, size=size, mold_id=mold_id, batch_id=batch_id)
        db.session.add(finger)
        db.session.commit()
        return jsonify({"message": f"Finger {finger.version} {finger.size} {finger.type} created successfully!"}), 201

    @app.route('/batch', methods=['POST'])
    def create_batch():
        data = request.get_json()
        batch_number = data.get('batch_number')
        technician_name = data.get('technician_name')
        mmd_version = data.get('mmd_version')

        if not all([batch_number, technician_name, mmd_version]):
            return jsonify({"message": "All fields are required"}), 400

        batch = Batch(batch_number=batch_number, technician_name=technician_name, mmd_version=mmd_version)
        db.session.add(batch)
        db.session.commit()
        return jsonify({"message": f"Batch {batch.batch_number} created successfully!"}), 201

    @app.route('/failure', methods=['POST'])
    def create_failure():
        data = request.get_json()
        phase = data.get('phase')
        failure_type = data.get('failure_type')
        finger_id = data.get('finger_id')

        if not all([phase, failure_type, finger_id]):
            return jsonify({"message": "All fields are required"}), 400

        failure = Failure(phase=phase, failure_type=failure_type, finger_id=finger_id)
        db.session.add(failure)
        db.session.commit()
        return jsonify({"message": f"Failure recorded for finger ID {finger_id} during {phase} phase!"}), 201

    @app.route('/fingers/stats', methods=['GET'])
    def get_finger_stats():
        total_fingers = Finger.query.count()
        return jsonify({"total_fingers": total_fingers})

    @app.route('/batches', methods=['GET'])
    def get_batches():
        batches = Batch.query.all()
        return jsonify([{"id": b.id, "batch_number": b.batch_number, "mmd_version":b.mmd_version} for b in batches])

    @app.route('/fingers', methods=['GET'])
    def get_fingers():
        fingers = Finger.query.all()
        return jsonify([{
            "id": f.id, "version": f.version, "type": f.type, "size": f.size,
            "mold_id": f.mold_id, "batch_id": f.batch_id
        } for f in fingers])

    @app.route('/failures', methods=['GET'])
    def get_failures():
        failures = Failure.query.all()
        return jsonify([{
            "id": f.id, "phase": f.phase, "failure_type": f.failure_type, "finger_id": f.finger_id
        } for f in failures])

    @app.route('/batches/<int:batch_id>/fingers', methods=['GET'])
    def get_fingers_by_batch(batch_id):
        fingers = Finger.query.filter_by(batch_id=batch_id).all()
        return jsonify([{
            "id": f.id, "version": f.version, "type": f.type, "size": f.size,
            "mold_id": f.mold_id, "batch_id": f.batch_id
        } for f in fingers])
    
    @app.route('/molds', methods=['GET', 'POST'])
    def handle_molds():
        if request.method == 'GET':
            molds = Mold.query.all()
            return jsonify([
                {
                    'id': mold.id,
                    'version': mold.version,
                    'label': mold.label,
                    'size': mold.size,
                    'mold_uses': mold.mold_uses
                }
                for mold in molds
            ])
        if request.method == 'POST':
            data = request.get_json()
            new_mold = Mold(
                version=data['version'],
                label=data['label'], size=data['size'],
                mold_uses=data.get('mold_uses', 0)
            )
            db.session.add(new_mold)
            db.session.commit()
            return jsonify({'message': 'Mold added'}), 201
        
    @app.route('/molds/<int:id>/', methods=['PUT', 'DELETE'])
    def handle_single_mold(id):
        mold = Mold.query.get_or_404(id)

        if request.method == 'PUT':
            data = request.get_json()
            mold.version = data.get('version', mold.version)
            mold.label = data.get('label', mold.label)
            mold.size = data.get('size', mold.size)
            mold.mold_uses = data.get('mold_uses', mold.mold_uses)
            db.session.commit()
            return jsonify({'message': 'Mold updated'})

        if request.method == 'DELETE':
            db.session.delete(mold)
            db.session.commit()
            return jsonify({'message': 'Mold deleted'})
    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)
