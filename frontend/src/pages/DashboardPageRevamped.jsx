import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Award, TrendingUp, Shield, Plus, 
  FileText, CheckCircle, Clock, Users, Code,
  Brain, Eye, Lock, Zap, Database, Globe, Cpu,
  BarChart, Activity, AlertTriangle, Settings
} from 'lucide-react';
import { fetchQuizzes, deleteQuiz, toggleQuizPublishStatus } from '../store/slices/quizSlice.js';
import { fetchAllResults, fetchResultsForUser } from '../store/slices/resultSlice.js';
import { Card } from '../components/ui/Card';
import '../styles/globals.css';
import './DashboardPageRevamped.css';
import { getQuizCreatorId, getResultUserId, getUserId } from '../utils/idUtils.js';

const DashboardPageRevamped = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items: quizzes, status: quizzesStatus } = useSelector((state) => state.quizzes);
  const { list: results, listStatus } = useSelector((state) => state.results);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const isAdmin = user?.role === 'admin';
  const isInstructor = user?.role === 'instructor';
  const currentUserId = useMemo(() => getUserId(user), [user]);
  const isDebug = import.meta.env?.DEV;
  const debugLog = (...args) => {
    if (isDebug) {
      console.log(...args);
    }
  };

  // Calculate stats for students - for students, results already contains only their results
  const myResults = useMemo(() => {
    debugLog('[Dashboard myResults] Raw results:', results);
    debugLog('[Dashboard myResults] User:', user);
    debugLog('[Dashboard myResults] Results length:', results?.length);
    
    if (!user || user.role !== 'student' || !currentUserId) {
      debugLog('[Dashboard myResults] No user, returning empty');
      return [];
    }
    
    // Filter out in-progress results, only show submitted ones for current user
    const filtered = results.filter(r => {
      const resultUserId = getResultUserId(r);
      const include = Boolean(resultUserId && resultUserId === currentUserId);
      if (include) {
        debugLog('[Dashboard myResults] Checking result:', r._id, 'status:', r.status);
      }
      return include && (r.status === 'submitted' || r.status === 'completed');
    });
    
    debugLog('[Dashboard myResults] Filtered results:', filtered.length, filtered);
    return filtered;
  }, [results, user, currentUserId]);

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
    const baseStats = {
      totalQuizzes: 0,
      quizzesCompleted: 0,
      averageScore: null,
      sessionsWithAlerts: 0,
      recentActivity: []
    };

    if (!user) {
      return baseStats;
    }

    if (isAdmin) {
      const totalSubmissions = results.length;
      const sessionsWithAlerts = results.filter((res) => (res.proctoringLog?.length ?? 0) > 0).length;
      const scoredResults = results.filter((res) => typeof res.score === 'number');
      const averageScore = scoredResults.length
        ? Math.round((scoredResults.reduce((sum, res) => sum + res.score, 0) / scoredResults.length) * 10) / 10
        : null;

      debugLog('[Dashboard Stats] Admin:', {
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
    }

    if (isInstructor) {
      const instructorQuizzes = quizzes.filter((quiz) => {
        const creatorId = getQuizCreatorId(quiz);
        return currentUserId && creatorId === currentUserId;
      });

      const instructorResults = results.filter((res) => {
        const creatorId = getQuizCreatorId(res?.quiz);
        return currentUserId && creatorId === currentUserId;
      });

      const scoredResults = instructorResults.filter((res) => typeof res.score === 'number');
      const averageScore = scoredResults.length
        ? Math.round((scoredResults.reduce((sum, res) => sum + res.score, 0) / scoredResults.length) * 10) / 10
        : null;

      debugLog('[Dashboard Stats] Instructor:', {
        instructorQuizCount: instructorQuizzes.length,
        instructorResultsCount: instructorResults.length,
        averageScore,
        currentUserId
      });

      return {
        totalQuizzes: instructorQuizzes.length,
        quizzesCompleted: instructorResults.length,
        averageScore,
        sessionsWithAlerts: instructorResults.filter((res) => (res.proctoringLog?.length ?? 0) > 0).length,
        recentActivity: instructorResults.slice(0, 5)
      };
    }

    {
      const scoredResults = myResults.filter((res) => typeof res.score === 'number');
      const averageScore = scoredResults.length
        ? Math.round((scoredResults.reduce((sum, res) => sum + res.score, 0) / scoredResults.length) * 10) / 10
        : null;

      debugLog('[Dashboard Stats] Student:', {
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
  }, [user, isAdmin, isInstructor, quizzes, results, myResults, currentUserId]);

  const formatDateTime = (value) => {
    if (!value) return 'Date pending';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return 'Date pending';
    }
    return parsed.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const formatStatusLabel = (status) => {
    if (!status) return 'Submitted';
    switch (status) {
      case 'completed':
        return 'Graded';
      case 'submitted':
        return 'Awaiting grading';
      case 'in-progress':
        return 'In progress';
      default:
        return status.replace(/-/g, ' ');
    }
  };

  const getResultScoreDisplay = (result) => {
    if (typeof result?.score === 'number') {
      return `${result.score}%`;
    }
    if (result?.status === 'in-progress') {
      return 'In progress';
    }
    if (result?.status === 'submitted') {
      return 'Awaiting grading';
    }
    return 'Pending';
  };

  const roleConfig = useMemo(() => {
    if (isAdmin) {
      return {
        heroSubtitle: 'Orchestrate the platform and keep assessments running smoothly.',
        quickActions: [
          {
            icon: BookOpen,
            title: 'All Quizzes',
            description: 'Manage every assessment across cohorts',
            onClick: () => navigate('/quizzes'),
            color: 'blue'
          },
          {
            icon: Plus,
            title: 'Create Quiz',
            description: 'Publish a new organization-wide quiz',
            onClick: () => navigate('/manage-quiz'),
            color: 'purple'
          },
          {
            icon: Users,
            title: 'Student References',
            description: 'Upload and manage face reference photos',
            onClick: () => navigate('/admin/references'),
            color: 'cyan'
          },
          {
            icon: FileText,
            title: 'All Results',
            description: 'Review submissions and proctoring logs',
            onClick: () => navigate('/results'),
            color: 'green'
          }
        ],
        spotlightTitle: 'Administrator focus',
        spotlightSubtitle: 'Insights to keep the platform running smoothly.',
        spotlightCards: [
          {
            icon: Activity,
            title: 'Live Load',
            description: 'Monitor submissions across all cohorts in real time.'
          },
          {
            icon: Shield,
            title: 'Proctoring Alerts',
            description: 'Triage flagged sessions to safeguard academic integrity.'
          },
          {
            icon: Settings,
            title: 'Platform Controls',
            description: 'Adjust access policies, integrations, and proctoring rules.'
          }
        ],
        activityTitle: 'Latest submissions',
        activitySubtitle: 'Recent quiz attempts across the organization.',
        activityEmpty: 'No submissions yet. Encourage instructors to publish a quiz.',
        checklistTitle: 'Today’s admin checklist',
        checklistSubtitle: 'Stay proactive with these quick health checks.',
        checklistItems: [
          'Review AI-proctoring alerts flagged overnight.',
          'Approve new instructor-created quizzes waiting for publish.',
          'Export the latest platform-wide performance snapshot.'
        ]
      };
    }

    if (isInstructor) {
      return {
        heroSubtitle: 'Coach your learners and track class performance at a glance.',
        quickActions: [
          {
            icon: BookOpen,
            title: 'My Quizzes',
            description: 'Review and update your assessments',
            onClick: () => navigate('/quizzes'),
            color: 'blue'
          },
          {
            icon: Plus,
            title: 'Create Quiz',
            description: 'Design a new assessment for your class',
            onClick: () => navigate('/manage-quiz'),
            color: 'purple'
          },
          {
            icon: FileText,
            title: 'Review Submissions',
            description: 'Grade and release scores',
            onClick: () => navigate('/results'),
            color: 'green'
          },
          {
            icon: BarChart,
            title: 'Recent Activity',
            description: 'Monitor learner progress',
            onClick: () => navigate('/activity'),
            color: 'cyan'
          }
        ],
        spotlightTitle: 'Instructor playbook',
        spotlightSubtitle: 'Priorities tailored to your cohort.',
        spotlightCards: [
          {
            icon: BarChart,
            title: 'Performance Trends',
            description: 'Compare average scores and completion rates for each quiz.'
          },
          {
            icon: Users,
            title: 'Learner Outreach',
            description: 'Follow up with learners showing repeated alerts or low scores.'
          },
          {
            icon: BookOpen,
            title: 'Content Refresh',
            description: 'Keep your assessments current with updated materials.'
          }
        ],
        activityTitle: 'Latest learner submissions',
        activitySubtitle: 'Newest attempts from your classes.',
        activityEmpty: 'No recent attempts. Share a direct invite to get learners started.',
        checklistTitle: 'Keep learners engaged',
        checklistSubtitle: 'Quick wins for your next session.',
        checklistItems: [
          'Grade pending submissions and release feedback.',
          'Schedule a follow-up quiz or practice activity.',
          'Send reminders to learners who have not started yet.'
        ]
      };
    }

    return {
      heroSubtitle: 'Track your progress and jump back into upcoming quizzes.',
      quickActions: [
        {
          icon: BookOpen,
          title: 'Browse Quizzes',
          description: 'Find upcoming and available quizzes',
          onClick: () => navigate('/quizzes'),
          color: 'blue'
        },
        {
          icon: FileText,
          title: 'My Results',
          description: 'Review your latest scores and feedback',
          onClick: () => navigate('/results'),
          color: 'green'
        },
        {
          icon: Clock,
          title: 'My Attempts',
          description: 'See in-progress or submitted quizzes',
          onClick: () => navigate('/my-attempts'),
          color: 'cyan'
        },
        {
          icon: TrendingUp,
          title: 'Recent Activity',
          description: 'Stay on top of recent submissions',
          onClick: () => navigate('/activity'),
          color: 'purple'
        }
      ],
      spotlightTitle: 'Stay on track',
      spotlightSubtitle: 'Shortcuts to keep your learning momentum.',
      spotlightCards: [
        {
          icon: TrendingUp,
          title: 'Mastery Goals',
          description: 'Aim for consistent scores above 70% to stay in the green.'
        },
        {
          icon: Clock,
          title: 'Plan Your Time',
          description: 'Preview upcoming quizzes and schedule study blocks.'
        },
        {
          icon: Award,
          title: 'Celebrate Wins',
          description: 'Review detailed feedback to reinforce what you got right.'
        }
      ],
      activityTitle: 'Recent quiz activity',
      activitySubtitle: 'Your latest submissions and status updates.',
      activityEmpty: 'No activity yet. Start a quiz to see progress here.',
      checklistTitle: 'Next steps',
      checklistSubtitle: 'A few ideas to get the most out of the platform.',
      checklistItems: [
        'Attempt an available quiz assigned by your instructor.',
        'Review feedback on your latest graded submission.',
        'Update your study plan with topics to revisit.'
      ]
    };
  }, [isAdmin, isInstructor, navigate]);

  useEffect(() => {
    if (!user) return;
    dispatch(fetchQuizzes());
    if (isAdmin || isInstructor) {
      dispatch(fetchAllResults()).then((result) => {
        debugLog('[Dashboard] Admin/Instructor results fetched:', result.payload?.length || 0);
      });
    } else if (currentUserId) {
      // Fetch results for current student user - backend returns 'id' not '_id'
      dispatch(fetchResultsForUser(currentUserId)).then((result) => {
        debugLog('[Dashboard] Student results fetched:', result.payload?.length || 0);
      });
    }
  }, [dispatch, user, isAdmin, isInstructor, currentUserId]);

  if (!user) return null;
  const quickActions = roleConfig.quickActions || [];

  const features = [
    {
      icon: Shield,
      title: 'AI Anti-Cheat',
      description: 'Real-time face detection & behavior monitoring',
      color: 'purple'
    },
    {
      icon: Eye,
      title: 'Live Proctoring',
      description: 'Continuous tracking with gaze & pose detection',
      color: 'blue'
    },
    {
      icon: Code,
      title: 'Code Execution',
      description: 'Support for coding questions with multiple languages',
      color: 'orange'
    },
    {
      icon: Brain,
      title: 'ML Detection',
      description: 'Machine learning for anomaly detection',
      color: 'cyan'
    }
  ];

  const techStack = [
    { icon: Globe, name: 'React', category: 'Frontend Framework' },
    { icon: Cpu, name: 'Node.js', category: 'Backend Runtime' },
    { icon: Database, name: 'MongoDB', category: 'Database' },
    { icon: Eye, name: 'Face-API.js', category: 'AI/ML Library' },
    { icon: Zap, name: 'WebSocket', category: 'Real-time Comm' },
    { icon: Lock, name: 'JWT + 2FA', category: 'Authentication' }
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
                {roleConfig.heroSubtitle}
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
                    {isAdmin ? 'Published Quizzes' : isInstructor ? 'My Quizzes' : 'Available Quizzes'}
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
                    {isAdmin ? 'Total Submissions' : isInstructor ? 'Submissions Received' : 'Completed Quizzes'}
                  </div>
                </div>
              </Card>

              <Card className="stat-card stat-card--purple">
                <div className="stat-icon">
                  <Award />
                </div>
                <div className="stat-info">
                  <div className="stat-value">
                    {listStatus === 'loading'
                      ? '...'
                      : stats.averageScore === null
                        ? '—'
                        : `${stats.averageScore}%`}
                  </div>
                  <div className="stat-label">Average Score</div>
                </div>
              </Card>

              <Card className="stat-card stat-card--orange">
                <div className="stat-icon">
                  {isAdmin || isInstructor ? <AlertTriangle /> : <TrendingUp />}
                </div>
                <div className="stat-info">
                  <div className="stat-value">
                    {listStatus === 'loading' 
                      ? '...' 
                      : isAdmin || isInstructor
                        ? stats.sessionsWithAlerts
                        : stats.averageScore === null
                          ? 'Getting Started'
                          : stats.averageScore >= 70
                            ? 'Excellent'
                            : stats.averageScore >= 50
                              ? 'Good'
                              : 'Improving'}
                  </div>
                  <div className="stat-label">
                    {isAdmin || isInstructor ? 'Sessions with Alerts' : 'Performance'}
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
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={index} 
                  className={`quick-action-card quick-action-card--${action.color}`}
                  onClick={action.onClick}
                >
                  <div className={`action-icon action-icon--${action.color}`}>
                    {Icon ? <Icon /> : null}
                  </div>
                  <h3 className="action-title">{action.title}</h3>
                  <p className="action-description">{action.description}</p>
                  <div className="action-arrow">→</div>
                </Card>
              );
            })}
          </div>
        </section>

        {roleConfig?.spotlightCards?.length > 0 && (
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">{roleConfig.spotlightTitle}</h2>
              <p className="section-subtitle">{roleConfig.spotlightSubtitle}</p>
            </div>
            <div className="role-spotlight-grid">
              {roleConfig.spotlightCards.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card key={`${item.title}-${index}`} className="role-spotlight-card">
                    <div className="role-spotlight-icon">
                      {Icon ? <Icon /> : null}
                    </div>
                    <h3 className="role-spotlight-title">{item.title}</h3>
                    <p className="role-spotlight-description">{item.description}</p>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        <section className="section">
          <div className="section-header">
            <h2 className="section-title">{roleConfig.activityTitle}</h2>
            <p className="section-subtitle">{roleConfig.activitySubtitle}</p>
          </div>
          {stats.recentActivity?.length ? (
            <div className="recent-activity-grid">
              {stats.recentActivity.map((activity) => {
                const quizTitle = activity.quiz?.title || 'Untitled Quiz';
                const learnerName = activity.user?.username || activity.studentName || 'Learner';
                const instructorName = activity.quiz?.creator?.username || activity.quiz?.instructorName;
                const timestamp = activity.submittedAt || activity.updatedAt || activity.createdAt;
                const alerts = activity.proctoringLog?.length ?? 0;
                const statusLabel = formatStatusLabel(activity.status);
                const scoreDisplay = getResultScoreDisplay(activity);
                const key = activity._id || `${quizTitle}-${timestamp}`;

                return (
                  <Card key={key} className="recent-activity-card">
                    <div className="recent-activity-header">
                      <h3>{quizTitle}</h3>
                      <span className="recent-activity-score">{scoreDisplay}</span>
                    </div>
                    {(isAdmin || isInstructor) && (
                      <p className="recent-activity-meta"><strong>Learner:</strong> {learnerName}</p>
                    )}
                    {!isAdmin && !isInstructor && instructorName && (
                      <p className="recent-activity-meta"><strong>Instructor:</strong> {instructorName}</p>
                    )}
                    <p className="recent-activity-meta">{formatDateTime(timestamp)}</p>
                    <div className="recent-activity-footer">
                      <span className="recent-activity-status">{statusLabel}</span>
                      {alerts > 0 && (
                        <span className="recent-activity-alerts">⚠️ {alerts} alert{alerts !== 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="empty-state-card">
              <h3>No recent activity</h3>
              <p>{roleConfig.activityEmpty}</p>
            </Card>
          )}
        </section>

        {roleConfig?.checklistItems?.length > 0 && (
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">{roleConfig.checklistTitle}</h2>
              <p className="section-subtitle">{roleConfig.checklistSubtitle}</p>
            </div>
            <Card className="role-checklist-card">
              <ul className="role-checklist-list">
                {roleConfig.checklistItems.map((item, index) => (
                  <li key={`${item}-${index}`} className="role-checklist-item">
                    <span className="role-checklist-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="role-checklist-text">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        )}

        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Core platform capabilities</h2>
            <p className="section-subtitle">Security, reliability, and performance features built for high-stakes assessments.</p>
          </div>
          <div className="features-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="feature-card">
                  <div className={`feature-icon feature-icon--${feature.color}`}>
                    {Icon ? <Icon /> : null}
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Technology stack</h2>
            <p className="section-subtitle">Modern tooling powers the end-to-end assessment experience.</p>
          </div>
          <div className="tech-stack-grid">
            {techStack.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card key={tool.name} className="tech-stack-card">
                  <div className="tech-stack-icon">{Icon ? <Icon /> : null}</div>
                  <div className="tech-stack-info">
                    <h3 className="tech-stack-name">{tool.name}</h3>
                    <span className="tech-stack-category">{tool.category}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Behind the platform</h2>
            <p className="section-subtitle">Cross-functional teams collaborate to deliver secure, scalable assessments.</p>
          </div>
          <div className="developers-grid">
            {developers.map((team) => (
              <Card key={team.name} className="developer-card">
                <div className="developer-avatar">{team.name.charAt(0)}</div>
                <div>
                  <h3 className="developer-name">{team.name}</h3>
                  <p className="developer-role">{team.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPageRevamped;
