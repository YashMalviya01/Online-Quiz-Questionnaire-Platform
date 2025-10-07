import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, CheckCircle, AlertTriangle, FileText, 
  Clock, Award, TrendingUp, ArrowLeft
} from 'lucide-react';
import { fetchResultsForUser, fetchAllResults } from '../store/slices/resultSlice';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import '../styles/globals.css';
import { getQuizCreatorId, getResultUserId, getUserId } from '../utils/idUtils.js';

const RecentActivityPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { list: results, listStatus } = useSelector((state) => state.results);
  const isAdmin = user?.role === 'admin';
  const isInstructor = user?.role === 'instructor';
  const currentUserId = useMemo(() => getUserId(user), [user]);

  useEffect(() => {
    if (!user) return;
    
    if (isAdmin || isInstructor) {
      dispatch(fetchAllResults());
    } else if (currentUserId) {
      dispatch(fetchResultsForUser(currentUserId));
    }
  }, [dispatch, user, isAdmin, isInstructor, currentUserId]);

  const relevantResults = useMemo(() => {
    if (!Array.isArray(results)) return [];

    if (isAdmin) {
      return results;
    }

    if (isInstructor) {
      return results.filter((result) => {
        const creatorId = getQuizCreatorId(result?.quiz);
        return currentUserId && creatorId === currentUserId;
      });
    }

    if (currentUserId) {
      return results.filter((result) => getResultUserId(result) === currentUserId);
    }

    return results;
  }, [results, isAdmin, isInstructor, currentUserId]);

  // Get recent activity (last 10 submissions)
  const recentActivity = useMemo(() => {
    const filtered = relevantResults.filter(r => r.status === 'submitted' || r.status === 'completed');
    return filtered
      .sort((a, b) => {
        const dateA = new Date(a.submittedAt || a.updatedAt || a.createdAt);
        const dateB = new Date(b.submittedAt || b.updatedAt || b.createdAt);
        return dateB - dateA;
      })
      .slice(0, 20); // Show last 20 activities
  }, [relevantResults]);

  // Calculate stats
  const totalSubmissions = recentActivity.length;
  const averageScore = totalSubmissions > 0
    ? Math.round(recentActivity.reduce((sum, r) => sum + (r.score || 0), 0) / totalSubmissions)
    : null;
  const highScores = recentActivity.filter(r => (r.score || 0) >= 80).length;
  const alertCount = recentActivity.reduce((sum, r) => sum + (r.proctoringLog?.length || 0), 0);

  return (
    <div className="dashboard-page">
      {/* Header Section */}
      <section className="dashboard-hero" style={{ paddingBottom: '2rem' }}>
        <div className="hero-gradient"></div>
        <div className="container">
          <div className="hero-content">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              style={{ marginBottom: '1rem', width: 'fit-content' }}
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
            
            <div className="welcome-section">
              <h1 className="welcome-title">
                Recent <span className="gradient-text">Activity</span>
              </h1>
              <p className="welcome-subtitle">
                {isAdmin
                  ? 'Latest quiz submissions across all students'
                  : isInstructor
                    ? 'Learner activity across the quizzes you manage'
                    : 'Your recent quiz submissions and performance'}
              </p>
            </div>

            <div className="stats-cards">
              <Card className="stat-card stat-card--blue">
                <div className="stat-icon">
                  <Activity />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{totalSubmissions}</div>
                  <div className="stat-label">Total Submissions</div>
                </div>
              </Card>

              <Card className="stat-card stat-card--green">
                <div className="stat-icon">
                  <CheckCircle />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{highScores}</div>
                  <div className="stat-label">High Scores (80%+)</div>
                </div>
              </Card>

              <Card className="stat-card stat-card--purple">
                <div className="stat-icon">
                  <Award />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{averageScore === null ? '—' : `${averageScore}%`}</div>
                  <div className="stat-label">Average Score</div>
                </div>
              </Card>

              <Card className="stat-card stat-card--orange">
                <div className="stat-icon">
                  <AlertTriangle />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{alertCount}</div>
                  <div className="stat-label">Total Alerts</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <div className="container dashboard-content">
        {/* Activity List */}
        {listStatus === 'loading' ? (
          <div className="empty-state">
            <Clock size={64} className="empty-icon" />
            <h3>Loading activity...</h3>
          </div>
        ) : recentActivity.length > 0 ? (
          <section className="section" style={{ marginTop: 0 }}>
            <Card className="activity-card">
              <div className="activity-list">
                {recentActivity.map((activity, index) => {
                  const quizTitle = activity.quiz?.title || 'Untitled Quiz';
                  const score = activity.score || 0;
                  const userName = activity.user?.username || 'Student';
                  const completedDate = activity.submittedAt || activity.updatedAt || activity.createdAt;
                  
                  return (
                    <div key={activity._id || index} className="activity-item">
                      <div className="activity-icon">
                        <CheckCircle />
                      </div>
                      <div className="activity-info">
                        <div className="activity-title">
                          {quizTitle}
                          {(isAdmin || isInstructor) && (
                            <span className="activity-user"> by {userName}</span>
                          )}
                        </div>
                        <div className="activity-meta">
                          <span className="activity-score">{score}%</span>
                          {completedDate && (
                            <span className="activity-date">
                              {new Date(completedDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })} at {new Date(completedDate).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          )}
                          {activity.proctoringLog && activity.proctoringLog.length > 0 && (
                            <span className="activity-alerts">
                              <AlertTriangle size={14} />
                              {activity.proctoringLog.length} alerts
                            </span>
                          )}
                        </div>
                      </div>
                      {(isAdmin || isInstructor) && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/results/${activity._id}`)}
                        >
                          <FileText size={14} />
                          Review
                        </Button>
                      )}
                      {!isAdmin && !isInstructor && (
                        <div className={`activity-badge ${score >= 70 ? 'success' : score >= 50 ? 'warning' : 'danger'}`}>
                          {score >= 70 ? 'Pass' : score >= 50 ? 'Average' : 'Needs Review'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </section>
        ) : (
          <div className="empty-state">
            <Activity size={64} className="empty-icon" />
            <h3>No Activity Yet</h3>
            <p>{isAdmin
              ? 'Quiz submissions will appear here'
              : isInstructor
                ? 'Learner submissions will appear here once your quizzes are completed'
                : 'Start taking quizzes to see your activity'}</p>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              Browse Quizzes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityPage;
