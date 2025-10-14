// Meditation Timer functionality

document.addEventListener('DOMContentLoaded', function() {
    let meditationInterval;
    let meditationSeconds = 0;
    let isRunning = false;
    
    const timerDisplay = document.getElementById('meditationTimer');
    const startBtn = document.getElementById('startMeditation');
    const pauseBtn = document.getElementById('pauseMeditation');
    const stopBtn = document.getElementById('stopMeditation');
    const meditationType = document.getElementById('meditationType');
    const meditationMessage = document.getElementById('meditationMessage');
    
    if (startBtn) {
        startBtn.addEventListener('click', startMeditation);
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', pauseMeditation);
    }
    
    if (stopBtn) {
        stopBtn.addEventListener('click', stopMeditation);
    }
    
    function startMeditation() {
        if (!isRunning) {
            isRunning = true;
            meditationInterval = setInterval(updateTimer, 1000);
            
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            stopBtn.disabled = false;
            
            hideMessage();
        }
    }
    
    function pauseMeditation() {
        if (isRunning) {
            isRunning = false;
            clearInterval(meditationInterval);
            
            startBtn.disabled = false;
            pauseBtn.disabled = true;
        }
    }
    
    function stopMeditation() {
        isRunning = false;
        clearInterval(meditationInterval);
        
        const duration = Math.floor(meditationSeconds / 60);
        const type = meditationType.value;
        
        // Save meditation to database
        if (duration > 0) {
            fetch('/api/save-meditation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    meditation_type: type,
                    duration: duration
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage(`Wonderful! ${duration} minute ${type} session saved!`, 'success');
                } else {
                    showMessage('Meditation completed but not saved.', 'warning');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('Meditation completed but not saved.', 'warning');
            });
        }
        
        // Reset timer
        meditationSeconds = 0;
        timerDisplay.textContent = '00:00';
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
    }
    
    function updateTimer() {
        meditationSeconds++;
        const minutes = Math.floor(meditationSeconds / 60);
        const seconds = meditationSeconds % 60;
        timerDisplay.textContent = 
            String(minutes).padStart(2, '0') + ':' + 
            String(seconds).padStart(2, '0');
    }
    
    function showMessage(message, type) {
        meditationMessage.className = `alert alert-${type}`;
        meditationMessage.textContent = message;
        meditationMessage.style.display = 'block';
    }
    
    function hideMessage() {
        meditationMessage.style.display = 'none';
    }
});
