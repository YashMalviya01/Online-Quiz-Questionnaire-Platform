import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, Lock, Eye, Brain, Code, Award, 
  ChevronRight, CheckCircle, Users, Zap, Star,
  BarChart, Clock, FileText, Cpu, Database, Globe
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import '../styles/globals.css';
import './LandingPageNew.css';
import apiClient from '../services/apiClient.js';

const LandingPageNew = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Advanced Anti-Cheat',
      description: 'Real-time proctoring with AI-powered face detection, liveness verification, and behavior monitoring',
      color: 'purple'
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Live Proctoring',
      description: 'Continuous face tracking, gaze detection, and multiple person detection during exams',
      color: 'blue'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Detection',
      description: 'Machine learning algorithms detect suspicious patterns, audio anomalies, and cheating attempts',
      color: 'cyan'
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Code Execution',
      description: 'Support for coding questions with real-time code execution in multiple programming languages',
      color: 'orange'
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Secure Authentication',
      description: '2FA, JWT tokens, and role-based access control ensure platform security',
      color: 'green'
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics with detailed reports, violation tracking, and performance metrics',
      color: 'pink'
    }
  ];

  const techStack = [
    { name: 'React', icon: <Cpu />, category: 'Frontend' },
    { name: 'Node.js', icon: <Globe />, category: 'Backend' },
    { name: 'MongoDB', icon: <Database />, category: 'Database' },
    { name: 'Face-API.js', icon: <Eye />, category: 'AI/ML' },
    { name: 'WebSocket', icon: <Zap />, category: 'Real-time' },
    { name: 'Docker', icon: <FileText />, category: 'DevOps' },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '50ms', label: 'Detection Speed' },
    { value: '24/7', label: 'Monitoring' }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-gradient"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              Smart Quiz Platform with
              <span className="gradient-text"> Advanced Anti-Cheat</span>
            </h1>
            
            <p className="hero-subtitle animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              Experience the next generation of online assessments with AI-powered proctoring,
              real-time monitoring, and comprehensive security features
            </p>

            <div className="hero-demo-section animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <div className="demo-card">
                <div className="demo-icon">
                  <Database size={24} />
                </div>
                <div className="demo-content">
                  <h3 className="demo-title">Load Demo Data</h3>
                  <p className="demo-description">Try the platform with sample quizzes and users</p>
                  <Button 
                    variant="primary" 
                    size="md"
                    onClick={async () => {
                      if (!window.confirm('This will populate the database with demo quizzes and sample users. Continue?')) return;
                      try {
                        const { data } = await apiClient.post('/api/seed');
                        if (data?.success) {
                          alert('Demo data loaded successfully! You can now login with demo credentials.');
                          navigate('/login');
                        } else {
                          alert('Failed to load demo data: ' + (data?.message || 'Unknown error'));
                        }
                      } catch (error) {
                        const message = error.response?.data?.message || error.message;
                        alert('Error loading demo data: ' + message);
                      }
                    }}
                    leftIcon={<Database />}
                  >
                    Load Demo Data
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-subtitle">
              Everything you need for secure and intelligent online assessments
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-card feature-card--${feature.color} animate-fadeIn`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`feature-icon feature-icon--${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="tech-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Built with Modern Technology</h2>
            <p className="section-subtitle">
              Leveraging cutting-edge tools and frameworks for reliability and performance
            </p>
          </div>

          <div className="tech-grid">
            {techStack.map((tech, index) => (
              <div 
                key={index} 
                className="tech-card animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="tech-icon">{tech.icon}</div>
                <div className="tech-name">{tech.name}</div>
                <div className="tech-category">{tech.category}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <Link to="/about">Features</Link>
                <Link to="/about">Tech Stack</Link>
                <Link to="/register">Pricing</Link>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <Link to="/about">Documentation</Link>
                <Link to="/about">API Reference</Link>
                <Link to="/about">Support</Link>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <Link to="/about">Privacy Policy</Link>
                <Link to="/about">Terms of Service</Link>
                <Link to="/about">Security</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageNew;
