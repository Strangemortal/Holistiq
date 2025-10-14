// Health Dashboard functionality
function initializeHealthDashboard() {
    // Load user's health data
    loadHealthData();

    // Set up update interval (every 5 minutes)
    setInterval(loadHealthData, 300000);

    // Initialize health data form submission
    const healthDataForm = document.getElementById('healthDataForm');
    if (healthDataForm) {
        healthDataForm.addEventListener('submit', handleHealthDataSubmit);
    }
}

function showHealthDataModal() {
    const modal = new bootstrap.Modal(document.getElementById('healthDataModal'));
    modal.show();
}

function loadHealthData() {
    fetch('/api/health-data')
        .then(response => response.json())
        .then(data => {
            updateDashboard(data);
        })
        .catch(error => {
            console.error('Error loading health data:', error);
        });
}

function updateDashboard(data) {
    // Update weight
    document.getElementById('user-weight').textContent = `${data.weight} kg`;

    // Update BMI
    const bmiElement = document.getElementById('user-bmi');
    const bmiStatusElement = document.getElementById('bmi-status');
    bmiElement.textContent = data.bmi.toFixed(1);
    updateBMIStatus(data.bmi, bmiStatusElement);

    // Update mental score
    const mentalScoreElement = document.getElementById('mental-score');
    const mentalStatusElement = document.getElementById('mental-status');
    mentalScoreElement.textContent = data.mental_score;
    updateMentalStatus(data.mental_score, mentalStatusElement);

    // Update recommendations
    updateRecommendations(data);
}

function updateBMIStatus(bmi, element) {
    let status;
    let color;

    if (bmi < 18.5) {
        status = "Underweight";
        color = "text-warning";
    } else if (bmi < 25) {
        status = "Healthy";
        color = "text-success";
    } else if (bmi < 30) {
        status = "Overweight";
        color = "text-warning";
    } else {
        status = "Obese";
        color = "text-danger";
    }

    element.textContent = status;
    element.className = color;
}

function handleHealthDataSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    const mentalScore = document.getElementById('mentalScore').value;

    // Validate input
    if (!weight || !height || !mentalScore) {
        showAlert('Please fill in all fields', 'warning');
        return;
    }

    const formData = {
        weight: parseFloat(weight),
        height: parseFloat(height),
        mental_score: parseFloat(mentalScore)
    };

    fetch('/api/health-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('healthDataModal'));
            modal.hide();
            
            // Reload the dashboard with new data
            loadHealthData();

            // Show success message
            showAlert('Health data updated successfully!', 'success');
        } else {
            showAlert('Error updating health data. Please try again.', 'danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('Error updating health data. Please try again.', 'danger');
    });
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function updateMentalStatus(score, element) {
    let status;
    let color;

    if (score >= 80) {
        status = "Excellent";
        color = "text-success";
    } else if (score >= 60) {
        status = "Good";
        color = "text-primary";
    } else if (score >= 40) {
        status = "Fair";
        color = "text-warning";
    } else {
        status = "Needs Attention";
        color = "text-danger";
    }

    element.textContent = status;
    element.className = color;
}

function updateRecommendations(data) {
    const recommendationsContainer = document.getElementById('health-recommendations');
    fetch('/api/health-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: localStorage.getItem('user_id'),
            weight: data.weight,
            height: data.height,
            mental_score: data.mental_score
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.recommendations && data.recommendations.length > 0) {
            const recommendationsList = data.recommendations
                .map(rec => `
                    <li class="mb-2">
                        <i class="fas fa-check-circle text-success me-2"></i>
                        ${rec}
                    </li>
                `)
                .join('');
            
            recommendationsContainer.innerHTML = `<ul class="list-unstyled">${recommendationsList}</ul>`;
        }
    })
    .catch(error => {
        console.error('Error updating recommendations:', error);
    });
}