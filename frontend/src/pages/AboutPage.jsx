import React from 'react';
import { 
  Shield, Users, Code, Brain, Eye, Lock, 
  Zap, Database, Globe, Cpu
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import '../styles/globals.css';
import './DashboardPageRevamped.css';

const AboutPage = () => {
  const features = [
    {
      icon: <Shield />,
      title: 'AI Anti-Cheat',
      description: 'Real-time face detection & behavior monitoring',
      color: 'purple'
    },
    {
      icon: <Eye />,
      title: 'Live Proctoring',
      description: 'Continuous tracking with gaze & pose detection',
      color: 'blue'
    },
    {
      icon: <Code />,
      title: 'Code Execution',
      description: 'Support for coding questions with multiple languages',
      color: 'orange'
    },
    {
      icon: <Brain />,
      title: 'ML Detection',
      description: 'Machine learning for anomaly detection',
      color: 'cyan'
    }
  ];

  const techStack = [
    { icon: <Globe />, name: 'React', category: 'Frontend Framework' },
    { icon: <Cpu />, name: 'Node.js', category: 'Backend Runtime' },
    { icon: <Database />, name: 'MongoDB', category: 'Database' },
    { icon: <Eye />, name: 'Face-API.js', category: 'AI/ML Library' },
    { icon: <Zap />, name: 'WebSocket', category: 'Real-time Comm' },
    { icon: <Lock />, name: 'JWT + 2FA', category: 'Authentication' }
  ];

  const developers = [
    { name: 'Pentacore Solutions Team', role: 'Full Stack Development' },
    { name: 'Architecture Team', role: 'System Design & Security' },
    { name: 'AI/ML Team', role: 'Proctoring & Detection' },
    { name: 'DevOps Team', role: 'Infrastructure & Deployment' }
  ];

  return (
    <div className="dashboard-page">
      {/* Hero Section */}
      <section className="dashboard-hero">
        <div className="hero-gradient"></div>
        <div className="container">
          <div className="hero-content">
            <div className="welcome-section">
              <h1 className="welcome-title">
                About <span className="gradient-text">Our Platform</span>
              </h1>
              <p className="welcome-subtitle">
                A comprehensive quiz platform with advanced anti-cheat features
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container">
        <div className="dashboard-content">
          {/* Developer Section */}
          <section className="section developer-section">
            <div className="developer-header">
              <Shield className="developer-logo" />
              <div>
                <h2 className="section-title">Developed by Pentacore Solutions</h2>
                <p className="section-subtitle">
                  A comprehensive quiz platform with advanced anti-cheat features
                </p>
              </div>
            </div>
            
            <div className="developers-grid">
              {developers.map((dev, index) => (
                <Card key={index} className="developer-card">
                  <div className="developer-avatar">
                    <Users />
                  </div>
                  <h3 className="developer-name">{dev.name}</h3>
                  <p className="developer-role">{dev.role}</p>
                </Card>
              ))}
            </div>

            <Card className="credits-card">
              <h3 className="credits-title">Platform Information</h3>
              <div className="credits-info">
                <div className="credits-item">
                  <strong>Platform:</strong> Smart Quiz with Anti-Cheat Features
                </div>
                <div className="credits-item">
                  <strong>Organization:</strong> Pentacore Solutions
                </div>
                <div className="credits-item">
                  <strong>Version:</strong> 2.0.0
                </div>
                <div className="credits-item">
                  <strong>Technologies:</strong> React, Node.js, MongoDB, Face-API.js, WebSockets, Docker
                </div>
              </div>
            </Card>
          </section>

          {/* Platform Features */}
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">Platform Features</h2>
              <p className="section-subtitle">Advanced capabilities for secure assessment</p>
            </div>
            <div className="features-grid">
              {features.map((feature, index) => (
                <Card key={index} className={`feature-card feature-card--${feature.color}`}>
                  <div className={`feature-icon feature-icon--${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Tech Stack */}
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">Technology Stack</h2>
              <p className="section-subtitle">Built with modern technologies</p>
            </div>
            <div className="tech-stack-grid">
              {techStack.map((tech, index) => (
                <Card key={index} className="tech-stack-card">
                  <div className="tech-stack-icon">
                    {tech.icon}
                  </div>
                  <h3 className="tech-stack-name">{tech.name}</h3>
                  <p className="tech-stack-category">{tech.category}</p>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
