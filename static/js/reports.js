// Reports page functionality

document.addEventListener('DOMContentLoaded', function() {
    loadReportsData();
    
    const exportPDF = document.getElementById('exportPDF');
    const exportJSON = document.getElementById('exportJSON');
    
    if (exportPDF) {
        exportPDF.addEventListener('click', function() {
            showExportMessage('Generating PDF report...', 'info');
            window.location.href = '/api/export-pdf';
            setTimeout(() => {
                showExportMessage('PDF report downloaded successfully!', 'success');
            }, 1000);
        });
    }
    
    if (exportJSON) {
        exportJSON.addEventListener('click', function() {
            showExportMessage('Generating JSON report...', 'info');
            window.location.href = '/api/export-json';
            setTimeout(() => {
                showExportMessage('JSON report downloaded successfully!', 'success');
            }, 1000);
        });
    }
    
    function loadReportsData() {
        fetch('/api/reports-data')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayBMIRecords(data.bmi_records);
                    displayWorkoutRecords(data.workout_records);
                    displayMeditationRecords(data.meditation_records);
                    updateStatistics(data);
                } else {
                    showError('Failed to load reports data');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('Failed to load reports data');
            });
    }
    
    function displayBMIRecords(records) {
        const container = document.getElementById('bmiRecordsTable');
        
        if (records.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">No BMI records found. Calculate your BMI on the home page!</p>';
            return;
        }
        
        let html = '<div class="table-responsive"><table class="table table-striped table-hover">';
        html += '<thead><tr><th>Date & Time</th><th>BMI</th><th>Weight (kg)</th><th>Height (cm)</th><th>Category</th></tr></thead>';
        html += '<tbody>';
        
        records.forEach(record => {
            const categoryClass = getCategoryClass(record.category);
            html += `<tr>
                <td>${record.timestamp}</td>
                <td><strong>${record.bmi}</strong></td>
                <td>${record.weight.toFixed(1)}</td>
                <td>${record.height.toFixed(1)}</td>
                <td><span class="badge bg-${categoryClass}">${record.category}</span></td>
            </tr>`;
        });
        
        html += '</tbody></table></div>';
        container.innerHTML = html;
    }
    
    function displayWorkoutRecords(records) {
        const container = document.getElementById('workoutRecordsTable');
        
        if (records.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">No workout records found. Start tracking your workouts on the Exercise page!</p>';
            return;
        }
        
        let html = '<div class="table-responsive"><table class="table table-striped table-hover">';
        html += '<thead><tr><th>Date & Time</th><th>Exercise Type</th><th>Duration</th></tr></thead>';
        html += '<tbody>';
        
        records.forEach(record => {
            html += `<tr>
                <td>${record.timestamp}</td>
                <td><strong>${record.exercise_type}</strong></td>
                <td>${record.duration} minutes</td>
            </tr>`;
        });
        
        html += '</tbody></table></div>';
        container.innerHTML = html;
    }
    
    function displayMeditationRecords(records) {
        const container = document.getElementById('meditationRecordsTable');
        
        if (records.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">No meditation records found. Start your meditation journey on the Mental Health page!</p>';
            return;
        }
        
        let html = '<div class="table-responsive"><table class="table table-striped table-hover">';
        html += '<thead><tr><th>Date & Time</th><th>Meditation Type</th><th>Duration</th></tr></thead>';
        html += '<tbody>';
        
        records.forEach(record => {
            html += `<tr>
                <td>${record.timestamp}</td>
                <td><strong>${record.meditation_type}</strong></td>
                <td>${record.duration} minutes</td>
            </tr>`;
        });
        
        html += '</tbody></table></div>';
        container.innerHTML = html;
    }
    
    function updateStatistics(data) {
        document.getElementById('totalBMI').textContent = data.bmi_records.length;
        document.getElementById('totalWorkouts').textContent = data.workout_records.length;
        document.getElementById('totalMeditations').textContent = data.meditation_records.length;
    }
    
    function getCategoryClass(category) {
        const classes = {
            'Underweight': 'info',
            'Normal weight': 'success',
            'Overweight': 'warning',
            'Obese': 'danger'
        };
        return classes[category] || 'secondary';
    }
    
    function showExportMessage(message, type) {
        const messageDiv = document.getElementById('exportMessage');
        messageDiv.className = `alert alert-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }
    }
    
    function showError(message) {
        const containers = ['bmiRecordsTable', 'workoutRecordsTable', 'meditationRecordsTable'];
        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = `<p class="text-danger text-center">${message}</p>`;
            }
        });
    }
});
