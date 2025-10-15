let chatMessages = [];
let isTyping = false;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeHealthToolkit();
});

function initializeHealthToolkit() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize chat functionality
    initializeChat();
    
    // Add smooth scrolling to navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize form validations
    initializeFormValidation();
    
    // Add animation classes to elements as they come into view
    initializeScrollAnimations();
}

// Chat functionality
function initializeChat() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatBox = document.getElementById('chatBox');
    const message = chatInput.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addChatMessage('user', message);
    
    // Clear input
    chatInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate bot response after delay
    setTimeout(() => {
        hideTypingIndicator();
        const botResponse = generateBotResponse(message);
        addChatMessage('bot', botResponse);
    }, 1500);
}

function addChatMessage(sender, message) {
    const chatBox = document.getElementById('chatBox');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    if (sender === 'bot') {
        messageDiv.innerHTML = `<strong>Health Assistant:</strong> ${message} <small class="text-muted">(${timestamp})</small>`;
    } else {
        messageDiv.innerHTML = `<strong>You:</strong> ${message} <small class="text-muted">(${timestamp})</small>`;
    }
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    // Store message
    chatMessages.push({
        sender: sender,
        message: message,
        timestamp: new Date()
    });
}

function showTypingIndicator() {
    const chatBox = document.getElementById('chatBox');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.className = 'chat-message bot-message';
    typingDiv.innerHTML = '<strong>Health Assistant:</strong> <em>Typing...</em>';
    
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    isTyping = true;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isTyping = false;
}

function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Simple keyword-based responses
    if (message.includes('hello') || message.includes('hi')) {
        return "Hello! I'm here to help you with your health and wellness questions. How can I assist you today?";
    } else if (message.includes('bmi') || message.includes('body mass')) {
        return "I can help you calculate your BMI! You can use our BMI calculator on the home page, or tell me your height and weight and I'll calculate it for you.";
    } else if (message.includes('exercise') || message.includes('workout')) {
        return "Great! Regular exercise is essential for good health. Check out our exercise library for workouts suited to different fitness levels. What type of exercise are you interested in?";
    } else if (message.includes('nutrition') || message.includes('diet') || message.includes('food')) {
        return "Nutrition is a key component of health! Visit our recipes section for healthy meal ideas. What specific nutrition information are you looking for?";
    } else if (message.includes('stress') || message.includes('anxiety') || message.includes('mental health')) {
        return "Mental health is just as important as physical health. Try our mental health assessments and consider our meditation and breathing exercises. If you're experiencing persistent stress or anxiety, please consider speaking with a healthcare professional.";
    } else if (message.includes('sleep')) {
        return "Good sleep is crucial for health! Most adults need 7-9 hours per night. Try our sleep quality quiz in the mental health section for personalized tips.";
    } else if (message.includes('weight') || message.includes('lose') || message.includes('gain')) {
        return "Weight management involves both diet and exercise. I'd recommend checking your BMI first, then exploring our nutrition and exercise sections for personalized guidance.";
    } else if (message.includes('help') || message.includes('support')) {
        return "I'm here to help! You can ask me about exercise, nutrition, mental health, BMI calculation, or any other health-related topics. What would you like to know more about?";
    } else {
        return "That's an interesting question! While I can provide general health information, I'd recommend exploring our different sections - exercises, yoga & meditation, recipes, and mental health assessments. For specific medical concerns, please consult with a healthcare professional.";
    }
}

// Form validation
function initializeFormValidation() {
    // Add custom validation styles
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.prototype.slice.call(forms).forEach(function(form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.feature-card, .exercise-card, .yoga-card, .recipe-card, .assessment-card');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// Utility functions
function showLoading(element) {
    element.classList.add('loading');
    const originalText = element.innerHTML;
    element.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Loading...';
    element.dataset.originalText = originalText;
}

function hideLoading(element) {
    element.classList.remove('loading');
    if (element.dataset.originalText) {
        element.innerHTML = element.dataset.originalText;
        delete element.dataset.originalText;
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (notification && notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Health calculation utilities
function calculateBMI(weight, height) {
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return { category: 'Underweight', color: 'warning' };
    if (bmi < 25) return { category: 'Normal weight', color: 'success' };
    if (bmi < 30) return { category: 'Overweight', color: 'warning' };
    return { category: 'Obese', color: 'danger' };
}

function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

// Local storage utilities
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        return null;
    }
}

// API simulation functions (for demo purposes)
function simulateAPICall(endpoint, data = null) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Simulate random success/failure
            if (Math.random() > 0.1) { // 90% success rate
                resolve({
                    success: true,
                    data: data,
                    message: 'Operation completed successfully'
                });
            } else {
                reject({
                    success: false,
                    message: 'Network error occurred'
                });
            }
        }, 1000 + Math.random() * 2000);
    });
}

// Export functions for use in other scripts
window.HealthToolkit = {
    calculateBMI,
    getBMICategory,
    calculateAge,
    showNotification,
    showLoading,
    hideLoading,
    saveToLocalStorage,
    loadFromLocalStorage,
    simulateAPICall
};

// Service Worker registration (for PWA functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            }, function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Handle online/offline status
window.addEventListener('online', function() {
    showNotification('You are back online!', 'success');
});

window.addEventListener('offline', function() {
    showNotification('You are currently offline. Some features may be limited.', 'warning');
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to open chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const chatModal = new bootstrap.Modal(document.getElementById('chatModal'));
        chatModal.show();
        setTimeout(() => {
            document.getElementById('chatInput').focus();
        }, 300);
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
    }
});