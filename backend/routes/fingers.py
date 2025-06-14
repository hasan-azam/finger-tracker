from flask import Blueprint, request, jsonify
from models import Finger
from extensions import db

fingers_bp = Blueprint('fingers', __name__)

@fingers_bp.route('/fingers', methods=['POST'])
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

@fingers_bp.route('/fingers/stats', methods=['GET'])
def get_finger_stats():
    total_fingers = Finger.query.count()
    return jsonify({"total_fingers": total_fingers})

@fingers_bp.route('/fingers', methods=['GET'])
def get_fingers():
    fingers = Finger.query.all()
    return jsonify([{
        "id": f.id, "version": f.version, "type": f.type, "size": f.size,
        "mold_id": f.mold_id, "batch_id": f.batch_id
    } for f in fingers])

@fingers_bp.route('/batches/<int:batch_id>/fingers', methods=['GET'])
def get_fingers_by_batch(batch_id):
    fingers = Finger.query.filter_by(batch_id=batch_id).all()
    return jsonify([{
        "id": f.id, "version": f.version, "type": f.type, "size": f.size,
        "mold_id": f.mold_id, "batch_id": f.batch_id
    } for f in fingers])
