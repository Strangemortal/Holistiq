"""
Simple tests for Holistiq Health Toolkit
"""
import json
from app import app

def test_home_page():
    """Test home page loads successfully"""
    client = app.test_client()
    response = client.get('/')
    assert response.status_code == 200
    assert b'Holistiq' in response.data
    print("✓ Home page test passed")

def test_exercise_page():
    """Test exercise page loads successfully"""
    client = app.test_client()
    response = client.get('/exercise')
    assert response.status_code == 200
    assert b'Exercise' in response.data
    print("✓ Exercise page test passed")

def test_yoga_page():
    """Test yoga page loads successfully"""
    client = app.test_client()
    response = client.get('/yoga')
    assert response.status_code == 200
    assert b'Yoga' in response.data
    print("✓ Yoga page test passed")

def test_recipes_page():
    """Test recipes page loads successfully"""
    client = app.test_client()
    response = client.get('/recipes')
    assert response.status_code == 200
    assert b'Recipes' in response.data
    print("✓ Recipes page test passed")

def test_mental_health_page():
    """Test mental health page loads successfully"""
    client = app.test_client()
    response = client.get('/mental-health')
    assert response.status_code == 200
    assert b'Mental Health' in response.data
    print("✓ Mental Health page test passed")

def test_reports_page():
    """Test reports page loads successfully"""
    client = app.test_client()
    response = client.get('/reports')
    assert response.status_code == 200
    assert b'Reports' in response.data
    print("✓ Reports page test passed")

def test_bmi_calculator():
    """Test BMI calculator API"""
    client = app.test_client()
    response = client.post('/api/calculate-bmi',
                          data=json.dumps({
                              'weight': 70,
                              'height': 175,
                              'unit': 'metric'
                          }),
                          content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True
    assert data['bmi'] == 22.86
    assert data['category'] == 'Normal weight'
    print("✓ BMI calculator test passed")

def test_chatbot():
    """Test chatbot API"""
    client = app.test_client()
    response = client.post('/api/chatbot',
                          data=json.dumps({
                              'message': 'Tell me about exercise'
                          }),
                          content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True
    assert 'exercise' in data['response'].lower()
    print("✓ Chatbot test passed")

def test_save_workout():
    """Test save workout API"""
    client = app.test_client()
    response = client.post('/api/save-workout',
                          data=json.dumps({
                              'exercise_type': 'Cardio',
                              'duration': 30
                          }),
                          content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True
    print("✓ Save workout test passed")

def test_save_meditation():
    """Test save meditation API"""
    client = app.test_client()
    response = client.post('/api/save-meditation',
                          data=json.dumps({
                              'meditation_type': 'Mindfulness',
                              'duration': 15
                          }),
                          content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['success'] == True
    print("✓ Save meditation test passed")

if __name__ == '__main__':
    print("\n" + "="*50)
    print("Running Holistiq Health Toolkit Tests")
    print("="*50 + "\n")
    
    try:
        test_home_page()
        test_exercise_page()
        test_yoga_page()
        test_recipes_page()
        test_mental_health_page()
        test_reports_page()
        test_bmi_calculator()
        test_chatbot()
        test_save_workout()
        test_save_meditation()
        
        print("\n" + "="*50)
        print("All tests passed! ✓")
        print("="*50 + "\n")
    except AssertionError as e:
        print(f"\n✗ Test failed: {e}\n")
        exit(1)
