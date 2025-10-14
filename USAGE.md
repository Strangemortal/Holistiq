# Holistiq Usage Guide

## Getting Started

### Prerequisites
- Docker and Docker Compose (recommended) OR
- Python 3.11+ and MongoDB 7.0+

### Quick Start with Docker

1. **Clone and run:**
```bash
git clone https://github.com/Strangemortal/Holistiq.git
cd Holistiq
docker-compose up -d
```

2. **Access the application:**
Open your browser and navigate to `http://localhost:5000`

3. **Stop the application:**
```bash
docker-compose down
```

### Local Development Setup

1. **Install dependencies:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Start MongoDB:**
```bash
mongod --dbpath /path/to/data/directory
```

3. **Configure environment (optional):**
```bash
cp .env.example .env
# Edit .env with your settings
```

4. **Run the application:**
```bash
python app.py
```

## Features Guide

### 1. BMI Calculator (Home Page)

**How to use:**
1. Navigate to the Home page
2. Scroll to the BMI Calculator section
3. Enter your weight and height
4. Select unit system (Metric or Imperial)
5. Click "Calculate BMI"
6. View your BMI result and category
7. Your calculation is automatically saved

**Categories:**
- Underweight: BMI < 18.5
- Normal weight: BMI 18.5-24.9
- Overweight: BMI 25-29.9
- Obese: BMI ≥ 30

### 2. Workout Timer (Exercise Page)

**How to use:**
1. Go to the Exercise page
2. Select your exercise type from the dropdown
3. Click "Start" to begin timing
4. Use "Pause" to pause the timer
5. Click "Stop" when finished
6. Your workout duration is automatically saved

**Available exercises:**
- Cardio
- Strength Training
- HIIT
- CrossFit
- Running
- Cycling

### 3. Meditation Timer (Mental Health Page)

**How to use:**
1. Visit the Mental Health page
2. Choose your meditation type
3. Click "Start" to begin
4. Use "Pause" if needed
5. Click "Stop" when done
6. Session is automatically saved

**Meditation types:**
- Mindfulness Meditation
- Breathing Exercise
- Body Scan
- Loving-kindness
- Visualization
- Mantra Meditation

### 4. Health Assistant Chatbot

**How to use:**
1. Click the chat icon in the bottom-right corner (on any page)
2. Type your health-related question
3. Press "Send" or hit Enter
4. Receive instant guidance

**Topics it can help with:**
- BMI information
- Exercise advice
- Yoga practices
- Healthy recipes
- Mental health tips
- Stress management
- Diet guidance

**Example questions:**
- "Tell me about BMI"
- "What exercises should I do?"
- "How can I reduce stress?"
- "Give me healthy recipe ideas"

### 5. Health Reports

**View your data:**
1. Navigate to the Reports page
2. See all your recorded data:
   - BMI calculations
   - Workout sessions
   - Meditation sessions
3. View summary statistics

**Export your data:**
1. Go to the Reports page
2. Choose export format:
   - **PDF**: Beautiful formatted report with tables
   - **JSON**: Raw data for further analysis
3. Click the export button
4. File downloads automatically

**Export includes:**
- All BMI records with dates
- Complete workout history
- Full meditation log
- Timestamp for each activity

### 6. Recipe Browser (Recipes Page)

**Features:**
- Browse recipes by category (Breakfast, Smoothies, Main Meals, Snacks)
- View detailed ingredients and instructions
- See preparation time and calories
- Get nutrition tips and healthy eating guidelines

### 7. Yoga Guide (Yoga Page)

**Explore:**
- Different yoga styles (Hatha, Vinyasa, Restorative)
- Breathing exercises (Pranayama)
- Benefits of regular yoga practice
- Pose instructions and techniques

## Tips for Best Experience

### Daily Routine
1. **Morning:**
   - Check your BMI weekly
   - Plan your meals using Recipes
   - Set exercise goals

2. **During the day:**
   - Use workout timer during exercise
   - Take meditation breaks
   - Ask chatbot for quick health tips

3. **Evening:**
   - Practice yoga or meditation
   - Review your Reports
   - Track progress over time

### Data Management
- All data is automatically saved when MongoDB is connected
- Export reports regularly for backup
- Use JSON exports for data analysis in Excel/Python

### Mobile Usage
- Fully responsive design works on all devices
- Touch-friendly interface
- All features available on mobile

### Performance Tips
- Application works offline (without database) for calculation features
- Database connection optional but recommended for data persistence
- Lightweight and fast on all devices

## Troubleshooting

### MongoDB Connection Issues
**Symptom:** "MongoDB connection failed" message in console

**Solution:**
- Ensure MongoDB is running
- Check MONGO_URI in .env file
- Application still works without DB (calculations won't be saved)

### Docker Issues
**Port already in use:**
```bash
# Change port in docker-compose.yml
ports:
  - "5001:5000"  # Use different port
```

**Container won't start:**
```bash
# Check logs
docker-compose logs web

# Rebuild containers
docker-compose down
docker-compose up --build
```

### Browser Issues
**Styles not loading:**
- Clear browser cache
- Check internet connection (Bootstrap CDN)
- Try different browser

## API Reference

For developers integrating with Holistiq:

### Calculate BMI
```
POST /api/calculate-bmi
Content-Type: application/json

{
  "weight": 70,
  "height": 175,
  "unit": "metric"
}

Response: {
  "success": true,
  "bmi": 22.86,
  "category": "Normal weight",
  "color": "success"
}
```

### Save Workout
```
POST /api/save-workout
Content-Type: application/json

{
  "exercise_type": "Cardio",
  "duration": 30
}
```

### Save Meditation
```
POST /api/save-meditation
Content-Type: application/json

{
  "meditation_type": "Mindfulness",
  "duration": 15
}
```

### Chatbot
```
POST /api/chatbot
Content-Type: application/json

{
  "message": "Tell me about exercise"
}
```

### Get Reports Data
```
GET /api/reports-data

Response: {
  "success": true,
  "bmi_records": [...],
  "workout_records": [...],
  "meditation_records": [...]
}
```

### Export Reports
```
GET /api/export-pdf    # Downloads PDF
GET /api/export-json   # Downloads JSON
```

## Support

For issues, questions, or contributions:
- GitHub Issues: https://github.com/Strangemortal/Holistiq/issues
- Documentation: README.md
- Tests: test_app.py

---

**Enjoy your health journey with Holistiq! 🏃‍♂️🧘‍♀️🥗💪**
