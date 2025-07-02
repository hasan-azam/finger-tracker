from flask import Blueprint, request, jsonify
from models import Batch, Mold
from extensions import db

batches_bp = Blueprint('batches', __name__)

@batches_bp.route('/batches', methods=['POST'])
def create_batch():
    data = request.get_json()
    batch_number = data.get('batch_number')
    technician_name = data.get('technician_name')
    mmd_id = data.get('mmd_id')
    mold_ids = data.get('mold_ids', [])


#Field Validation
    if not all([batch_number, technician_name, mmd_id]):
        return jsonify({"message": "All fields are required"}), 400

#Create the batch

    batch = Batch(batch_number=batch_number, technician_name=technician_name, mmd_id=mmd_id)
    db.session.add(batch)
    db.session.commit()


#Increment mold_uses
    for mold_id in mold_ids:
        mold = Mold.query.get(mold_id)
        if mold:
            mold.mold_uses += 1
            db.session.add(mold)
        else:
            print(f"Warning: Mold with ID {mold_id} not found")
    db.session.commit()


    return jsonify({"message": f"Batch {batch.batch_number} created successfully!", "batch_id": batch.id}), 201

@batches_bp.route('/batches', methods=['GET'])
def get_batches():
    batches = Batch.query.all()
    return jsonify([
        {
            "id": b.id,
            "batch_number": b.batch_number,
            "mmd_id": b.mmd_id
        } for b in batches
    ])
