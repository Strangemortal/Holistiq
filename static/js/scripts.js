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

    // Initialize health dashboard
    // This is called from scripts.js, so health-dashboard.js must be loaded before this script.
    if (typeof initializeHealthDashboard === 'function') {
        initializeHealthDashboard();
    }

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
    const sendButton = document.getElementById('sendButton');

    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (message === '') return;
    
    addChatMessage('user', message);
    chatInput.value = '';
    showTypingIndicator();

    // --- NEW: Get health data from the dashboard ---
    const weightEl = document.getElementById('user-weight');
    const bmiEl = document.getElementById('user-bmi');
    const mentalScoreEl = document.getElementById('mental-score');

    const healthData = {
        message: message,
        weight: weightEl ? parseFloat(weightEl.textContent) : null,
        bmi: bmiEl ? parseFloat(bmiEl.textContent) : null,
        mentalHealthScore: mentalScoreEl ? parseInt(mentalScoreEl.textContent) : null,
        session_id: "some-unique-session-id" // You can implement session management here
    };

    // --- NEW: Call the backend API ---
    fetch('/api/chatbot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(healthData),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error || 'Network response was not ok.'); });
        }
        return response.json();
    })
    .then(data => {
        hideTypingIndicator();
        addChatMessage('bot', data.response);
    })
    .catch(error => {
        hideTypingIndicator();
        console.error('Chatbot Error:', error);
        addChatMessage('bot', `Sorry, I encountered an error: ${error.message}. Please try again later.`);
    });
}

function addChatMessage(sender, message) {
    const chatBox = document.getElementById('chatBox');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message d-flex mb-3 ${sender}-message`;
    
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    let icon;
    let content;

    if (sender === 'bot') {
        icon = '<div class="flex-shrink-0 me-3"><i class="fas fa-robot fa-lg text-primary"></i></div>';
        content = `<div class="flex-grow-1"><strong>Health Assistant:</strong><div class="bg-light rounded p-2">${message}</div><small class="text-muted ms-2">${timestamp}</small></div>`;
    } else {
        icon = '<div class="flex-shrink-0 ms-3 order-2"><i class="fas fa-user fa-lg text-secondary"></i></div>';
        content = `<div class="flex-grow-1 text-end order-1"><strong>You:</strong><div class="bg-white rounded p-2">${message}</div><small class="text-muted me-2">${timestamp}</small></div>`;
    }

    messageDiv.innerHTML = icon + content;
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    chatMessages.push({ sender, message, timestamp: new Date() });
}

function showTypingIndicator() {
    if (isTyping) return;
    const chatBox = document.getElementById('chatBox');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.className = 'chat-message d-flex mb-3 bot-message';
    typingDiv.innerHTML = '<div class="flex-shrink-0 me-3"><i class="fas fa-robot fa-lg text-primary"></i></div>' +
                          '<div class="flex-grow-1"><strong>Health Assistant:</strong><div class="bg-light rounded p-2"><em>Typing...</em></div></div>';
    
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

// Form validation
function initializeFormValidation() {
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
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver(function(entries, obs) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const elementsToAnimate = document.querySelectorAll('.feature-card, .exercise-card, .yoga-card, .recipe-card, .assessment-card');
    elementsToAnimate.forEach(el => { observer.observe(el); });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const chatModal = new bootstrap.Modal(document.getElementById('chatModal'));
        chatModal.show();
        setTimeout(() => { document.getElementById('chatInput').focus(); }, 300);
    }
    
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) { modalInstance.hide(); }
        });
    }
});
