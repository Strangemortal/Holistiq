from flask import Flask, render_template, request, jsonify, send_file, url_for
from flask_pymongo import PyMongo
from datetime import datetime, timedelta
import datetime as dt
import json
import os
from bson import ObjectId
import secrets
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import logging
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logger.warning("GEMINI_API_KEY not found. Chatbot will not function.")
genai.configure(api_key=GEMINI_API_KEY)

def create_app(config=None):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', secrets.token_hex(32))
    app.config['MONGO_URI'] = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/health_toolkit')
    app.config['DEBUG'] = os.environ.get('FLASK_DEBUG', True)
    
    # Initialize extensions
    try:
        mongo = PyMongo(app)
        mongo_available = True
    except Exception as e:
        logger.warning(f"MongoDB unavailable: {e}")
        mongo = None
        mongo_available = False
    
    # JSON Encoder for MongoDB ObjectId
    class JSONEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, ObjectId):
                return str(obj)
            if isinstance(obj, datetime):
                return obj.isoformat()
            return super(JSONEncoder, self).default(obj)
    
    app.json_encoder = JSONEncoder
    
    # Routes
    @app.route('/')
    def index():
        """Home page"""
        return render_template('index.html')

    @app.route('/exercises')
    def exercises():
        """Exercise page"""
        return render_template('exercise.html')
    
    @app.route('/yoga')
    def yoga():
        """Yoga & Meditation page"""
        return render_template('yoga.html')
    
    @app.route('/recipes')
    def recipes():
        """Recipes page"""
        return render_template('recipes.html')
    
    @app.route('/mental')
    def quiz():
        """Mental Health Quiz page"""
        return render_template('quiz.html')
    
    @app.route('/report')
    def report():
        """Health Report page"""
        return render_template('reports.html')

    @app.route('/api/chatbot', methods=['POST'])
    def chatbot_response():
        """Handle chatbot interactions using Gemini API"""
        try:
            if not GEMINI_API_KEY:
                return jsonify({'error': 'Chatbot is not configured. Missing Gemini API key.'}), 500

            data = request.get_json()
            user_message = data.get('message', '').strip()
            
            # Get user details from the request
            health_data = {
                "age": data.get("age"),
                "weight": data.get("weight"),
                "height": data.get("height"),
                "activityLevel": data.get("activityLevel"),
                "healthGoals": data.get("healthGoals")
            }

            if not user_message:
                return jsonify({'error': 'Empty message'}), 400
            
            response_text = generate_chatbot_response(user_message, health_data)
            
            # Store conversation if MongoDB is available
            if mongo is not None and mongo_available:
                try:
                    conversation = {
                        'user_message': user_message,
                        'bot_response': response_text,
                        'timestamp': datetime.now(dt.timezone.utc),
                        'session_id': data.get('session_id')
                    }
                    mongo.db.conversations.insert_one(conversation)
                except Exception as db_exc:
                    logger.warning(f"Could not store conversation in MongoDB: {db_exc}")
            
            return jsonify({
                'response': response_text,
                'timestamp': datetime.now(dt.timezone.utc).isoformat()
            })
            
        except Exception as e:
            logger.error(f"Chatbot error: {str(e)}")
            return jsonify({'error': 'Chatbot unavailable due to an internal error.'}), 500

    def generate_chatbot_response(user_message, health_data):
        """Generate a response using the Gemini API."""
        try:
            system_prompt = (
                "You are an expert health and wellness assistant named Holistiq. "
                "Your goal is to provide safe, relevant, and actionable suggestions for diet, exercise, and mental well-being. "
                "You must use the user's provided health data to personalize your recommendations. "
                "IMPORTANT: Always include a disclaimer that you are not a medical professional and the user should consult a doctor before making significant lifestyle changes. "
                "Provide detailed answers between 60-70 words, with specific recommendations based on the user's age, weight, height, activity level, and health goals."
            )
            # Calculate BMI if weight and height are provided
            if health_data.get('weight') and health_data.get('height'):
                bmi = round(float(health_data['weight']) / ((float(health_data['height']) / 100) ** 2), 1)
            else:
                bmi = None

            user_context = (
                "Here is my health data:\n"
                f"- Age: {health_data.get('age', 'Not provided')} years\n"
                f"- Weight: {health_data.get('weight', 'Not provided')} kg\n"
                f"- Height: {health_data.get('height', 'Not provided')} cm\n"
                f"- BMI: {bmi if bmi else 'Not provided'}\n"
                f"- Activity Level: {health_data.get('activityLevel', 'Not provided')}\n"
                f"- Health Goals: {health_data.get('healthGoals', 'Not provided')}\n"
                "---\n"
                f"My question is: {user_message}"
            )
            response = genai.GenerativeModel("gemini-2.5-flash").generate_content(f"{system_prompt}\n{user_context}")
            return response.text.strip()
        except Exception as e:
            logger.error(f"Gemini API call failed: {e}")
            return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later."

    # ... (all other functions and error handlers remain the same) ...
    
    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() in ['true', '1', 't']
    app.run(host='0.0.0.0', port=port, debug=debug)