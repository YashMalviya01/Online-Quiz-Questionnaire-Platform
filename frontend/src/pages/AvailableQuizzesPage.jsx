import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Clock, Plus, Edit, Trash2, CheckCircle, 
  Award, TrendingUp, ArrowLeft
} from 'lucide-react';
import { fetchQuizzes, deleteQuiz, toggleQuizPublishStatus } from '../store/slices/quizSlice.js';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import '../styles/globals.css';

const AvailableQuizzesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items: quizzes, status: quizzesStatus } = useSelector((state) => state.quizzes);
  const { list: results } = useSelector((state) => state.results);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const handleDeleteQuiz = (quizId, quizTitle) => {
    if (deleteConfirm === quizId) {
      dispatch(deleteQuiz(quizId));
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(quizId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleTogglePublish = (quizId, currentStatus) => {
    dispatch(toggleQuizPublishStatus({ quizId, isPublished: !currentStatus }));
  };

  // Calculate stats
  const totalQuizzes = user?.role === 'admin' 
    ? quizzes.length 
    : quizzes.filter(q => q.isPublished).length;
  
  // For both admin and student, count unique quizzes completed
  const completedResults = results.filter(r => r.status === 'submitted' || r.status === 'completed');
  const completedQuizzes = new Set(completedResults.map(r => r.quiz?._id || r.quiz)).size;
  
  const remainingQuizzes = Math.max(0, totalQuizzes - completedQuizzes);
  const progressPercentage = totalQuizzes > 0 
    ? Math.round((completedQuizzes / totalQuizzes) * 100) 
    : 0;
  
  const draftQuizzes = user?.role === 'admin'
    ? quizzes.filter(q => !q.isPublished).length
    : 0;

  const publishedQuizzes = user?.role === 'admin'
    ? quizzes.filter(q => q.isPublished).length
    : 0;

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
                {user?.role === 'admin' ? 'All' : 'Available'} <span className="gradient-text">Quizzes</span>
              </h1>
              <p className="welcome-subtitle">
                {user?.role === 'admin' 
                  ? 'Create, edit, and manage all quizzes' 
                  : 'Choose a quiz to start your assessment'}
              </p>
            </div>

            <div className="stats-cards">
              <Card className="stat-card stat-card--blue">
                <div className="stat-icon">
                  <BookOpen />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{totalQuizzes}</div>
                  <div className="stat-label">
                    {user?.role === 'admin' ? 'Total Quizzes' : 'Available Quizzes'}
                  </div>
                </div>
              </Card>

              {user?.role === 'admin' ? (
                <>
                  <Card className="stat-card stat-card--green">
                    <div className="stat-icon">
                      <CheckCircle />
                    </div>
                    <div className="stat-info">
                      <div className="stat-value">{publishedQuizzes}</div>
                      <div className="stat-label">Published</div>
                    </div>
                  </Card>

                  <Card className="stat-card stat-card--orange">
                    <div className="stat-icon">
                      <Clock />
                    </div>
                    <div className="stat-info">
                      <div className="stat-value">{draftQuizzes}</div>
                      <div className="stat-label">Drafts</div>
                    </div>
                  </Card>

                  <Card className="stat-card stat-card--purple">
                    <div className="stat-icon">
                      <Award />
                    </div>
                    <div className="stat-info">
                      <div className="stat-value">{results.length}</div>
                      <div className="stat-label">Total Submissions</div>
                    </div>
                  </Card>
                </>
              ) : (
                <>
                  <Card className="stat-card stat-card--green">
                    <div className="stat-icon">
                      <CheckCircle />
                    </div>
                    <div className="stat-info">
                      <div className="stat-value">{completedQuizzes}</div>
                      <div className="stat-label">Completed</div>
                    </div>
                  </Card>

                  <Card className="stat-card stat-card--orange">
                    <div className="stat-icon">
                      <Clock />
                    </div>
                    <div className="stat-info">
                      <div className="stat-value">{remainingQuizzes}</div>
                      <div className="stat-label">Remaining</div>
                    </div>
                  </Card>

                  <Card className="stat-card stat-card--purple">
                    <div className="stat-icon">
                      <TrendingUp />
                    </div>
                    <div className="stat-info">
                      <div className="stat-value">{progressPercentage}%</div>
                      <div className="stat-label">Progress</div>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container dashboard-content">
        {/* Create Quiz Button for Admin */}
        {user?.role === 'admin' && (
          <div style={{ marginBottom: '2rem', marginTop: 0 }}>
            <Button 
              variant="primary" 
              onClick={() => navigate('/manage-quiz')}
              size="lg"
            >
              <Plus size={18} />
              Create New Quiz
            </Button>
          </div>
        )}

        {/* Quizzes Grid */}
        {quizzesStatus === 'loading' ? (
          <div className="empty-state">
            <Clock size={64} className="empty-icon" />
            <h3>Loading quizzes...</h3>
          </div>
        ) : quizzes.length > 0 ? (
          <section className="section" style={{ marginTop: 0 }}>
            <div className="quizzes-grid">
              {quizzes
                .filter(quiz => user?.role === 'admin' || quiz.isPublished)
                .map((quiz) => {
                  const hasAttempted = results.some(
                    r => (r.quiz?._id || r.quiz) === quiz._id
                  );
                  
                  return (
                    <Card key={quiz._id} className="quiz-card">
                      <div className="quiz-card-header">
                        <div className="quiz-icon">
                          <BookOpen />
                        </div>
                        <h3 className="quiz-title">{quiz.title}</h3>
                      </div>
                      
                      {quiz.description && (
                        <p className="quiz-description">{quiz.description}</p>
                      )}
                      
                      {/* Publish Status Toggle for Admin */}
                      {user?.role === 'admin' && (
                        <div 
                          className="quiz-publish-toggle"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <label className="publish-switch">
                            <input
                              type="checkbox"
                              checked={quiz.isPublished}
                              onChange={() => handleTogglePublish(quiz._id, quiz.isPublished)}
                            />
                            <span className="publish-slider"></span>
                          </label>
                          <span className={`publish-label ${quiz.isPublished ? 'published' : 'draft'}`}>
                            {quiz.isPublished ? '✅ Published' : '🔒 Draft'}
                          </span>
                        </div>
                      )}
                      
                      <div className="quiz-meta">
                        <span className="quiz-questions">
                          <BookOpen size={14} />
                          {quiz.questions?.length || 0} questions
                        </span>
                        {user?.role === 'admin' && (
                          <span className="quiz-created">
                            <Clock size={14} />
                            {new Date(quiz.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      {user?.role === 'admin' ? (
                        <div className="quiz-admin-actions">
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => navigate(`/manage-quiz?edit=${quiz._id}`)}
                            style={{ flex: 1 }}
                          >
                            <Edit size={16} />
                            Edit
                          </Button>
                          <Button 
                            variant={deleteConfirm === quiz._id ? 'danger' : 'outline'}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuiz(quiz._id, quiz.title);
                            }}
                            style={{ flex: 1 }}
                          >
                            <Trash2 size={16} />
                            {deleteConfirm === quiz._id ? 'Confirm?' : 'Delete'}
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="primary" 
                          size="sm" 
                          className="quiz-start-btn"
                          onClick={() => navigate(`/quiz/${quiz._id}`)}
                        >
                          {hasAttempted ? 'Retake Quiz' : 'Start Quiz'}
                        </Button>
                      )}
                    </Card>
                  );
                })}
            </div>
          </section>
        ) : (
          <div className="empty-state">
            <BookOpen size={64} className="empty-icon" />
            <h3>No Quizzes Available</h3>
            <p>{user?.role === 'admin' ? 'Create your first quiz to get started' : 'Check back later for new quizzes'}</p>
            {user?.role === 'admin' && (
              <Button variant="primary" onClick={() => navigate('/manage-quiz')}>
                <Plus size={18} />
                Create Quiz
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableQuizzesPage;
