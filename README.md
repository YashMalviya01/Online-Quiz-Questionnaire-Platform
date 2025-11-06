# 🎓 Online Quiz Assessment Platform# 🎓 Online Quiz Assessment Platform

<div align="center">

<div align="center">

[![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)](https://github.com/Chetankhaped/Online-Quiz-Questionnaire-Platform)

[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)[![Stack](https://img.shields.io/badge/Stack-MERN-00b894?style=for-the-badge&logo=mongodb&logoColor=white)](https://github.com/Chetankhaped/Online-Quiz-Questionnaire-Platform)

[![Stack](https://img.shields.io/badge/Stack-MERN-00b894?style=for-the-badge&logo=mongodb&logoColor=white)](https://github.com/Chetankhaped/Online-Quiz-Questionnaire-Platform)[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://github.com/Chetankhaped/Online-Quiz-Questionnaire-Platform)

[![AI Powered](https://img.shields.io/badge/AI-Ollama_Powered-ff6b6b?style=for-the-badge&logo=artificial-intelligence&logoColor=white)](https://ollama.com)[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)



</div></div>



A comprehensive, production-ready online quiz and assessment platform featuring AI-powered quiz generation, real-time proctoring, and advanced analytics. Built with the MERN stack and optimized for Mac Mini M4 with Ollama integration.A modern, production-ready assessment platform that delivers secure testing, AI-powered proctoring, and deep analytics for teams of any size. Built end-to-end with the MERN stack, it ships with polished UX, enterprise security features, and a one-command demo environment.



---![Dashboard Preview](https://via.placeholder.com/1200x520/667eea/ffffff?text=Online+Quiz+Assessment+Platform)



## ✨ Key Features## 🧭 Table of Contents

- [Highlights](#-highlights)

### 🎯 Assessment Management- [Tech Stack](#-tech-stack)

- **Multiple Question Types**: Multiple choice, true/false, fill-in-the-blank, coding challenges- [Quick Start](#-quick-start)

- **AI Quiz Generation**: Automatic question generation using fine-tuned Ollama models (quiz-master)- [Manual Setup](#-manual-setup)

- **Comprehensive Question Bank**: Pre-loaded with 448+ questions across JavaScript, Python, Java, and C++- [Demo Accounts](#-demo-accounts)

- **Flexible Quiz Creation**: Build custom quizzes with drag-and-drop question selection- [Core Features](#-core-features)

- **Scheduled Assessments**: Set start times, duration, and availability windows- [Project Structure](#-project-structure)

- [Documentation](#-documentation)

### 🤖 AI-Powered Features- [Testing](#-testing)

- **Ollama Integration**: Local LLM running on Mac Mini M4 for quiz generation- [Development Scripts](#-development-scripts)

- **Fine-tuned Models**: Custom `quiz-master` model optimized for educational content- [Deployment](#-deployment)

- **Smart Question Generation**: Context-aware questions with proper difficulty levels- [Roadmap](#-roadmap)

- **Multi-language Support**: JavaScript, Python, Java, C++ quiz generation- [Contributing](#-contributing)

- [License](#-license)

### 🛡️ Security & Proctoring- [Acknowledgements](#-acknowledgements)

- **JWT Authentication**: Secure token-based authentication with refresh tokens- [Support](#-support)

- **Role-Based Access Control (RBAC)**: Admin, Teacher, Student roles

- **Real-time Proctoring**: Monitor student activity during exams## ✨ Highlights

- **Anti-cheating Measures**: Tab switching detection, copy-paste prevention- 🎯 **Multiple assessment types**: MCQ, true/false, essay, file upload, and code execution.

- **Session Management**: Secure session handling with audit logging- 🛡️ **Layered security**: JWT, 2FA, OAuth 2.0, granular RBAC, and rate limiting.

- 🧠 **AI-driven proctoring**: Face detection, behavioral analytics, tab switching alerts, and violation scoring.

### 📊 Analytics & Reporting- 📊 **Actionable insights**: Student, class, and platform-level dashboards with exportable reports.

- **Detailed Performance Metrics**: Student scores, question-level analytics- 🐳 **Docker-ready**: Launch the full stack (frontend, backend, MongoDB) with a single command.

- **Dashboard Views**: Personalized dashboards for all user roles

- **Export Functionality**: Download reports in CSV/PDF formats## 📦 Tech Stack

- **Historical Tracking**: Performance trends over time### Frontend

- **Class Comparisons**: Compare student performance across cohorts- React 18 with Vite for lightning-fast builds.

- Redux Toolkit, React Router 6, and Axios for stateful, predictable flows.

### 🎨 User Experience- Tailwind CSS, Chart.js/Recharts, Monaco Editor, and face-api.js for rich UI experiences.

- **Modern UI**: Clean, responsive design with Tailwind CSS

- **Real-time Updates**: Socket.io integration for live notifications### Backend

- **Code Editor**: Monaco Editor for coding questions- Node.js 18 + Express.js with modular controllers and services.

- **Rich Text Editor**: Formatted content creation for questions- MongoDB 6 via Mongoose schemas and helpers.

- **Mobile Responsive**: Optimized for all screen sizes- Passport.js (OAuth), JSON Web Tokens, bcrypt, Multer, and Nodemailer.

- Socket.io for real-time updates and proctoring events.

---

### DevOps & Tooling

## 🚀 Quick Start- Docker & Docker Compose for local and production parity.

- Nginx as an optional reverse proxy for the frontend.

### Prerequisites- Jest (backend) and Vitest (frontend) for automated testing.

- **Node.js** 18+ and npm/yarn- ESLint + Prettier for consistent style.

- **MongoDB** 6+

- **Git**## 🚀 Quick Start

- **Mac Mini M4** (optional, for AI features with Ollama)

### Prerequisites

### Option 1: Automated Setup (Mac Mini M4)- **Docker Desktop** (Windows/macOS) or Docker Engine (Linux)

- **Docker Compose** V2+

For complete installation with Ollama auto-start on Mac Mini:- **RAM**: 16GB minimum (48GB+ for AI features)

- **Disk**: 10GB free (50GB+ with AI)

```bash

curl -o install.sh https://raw.githubusercontent.com/Chetankhaped/Online-Quiz-Questionnaire-Platform/master/scripts/macos/install-complete.sh### One-Command Demo

chmod +x install.sh

./install.sh**Windows:**

``````powershell

cd scripts\windows

This script will:.\setup-demo.bat

- Install all dependencies (Node.js, MongoDB, Ollama)# OR

- Clone and configure the project.\setup-demo.ps1

- Set up fine-tuned AI models```

- Configure auto-start services for boot

- Create management helper scripts**macOS:**

```bash

### Option 2: Manual Setupcd scripts/macos

chmod +x setup-demo.sh

#### 1. Clone Repository./setup-demo.sh

```bash```

git clone https://github.com/Chetankhaped/Online-Quiz-Questionnaire-Platform.git

cd Online-Quiz-Questionnaire-Platform**Linux:**

``````bash

cd scripts/linux

#### 2. Backend Setupchmod +x setup-demo.sh

```bash./setup-demo.sh

cd backend```

npm install

### What Happens?

# Create .env file

cat > .env << EOF1. ✅ Verifies Docker installation

PORT=40002. ✅ Creates `.env` files from templates

NODE_ENV=development3. ✅ Builds and starts containers (MongoDB, Backend, Frontend, Ngrok)

4. ✅ **Optional:** Downloads Llama 3.3 AI model (37GB, ~30-60 min)

MONGO_URI=mongodb://localhost:27017/quiz-proctor5. ✅ Seeds demo data (users, quizzes, results)

JWT_SECRET=your-super-secret-jwt-key-change-in-production6. ✅ Opens browser to http://localhost:3000

SESSION_SECRET=your-session-secret-key-change-in-production

**During setup, you'll be prompted:**

FRONTEND_URL=http://localhost:5173### Access Points

CLIENT_ORIGIN=http://localhost:5173

- **Frontend**: http://localhost:3000

# Ollama AI Configuration (optional)- **Backend API**: http://localhost:4000/api

OLLAMA_API_ENDPOINT=http://localhost:11434/api/generate- **MongoDB**: localhost:27017

OLLAMA_MODEL=quiz-master- **Public URL**: https://smart-quiz-platform.pentacoresolutions.in

- **Ngrok Dashboard**: http://localhost:4040

USE_DOCKER=false

EOF> 📖 **For detailed setup instructions**, see [Getting Started Guide](docs/setup/GETTING_STARTED.md)



# Start backend## 🧼 Manual Setup

npm run devPrefer to wire things up yourself? Follow these steps:

```

1. **Clone the repository**

#### 3. Frontend Setup   ```bash

```bash   git clone https://github.com/Chetankhaped/Online-Quiz-Questionnaire-Platform.git

cd ../frontend   cd Online-Quiz-Questionnaire-Platform

npm install   ```

2. **Backend**

# Create .env file   ```bash

cat > .env << EOF   cd backend

VITE_API_URL=http://localhost:4000   npm install

VITE_WS_URL=ws://localhost:4000   cp .env.example .env

EOF   # Update environment variables

   npm run dev

# Start frontend   ```

npm run dev3. **Frontend**

```   ```bash

   cd frontend

#### 4. MongoDB Setup   npm install

```bash   cp .env.example .env

# macOS (with Homebrew)   npm run dev

brew tap mongodb/brew   ```

brew install mongodb-community4. **MongoDB**

brew services start mongodb-community   ```bash

   docker run -d -p 27017:27017 --name mongodb mongo:6

# Ubuntu/Debian   ```

sudo apt-get install mongodb5. (Optional) **Seed demo data**

sudo systemctl start mongodb   ```bash

   cd backend

# Windows   node src/utils/seedData.js

# Download and install from https://www.mongodb.com/try/download/community   ```

```

## 📚 Question Bank System

#### 5. Ollama Setup (Optional - for AI Quiz Generation)

This platform includes a comprehensive pre-built question bank for quiz generation:

**On Mac Mini M4:**

```bash### 🎯 Question Bank Features

# Install Ollama- **4000+ Questions**: Pre-built questions across multiple languages

curl -fsSL https://ollama.com/install.sh | sh- **Multiple Languages**: JavaScript, Python, Java, C++

- **Topic-Based**: Organized by programming topics and concepts

# Pull base model- **Offline Ready**: No internet or API keys required

ollama pull qwen2.5-coder:7b- **Multiple Types**: MCQ, True/False, Fill-in-the-blank, Coding



# Create fine-tuned quiz-master model### 📊 Question Coverage:

cd ai-training/modelfiles- **JavaScript**: 1000 questions (fundamentals, DOM, async, ES6+)

ollama create quiz-master -f Modelfile.quiz-master- **Python**: 1000 questions (basics, data structures, OOP, libraries)

- **Java**: 1000 questions (syntax, OOP, collections, concurrency)

# Start Ollama server (accessible network-wide)- **C++**: 1000 questions (memory, STL, templates, advanced)

OLLAMA_HOST=0.0.0.0:11434 ollama serve

```### 🚀 How to Use:

1. Login as instructor or admin

---2. Navigate to Quiz Configuration

3. Click "Generate Questions"

## 📂 Project Structure4. Select language, topic, difficulty, and question type

5. Questions are automatically generated from the bank

```

Online-Quiz-Questionnaire-Platform/### � Question Bank Location:

├── backend/                    # Node.js/Express backend- `backend/src/data/questionBankGenerated.json`

│   ├── src/- Service: `backend/src/services/questionBankService.js`

│   │   ├── controllers/       # Route controllers- Controller: `backend/src/controllers/questionGeneratorController.js`

│   │   ├── models/            # MongoDB/Mongoose models

│   │   ├── routes/            # API routes## 🔐 Demo Seed Data & Credentials

│   │   ├── services/          # Business logic (Ollama, AI services)The repository includes a comprehensive seeding script that wipes existing quiz-related collections and repopulates them with a representative dataset. You can trigger it manually or rely on the platform-specific setup scripts, which call it automatically when spinning up the Docker demo environment.

│   │   ├── middleware/        # Auth, validation, error handling

│   │   ├── config/            # Configuration files### Seed the database manually

│   │   └── utils/             # Helper utilities1. Ensure the backend `.env` file points to your desired MongoDB instance and that the database is reachable.

│   ├── tests/                 # Backend tests2. From the `backend/` directory, install dependencies and run migrations if you haven't already:

│   └── package.json   ```powershell

│   cd backend

├── frontend/                   # React/Vite frontend   npm install

│   ├── src/   node src/utils/seedData.js

│   │   ├── components/        # React components   ```

│   │   ├── pages/             # Page components   > The seed resets quizzes, question banks, results, analytics, and user collections before inserting demo fixtures. Run it only on non-production databases.

│   │   ├── store/             # Redux store

│   │   ├── services/          # API services### Accounts created by the seed

│   │   ├── hooks/             # Custom React hooks| Role | Email | Password | Access |

│   │   └── utils/             # Frontend utilities|------|-------|----------|--------|

│   ├── public/                # Static assets| Admin | `admin@quiz.com` | `admin123` | Full platform administration, security settings |

│   └── package.json| Instructor | `instructor@quiz.com` | `instructor123` | Quiz authoring, proctoring review, analytics |

│| Students | `aman@student.com`<br>`chetan@student.com`<br>`vanisha@student.com`<br>`shashank@student.com`<br>`yash@student.com` | `student123` | Quiz participation, result review |

├── ai-training/               # AI model configurations

│   ├── modelfiles/            # Ollama Modelfiles### What the seed loads

│   └── datasets/              # Training data examples- 7 verified users (1 admin, 1 instructor, 5 students with biometric descriptors)

│- 3 public question banks (JavaScript Essentials, Python Fundamentals, Mathematics Practice)

├── scripts/                   # Automation scripts- 1 comprehensive quiz showcasing multiple-choice and coding questions with enhanced proctoring enabled

│   ├── macos/                 # Mac-specific scripts- 2 sample questions and 3 graded results to populate dashboards and analytics views

│   │   ├── install-complete.sh   # Complete setup script

│   │   ├── start-all.sh          # Start services## 🧠 Core Features

│   │   ├── stop-all.sh           # Stop services### 📚 Automated Question Generation

│   │   └── status.sh             # Check status- **Question Bank System**: Generate questions from pre-built question bank

│   └── generate-*.py          # Question generation scripts  - Multiple-choice, true/false, fill-in-the-blank, and coding questions

│  - Topic-based filtering (loops, functions, OOP, data structures, etc.)

├── docs/                      # Documentation  - Customizable difficulty levels (easy, medium, hard)

│   ├── setup/                 # Setup guides  - 4000+ questions across JavaScript, Python, Java, C++

│   ├── ai/                    # AI integration docs  - Random selection for variety

│   └── CONTRIBUTING.md  - No internet or API keys required

│

├── docker-compose.yml         # Docker orchestration### Assessment Creation

└── README.md- Rich question banks with tagging, difficulty ratings, and CSV/JSON import/export.

```- Pre-built question bank with 4000+ questions for automated generation.

- Topic-based question filtering and selection from comprehensive question bank.

---- Configurable time limits, retakes, question pools, and adaptive testing.

- Partial credit grading and rubric support for subjective questions.

## 🎯 Usage

### Enhanced Proctoring

### Default Login Credentials- Live webcam monitoring with multiple-face/no-face detection.

- Browser lockdown: full-screen enforcement, tab switching, context menu and copy/paste prevention.

After installation, you can create admin/teacher/student accounts through the registration flow, or use seeded accounts if you've run seed scripts.- Behavioral analytics: eye tracking, keystroke analysis, audio hints, and periodic screenshots.

- AI-powered code plagiarism and generation detection.

### Creating Quizzes

### Analytics & Reporting

1. **Login as Teacher/Admin**- Student, instructor, and admin dashboards with trend analysis.

2. Navigate to **Quiz Management**- Question bank usage statistics and performance metrics.

3. Click **Create New Quiz**- Exportable CSV gradebooks, PDF certificates, and violation reports.

4. Options:- Violation severity scoring with evidence attachments for audits.

   - **Manual Creation**: Select questions from the question bank

   - **AI Generation**: Use Ollama to generate quiz questions automatically### Secure Access Control

5. Set quiz parameters (duration, difficulty, language)- JWT + refresh tokens, optional 2FA, and OAuth (Google/GitHub) sign-in.

6. Schedule and publish- Role-based permissions (student, teacher, admin) enforced at route and UI levels.

- Rate limiting, helmet-based headers, and validation middleware throughout.

### Taking Quizzes

## 🧰 Project Structure

1. **Login as Student**```

2. View **Available Quizzes** on dashboardOnline-Quiz-Questionnaire-Platform/

3. Click **Start Quiz** when ready├── backend/              # Node.js/Express API

4. Answer questions within time limit│   ├── src/

5. Submit and view instant results│   │   ├── config/      # Database & Passport setup

│   │   ├── controllers/ # REST controllers

### Monitoring & Analytics│   │   ├── middleware/  # Auth, validation, rate limiting

│   │   ├── models/      # Mongoose schemas

1. **Teachers**: View student submissions, grade manually (if needed), export reports│   │   ├── routes/      # Express routers

2. **Admins**: Access platform-wide analytics, user management, system health│   │   ├── services/    # Business logic (AI, proctoring)

│   │   └── utils/       # Logging, seeding, helpers

---│   └── tests/           # Jest test suites

├── frontend/            # React 18 + Vite

## 🔧 Configuration│   ├── src/

│   │   ├── components/  # Reusable UI components

### Environment Variables│   │   ├── pages/       # Route-level pages

│   │   ├── services/    # API clients

**Backend (.env)**│   │   ├── store/       # Redux Toolkit slices

```env│   │   └── styles/      # Tailwind CSS

PORT=4000│   └── __tests__/       # Vitest test suites

NODE_ENV=production|development├── docs/                # Documentation

│   ├── setup/          # Getting started guides

MONGO_URI=mongodb://localhost:27017/quiz-proctor│   │   └── GETTING_STARTED.md

JWT_SECRET=<your-secret>│   ├── ai/             # AI features documentation

SESSION_SECRET=<your-secret>│   │   ├── LLAMA_INTEGRATION.md

│   │   ├── AI_FEATURES_QUICK_REFERENCE.md

FRONTEND_URL=http://localhost:5173│   │   └── AI_IMPLEMENTATION_SUMMARY.md

CLIENT_ORIGIN=http://localhost:5173│   ├── CONTRIBUTING.md

│   └── CODE_OF_CONDUCT.md

OLLAMA_API_ENDPOINT=http://10.108.51.85:11434/api/generate├── scripts/             # Setup and utility scripts

OLLAMA_MODEL=quiz-master│   ├── windows/        # Windows setup (.bat, .ps1)

```│   ├── macos/          # macOS setup (.sh)

│   ├── linux/          # Linux setup (.sh)

**Frontend (.env)**│   ├── setup-llama.*   # AI model setup

```env│   └── setup-ai-features.*

VITE_API_URL=http://localhost:4000├── Documents/           # Project documentation

VITE_WS_URL=ws://localhost:4000├── docker-compose.yml   # Container orchestration

```├── LICENSE

└── README.md           # You are here

### Ollama Model Configuration```



The fine-tuned `quiz-master` model is configured in:## 📄 Documentation

```

ai-training/modelfiles/Modelfile.quiz-master### Getting Started

```- 🚀 **[Getting Started Guide](docs/setup/GETTING_STARTED.md)** - Complete setup instructions

- 📝 **[Main README](README.md)** - Project overview (this file)

Key parameters:

- **Base Model**: qwen2.5-coder:7b### AI Features

- **Temperature**: 0.7 (balanced creativity)- 🦙 **[Llama Integration Guide](docs/ai/LLAMA_INTEGRATION.md)** - Local AI setup

- **Context Window**: 4096 tokens- ⚡ **[AI Features Reference](docs/ai/AI_FEATURES_QUICK_REFERENCE.md)** - API quick reference

- **Specialized**: Educational quiz generation for JavaScript, Python, Java, C++- 📊 **[AI Implementation](docs/ai/AI_IMPLEMENTATION_SUMMARY.md)** - Technical details



---### Contributing

- 🤝 **[Contributing Guidelines](docs/CONTRIBUTING.md)** - How to contribute

## 🧪 Testing- 📜 **[Code of Conduct](docs/CODE_OF_CONDUCT.md)** - Community guidelines



### Backend Tests## 🧪 Testing

```bash```bash

cd backend# Backend

npm test                    # Run all testscd backend

npm run test:coverage       # With coverage reportnpm test

```

# Frontend

### Frontend Testscd frontend

```bashnpm test

cd frontend```

npm test

```## 🧑‍💻 Development Scripts



---### Backend (Node.js/Express)

```bash

## 📜 API Documentationcd backend

npm run dev      # Development server with hot reload

### Authentication Endpointsnpm start        # Production server

- `POST /api/auth/register` - Register new usernpm test         # Run Jest tests

- `POST /api/auth/login` - User loginnpm run lint     # ESLint check

- `POST /api/auth/refresh` - Refresh JWT token```

- `POST /api/auth/logout` - User logout

### Frontend (React/Vite)

### Quiz Endpoints```bash

- `GET /api/quizzes` - Get all quizzescd frontend

- `POST /api/quizzes` - Create quiznpm run dev      # Development server (http://localhost:3000)

- `GET /api/quizzes/:id` - Get quiz by IDnpm run build    # Production build

- `PUT /api/quizzes/:id` - Update quiznpm run preview  # Preview production build

- `DELETE /api/quizzes/:id` - Delete quiznpm test         # Run Vitest tests

npm run lint     # ESLint + style checks

### AI Quiz Generation```

- `POST /api/ai-quiz/generate-multiple-choice` - Generate MCQ

- `POST /api/ai-quiz/generate-true-false` - Generate T/F### Platform Setup Scripts

- `POST /api/ai-quiz/generate-fill-blank` - Generate fill-in-blank

- `POST /api/ai-quiz/generate-coding` - Generate coding question**Windows:**

- `GET /api/ai-quiz/check-availability` - Check AI service status- `scripts\windows\setup-demo.bat` - Full setup (Batch)

- `scripts\windows\setup-demo.ps1` - Full setup (PowerShell)

---

**macOS:**

## 🐳 Docker Deployment- `scripts/macos/setup-demo.sh` - Full setup

- `scripts/macos/start-mac.sh` - Quick start

### Quick Deploy with Docker Compose- `scripts/macos/stop-mac.sh` - Stop services

- `scripts/macos/logs-mac.sh` - View logs

```bash- `scripts/macos/cleanup-mac.sh` - Complete cleanup

# Build and start all services

docker-compose up -d**Linux:**

- `scripts/linux/setup-demo.sh` - Full setup

# View logs- `scripts/linux/start-mac.sh` - Quick start

docker-compose logs -f- `scripts/linux/stop-mac.sh` - Stop services

- `scripts/linux/logs-mac.sh` - View logs

# Stop services- `scripts/linux/cleanup-mac.sh` - Complete cleanup

docker-compose down

```**AI Features:**

- `scripts/setup-llama.bat` - Llama AI setup (Windows)

Services will be available at:- `scripts/setup-llama.sh` - Llama AI setup (Mac/Linux)

- Frontend: http://localhost:5173- `scripts/setup-ai-features.bat` - Backend AI config (Windows)

- Backend: http://localhost:4000- `scripts/setup-ai-features.sh` - Backend AI config (Mac/Linux)

- MongoDB: localhost:27017

## 🐳 Deployment

---### Docker Compose

```bash

## 📚 Documentationdocker-compose up -d --build

```

Detailed documentation available in the `docs/` directory:Services boot on:

- Frontend: `http://localhost:3000`

- [Getting Started](docs/setup/GETTING_STARTED.md)- Backend API: `http://localhost:4000/api`

- [AI Model Fine-tuning](docs/setup/AI_MODEL_FINE_TUNING.md)- Public tunnel (ngrok): `https://smart-quiz-platform.pentacoresolutions.in`

- [Quick Setup Guide](docs/setup/QUICK_SETUP.md)- MongoDB: `mongodb://localhost:27017`

- [AI Quiz Quick Start](docs/setup/AI_QUIZ_QUICK_START.md)

- [Contributing Guidelines](docs/CONTRIBUTING.md)### Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories using the provided examples. Key backend variables include:

---

```env

## 🛠️ DevelopmentPORT=4000

NODE_ENV=production

### Start Development ServersMONGO_URI=mongodb://localhost:27017/quiz-proctor

JWT_SECRET=change-me

```bashJWT_REFRESH_SECRET=change-me-too

# Backend (with hot reload)EMAIL_HOST=smtp.gmail.com

cd backend && npm run devEMAIL_PORT=587

EMAIL_USER=your-email@gmail.com

# Frontend (with HMR)EMAIL_PASS=your-app-password

cd frontend && npm run devCLIENT_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:3000

CORS_ALLOW_ALL=false

# Both concurrently (from root)CORS_DOMAIN=https://smart-quiz-platform.pentacoresolutions.in

npm run dev:allFRONTEND_URL=https://smart-quiz-platform.pentacoresolutions.in

``````



### Code Quality> If you expose the app through a different domain, update both `CLIENT_ORIGIN` and `FRONTEND_URL`. You can override the ngrok authtoken by exporting `NGROK_AUTHTOKEN` before running the setup scripts.



```bashFrontend variables:

# Lint code```env

npm run lintVITE_API_BASE_URL=http://localhost:4000

VITE_WS_URL=ws://localhost:4000

# Format codeVITE_API_PORT=4000

npm run formatVITE_PUBLIC_TUNNEL_URL=https://smart-quiz-platform.pentacoresolutions.in

```

# Type checking (if using TypeScript)

npm run type-check## 🛣️ Roadmap

```- [ ] Native mobile apps (iOS/Android)

- [ ] Advanced AI proctoring with pose estimation

---- [ ] Real-time collaborative quizzes

- [ ] LMS integrations (Moodle, Canvas, Blackboard)

## 🚀 Deployment- [ ] Multi-language localization and white-labeling

- [ ] Gamification (badges, leaderboards)

### Production Build- [ ] Webhook integrations for external systems



**Frontend:**## 🤝 Contributing

```bashWe love community contributions! Please:

cd frontend1. Fork the repository and create a feature branch.

npm run build2. Follow the existing coding standards.

# Outputs to: frontend/dist/3. Add or update tests where relevant.

```4. Update documentation if behavior changes.

5. Open a pull request with a clear summary of your changes.

**Backend:**

```bashSee [CONTRIBUTING.md](docs/CONTRIBUTING.md) for full guidelines.

cd backend

npm run build  # If using TypeScript## 📜 License

npm start      # Production serverThis project is licensed under the [MIT License](LICENSE).

```

## 🙏 Acknowledgements

### Recommended Hosting- MongoDB, Express.js, React, and Node.js communities for fantastic tooling.

- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront- face-api.js and Monaco Editor maintainers for powering premium features.

- **Backend**: AWS EC2, DigitalOcean, Heroku- Docker & GitHub for infrastructure and collaboration.

- **Database**: MongoDB Atlas, self-hosted

- **Ollama**: Dedicated Mac Mini M4 or GPU server## 📬 Support

- 📖 Review the docs bundled in `docs/`

---- 🐛 Report bugs or request features via [GitHub Issues](https://github.com/Chetankhaped/Online-Quiz-Questionnaire-Platform/issues)

- 💬 Join discussions in [GitHub Discussions](https://github.com/Chetankhaped/Online-Quiz-Questionnaire-Platform/discussions)

## 🤝 Contributing

If the platform helps you, consider starring the repository or sharing it with your community.

We welcome contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

---

1. Fork the repository

2. Create feature branch (`git checkout -b feature/AmazingFeature`)<div align="center">

3. Commit changes (`git commit -m 'Add AmazingFeature'`)

4. Push to branch (`git push origin feature/AmazingFeature`)[⬆ Back to top](#-online-quiz-assessment-platform)

5. Open Pull Request

</div>

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Chetan Khaped** - [GitHub](https://github.com/Chetankhaped)

---

## 🙏 Acknowledgements

- [Ollama](https://ollama.com) - Local LLM runtime
- [qwen2.5-coder](https://ollama.com/library/qwen2.5-coder) - Base AI model
- [MongoDB](https://www.mongodb.com) - Database
- [React](https://reactjs.org) - Frontend framework
- [Express](https://expressjs.com) - Backend framework
- [Tailwind CSS](https://tailwindcss.com) - Styling

---

## 📞 Support

For support, email chetankhaped@example.com or open an issue on GitHub.

---

<div align="center">

Made with ❤️ by Chetan Khaped

⭐ Star this repo if you find it helpful!

</div>
