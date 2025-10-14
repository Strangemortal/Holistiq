# Holistiq - Complete Health Toolkit

![Holistiq](https://img.shields.io/badge/Health-Toolkit-blue)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-brightgreen)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.2-purple)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

A comprehensive Flask-based web application for health and wellness management. Holistiq provides a complete toolkit for tracking fitness, practicing yoga and meditation, discovering healthy recipes, and monitoring your health journey with detailed reports.

## 🌟 Features

### Six Main Pages

1. **Home** - Welcome page with BMI calculator and feature overview
2. **Exercise** - Workout routines with timer functionality
3. **Yoga** - Yoga styles, poses, and breathing exercises
4. **Recipes** - Healthy recipes for meals and snacks
5. **Mental Health** - Meditation timer and mindfulness exercises
6. **Reports** - Health data visualization and export (PDF/JSON)

### Core Functionality

- ✅ **Real-time BMI Calculator** - Calculate and track your Body Mass Index
- ⏱️ **Workout Timer** - Track your exercise sessions with built-in timer
- 🧘 **Meditation Timer** - Time your meditation and mindfulness practices
- 🤖 **AI Chatbot** - Get instant health and wellness advice
- 📊 **Health Reports** - Export comprehensive health data in PDF or JSON format
- 💾 **MongoDB Integration** - Secure data storage and retrieval
- 📱 **Responsive Design** - Mobile-friendly interface using Bootstrap 5
- 🔒 **Secure** - Data handling with Flask security best practices
- 🚀 **Docker Ready** - Easy deployment with Docker and Docker Compose

## 📋 Requirements

- Python 3.11+
- MongoDB 7.0+
- Docker (optional, for containerized deployment)

## 🚀 Installation

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/Strangemortal/Holistiq.git
cd Holistiq
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Start MongoDB** (if not using Docker)
```bash
mongod --dbpath /path/to/your/data/directory
```

6. **Run the application**
```bash
python app.py
```

The application will be available at `http://localhost:5000`

### Docker Deployment

1. **Build and run with Docker Compose**
```bash
docker-compose up -d
```

2. **Access the application**
Open your browser and navigate to `http://localhost:5000`

3. **Stop the application**
```bash
docker-compose down
```

## 🗂️ Project Structure

```
Holistiq/
├── app.py                  # Main Flask application
├── config.py              # Configuration settings
├── requirements.txt       # Python dependencies
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose setup
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore rules
├── README.md            # Project documentation
├── templates/           # HTML templates
│   ├── base.html       # Base template
│   ├── home.html       # Home page
│   ├── exercise.html   # Exercise page
│   ├── yoga.html       # Yoga page
│   ├── recipes.html    # Recipes page
│   ├── mental_health.html  # Mental health page
│   └── reports.html    # Reports page
└── static/             # Static assets
    ├── css/
    │   └── style.css   # Custom styles
    └── js/
        ├── main.js     # Main JavaScript
        ├── bmi.js      # BMI calculator
        ├── workout-timer.js    # Workout timer
        ├── meditation-timer.js # Meditation timer
        └── reports.js  # Reports functionality
```

## 🎯 Usage Guide

### BMI Calculator
1. Navigate to the Home page
2. Enter your weight and height
3. Select your preferred unit system (Metric/Imperial)
4. Click "Calculate BMI" to see your results
5. Results are automatically saved to your health records

### Workout Tracking
1. Go to the Exercise page
2. Select your exercise type
3. Click "Start" to begin the timer
4. Click "Stop" when finished
5. Your workout is automatically saved

### Meditation Sessions
1. Visit the Mental Health page
2. Choose your meditation type
3. Use the timer to track your session
4. Session data is saved automatically

### Health Reports
1. Navigate to the Reports page
2. View all your health records
3. Export data as PDF or JSON
4. Track your progress over time

### Chatbot Assistant
1. Click the chat icon in the bottom-right corner
2. Ask questions about health, fitness, or nutrition
3. Get instant responses and guidance

## 🛠️ Technology Stack

- **Backend**: Flask 3.0.0
- **Database**: MongoDB 7.0
- **Frontend**: Bootstrap 5.3.2, HTML5, CSS3, JavaScript
- **PDF Generation**: ReportLab 4.0.7
- **Server**: Gunicorn 21.2.0
- **Containerization**: Docker & Docker Compose

## 📱 Responsive Design

Holistiq is fully responsive and optimized for:
- 📱 Mobile devices (320px and up)
- 📱 Tablets (768px and up)
- 💻 Desktops (1024px and up)
- 🖥️ Large screens (1440px and up)

## 🔐 Security Features

- Environment-based configuration
- Secure session management
- MongoDB connection security
- Input validation and sanitization
- CSRF protection
- Secure data transmission

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Strangemortal**
- GitHub: [@Strangemortal](https://github.com/Strangemortal)

## 🙏 Acknowledgments

- Bootstrap team for the amazing UI framework
- Flask community for the excellent web framework
- MongoDB for reliable data storage
- ReportLab for PDF generation capabilities

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainer.

## 🗺️ Roadmap

- [ ] User authentication and authorization
- [ ] Social sharing features
- [ ] Mobile app (React Native)
- [ ] Integration with fitness trackers
- [ ] Advanced analytics and insights
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Progressive Web App (PWA) support

## 📊 Screenshots

### Home Page
The home page features a welcoming hero section and the real-time BMI calculator.

### Exercise Page
Track your workouts with various exercise types and a built-in timer.

### Yoga Page
Explore different yoga styles and breathing techniques.

### Recipes Page
Discover healthy and nutritious recipes for all meals.

### Mental Health Page
Practice meditation and mindfulness with guided timers.

### Reports Page
View and export your complete health journey data.

---

**Built with ❤️ using Flask, MongoDB, and Bootstrap 5**