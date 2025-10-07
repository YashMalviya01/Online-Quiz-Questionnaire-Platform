import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, Clock, AlertTriangle, FileText, BookOpen, 
  Award, TrendingUp, ArrowLeft
} from 'lucide-react';
import { fetchResultsForUser } from '../store/slices/resultSlice';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import '../styles/globals.css';
import { getResultUserId, getUserId } from '../utils/idUtils.js';

const MyAttemptsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { list: results, listStatus } = useSelector((state) => state.results);
  const currentUserId = useMemo(() => getUserId(user), [user]);

  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchResultsForUser(currentUserId));
    }
  }, [dispatch, currentUserId]);

  // Filter to only show submitted/completed attempts
  const myAttempts = useMemo(() => {
    if (!currentUserId) return [];
    return results.filter((r) =>
      (r.status === 'submitted' || r.status === 'completed') &&
      getResultUserId(r) === currentUserId
    );
  }, [results, currentUserId]);

  // Calculate stats
  const totalAttempts = myAttempts.length;
  const averageScore = totalAttempts > 0
    ? Math.round(myAttempts.reduce((sum, r) => sum + (r.score || 0), 0) / totalAttempts)
    : null;
  const passedQuizzes = myAttempts.filter(r => (r.score || 0) >= 70).length;
  const performanceLabel = averageScore === null
    ? 'Getting Started'
    : averageScore >= 70
      ? 'Excellent'
      : averageScore >= 50
        ? 'Good'
        : 'Improving';

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
                My <span className="gradient-text">Quiz Attempts</span>
              </h1>
              <p className="welcome-subtitle">
                View all your attempted quizzes and track your progress
              </p>
            </div>

            <div className="stats-cards">
              <Card className="stat-card stat-card--blue">
                <div className="stat-icon">
                  <BookOpen />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{totalAttempts}</div>
                  <div className="stat-label">Total Attempts</div>
                </div>
              </Card>

              <Card className="stat-card stat-card--green">
                <div className="stat-icon">
                  <CheckCircle />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{passedQuizzes}</div>
                  <div className="stat-label">Passed Quizzes</div>
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
                  <TrendingUp />
                </div>
                <div className="stat-info">
                  <div className="stat-value">
                    {performanceLabel}
                  </div>
                  <div className="stat-label">Performance</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <div className="container dashboard-content">
        {/* Quiz Attempts Grid */}
        {listStatus === 'loading' ? (
          <div className="empty-state">
            <Clock size={64} className="empty-icon" />
            <h3>Loading your attempts...</h3>
          </div>
        ) : myAttempts.length > 0 ? (
          <section className="section" style={{ marginTop: 0 }}>
            <div className="quizzes-grid">
              {myAttempts.map((result) => {
                const quizTitle = result.quiz?.title || 'Untitled Quiz';
                const numericScore = typeof result.score === 'number' ? Math.round(result.score) : null;
                const awaitingManual = result.status === 'submitted' && (result.requiresManualReview || result.manuallyGraded === false);
                const scoreLabel = awaitingManual
                  ? 'Awaiting grading'
                  : numericScore !== null
                    ? `${numericScore}%`
                    : 'Pending';
                const scoreClass = numericScore !== null
                  ? numericScore >= 70
                    ? 'score-high'
                    : numericScore >= 50
                      ? 'score-mid'
                      : 'score-low'
                  : 'score-mid';
                const completedDate = result.submittedAt || result.updatedAt || result.createdAt;
                const hasAlerts = result.proctoringLog && result.proctoringLog.length > 0;
                
                return (
                  <Card key={result._id} className="quiz-card">
                    <div className="quiz-card-header">
                      <div className="quiz-icon">
                        <CheckCircle />
                      </div>
                      <h3 className="quiz-title">{quizTitle}</h3>
                    </div>
                    
                    <div className="quiz-result-info">
                      <div className="result-score-section">
                        <span className="result-score-label">Score:</span>
                        <span className={`result-score ${scoreClass}`}>
                          {scoreLabel}
                        </span>
                      </div>
                      
                      <div className="quiz-meta">
                        <span className="quiz-created">
                          <Clock size={14} />
                          {completedDate && new Date(completedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {hasAlerts && (
                          <span className="quiz-alerts">
                            <AlertTriangle size={14} />
                            {result.proctoringLog.length} alerts
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="quiz-actions">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/results/${result._id}`)}
                        style={{ flex: 1 }}
                      >
                        <FileText size={16} />
                        View Details
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => navigate(`/quiz/${result.quiz?._id || result.quiz}`)}
                        style={{ flex: 1 }}
                      >
                        <BookOpen size={16} />
                        Retake
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        ) : (
          <div className="empty-state">
            <CheckCircle size={64} className="empty-icon" />
            <h3>No Quiz Attempts Yet</h3>
            <p>Start taking quizzes to see your attempts here</p>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              <BookOpen size={18} />
              Browse Quizzes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAttemptsPage;
