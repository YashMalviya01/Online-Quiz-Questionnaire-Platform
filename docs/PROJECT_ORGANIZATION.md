# 📁 Project Organization

This document explains the new organized structure of the Online Quiz Platform repository.

## 🎯 What Changed?

We've reorganized the project to eliminate duplicate documentation, consolidate scripts, and create a cleaner structure.

### Before (Messy)
```
❌ LLAMA_SETUP.md
❌ LLAMA_QUICKSTART.md
❌ LLAMA_INTEGRATION_GUIDE.md
❌ SETUP_SCRIPTS_UPDATED.md
❌ AI_FEATURES_QUICK_REFERENCE.md
❌ AI_IMPLEMENTATION_SUMMARY.md
❌ CODE_OF_CONDUCT.md
❌ CONTRIBUTING.md
❌ RUN ON WINDOWS/
❌ RUN ON MAC/
❌ RUN ON LINUX/
❌ setup-llama.bat (root)
❌ setup-llama.sh (root)
❌ backend/setup-ai-features.*
```

### After (Clean)
```
✅ docs/
   ├── setup/
   │   └── GETTING_STARTED.md          # All setup instructions
   ├── ai/
   │   ├── LLAMA_INTEGRATION.md        # Complete AI guide
   │   ├── AI_FEATURES_QUICK_REFERENCE.md
   │   └── AI_IMPLEMENTATION_SUMMARY.md
   ├── CONTRIBUTING.md
   └── CODE_OF_CONDUCT.md
✅ scripts/
   ├── windows/
   │   ├── setup-demo.bat
   │   └── setup-demo.ps1
   ├── macos/
   │   ├── setup-demo.sh
   │   ├── start-mac.sh
   │   ├── stop-mac.sh
   │   ├── logs-mac.sh
   │   └── cleanup-mac.sh
   ├── linux/
   │   ├── setup-demo.sh
   │   ├── start-mac.sh
   │   ├── stop-mac.sh
   │   ├── logs-mac.sh
   │   └── cleanup-mac.sh
   ├── setup-llama.bat
   ├── setup-llama.sh
   ├── setup-ai-features.bat
   └── setup-ai-features.sh
```

## 📂 Directory Structure

### Root Directory
```
Online-Quiz-Questionnaire-Platform/
├── backend/                 # Node.js/Express backend
├── frontend/                # React frontend
├── docs/                    # 📚 All documentation
├── scripts/                 # 🔧 All scripts
├── Documents/               # Project deliverables
├── docker-compose.yml       # Container orchestration
├── LICENSE                  # MIT License
└── README.md               # Main documentation
```

### Documentation (`docs/`)

#### Setup Documentation (`docs/setup/`)
- **GETTING_STARTED.md** - Complete setup guide for all platforms
  - Prerequisites
  - Quick start instructions
  - Platform-specific commands
  - Troubleshooting
  - AI setup (optional)

#### AI Documentation (`docs/ai/`)
- **LLAMA_INTEGRATION.md** - Comprehensive Llama 3.3 guide
  - System requirements
  - Installation steps
  - Configuration options
  - Performance tuning
  - Troubleshooting
  - API reference
  
- **AI_FEATURES_QUICK_REFERENCE.md** - Quick API reference
  - Endpoints
  - Request/response formats
  - Code examples

- **AI_IMPLEMENTATION_SUMMARY.md** - Technical implementation
  - Architecture
  - Service integration
  - Code structure

#### Contributing (`docs/`)
- **CONTRIBUTING.md** - Contribution guidelines
- **CODE_OF_CONDUCT.md** - Community standards

### Scripts (`scripts/`)

#### Windows Scripts (`scripts/windows/`)
- **setup-demo.bat** - Full setup (Windows Batch)
- **setup-demo.ps1** - Full setup (PowerShell)

#### macOS Scripts (`scripts/macos/`)
- **setup-demo.sh** - Full platform setup
- **start-mac.sh** - Quick start all services
- **stop-mac.sh** - Stop all services
- **logs-mac.sh** - View service logs
- **cleanup-mac.sh** - Complete cleanup

#### Linux Scripts (`scripts/linux/`)
- **setup-demo.sh** - Full platform setup
- **start-mac.sh** - Quick start all services
- **stop-mac.sh** - Stop all services
- **logs-mac.sh** - View service logs
- **cleanup-mac.sh** - Complete cleanup

#### AI Setup Scripts (`scripts/`)
- **setup-llama.bat** - Llama AI setup (Windows)
- **setup-llama.sh** - Llama AI setup (Mac/Linux)
- **setup-ai-features.bat** - Backend AI configuration (Windows)
- **setup-ai-features.sh** - Backend AI configuration (Mac/Linux)

## 🗺️ Navigation Guide

### I want to...

**...get started quickly**
→ Read: `docs/setup/GETTING_STARTED.md`
→ Run: `scripts/windows/setup-demo.bat` (or your platform)

**...set up AI features**
→ Read: `docs/ai/LLAMA_INTEGRATION.md`
→ Run: `scripts/setup-llama.bat` (or .sh)

**...understand AI APIs**
→ Read: `docs/ai/AI_FEATURES_QUICK_REFERENCE.md`

**...contribute to the project**
→ Read: `docs/CONTRIBUTING.md`

**...see all available scripts**
→ Browse: `scripts/` directory

**...understand the architecture**
→ Read: Main `README.md` + `docs/ai/AI_IMPLEMENTATION_SUMMARY.md`

