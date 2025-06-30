from flask import Blueprint, request, jsonify
from models import Finger, Mold
from extensions import db

fingers_bp = Blueprint('fingers', __name__)

@fingers_bp.route('/fingers', methods=['POST'])
def create_finger():
    data = request.get_json()

    # Support both single object and list of objects
    if isinstance(data, dict):
        data = [data]

    if not isinstance(data, list):
        return jsonify({"message": "Invalid input: expected a finger object or list of finger objects"}), 400

    created_fingers = []
    for item in data:
        finger_type = item.get('type')
        size = item.get('size')
        mold_id = item.get('mold_id')
        batch_id = item.get('batch_id')

        if not all([finger_type, size, mold_id, batch_id]):
            return jsonify({"message": "All fields (type, size, mold_id, batch_id) are required for each finger"}), 400


#Queries the molds and lets us know which mold each finger used
        mold = Mold.query.get(mold_id)
        if not mold:
            return jsonify({"message": f"Mold with ID {mold_id} not found"}), 400


        finger = Finger(
            version=mold.version,
            type=finger_type,
            size=size,
            mold_id=mold_id,
            batch_id=batch_id
        )
        db.session.add(finger)
        created_fingers.append(finger)

    db.session.commit()

    return jsonify({
        "message": f"{len(created_fingers)} finger(s) created successfully!",
        "created": [{
            "id": f.id, "version": f.version, "type": f.type, "size": f.size,
            "mold_id": f.mold_id, "batch_id": f.batch_id
        } for f in created_fingers]
    }), 201

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
