from flask import Flask, jsonify, request
from flask_migrate import Migrate
from extensions import db
from models import Batch, Finger, Failure, Mold
from flask_cors import CORS

#Import routes here

from routes.molds import molds_bp
from routes.fingers import fingers_bp
from routes.batches import batches_bp
from routes.failures import failures_bp


from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'dev')  # dev fallback for local dev
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///site.db')


    db.init_app(app)
    Migrate(app, db)  # Enable Flask-Migrate
    CORS(app) #Allows CORS between frontend and backend

    #Registers the mold blueprint, allowing us to break down our routes into discrete pieces
    app.register_blueprint(molds_bp)
    app.register_blueprint(fingers_bp)
    app.register_blueprint(batches_bp)
    app.register_blueprint(failures_bp)

    # Define routes
    @app.route('/')
    def hello():
        return jsonify({"message": "Finger Tracker is running successfully!"})

    
    
    
    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)
