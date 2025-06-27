from flask import Blueprint, request, jsonify
from models import Batch
from extensions import db

batches_bp = Blueprint('batches', __name__)

@batches_bp.route('/batches', methods=['POST'])
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
    return jsonify({"message": f"Batch {batch.batch_number} created successfully!", "batch_id": batch.batch_number}), 201

@batches_bp.route('/batches', methods=['GET'])
def get_batches():
    batches = Batch.query.all()
    return jsonify([
        {
            "id": b.id,
            "batch_number": b.batch_number,
            "mmd_version": b.mmd_version
        } for b in batches
    ])
