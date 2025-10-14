// Main JavaScript file for Holistiq

// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');
    
    if (chatSend) {
        chatSend.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessageToChat('user', message);
        chatInput.value = '';
        
        // Send to API
        fetch('/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                addMessageToChat('bot', data.response);
            } else {
                addMessageToChat('bot', 'Sorry, I encountered an error. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            addMessageToChat('bot', 'Sorry, I encountered an error. Please try again.');
        });
    }
    
    function addMessageToChat(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert ${sender === 'user' ? 'alert-primary' : 'alert-secondary'} mb-2`;
        messageDiv.innerHTML = `<strong>${sender === 'user' ? 'You' : 'Assistant'}:</strong> ${message}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Update unit labels when unit system changes
    const unitRadios = document.querySelectorAll('input[name="unitSystem"]');
    unitRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const weightUnit = document.getElementById('weightUnit');
            const heightUnit = document.getElementById('heightUnit');
            
            if (this.value === 'metric') {
                if (weightUnit) weightUnit.textContent = 'kg';
                if (heightUnit) heightUnit.textContent = 'cm';
            } else {
                if (weightUnit) weightUnit.textContent = 'lbs';
                if (heightUnit) heightUnit.textContent = 'in';
            }
        });
    });
});
