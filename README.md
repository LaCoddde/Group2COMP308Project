"# Group 2 COMP308 Project - Health Monitoring System

A full-stack health monitoring application that enables **nurses** to track patient vital signs and **patients** to log daily health information, track symptoms, and receive AI-powered condition predictions.

![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)

## 🩺 Features

### For Nurses
- **Record Vital Signs** – Log patient body temperature, heart rate, blood pressure, and respiratory rate
- **View Patient Data** – Access previous visit records and patient health history
- **Send Motivational Tips** – Provide encouragement and health tips to patients
- **Generate Reports** – Create and send medical reports to patients

### For Patients
- **Daily Health Logging** – Record daily metrics including pulse rate, blood pressure, weight, temperature, and respiratory rate
- **Symptom Checklist** – Track and submit symptoms for monitoring
- **View Motivational Tips** – Receive tips and encouragement from nurses
- **AI Condition Prediction** – Get health condition predictions powered by TensorFlow.js

## 🛠️ Tech Stack

### Frontend
- **React 18** – UI library
- **React Router v6** – Client-side routing
- **Apollo Client** – GraphQL client
- **TailwindCSS** – Utility-first styling
- **TensorFlow.js** – Machine learning predictions
- **React Toastify** – Toast notifications

### Backend
- **Node.js + Express** – Server framework
- **GraphQL** – API query language (using `express-graphql`)
- **MongoDB + Mongoose** – Database and ODM
- **JWT** – Authentication tokens
- **bcrypt** – Password hashing

## 📁 Project Structure

```
Group2COMP308Project/
├── backend/
│   ├── graphql/          # GraphQL schema and resolvers
│   ├── models/           # Mongoose models (User, VitalSign, DailyInfo, etc.)
│   ├── routes/           # REST auth routes
│   ├── utils/            # Authentication utilities
│   ├── index.js          # Server entry point
│   └── .env.example      # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── Modules/      # React components (dashboards, forms, etc.)
│   │   ├── Context/      # React context providers
│   │   └── App.js        # Main application with routing
│   └── .env.example      # Environment variables template
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **MongoDB** (local instance or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Group2COMP308Project.git
   cd Group2COMP308Project
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Edit .env if needed (default connects to localhost:4000)
   ```

### Environment Variables

#### Backend (`.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/...` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secure_secret_key` |
| `PORT` | Server port (optional) | `4000` |

#### Frontend (`.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:4000` |

### Running the Application

**Start Backend** (runs on port 4000):
```bash
cd backend
npm start
```

**Start Frontend** (runs on port 3000):
```bash
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## 📊 GraphQL API

The backend exposes a GraphQL endpoint at `/graphql` with GraphiQL enabled for development.

### Example Queries
```graphql
# Get all patients
query {
  patients {
    id
    name
    email
    age
    gender
  }
}

# Get vital signs recorded by a nurse
query {
  getVitalSignsByNurseId(nurseId: "...") {
    bodyTemperature
    heartRate
    bloodPressure
    respiratoryRate
    createdAt
  }
}
```

### Example Mutations
```graphql
# Record vital signs
mutation {
  recordVitalSigns(
    nurseId: "..."
    patientId: "..."
    bodyTemperature: 98.6
    heartRate: 72
    bloodPressure: "120/80"
    respiratoryRate: 16
  ) {
    id
    createdAt
  }
}
```

## 🔐 Authentication

- Users register and login via REST endpoints at `/api/auth`
- JWT tokens are stored in localStorage
- Protected routes require valid authentication tokens

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Honesty Werinwo** & Group 2 Contributors - COMP308 Project

---

<p align="center">Made with ❤️ for COMP308</p>
" 
