from flask import Blueprint, request, jsonify
from models import Failure
from extensions import db

failures_bp = Blueprint('failures', __name__)

@failures_bp.route('/failure', methods=['POST'])
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

@failures_bp.route('/failures', methods=['GET'])
def get_failures():
    failures = Failure.query.all()
    return jsonify([{
        "id": f.id, "phase": f.phase, "failure_type": f.failure_type, "finger_id": f.finger_id
    } for f in failures])
