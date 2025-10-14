import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'health-toolkit-secret-key-2024'
    MONGO_URI = os.environ.get('MONGO_URI') or 'mongodb://localhost:27017/holistiq'
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
