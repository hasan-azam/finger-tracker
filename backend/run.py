from flask import Flask, jsonify, request
from extensions import db

def create_app():
    # Initialize Flask app
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'

    # Bind the app to the db instance
    db.init_app(app)

    # Import models only after db is initialized
    from models import Batch, Finger, Failure  # Import models here

    with app.app_context():
        db.create_all()

    # ------- Define Routes inside create_app -------- #

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

        finger = Finger(
            version=version,
            type=finger_type,
            size=size,
            mold_id=mold_id,
            batch_id=batch_id
        )
        db.session.add(finger)
        db.session.commit()

        return jsonify({"message": f"Finger {finger.version} {finger.size} {finger.type} created successfully!"}), 201

    @app.route('/batch', methods=['POST'])
    def create_batch():
        data = request.get_json()
        batch_number = data.get('batch_number')

        if not batch_number:
            return jsonify({"message": "Batch number is required"}), 400
        
        batch = Batch(batch_number=batch_number)
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

        failure = Failure(
            phase=phase,
            failure_type=failure_type,
            finger_id=finger_id
        )
        db.session.add(failure)
        db.session.commit()

        return jsonify({"message": f"Failure recorded for finger ID {finger_id} during {phase} phase!"}), 201

    @app.route('/fingers/stats', methods=['GET'])
    def get_finger_stats():
        total_fingers = Finger.query.count()
        return jsonify({"total_fingers": total_fingers})

    # --------- NEW GET ROUTES --------- #

    @app.route('/batches', methods=['GET'])
    def get_batches():
        batches = Batch.query.all()
        batch_list = [{"id": batch.id, "batch_number": batch.batch_number} for batch in batches]
        return jsonify(batch_list)

    @app.route('/fingers', methods=['GET'])
    def get_fingers():
        fingers = Finger.query.all()
        finger_list = [{
            "id": finger.id,
            "version": finger.version,
            "type": finger.type,
            "size": finger.size,
            "mold_id": finger.mold_id,
            "batch_id": finger.batch_id
        } for finger in fingers]
        return jsonify(finger_list)

    @app.route('/failures', methods=['GET'])
    def get_failures():
        failures = Failure.query.all()
        failure_list = [{
            "id": failure.id,
            "phase": failure.phase,
            "failure_type": failure.failure_type,
            "finger_id": failure.finger_id
        } for failure in failures]
        return jsonify(failure_list)

    @app.route('/batches/<int:batch_id>/fingers', methods=['GET'])
    def get_fingers_by_batch(batch_id):
        fingers = Finger.query.filter_by(batch_id=batch_id).all()
        finger_list = [{
        "id": finger.id,
        "version": finger.version,
        "type": finger.type,
        "size": finger.size,
        "mold_id": finger.mold_id,
        "batch_id": finger.batch_id
        } for finger in fingers]

        return jsonify(finger_list)
    # ------------------------------------------------ #

    return app

# Only run the app if this file is run directly (not imported)
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
