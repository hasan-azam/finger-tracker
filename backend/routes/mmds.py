from flask import Blueprint, request, jsonify
from models import db, MMD

mmds_bp = Blueprint('mmds', __name__)

# Get all MMDs
@mmds_bp.route('/mmds', methods=['GET'])
def get_all_mmds():
    mmds = MMD.query.all()
    return jsonify([{
        'id': mmd.id,
        'serial_number': mmd.serial_number,
        'name': mmd.name
    } for mmd in mmds])

# Create a new MMD
@mmds_bp.route('/mmds', methods=['POST'])
def create_mmd():
    data = request.get_json()
    serial_number = data.get('serial_number')
    name = data.get('name')

    if not serial_number:
        return jsonify({'error': 'serial_number is required'}), 400

    mmd = MMD(serial_number=serial_number, name=name)
    db.session.add(mmd)
    db.session.commit()
    return jsonify({'id': mmd.id, 'serial_number': mmd.serial_number, 'name': mmd.name}), 201

# Get a single MMD
@mmds_bp.route('/mmds/<int:mmd_id>', methods=['GET'])
def get_mmd(mmd_id):
    mmd = MMD.query.get_or_404(mmd_id)
    return jsonify({
        'id': mmd.id,
        'serial_number': mmd.serial_number,
        'name': mmd.name
    })

# Update an MMD
@mmds_bp.route('/mmds/<int:mmd_id>', methods=['PUT'])
def update_mmd(mmd_id):
    mmd = MMD.query.get_or_404(mmd_id)
    data = request.get_json()

    mmd.serial_number = data.get('serial_number', mmd.serial_number)
    mmd.name = data.get('name', mmd.name)

    db.session.commit()
    return jsonify({'message': 'MMD updated successfully'})

# Delete an MMD
@mmds_bp.route('/mmds/<int:mmd_id>', methods=['DELETE'])
def delete_mmd(mmd_id):
    mmd = MMD.query.get_or_404(mmd_id)
    db.session.delete(mmd)
    db.session.commit()
    return jsonify({'message': 'MMD deleted successfully'})
