# routes/molds.py
from flask import Blueprint, request, jsonify
from models import Mold
from extensions import db

molds_bp = Blueprint('molds', __name__)

@molds_bp.route('/molds', methods=['GET', 'POST'])
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

@molds_bp.route('/molds/<int:id>', methods=['PUT', 'DELETE'])
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
