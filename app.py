from flask import Flask, render_template, request, jsonify, send_file, url_for
from flask_pymongo import PyMongo
from datetime import datetime, timedelta, UTC
import json
import os
from bson import ObjectId
import secrets
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import logging
import openai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure OpenAI API
try:
    openai.api_key = os.getenv("OPENAI_API_KEY")
    if not openai.api_key:
        logger.warning("OPENAI_API_KEY not found. Chatbot will not function.")
except Exception as e:
    logger.error(f"Failed to configure OpenAI API: {e}")

def create_app(config=None):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', secrets.token_hex(32))
    app.config['MONGO_URI'] = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/health_toolkit')
    app.config['DEBUG'] = os.environ.get('FLASK_DEBUG', True)
    
    # Initialize extensions
    mongo = PyMongo(app)
    
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
        """Handle chatbot interactions using OpenAI API"""
        try:
            if not openai.api_key:
                 return jsonify({'error': 'Chatbot is not configured. Missing API key.'}), 500

            data = request.get_json()
            user_message = data.get('message', '').strip()
            
            health_data = {
                "bmi": data.get("bmi"),
                "weight": data.get("weight"),
                "mental_score": data.get("mentalHealthScore")
            }

            if not user_message:
                return jsonify({'error': 'Empty message'}), 400
            
            response_text = generate_chatbot_response(user_message, health_data)
            
            # Store conversation
            conversation = {
                'user_message': user_message,
                'bot_response': response_text,
                'timestamp': datetime.now(datetime.UTC),
                'session_id': data.get('session_id')
            }
            mongo.db.conversations.insert_one(conversation)
            
            return jsonify({
                'response': response_text,
                'timestamp': datetime.utcnow().isoformat()
            })
            
        except Exception as e:
            logger.error(f"Chatbot error: {str(e)}")
            return jsonify({'error': 'Chatbot unavailable due to an internal error.'}), 500

    def generate_chatbot_response(user_message, health_data):
        """Generate a response using the OpenAI API."""
        try:
            system_prompt = (
                "You are an expert health and wellness assistant named Holistiq. "
                "Your goal is to provide safe, relevant, and actionable suggestions for diet, exercise, and mental well-being. "
                "You must use the user's provided health data to personalize your recommendations. "
                "IMPORTANT: Always include a disclaimer that you are not a medical professional and the user should consult a doctor before making significant lifestyle changes."
            )

            user_context = (
                "Here is my health data:\n"
                f"- BMI: {health_data.get('bmi', 'Not provided')}\n"
                f"- Weight: {health_data.get('weight', 'Not provided')} kg\n"
                f"- Recent Mental Wellness Score: {health_data.get('mental_score', 'Not provided')} (out of 10, where 10 is excellent)\n"
                "---\n"
                f"My question is: {user_message}"
            )

            client = openai.Client()
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_context}
                ],
                temperature=0.7,
                max_tokens=250
            )
            
            return response.choices[0].message.content.strip()

        except Exception as e:
            logger.error(f"OpenAI API call failed: {e}")
            return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later."

    # ... (all other functions and error handlers remain the same) ...
    
    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() in ['true', '1', 't']
    app.run(host='0.0.0.0', port=port, debug=debug)