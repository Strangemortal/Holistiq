// BMI Calculator functionality

document.addEventListener('DOMContentLoaded', function() {
    const bmiForm = document.getElementById('bmiForm');
    
    if (bmiForm) {
        bmiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const weight = parseFloat(document.getElementById('weight').value);
            const height = parseFloat(document.getElementById('height').value);
            const unit = document.querySelector('input[name="unitSystem"]:checked').value;
            
            // Send to API
            fetch('/api/calculate-bmi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    weight: weight,
                    height: height,
                    unit: unit
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayBMIResult(data);
                } else {
                    alert('Error calculating BMI: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error calculating BMI. Please try again.');
            });
        });
    }
    
    function displayBMIResult(data) {
        const bmiResult = document.getElementById('bmiResult');
        const bmiAlert = document.getElementById('bmiAlert');
        const bmiValue = document.getElementById('bmiValue');
        const bmiCategory = document.getElementById('bmiCategory');
        
        // Update values
        bmiValue.textContent = data.bmi;
        bmiCategory.textContent = data.category;
        
        // Update alert styling
        bmiAlert.className = `alert alert-${data.color}`;
        
        // Show result
        bmiResult.style.display = 'block';
        
        // Scroll to result
        bmiResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});
