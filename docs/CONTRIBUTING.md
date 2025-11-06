# Contributing to Online Quiz Assessment Platform

First off, thank you for considering contributing to the Online Quiz Assessment Platform! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code snippets, screenshots, etc.)
- **Describe the behavior you observed** and what you expected to see
- **Include details about your environment** (OS, Node.js version, Docker version)

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a step-by-step description** of the suggested enhancement
- **Provide specific examples** to demonstrate the use case
- **Explain why this enhancement would be useful**

### 🔨 Pull Requests

1. Fork the repository
2. Create a new branch from `main`
3. Make your changes
4. Write or update tests as needed
5. Ensure all tests pass
6. Update documentation
7. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 18+
- Docker Desktop
- Git

### Local Development

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/online-quiz-platform.git
cd online-quiz-platform

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start development servers
# Backend (http://localhost:4000)
cd backend && npm run dev

# Frontend (http://localhost:3000)
cd frontend && npm run dev
```

### Docker Development

```bash
# Start all services
docker-compose up -d --build

# Load demo data
docker-compose exec backend node src/utils/seedData.js

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Coding Guidelines

### JavaScript/React Style

- Use **ES6+ features** (arrow functions, destructuring, async/await)
- Use **functional components** and hooks (no class components)
- Follow **camelCase** for variables and functions
- Use **PascalCase** for React components
- Keep functions **small and focused** (single responsibility)
- Write **meaningful variable names** (no single-letter variables except in loops)

### File Organization

```
backend/
  src/
    controllers/    - Route handlers
    models/         - Mongoose schemas
    services/       - Business logic
    middleware/     - Express middleware
    routes/         - API routes
    utils/          - Helper functions

frontend/
  src/
    components/     - Reusable UI components
    pages/          - Page-level components
    services/       - API clients
    store/          - Redux slices
    utils/          - Helper functions
```

### Code Quality

- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **Comments**: Write clear comments for complex logic
- **Error Handling**: Always handle errors gracefully
- **Security**: Never commit sensitive data (API keys, passwords)

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring without adding features or fixing bugs
- **test**: Adding or updating tests
- **chore**: Changes to build process or auxiliary tools

### Examples

```bash
feat(quiz): add code execution support for Python

- Add Python code execution endpoint
- Integrate with Judge0 API
- Add syntax highlighting in quiz editor

Closes #123
```

```bash
fix(auth): resolve JWT token expiration issue

Fixed bug where expired tokens were not being properly handled,
causing users to remain logged in after expiration.

Fixes #456
```

## Pull Request Process

### Before Submitting

1. **Update Documentation**: Ensure README and relevant docs are updated
2. **Run Tests**: All tests must pass
3. **Update CHANGELOG**: Add your changes to the unreleased section
4. **Check Code Style**: Run linter and fix any issues
5. **Test Locally**: Verify your changes work in Docker environment

### PR Template

When creating a pull request, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that causes existing functionality to change)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Tested in Docker environment
- [ ] Added new tests for new features

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Commented complex code sections
- [ ] Updated documentation
- [ ] No new warnings or errors
- [ ] Tested all affected features
```

### Review Process

1. Maintainers will review your PR within 3-5 business days
2. Address any requested changes
3. Once approved, a maintainer will merge your PR

## Questions?

Feel free to reach out:

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Email**: your.email@example.com

Thank you for contributing! 🙌
