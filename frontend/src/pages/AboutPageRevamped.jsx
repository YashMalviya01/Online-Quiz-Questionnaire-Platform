import React, { useState } from 'react';
import { 
  Shield, Users, Code, Brain, Eye, Lock, 
  Zap, Database, Globe, Cpu, Activity, ChevronDown, ChevronUp,
  CheckCircle, AlertTriangle, TrendingUp, Server, Cloud,
  FileText, Video, Mic, MousePointer, Layers
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import '../styles/globals.css';
import './AboutPageRevamped.css';

const AboutPageRevamped = () => {
  const [expandedFeatures, setExpandedFeatures] = useState({});

  const toggleFeature = (id) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const antiCheatFeatures = [
    {
      id: 'face-detection',
      icon: <Eye />,
      title: 'Real-time Face Detection',
      shortDesc: 'AI-powered face tracking throughout the exam',
      detailedDesc: [
        'Continuous face detection using Face-API.js with TinyFaceDetector',
        'Face landmark detection with 68-point facial feature mapping',
        'Real-time face recognition to ensure identity consistency',
        'Alerts when no face or multiple faces are detected',
        'Automatic violation recording with timestamp'
      ],
      tech: ['Face-API.js', 'TensorFlow.js', 'WebRTC'],
      color: 'blue'
    },
    {
      id: 'liveness',
      icon: <Activity />,
      title: 'Liveness Detection',
      shortDesc: 'Prevent photo/video spoofing attacks',
      detailedDesc: [
        'Random challenge-based liveness checks',
        'Blink detection to verify real person',
        'Head movement validation',
        'Texture analysis to detect printed photos',
        'Depth perception using facial landmarks'
      ],
      tech: ['Face-API.js', 'Machine Learning', 'Computer Vision'],
      color: 'purple'
    },
    {
      id: 'gaze-tracking',
      icon: <MousePointer />,
      title: 'Gaze & Head Pose Detection',
      shortDesc: 'Monitor where the student is looking',
      detailedDesc: [
        'Eye gaze direction tracking',
        'Head rotation detection (yaw, pitch, roll)',
        'Threshold-based violation detection (35° rotation)',
        '3-second cooldown to prevent false positives',
        'Visual warnings before violation logging'
      ],
      tech: ['Face Landmarks', 'Euler Angles', 'Vector Mathematics'],
      color: 'cyan'
    },
    {
      id: 'audio-monitoring',
      icon: <Mic />,
      title: 'Audio Monitoring',
      shortDesc: 'Detect suspicious sounds and voices',
      detailedDesc: [
        'Real-time audio capture with Web Audio API',
        '10x gain boost for sensitive detection',
        'Voice activity detection (VAD)',
        'Multiple speaker detection',
        'Background noise analysis and filtering',
        'Suspicious pattern recognition'
      ],
      tech: ['Web Audio API', 'FFT Analysis', 'Voice Detection'],
      color: 'green'
    },
    {
      id: 'tab-switching',
      icon: <AlertTriangle />,
      title: 'Tab Switch Detection',
      shortDesc: 'Monitor browser focus and window changes',
      detailedDesc: [
        'Visibility API to detect tab switches',
        'Window focus/blur event monitoring',
        'Automatic quiz pause on suspicious activity',
        'Violation counter with detailed logs',
        'Warning system before penalties'
      ],
      tech: ['Visibility API', 'Focus Events', 'WebSockets'],
      color: 'orange'
    },
    {
      id: 'ai-behavior',
      icon: <Brain />,
      title: 'AI Behavior Analysis',
      shortDesc: 'Machine learning-based anomaly detection',
      detailedDesc: [
        'Pattern recognition for suspicious behavior',
        'Answer timing analysis',
        'Keystroke dynamics monitoring',
        'Mouse movement pattern analysis',
        'Statistical anomaly detection',
        'Risk scoring algorithm'
      ],
      tech: ['TensorFlow.js', 'Statistical Analysis', 'ML Algorithms'],
      color: 'pink'
    }
  ];

  const techStackDetails = [
    {
      category: 'Frontend',
      icon: <Globe />,
      color: 'blue',
      technologies: [
        {
          name: 'React 18',
          purpose: 'UI Framework',
          description: 'Modern component-based UI with hooks and context',
          features: ['Virtual DOM', 'State Management', 'Component Reusability']
        },
        {
          name: 'Vite',
          purpose: 'Build Tool',
          description: 'Lightning-fast development and optimized production builds',
          features: ['Hot Module Replacement', 'Fast Refresh', 'Tree Shaking']
        },
        {
          name: 'Tailwind CSS',
          purpose: 'Styling',
          description: 'Utility-first CSS framework for rapid UI development',
          features: ['Responsive Design', 'Custom Themes', 'JIT Compiler']
        },
        {
          name: 'Face-API.js',
          purpose: 'AI/ML',
          description: 'JavaScript face detection and recognition library',
          features: ['Face Detection', 'Landmarks', 'Face Recognition', 'Expression Detection']
        }
      ]
    },
    {
      category: 'Backend',
      icon: <Server />,
      color: 'green',
      technologies: [
        {
          name: 'Node.js',
          purpose: 'Runtime',
          description: 'JavaScript runtime for scalable server applications',
          features: ['Event-driven', 'Non-blocking I/O', 'NPM Ecosystem']
        },
        {
          name: 'Express.js',
          purpose: 'Web Framework',
          description: 'Fast, minimalist web framework for APIs',
          features: ['Routing', 'Middleware', 'RESTful APIs']
        },
        {
          name: 'Socket.io',
          purpose: 'Real-time Communication',
          description: 'WebSocket library for bidirectional event-based communication',
          features: ['Real-time Proctoring', 'Live Monitoring', 'Event Broadcasting']
        },
        {
          name: 'Passport.js',
          purpose: 'Authentication',
          description: 'Authentication middleware with multiple strategies',
          features: ['JWT', 'OAuth', 'Local Strategy', '2FA Support']
        }
      ]
    },
    {
      category: 'Database',
      icon: <Database />,
      color: 'purple',
      technologies: [
        {
          name: 'MongoDB',
          purpose: 'NoSQL Database',
          description: 'Document-based database for flexible data storage',
          features: ['Schema Flexibility', 'Scalability', 'JSON-like Documents']
        },
        {
          name: 'Mongoose',
          purpose: 'ODM',
          description: 'Elegant MongoDB object modeling for Node.js',
          features: ['Schema Validation', 'Middleware', 'Query Building']
        }
      ]
    },
    {
      category: 'DevOps',
      icon: <Cloud />,
      color: 'orange',
      technologies: [
        {
          name: 'Docker',
          purpose: 'Containerization',
          description: 'Container platform for consistent deployment',
          features: ['Isolated Environments', 'Easy Deployment', 'Scalability']
        },
        {
          name: 'Docker Compose',
          purpose: 'Orchestration',
          description: 'Multi-container application management',
          features: ['Service Definition', 'Network Management', 'Volume Mapping']
        },
        {
          name: 'Nginx',
          purpose: 'Web Server',
          description: 'High-performance reverse proxy and static file server',
          features: ['Load Balancing', 'Caching', 'SSL/TLS']
        }
      ]
    },
    {
      category: 'Security',
      icon: <Lock />,
      color: 'red',
      technologies: [
        {
          name: 'JWT',
          purpose: 'Token-based Auth',
          description: 'JSON Web Tokens for secure authentication',
          features: ['Stateless', 'Cross-domain', 'Compact']
        },
        {
          name: '2FA (TOTP)',
          purpose: 'Two-Factor Authentication',
          description: 'Time-based one-time passwords for enhanced security',
          features: ['Speakeasy', 'QR Codes', 'Backup Codes']
        },
        {
          name: 'bcrypt',
          purpose: 'Password Hashing',
          description: 'Secure password hashing algorithm',
          features: ['Salting', 'Adaptive Hashing', 'Brute-force Resistant']
        }
      ]
    }
  ];

  const architectureFlow = [
    {
      step: '1',
      title: 'User Authentication',
      description: 'JWT + 2FA with role-based access control',
      icon: <Lock />
    },
    {
      step: '2',
      title: 'Quiz Initialization',
      description: 'Load quiz, start proctoring systems',
      icon: <FileText />
    },
    {
      step: '3',
      title: 'Real-time Monitoring',
      description: 'WebSocket connection for live proctoring',
      icon: <Video />
    },
    {
      step: '4',
      title: 'AI Analysis',
      description: 'Face detection, behavior analysis, audio monitoring',
      icon: <Brain />
    },
    {
      step: '5',
      title: 'Violation Detection',
      description: 'Log violations, send alerts, update dashboard',
      icon: <AlertTriangle />
    },
    {
      step: '6',
      title: 'Result Generation',
      description: 'Calculate scores, generate reports with violation logs',
      icon: <TrendingUp />
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-gradient"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Shield className="w-4 h-4" />
              <span>Pentacore Solutions</span>
            </div>
            <h1 className="hero-title">
              Smart Quiz Platform with
              <span className="gradient-text"> Advanced Anti-Cheat</span>
            </h1>
            <p className="hero-subtitle">
              A comprehensive assessment platform powered by AI, machine learning,
              and cutting-edge web technologies
            </p>
          </div>
        </div>
      </section>

      <div className="container about-content">
        {/* Anti-Cheat Features */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Anti-Cheat Features</h2>
            <p className="section-subtitle">
              Multi-layered security system powered by AI and real-time monitoring
            </p>
          </div>

          <div className="features-list">
            {antiCheatFeatures.map((feature) => (
              <Card 
                key={feature.id} 
                className={`feature-detail-card feature-detail-card--${feature.color}`}
              >
                <div className="feature-header" onClick={() => toggleFeature(feature.id)}>
                  <div className="feature-header-left">
                    <div className={`feature-icon feature-icon--${feature.color}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="feature-title">{feature.title}</h3>
                      <p className="feature-short-desc">{feature.shortDesc}</p>
                    </div>
                  </div>
                  <button className="expand-button">
                    {expandedFeatures[feature.id] ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </div>

                {expandedFeatures[feature.id] && (
                  <div className="feature-details">
                    <div className="feature-capabilities">
                      <h4>Capabilities:</h4>
                      <ul>
                        {feature.detailedDesc.map((desc, index) => (
                          <li key={index}>
                            <CheckCircle className="check-icon" />
                            <span>{desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="feature-tech-tags">
                      <strong>Technologies:</strong>
                      {feature.tech.map((tech, index) => (
                        <span key={index} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Technology Stack</h2>
            <p className="section-subtitle">
              Built with modern, reliable, and scalable technologies
            </p>
          </div>

          <Tabs defaultValue="Frontend" className="tech-tabs">
            <TabsList className="tech-tabs-list">
              {techStackDetails.map((stack) => (
                <TabsTrigger key={stack.category} value={stack.category}>
                  {stack.icon}
                  <span>{stack.category}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {techStackDetails.map((stack) => (
              <TabsContent key={stack.category} value={stack.category}>
                <div className="tech-stack-section">
                  {stack.technologies.map((tech, index) => (
                    <Card key={index} className="tech-detail-card">
                      <div className="tech-header">
                        <h3 className="tech-name">{tech.name}</h3>
                        <span className={`tech-badge tech-badge--${stack.color}`}>
                          {tech.purpose}
                        </span>
                      </div>
                      <p className="tech-description">{tech.description}</p>
                      <div className="tech-features">
                        {tech.features.map((feature, idx) => (
                          <span key={idx} className="tech-feature-tag">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* System Architecture */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">System Architecture</h2>
            <p className="section-subtitle">
              How the platform works from authentication to result generation
            </p>
          </div>

          <div className="architecture-flow">
            {architectureFlow.map((item, index) => (
              <React.Fragment key={item.step}>
                <Card className="architecture-card">
                  <div className="architecture-step">{item.step}</div>
                  <div className="architecture-icon">{item.icon}</div>
                  <h3 className="architecture-title">{item.title}</h3>
                  <p className="architecture-description">{item.description}</p>
                </Card>
                {index < architectureFlow.length - 1 && (
                  <div className="architecture-arrow">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Platform Stats */}
        <section className="section">
          <Card className="stats-banner">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon"><Shield /></div>
                <div className="stat-value">6</div>
                <div className="stat-label">Anti-Cheat Layers</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon"><Layers /></div>
                <div className="stat-value">20+</div>
                <div className="stat-label">Technologies</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon"><Zap /></div>
                <div className="stat-value">50ms</div>
                <div className="stat-label">Detection Speed</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon"><Users /></div>
                <div className="stat-value">99.9%</div>
                <div className="stat-label">Accuracy</div>
              </div>
            </div>
          </Card>
        </section>

        {/* Footer Credits */}
        <section className="credits-section">
          <Card className="credits-banner">
            <Shield className="credits-logo" />
            <div className="credits-content">
              <h2>Developed by Pentacore Solutions</h2>
              <p>
                A comprehensive quiz platform with advanced anti-cheat features,
                built with modern web technologies and AI-powered proctoring
              </p>
              <div className="credits-meta">
                <span>Version 2.0.0</span>
                <span>•</span>
                <span>© 2025 Pentacore Solutions</span>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default AboutPageRevamped;
