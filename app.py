from flask import Flask, render_template, request, jsonify, send_file, url_for
from flask_pymongo import PyMongo
from datetime import datetime, timedelta
import json
import os
from bson import ObjectId
import secrets
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
        return render_template('home.html')
    
    @app.route('/exercises')
    def exercises():
        """Exercise library page"""
        return render_template('exercises.html')
    
    @app.route('/yoga')
    def yoga():
        """Yoga and meditation page"""
        return render_template('yoga.html')
    
    @app.route('/recipes')
    def recipes():
        """Healthy recipes page"""
        return render_template('recipes.html')
    
    @app.route('/quiz')
    def quiz():
        """Mental health assessments page"""
        return render_template('quiz.html')
    
    @app.route('/report')
    def report():
        """Health reports page"""
        return render_template('report.html')
    
    # API Routes
    @app.route('/api/bmi', methods=['POST'])
    def calculate_bmi():
        """Calculate BMI"""
        try:
            data = request.get_json()
            height = float(data.get('height', 0))  # in cm
            weight = float(data.get('weight', 0))  # in kg
            
            if height <= 0 or weight <= 0:
                return jsonify({'error': 'Invalid height or weight'}), 400
            
            height_m = height / 100
            bmi = weight / (height_m ** 2)
            
            # Determine category
            if bmi < 18.5:
                category = 'Underweight'
                color = 'warning'
            elif bmi < 25:
                category = 'Normal weight'
                color = 'success'
            elif bmi < 30:
                category = 'Overweight'
                color = 'warning'
            else:
                category = 'Obese'
                color = 'danger'
            
            return jsonify({
                'bmi': round(bmi, 1),
                'category': category,
                'color': color,
                'healthy_range': '18.5 - 24.9'
            })
            
        except Exception as e:
            logger.error(f"BMI calculation error: {str(e)}")
            return jsonify({'error': 'Calculation failed'}), 500
    
    @app.route('/api/exercises')
    def get_exercises():
        """Get exercise data"""
        try:
            exercises = list(mongo.db.exercises.find())
            return jsonify(exercises)
        except Exception as e:
            logger.error(f"Exercise fetch error: {str(e)}")
            return jsonify({'error': 'Failed to fetch exercises'}), 500
    
    @app.route('/api/recipes')
    def get_recipes():
        """Get recipe data"""
        try:
            recipes = list(mongo.db.recipes.find())
            return jsonify(recipes)
        except Exception as e:
            logger.error(f"Recipe fetch error: {str(e)}")
            return jsonify({'error': 'Failed to fetch recipes'}), 500
    
    @app.route('/api/yoga-sessions')
    def get_yoga_sessions():
        """Get yoga session data"""
        try:
            sessions = list(mongo.db.yoga_sessions.find())
            return jsonify(sessions)
        except Exception as e:
            logger.error(f"Yoga session fetch error: {str(e)}")
            return jsonify({'error': 'Failed to fetch yoga sessions'}), 500
    
    @app.route('/api/assessments/<assessment_type>')
    def get_assessment(assessment_type):
        """Get assessment questions"""
        try:
            assessment = mongo.db.assessments.find_one({'type': assessment_type})
            if not assessment:
                return jsonify({'error': 'Assessment not found'}), 404
            return jsonify(assessment)
        except Exception as e:
            logger.error(f"Assessment fetch error: {str(e)}")
            return jsonify({'error': 'Failed to fetch assessment'}), 500
    
    @app.route('/api/assessments/<assessment_type>/submit', methods=['POST'])
    def submit_assessment(assessment_type):
        """Submit assessment responses"""
        try:
            data = request.get_json()
            
            # Store assessment result
            result = {
                'type': assessment_type,
                'responses': data.get('responses', []),
                'score': data.get('score', 0),
                'timestamp': datetime.utcnow(),
                'user_id': data.get('user_id'),  # In a real app, this would come from authentication
                'ip_address': request.remote_addr
            }
            
            mongo.db.assessment_results.insert_one(result)
            
            return jsonify({
                'success': True,
                'message': 'Assessment submitted successfully'
            })
            
        except Exception as e:
            logger.error(f"Assessment submission error: {str(e)}")
            return jsonify({'error': 'Failed to submit assessment'}), 500
    
    @app.route('/api/health-report', methods=['POST'])
    def generate_health_report():
        """Generate comprehensive health report"""
        try:
            data = request.get_json()
            
            # Calculate additional metrics
            height = float(data.get('height', 0))
            weight = float(data.get('weight', 0))
            age = calculate_age(data.get('dateOfBirth', ''))
            gender = data.get('gender', '')
            activity_level = data.get('activityLevel', '')
            
            # Calculate BMI
            bmi = weight / ((height / 100) ** 2)
            
            # Calculate BMR (Basal Metabolic Rate)
            if gender.lower() == 'male':
                bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
            else:
                bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161
            
            # Calculate daily calorie needs
            activity_multipliers = {
                'sedentary': 1.2,
                'light': 1.375,
                'moderate': 1.55,
                'active': 1.725,
                'extra': 1.9
            }
            
            daily_calories = int(bmr * activity_multipliers.get(activity_level, 1.2))
            
            # Store report in database
            report = {
                'user_data': data,
                'calculated_metrics': {
                    'bmi': round(bmi, 1),
                    'bmr': round(bmr, 0),
                    'daily_calories': daily_calories,
                    'age': age
                },
                'timestamp': datetime.utcnow(),
                'report_id': str(ObjectId())
            }
            
            mongo.db.health_reports.insert_one(report)
            
            return jsonify({
                'success': True,
                'report_id': report['report_id'],
                'data': report
            })
            
        except Exception as e:
            logger.error(f"Health report generation error: {str(e)}")
            return jsonify({'error': 'Failed to generate report'}), 500
    
    @app.route('/api/chatbot', methods=['POST'])
    def chatbot_response():
        """Handle chatbot interactions"""
        try:
            data = request.get_json()
            user_message = data.get('message', '').strip()
            
            if not user_message:
                return jsonify({'error': 'Empty message'}), 400
            
            # Simple keyword-based response system
            response = generate_chatbot_response(user_message)
            
            # Store conversation
            conversation = {
                'user_message': user_message,
                'bot_response': response,
                'timestamp': datetime.utcnow(),
                'session_id': data.get('session_id')
            }
            
            mongo.db.conversations.insert_one(conversation)
            
            return jsonify({
                'response': response,
                'timestamp': datetime.utcnow().isoformat()
            })
            
        except Exception as e:
            logger.error(f"Chatbot error: {str(e)}")
            return jsonify({'error': 'Chatbot unavailable'}), 500
    
    # Utility functions
    def calculate_age(birth_date):
        """Calculate age from birth date"""
        try:
            birth = datetime.strptime(birth_date, '%Y-%m-%d')
            today = datetime.today()
            age = today.year - birth.year
            
            if today.month < birth.month or (today.month == birth.month and today.day < birth.day):
                age -= 1
                
            return age
        except:
            return 0
    
    def generate_chatbot_response(message):
        """Generate simple chatbot response"""
        message = message.lower()
        
        if any(word in message for word in ['hello', 'hi', 'hey']):
            return "Hello! I'm your Health Toolkit assistant. How can I help you with your wellness journey today?"
        
        elif any(word in message for word in ['bmi', 'body mass', 'weight']):
            return "I can help you with BMI calculations! Use our BMI calculator on the home page, or check out our health report generator for comprehensive analysis."
        
        elif any(word in message for word in ['exercise', 'workout', 'fitness']):
            return "Great question about fitness! Visit our Exercise section for workout routines, or try our Yoga & Meditation section for mind-body wellness practices."
        
        elif any(word in message for word in ['nutrition', 'diet', 'food', 'recipe']):
            return "Nutrition is key to good health! Check out our Recipes section for healthy, delicious meal ideas with nutritional information."
        
        elif any(word in message for word in ['stress', 'anxiety', 'mental', 'mood']):
            return "Mental health is important! Try our Mental Health assessments and wellness tools. For serious concerns, please consult a healthcare professional."
        
        elif any(word in message for word in ['sleep', 'tired', 'rest']):
            return "Good sleep is essential! Try our sleep quality assessment in the Mental Health section, and consider our evening yoga routines for better rest."
        
        else:
            return "I'm here to help with health and wellness questions! You can ask me about exercise, nutrition, mental health, BMI, or explore our different sections for comprehensive health tools."
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return render_template('404.html'), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal server error: {str(error)}")
        return render_template('500.html'), 500
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        """Simple health check endpoint"""
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'version': '1.0.0'
        })
    
    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', True)
    
    app.run(host='0.0.0.0', port=port, debug=debug)