
function getHealthSuggestions() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const mentalPoints = parseInt(document.getElementById('mental-points').value);
    const suggestionsOutput = document.getElementById('suggestions-output');

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        suggestionsOutput.innerHTML = '<div class="alert alert-danger">Please enter valid weight and height.</div>';
        return;
    }

    const bmi = calculateBMI(weight, height);
    const bmiCategory = getBMICategory(bmi);

    let suggestions = `
        <div class="card">
            <div class="card-body">
                <h3 class="card-title text-center">Your Health Snapshot</h3>
                <p class="text-center">Your Weight is <strong>${weight}</strong> kg.</p>
                <p class="text-center">Your BMI is <strong>${bmi.toFixed(1)}</strong>, which is considered <strong>${bmiCategory.category}</strong>.</p>
                <p class="text-center">Your Mental Wellness Score is <strong>${mentalPoints}</strong>.</p>
                <hr>
                <h4 class="mt-4">Suggestions for You:</h4>
                <ul class="list-group list-group-flush">
    `;

    // Physical Health Suggestions
    if (bmi < 18.5) {
        suggestions += '<li class="list-group-item"><strong>Physical Health:</strong> You are in the underweight range. It is recommended to consult a nutritionist to ensure you are getting enough nutrients. Consider incorporating more calorie-dense, nutritious foods into your diet.</li>';
    } else if (bmi >= 18.5 && bmi < 25) {
        suggestions += '<li class="list-group-item"><strong>Physical Health:</strong> Your BMI is in a healthy range. Keep up the great work! Maintain a balanced diet and regular physical activity.</li>';
    } else if (bmi >= 25 && bmi < 30) {
        suggestions += '<li class="list-group-item"><strong>Physical Health:</strong> You are in the overweight range. Consider a combination of a balanced, calorie-controlled diet and regular exercise. Our exercise and recipe sections are a great place to start.</li>';
    } else {
        suggestions += '<li class="list-group-item"><strong>Physical Health:</strong> You are in the obese range. It is highly recommended to consult a healthcare professional. A structured plan for diet and exercise is important for your health.</li>';
    }

    // Mental Health Suggestions
    if (mentalPoints <= 4) {
        suggestions += '<li class="list-group-item"><strong>Mental Wellness:</strong> You've indicated a lower level of mental wellness. It's important to prioritize your mental health. Explore our mental health section for quizzes and resources. Consider talking to a friend, family member, or a mental health professional.</li>';
    } else if (mentalPoints > 4 && mentalPoints <= 7) {
        suggestions += '<li class="list-group-item"><strong>Mental Wellness:</strong> You're in a moderate range for mental wellness. There are always ways to improve. Our yoga and meditation sessions can be a great way to manage stress and improve focus.</li>';
    } else {
        suggestions += '<li class="list-group-item"><strong>Mental Wellness:</strong> It's great that you're feeling positive about your mental wellness. To maintain this, continue practicing self-care, and consider our guided meditations to further enhance your well-being.</li>';
    }

    suggestions += '</ul></div></div>';
    suggestionsOutput.innerHTML = suggestions;
}

function calculateBMI(weight, height) {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return { category: 'Underweight', color: 'warning' };
    if (bmi < 25) return { category: 'Normal weight', color: 'success' };
    if (bmi < 30) return { category: 'Overweight', color: 'warning' };
    return { category: 'Obese', color: 'danger' };
}
