# 🎓 Online Quiz Assessment Platform
<div align="center">

[![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)](https://github.com/Chetankhaped/Online-Quiz-Questionnaire-Platform)
[![Stack](https://img.shields.io/badge/Stack-MERN-00b894?style=for-the-badge&logo=mongodb&logoColor=white)](https://github.com/Chetankhaped/Online-Quiz-Questionnaire-Platform)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://github.com/Chetankhaped/Online-Quiz-Questionnaire-Platform)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

A modern, production-ready assessment platform that delivers secure testing, AI-powered proctoring, and deep analytics for teams of any size. Built end-to-end with the MERN stack, it ships with polished UX, enterprise security features, and a one-command demo environment.

![Dashboard Preview](https://via.placeholder.com/1200x520/667eea/ffffff?text=Online+Quiz+Assessment+Platform)

## 🧭 Table of Contents
- [Highlights](#-highlights)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Manual Setup](#-manual-setup)
- [Demo Accounts](#-demo-accounts)
- [Core Features](#-core-features)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Testing](#-testing)
- [Development Scripts](#-development-scripts)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)
- [Support](#-support)

## ✨ Highlights
- 🎯 **Multiple assessment types**: MCQ, true/false, essay, file upload, and code execution.
- 🛡️ **Layered security**: JWT, 2FA, OAuth 2.0, granular RBAC, and rate limiting.
- 🧠 **AI-driven proctoring**: Face detection, behavioral analytics, tab switching alerts, and violation scoring.
- 📊 **Actionable insights**: Student, class, and platform-level dashboards with exportable reports.
- 🐳 **Docker-ready**: Launch the full stack (frontend, backend, MongoDB) with a single command.

## 📦 Tech Stack
### Frontend
- React 18 with Vite for lightning-fast builds.
- Redux Toolkit, React Router 6, and Axios for stateful, predictable flows.
- Tailwind CSS, Chart.js/Recharts, Monaco Editor, and face-api.js for rich UI experiences.

### Backend
- Node.js 18 + Express.js with modular controllers and services.
- MongoDB 6 via Mongoose schemas and helpers.
- Passport.js (OAuth), JSON Web Tokens, bcrypt, Multer, and Nodemailer.
- Socket.io for real-time updates and proctoring events.

### DevOps & Tooling
- Docker & Docker Compose for local and production parity.
- Nginx as an optional reverse proxy for the frontend.
- Jest (backend) and Vitest (frontend) for automated testing.
- ESLint + Prettier for consistent style.

## 🚀 Quick Start
### Prerequisites
- Docker Desktop (Windows/macOS) or Docker Engine (Linux)
- Docker Compose V2+
- 4 GB RAM (8 GB recommended) and 10 GB free disk space

### One-Command Demo
Pick your platform and run the bundled setup script:

| Platform | Command |
|----------|---------|
| 🪟 Windows (PowerShell) | `cd "RUN ON WINDOWS"; .\setup-demo.ps1` |
| 🪟 Windows (Batch) | `setup-demo.bat` |
| 🍎 macOS | `cd "RUN ON MAC" && chmod +x *.sh && ./setup-demo.sh` |
| 🐧 Linux | `cd "RUN ON LINUX" && chmod +x *.sh && ./setup-demo.sh` |

> ℹ️ These scripts spin up Docker containers with built-in defaults and **auto-create backend/frontend `.env` files** if they don't exist, so you're ready to explore with a single click. Update the generated `.env` files afterward if you need custom credentials or third-party keys—see [Manual Setup](#-manual-setup) and [Deployment](#-deployment).

The script verifies Docker, builds the containers, boots the stack, seeds demo data, and opens the app at `http://localhost:3000` (frontend) with the API at `http://localhost:5000/api`.

## 🧼 Manual Setup
Prefer to wire things up yourself? Follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chetankhaped/Online-Quiz-Questionnaire-Platform.git
   cd Online-Quiz-Questionnaire-Platform
   ```
2. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update environment variables
   npm run dev
   ```
3. **Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```
4. **MongoDB**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:6
   ```
5. (Optional) **Seed demo data**
   ```bash
   cd backend
   node src/utils/seedData.js
   ```

## 🔐 Demo Accounts
| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | `admin@quiz.com` | `Admin@123` | Full platform administration |
| Teacher | `teacher@quiz.com` | `Teacher@123` | Quiz management and grading |
| Student | `student@quiz.com` | `Student@123` | Assessment participation and results |

> Demo data ships with six users, three question banks, one sample quiz, and representative analytics data.

## 🧠 Core Features
### Assessment Creation
- Rich question banks with tagging, difficulty ratings, and CSV/JSON import/export.
- Configurable time limits, retakes, question pools, and adaptive testing.
- Partial credit grading and rubric support for subjective questions.

### Enhanced Proctoring
- Live webcam monitoring with multiple-face/no-face detection.
- Browser lockdown: full-screen enforcement, tab switching, context menu and copy/paste prevention.
- Behavioral analytics: eye tracking, keystroke analysis, audio hints, and periodic screenshots.

### Analytics & Reporting
- Student, instructor, and admin dashboards with trend analysis.
- Exportable CSV gradebooks, PDF certificates, and violation reports.
- Violation severity scoring with evidence attachments for audits.

### Secure Access Control
- JWT + refresh tokens, optional 2FA, and OAuth (Google/GitHub) sign-in.
- Role-based permissions (student, teacher, admin) enforced at route and UI levels.
- Rate limiting, helmet-based headers, and validation middleware throughout.

## 🧰 Project Structure
```
Online-Quiz-Questionnaire-Platform/
├── backend/
│   ├── src/
│   │   ├── config/           # Database & Passport setup
│   │   ├── controllers/      # REST controllers
│   │   ├── middleware/       # Auth, validation, rate limiting
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express routers
│   │   ├── services/         # Business logic services
│   │   └── utils/            # Logging, seeding, helpers
│   ├── tests/                # Jest suites
│   └── package.json          # Backend manifest
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI building blocks
│   │   ├── pages/            # Route-level pages
│   │   ├── services/         # API clients
│   │   ├── store/            # Redux Toolkit slices
│   │   └── styles/           # Global styles & Tailwind config
│   └── package.json          # Frontend manifest
├── docs/                     # Extended documentation
├── docker-compose.yml        # Multi-container orchestration
├── RUN ON <platform>/        # Platform-specific demo scripts
└── README.md                 # You are here
```

## 📄 Documentation
- [Quick Start Guide](docs/QUICK_START.md)
- [API Reference](docs/API_QUICK_REFERENCE.md)
- [Anti-Cheating Feature Matrix](docs/ANTI_CHEATING_FEATURES.md)
- [Testing Guide](docs/TESTING_GUIDE.md)
- [Demo Walkthrough](docs/DEMO_GUIDE.md)
- [Implementation Notes](docs/IMPLEMENTATION_COMPLETE.md)

## 🧪 Testing
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 🧑‍💻 Development Scripts
| Target | Command | Description |
|--------|---------|-------------|
| Backend (dev) | `npm run dev` | Nodemon-powered API server |
| Backend (prod) | `npm start` | Production Express server |
| Backend lint | `npm run lint` | ESLint check |
| Frontend (dev) | `npm run dev` | Vite dev server with HMR |
| Frontend build | `npm run build` | Optimized production build |
| Frontend preview | `npm run preview` | Serve built assets locally |
| Frontend lint | `npm run lint` | ESLint + style checks |

## 🐳 Deployment
### Docker Compose
```bash
docker-compose up -d --build
```
Services boot on:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`
- MongoDB: `mongodb://localhost:27017`

### Environment Variables
Create `.env` files in both `backend/` and `frontend/` directories using the provided examples. Key backend variables include:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/quiz-platform
JWT_SECRET=change-me
JWT_REFRESH_SECRET=change-me-too
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

Frontend variables:
```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000
```

## 🛣️ Roadmap
- [ ] Native mobile apps (iOS/Android)
- [ ] Advanced AI proctoring with pose estimation
- [ ] Real-time collaborative quizzes
- [ ] LMS integrations (Moodle, Canvas, Blackboard)
- [ ] Multi-language localization and white-labeling
- [ ] Gamification (badges, leaderboards)
- [ ] Webhook integrations for external systems

## 🤝 Contributing
We love community contributions! Please:
1. Fork the repository and create a feature branch.
2. Follow the existing coding standards.
3. Add or update tests where relevant.
4. Update documentation if behavior changes.
5. Open a pull request with a clear summary of your changes.

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

## 📜 License
This project is licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgements
- MongoDB, Express.js, React, and Node.js communities for fantastic tooling.
- face-api.js and Monaco Editor maintainers for powering premium features.
- Docker & GitHub for infrastructure and collaboration.

## 📬 Support
- 📖 Review the docs bundled in `docs/`
- 🐛 Report bugs or request features via [GitHub Issues](https://github.com/Chetankhaped/Online-Quiz-Questionnaire-Platform/issues)
- 💬 Join discussions in [GitHub Discussions](https://github.com/Chetankhaped/Online-Quiz-Questionnaire-Platform/discussions)

If the platform helps you, consider starring the repository or sharing it with your community.

---

<div align="center">

[⬆ Back to top](#-online-quiz-assessment-platform)

</div>
