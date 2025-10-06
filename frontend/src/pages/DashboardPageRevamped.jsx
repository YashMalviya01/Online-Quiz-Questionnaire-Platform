import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Award, TrendingUp, Shield, Plus, 
  FileText, CheckCircle, Clock, Users, Code,
  Brain, Eye, Lock, Zap, Database, Globe, Cpu,
  BarChart, Activity, AlertTriangle, Home, Settings, Edit, Trash2
} from 'lucide-react';
import { fetchQuizzes, deleteQuiz, toggleQuizPublishStatus } from '../store/slices/quizSlice.js';
import { fetchAllResults, fetchResultsForUser } from '../store/slices/resultSlice.js';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import '../styles/globals.css';
import './DashboardPageRevamped.css';

const DashboardPageRevamped = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items: quizzes, status: quizzesStatus } = useSelector((state) => state.quizzes);
  const { list: results, listStatus } = useSelector((state) => state.results);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Calculate stats for students - for students, results already contains only their results
  const myResults = useMemo(() => {
    console.log('[Dashboard myResults] Raw results:', results);
    console.log('[Dashboard myResults] User:', user);
    console.log('[Dashboard myResults] Results length:', results?.length);
    
    if (!user) {
      console.log('[Dashboard myResults] No user, returning empty');
      return [];
    }
    
    // For students, the list is already filtered by backend (fetchResultsForUser)
    // For admin, we need to filter (but admin doesn't use myResults anyway)
    if (user.role === 'admin') {
      console.log('[Dashboard myResults] User is admin, returning empty');
      return [];
    }
    
    // Filter out in-progress results, only show submitted ones
    const filtered = results.filter(r => {
      console.log('[Dashboard myResults] Checking result:', r._id, 'status:', r.status);
      return r.status === 'submitted' || r.status === 'completed';
    });
    
    console.log('[Dashboard myResults] Filtered results:', filtered.length, filtered);
    return filtered;
  }, [results, user]);

  // Handle quiz deletion
  const handleDeleteQuiz = async (quizId, quizTitle) => {
    if (deleteConfirm !== quizId) {
      setDeleteConfirm(quizId);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }
    
    try {
      await dispatch(deleteQuiz(quizId)).unwrap();
      setDeleteConfirm(null);
    } catch (error) {
      alert('Failed to delete quiz: ' + (error?.message || 'Unknown error'));
    }
  };

  // Handle toggle publish status
  const handleTogglePublish = async (quizId, currentStatus) => {
    try {
      await dispatch(toggleQuizPublishStatus({ quizId, isPublished: !currentStatus })).unwrap();
    } catch (error) {
      alert('Failed to update quiz status: ' + (error?.message || 'Unknown error'));
    }
  };

  const stats = useMemo(() => {
    if (user?.role === 'admin') {
      const totalSubmissions = results.length;
      const sessionsWithAlerts = results.filter((res) => (res.proctoringLog?.length ?? 0) > 0).length;
      const scoredResults = results.filter((res) => typeof res.score === 'number');
      const averageScore = scoredResults.length
        ? Math.round((scoredResults.reduce((sum, res) => sum + res.score, 0) / scoredResults.length) * 10) / 10
        : 0;

      console.log('[Dashboard Stats] Admin:', {
        totalSubmissions,
        scoredResults: scoredResults.length,
        averageScore,
        resultsArray: results
      });

      return {
        totalQuizzes: quizzes.length,
        quizzesCompleted: totalSubmissions,
        averageScore: averageScore,
        sessionsWithAlerts: sessionsWithAlerts,
        recentActivity: results.slice(0, 5)
      };
    } else {
      const scoredResults = myResults.filter((res) => typeof res.score === 'number');
      const averageScore = scoredResults.length
        ? Math.round((scoredResults.reduce((sum, res) => sum + res.score, 0) / scoredResults.length) * 10) / 10
        : 0;

      console.log('[Dashboard Stats] Student:', {
        myResultsCount: myResults.length,
        scoredResults: scoredResults.length,
        averageScore,
        resultsArray: myResults
      });

      return {
        totalQuizzes: quizzes.length,
        quizzesCompleted: myResults.length,
        averageScore: averageScore,
        sessionsWithAlerts: 0,
        recentActivity: myResults.slice(0, 5)
      };
    }
  }, [user, quizzes, results, myResults]);

  useEffect(() => {
    if (!user) return;
    dispatch(fetchQuizzes());
    if (user.role === 'admin') {
      dispatch(fetchAllResults()).then((result) => {
        console.log('[Dashboard] Admin results fetched:', result.payload?.length || 0);
      });
    } else {
      // Fetch results for current student user - backend returns 'id' not '_id'
      dispatch(fetchResultsForUser(user.id)).then((result) => {
        console.log('[Dashboard] Student results fetched:', result.payload?.length || 0);
      });
    }
  }, [dispatch, user]);

  if (!user) return null;

  const quickActions = user?.role === 'admin' ? [
    {
      icon: <BookOpen />,
      title: 'My Quizzes',
      description: 'View and manage all quizzes',
      onClick: () => navigate('/quizzes'),
      color: 'blue'
    },
    {
      icon: <Plus />,
      title: 'Create Quiz',
      description: 'Create a new quiz',
      onClick: () => navigate('/manage-quiz'),
      color: 'purple'
    },
    {
      icon: <Users />,
      title: 'Student References',
      description: 'Upload and manage student photos',
      onClick: () => navigate('/admin/references'),
      color: 'cyan'
    },
    {
      icon: <FileText />,
      title: 'All Results',
      description: 'View all submissions',
      onClick: () => navigate('/results'),
      color: 'green'
    }
  ] : [
    {
      icon: <BookOpen />,
      title: 'Browse Quizzes',
      description: 'Explore available quizzes',
      onClick: () => navigate('/quizzes'),
      color: 'blue'
    },
    {
      icon: <FileText />,
      title: 'My Results',
      description: 'View your quiz results',
      onClick: () => navigate('/results'),
      color: 'green'
    },
    {
      icon: <Clock />,
      title: 'My Attempts',
      description: 'View attempted quizzes',
      onClick: () => navigate('/my-attempts'),
      color: 'cyan'
    },
    {
      icon: <BarChart />,
      title: 'Recent Activity',
      description: 'View latest submissions',
      onClick: () => navigate('/activity'),
      color: 'purple'
    }
  ];

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
                Welcome back, <span className="gradient-text">{user?.username || 'User'}!</span>
              </h1>
              <p className="welcome-subtitle">
                {user?.role === 'admin' ? 'Manage quizzes and monitor the platform' : 'Continue your learning journey'}
              </p>
            </div>

            <div className="stats-cards">
              <Card className="stat-card stat-card--blue">
                <div className="stat-icon">
                  <BookOpen />
                </div>
                <div className="stat-info">
                  <div className="stat-value">
                    {quizzesStatus === 'loading' ? '...' : stats.totalQuizzes}
                  </div>
                  <div className="stat-label">
                    {user.role === 'admin' ? 'Published Quizzes' : 'Available Quizzes'}
                  </div>
                </div>
              </Card>

              <Card className="stat-card stat-card--green">
                <div className="stat-icon">
                  <CheckCircle />
                </div>
                <div className="stat-info">
                  <div className="stat-value">
                    {listStatus === 'loading' ? '...' : stats.quizzesCompleted}
                  </div>
                  <div className="stat-label">
                    {user.role === 'admin' ? 'Total Submissions' : 'Completed Quizzes'}
                  </div>
                </div>
              </Card>

              <Card className="stat-card stat-card--purple">
                <div className="stat-icon">
                  <Award />
                </div>
                <div className="stat-info">
                  <div className="stat-value">
                    {listStatus === 'loading' ? '...' : `${stats.averageScore}%`}
                  </div>
                  <div className="stat-label">Average Score</div>
                </div>
              </Card>

              <Card className="stat-card stat-card--orange">
                <div className="stat-icon">
                  {user.role === 'admin' ? <AlertTriangle /> : <TrendingUp />}
                </div>
                <div className="stat-info">
                  <div className="stat-value">
                    {listStatus === 'loading' 
                      ? '...' 
                      : user.role === 'admin' 
                        ? stats.sessionsWithAlerts 
                        : (stats.averageScore >= 70 ? 'Excellent' : stats.averageScore >= 50 ? 'Good' : 'Improving')}
                  </div>
                  <div className="stat-label">
                    {user.role === 'admin' ? 'Sessions with Alerts' : 'Performance'}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <div className="container dashboard-content">
        {/* Quick Actions Section */}
        <section className="section" style={{ marginTop: 0 }}>
          <div className="quick-actions-grid">
            {quickActions
              .filter(action => !action.adminOnly || user?.role === 'admin')
              .map((action, index) => (
                <Card 
                  key={index} 
                  className={`quick-action-card quick-action-card--${action.color}`}
                  onClick={action.onClick}
                >
                  <div className={`action-icon action-icon--${action.color}`}>
                    {action.icon}
                  </div>
                  <h3 className="action-title">{action.title}</h3>
                  <p className="action-description">{action.description}</p>
                  <div className="action-arrow">→</div>
                </Card>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPageRevamped;
