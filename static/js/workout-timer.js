// Workout Timer functionality

document.addEventListener('DOMContentLoaded', function() {
    let workoutInterval;
    let workoutSeconds = 0;
    let isRunning = false;
    
    const timerDisplay = document.getElementById('workoutTimer');
    const startBtn = document.getElementById('startWorkout');
    const pauseBtn = document.getElementById('pauseWorkout');
    const stopBtn = document.getElementById('stopWorkout');
    const exerciseType = document.getElementById('exerciseType');
    const workoutMessage = document.getElementById('workoutMessage');
    
    if (startBtn) {
        startBtn.addEventListener('click', startWorkout);
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', pauseWorkout);
    }
    
    if (stopBtn) {
        stopBtn.addEventListener('click', stopWorkout);
    }
    
    function startWorkout() {
        if (!isRunning) {
            isRunning = true;
            workoutInterval = setInterval(updateTimer, 1000);
            
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            stopBtn.disabled = false;
            
            hideMessage();
        }
    }
    
    function pauseWorkout() {
        if (isRunning) {
            isRunning = false;
            clearInterval(workoutInterval);
            
            startBtn.disabled = false;
            pauseBtn.disabled = true;
        }
    }
    
    function stopWorkout() {
        isRunning = false;
        clearInterval(workoutInterval);
        
        const duration = Math.floor(workoutSeconds / 60);
        const type = exerciseType.value;
        
        // Save workout to database
        if (duration > 0) {
            fetch('/api/save-workout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    exercise_type: type,
                    duration: duration
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage(`Great job! ${duration} minute ${type} workout saved!`, 'success');
                } else {
                    showMessage('Workout completed but not saved.', 'warning');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('Workout completed but not saved.', 'warning');
            });
        }
        
        // Reset timer
        workoutSeconds = 0;
        timerDisplay.textContent = '00:00';
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
    }
    
    function updateTimer() {
        workoutSeconds++;
        const minutes = Math.floor(workoutSeconds / 60);
        const seconds = workoutSeconds % 60;
        timerDisplay.textContent = 
            String(minutes).padStart(2, '0') + ':' + 
            String(seconds).padStart(2, '0');
    }
    
    function showMessage(message, type) {
        workoutMessage.className = `alert alert-${type}`;
        workoutMessage.textContent = message;
        workoutMessage.style.display = 'block';
    }
    
    function hideMessage() {
        workoutMessage.style.display = 'none';
    }
});