## 📝 Documentation Consolidation

### Merged Documents

**GETTING_STARTED.md** consolidates:
- ✅ LLAMA_SETUP.md (deleted)
- ✅ LLAMA_QUICKSTART.md (deleted)
- ✅ SETUP_SCRIPTS_UPDATED.md (deleted)
- ✅ Parts of LLAMA_INTEGRATION_GUIDE.md

**LLAMA_INTEGRATION.md** consolidates:
- ✅ LLAMA_INTEGRATION_GUIDE.md (deleted)
- ✅ Parts of LLAMA_SETUP.md
- ✅ Parts of LLAMA_QUICKSTART.md
- ✅ Technical details from multiple sources

### Moved Documents
- ✅ AI_FEATURES_QUICK_REFERENCE.md → `docs/ai/`
- ✅ AI_IMPLEMENTATION_SUMMARY.md → `docs/ai/`
- ✅ CONTRIBUTING.md → `docs/`
- ✅ CODE_OF_CONDUCT.md → `docs/`

### Removed Folders
- ❌ RUN ON WINDOWS/ (merged into `scripts/windows/`)
- ❌ RUN ON MAC/ (merged into `scripts/macos/`)
- ❌ RUN ON LINUX/ (merged into `scripts/linux/`)

## 🎯 Benefits

### Before
- 📄 4 duplicate Llama documentation files
- 🔀 Confusing "RUN ON X" folder names
- 📁 Scripts scattered in multiple locations
- 🤔 Hard to find the right documentation
- 📚 12+ markdown files in root

### After
- ✅ Single comprehensive guide per topic
- ✅ Clear `scripts/` and `docs/` organization
- ✅ Platform-specific folders (windows/macos/linux)
- ✅ Easy navigation with clear naming
- ✅ Clean root directory (only 3 files: README, LICENSE, docker-compose)

## 🚀 Quick Commands

### Windows
```powershell
# Full setup
cd scripts\windows
.\setup-demo.bat

# AI setup
cd scripts
.\setup-llama.bat
```

### macOS/Linux
```bash
# Full setup
cd scripts/macos  # or linux
chmod +x setup-demo.sh
./setup-demo.sh

# AI setup
cd scripts
chmod +x setup-llama.sh
./setup-llama.sh

# Quick operations
cd scripts/macos
./start-mac.sh    # Start services
./stop-mac.sh     # Stop services
./logs-mac.sh     # View logs
./cleanup-mac.sh  # Complete cleanup
```

## 📖 Reading Order

For new users, we recommend:

1. **README.md** (root) - Project overview
2. **docs/setup/GETTING_STARTED.md** - Setup instructions
3. Run your platform's setup script
4. **docs/ai/LLAMA_INTEGRATION.md** - AI features (optional)
5. **docs/CONTRIBUTING.md** - If contributing

## 🔄 Migration Guide

If you have old documentation bookmarked:

| Old Path | New Path |
|----------|----------|
| `LLAMA_SETUP.md` | `docs/ai/LLAMA_INTEGRATION.md` |
| `LLAMA_QUICKSTART.md` | `docs/setup/GETTING_STARTED.md` |
| `LLAMA_INTEGRATION_GUIDE.md` | `docs/ai/LLAMA_INTEGRATION.md` |
| `SETUP_SCRIPTS_UPDATED.md` | `docs/setup/GETTING_STARTED.md` |
| `CONTRIBUTING.md` | `docs/CONTRIBUTING.md` |
| `CODE_OF_CONDUCT.md` | `docs/CODE_OF_CONDUCT.md` |
| `RUN ON WINDOWS/*.bat` | `scripts/windows/*.bat` |
| `RUN ON MAC/*.sh` | `scripts/macos/*.sh` |
| `RUN ON LINUX/*.sh` | `scripts/linux/*.sh` |
| `setup-llama.*` (root) | `scripts/setup-llama.*` |

## 🎨 Naming Conventions

### Folders
- `docs/` - All documentation
- `scripts/` - All executable scripts
- `backend/` - Backend source code
- `frontend/` - Frontend source code
- `Documents/` - Project deliverables (presentations, reports)

### Files
- **UPPERCASE.md** - Main documentation (README, LICENSE)
- **PascalCase.md** - Guide documents (GETTING_STARTED, CONTRIBUTING)
- **lowercase.sh/.bat** - Script files (setup-demo, start-mac)

### Script Naming
- `setup-*.sh/bat` - Setup scripts
- `start-*.sh` - Start services
- `stop-*.sh` - Stop services
- `logs-*.sh` - View logs
- `cleanup-*.sh` - Cleanup scripts

## 💡 Tips

### Finding Documentation
- **General setup?** → `docs/setup/`
- **AI features?** → `docs/ai/`
- **Contributing?** → `docs/CONTRIBUTING.md`
- **API reference?** → `docs/ai/AI_FEATURES_QUICK_REFERENCE.md`

### Finding Scripts
- **Your OS?** → `scripts/windows/`, `scripts/macos/`, or `scripts/linux/`
- **AI setup?** → `scripts/setup-llama.*`
- **Quick start?** → Platform folder's `setup-demo.*`

### Need Help?
1. Check `docs/setup/GETTING_STARTED.md` first
2. Review `docs/ai/LLAMA_INTEGRATION.md` for AI issues
3. See troubleshooting sections in docs
4. Open GitHub issue if stuck

---

**Last Updated**: November 3, 2025  
**Changes**: Complete reorganization of scripts and documentation
