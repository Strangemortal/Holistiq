from flask import Flask, render_template, request, jsonify, send_file
from pymongo import MongoClient
from datetime import datetime
import json
import os
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.units import inch
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

# MongoDB Connection
try:
    client = MongoClient(app.config['MONGO_URI'], serverSelectionTimeoutMS=5000)
    db = client.holistiq
    # Test connection
    client.server_info()
    print("MongoDB connected successfully")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    db = None

# Collections
if db is not None:
    bmi_collection = db.bmi_records
    workout_collection = db.workout_records
    meditation_collection = db.meditation_records
    chat_collection = db.chat_history

# Home Route
@app.route('/')
def home():
    return render_template('home.html')

# Exercise Page
@app.route('/exercise')
def exercise():
    return render_template('exercise.html')

# Yoga Page
@app.route('/yoga')
def yoga():
    return render_template('yoga.html')

# Recipes Page
@app.route('/recipes')
def recipes():
    return render_template('recipes.html')

# Mental Health Page
@app.route('/mental-health')
def mental_health():
    return render_template('mental_health.html')

# Reports Page
@app.route('/reports')
def reports():
    return render_template('reports.html')

# BMI Calculator API
@app.route('/api/calculate-bmi', methods=['POST'])
def calculate_bmi():
    try:
        data = request.get_json()
        weight = float(data.get('weight'))
        height = float(data.get('height'))
        unit = data.get('unit', 'metric')
        
        if unit == 'imperial':
            # Convert imperial to metric
            weight = weight * 0.453592  # pounds to kg
            height = height * 2.54  # inches to cm
        
        # Calculate BMI
        height_m = height / 100  # cm to m
        bmi = weight / (height_m ** 2)
        
        # Determine category
        if bmi < 18.5:
            category = 'Underweight'
            color = 'info'
        elif 18.5 <= bmi < 25:
            category = 'Normal weight'
            color = 'success'
        elif 25 <= bmi < 30:
            category = 'Overweight'
            color = 'warning'
        else:
            category = 'Obese'
            color = 'danger'
        
        # Save to database
        if db is not None:
            record = {
                'bmi': round(bmi, 2),
                'weight': weight,
                'height': height,
                'category': category,
                'timestamp': datetime.now()
            }
            bmi_collection.insert_one(record)
        
        return jsonify({
            'success': True,
            'bmi': round(bmi, 2),
            'category': category,
            'color': color
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# Save Workout API
@app.route('/api/save-workout', methods=['POST'])
def save_workout():
    try:
        data = request.get_json()
        if db is not None:
            record = {
                'exercise_type': data.get('exercise_type'),
                'duration': data.get('duration'),
                'timestamp': datetime.now()
            }
            workout_collection.insert_one(record)
        return jsonify({'success': True, 'message': 'Workout saved successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# Save Meditation API
@app.route('/api/save-meditation', methods=['POST'])
def save_meditation():
    try:
        data = request.get_json()
        if db is not None:
            record = {
                'meditation_type': data.get('meditation_type'),
                'duration': data.get('duration'),
                'timestamp': datetime.now()
            }
            meditation_collection.insert_one(record)
        return jsonify({'success': True, 'message': 'Meditation saved successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# Chatbot API
@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.get_json()
        message = data.get('message', '').lower()
        
        # Simple rule-based chatbot responses
        responses = {
            'bmi': 'BMI (Body Mass Index) is a measure of body fat based on height and weight. You can use our BMI calculator on the home page!',
            'exercise': 'Regular exercise is crucial for maintaining good health. Visit our Exercise page for workout routines and timers!',
            'yoga': 'Yoga combines physical postures, breathing techniques, and meditation. Check out our Yoga page for guided sessions!',
            'recipe': 'A healthy diet is essential for overall wellness. Browse our Recipes page for nutritious meal ideas!',
            'mental': 'Mental health is as important as physical health. Visit our Mental Health page for meditation and mindfulness exercises!',
            'stress': 'Try our meditation timers on the Mental Health page. Deep breathing and mindfulness can help reduce stress.',
            'diet': 'A balanced diet includes fruits, vegetables, whole grains, lean proteins, and healthy fats. Check our Recipes page!',
            'weight': 'Weight management involves balanced nutrition and regular exercise. Use our BMI calculator to track your progress!',
            'hello': 'Hello! I\'m your health assistant. How can I help you today?',
            'hi': 'Hi there! I\'m here to help with your health and wellness questions!',
            'help': 'I can help you with BMI calculations, exercise routines, yoga practices, healthy recipes, and mental health tips. What would you like to know?'
        }
        
        # Find matching response
        response = 'I\'m here to help with health and wellness questions! Try asking about BMI, exercise, yoga, recipes, or mental health.'
        for key, value in responses.items():
            if key in message:
                response = value
                break
        
        # Save chat history
        if db is not None:
            chat_record = {
                'message': data.get('message'),
                'response': response,
                'timestamp': datetime.now()
            }
            chat_collection.insert_one(chat_record)
        
        return jsonify({'success': True, 'response': response})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# Get Reports Data
@app.route('/api/reports-data')
def get_reports_data():
    try:
        if db is None:
            return jsonify({'success': False, 'error': 'Database not connected'}), 500
        
        # Get recent BMI records
        bmi_records = list(bmi_collection.find().sort('timestamp', -1).limit(10))
        # Get recent workout records
        workout_records = list(workout_collection.find().sort('timestamp', -1).limit(10))
        # Get recent meditation records
        meditation_records = list(meditation_collection.find().sort('timestamp', -1).limit(10))
        
        # Convert ObjectId to string and format dates
        for record in bmi_records + workout_records + meditation_records:
            record['_id'] = str(record['_id'])
            if 'timestamp' in record:
                record['timestamp'] = record['timestamp'].strftime('%Y-%m-%d %H:%M:%S')
        
        return jsonify({
            'success': True,
            'bmi_records': bmi_records,
            'workout_records': workout_records,
            'meditation_records': meditation_records
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# Export Reports as JSON
@app.route('/api/export-json')
def export_json():
    try:
        if db is None:
            return jsonify({'success': False, 'error': 'Database not connected'}), 500
        
        # Get all records
        bmi_records = list(bmi_collection.find().sort('timestamp', -1))
        workout_records = list(workout_collection.find().sort('timestamp', -1))
        meditation_records = list(meditation_collection.find().sort('timestamp', -1))
        
        # Convert ObjectId to string and format dates
        for record in bmi_records + workout_records + meditation_records:
            record['_id'] = str(record['_id'])
            if 'timestamp' in record:
                record['timestamp'] = record['timestamp'].strftime('%Y-%m-%d %H:%M:%S')
        
        report_data = {
            'export_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'bmi_records': bmi_records,
            'workout_records': workout_records,
            'meditation_records': meditation_records
        }
        
        # Create JSON file
        json_buffer = BytesIO()
        json_buffer.write(json.dumps(report_data, indent=2).encode('utf-8'))
        json_buffer.seek(0)
        
        return send_file(
            json_buffer,
            mimetype='application/json',
            as_attachment=True,
            download_name=f'health_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        )
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

# Export Reports as PDF
@app.route('/api/export-pdf')
def export_pdf():
    try:
        if db is None:
            return jsonify({'success': False, 'error': 'Database not connected'}), 500
        
        # Get all records
        bmi_records = list(bmi_collection.find().sort('timestamp', -1).limit(20))
        workout_records = list(workout_collection.find().sort('timestamp', -1).limit(20))
        meditation_records = list(meditation_collection.find().sort('timestamp', -1).limit(20))
        
        # Create PDF
        pdf_buffer = BytesIO()
        doc = SimpleDocTemplate(pdf_buffer, pagesize=letter)
        elements = []
        styles = getSampleStyleSheet()
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#2c3e50'),
            spaceAfter=30,
            alignment=1  # Center
        )
        elements.append(Paragraph('Health Toolkit Report', title_style))
        elements.append(Spacer(1, 0.2 * inch))
        
        # Export Date
        date_text = f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        elements.append(Paragraph(date_text, styles['Normal']))
        elements.append(Spacer(1, 0.3 * inch))
        
        # BMI Records Section
        if bmi_records:
            elements.append(Paragraph('BMI Records', styles['Heading2']))
            elements.append(Spacer(1, 0.1 * inch))
            
            bmi_data = [['Date', 'BMI', 'Category']]
            for record in bmi_records:
                bmi_data.append([
                    record['timestamp'].strftime('%Y-%m-%d %H:%M'),
                    str(round(record['bmi'], 2)),
                    record['category']
                ])
            
            bmi_table = Table(bmi_data, colWidths=[2*inch, 1.5*inch, 2*inch])
            bmi_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3498db')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            elements.append(bmi_table)
            elements.append(Spacer(1, 0.3 * inch))
        
        # Workout Records Section
        if workout_records:
            elements.append(Paragraph('Workout Records', styles['Heading2']))
            elements.append(Spacer(1, 0.1 * inch))
            
            workout_data = [['Date', 'Exercise Type', 'Duration (min)']]
            for record in workout_records:
                workout_data.append([
                    record['timestamp'].strftime('%Y-%m-%d %H:%M'),
                    record['exercise_type'],
                    str(record['duration'])
                ])
            
            workout_table = Table(workout_data, colWidths=[2*inch, 2*inch, 1.5*inch])
            workout_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2ecc71')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            elements.append(workout_table)
            elements.append(Spacer(1, 0.3 * inch))
        
        # Meditation Records Section
        if meditation_records:
            elements.append(Paragraph('Meditation Records', styles['Heading2']))
            elements.append(Spacer(1, 0.1 * inch))
            
            meditation_data = [['Date', 'Meditation Type', 'Duration (min)']]
            for record in meditation_records:
                meditation_data.append([
                    record['timestamp'].strftime('%Y-%m-%d %H:%M'),
                    record['meditation_type'],
                    str(record['duration'])
                ])
            
            meditation_table = Table(meditation_data, colWidths=[2*inch, 2*inch, 1.5*inch])
            meditation_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#9b59b6')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            elements.append(meditation_table)
        
        # Build PDF
        doc.build(elements)
        pdf_buffer.seek(0)
        
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'health_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf'
        )
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=app.config['DEBUG'])
