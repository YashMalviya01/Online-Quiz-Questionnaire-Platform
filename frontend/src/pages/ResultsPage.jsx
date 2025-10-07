import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchResultsForUser, fetchAllResults } from '../store/slices/resultSlice.js';
import { getQuizCreatorId, getResultUserId, getUserId } from '../utils/idUtils.js';

const ResultsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { list, listStatus, listError } = useSelector((state) => state.results);
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

  const filteredResults = useMemo(() => {
    if (!Array.isArray(list)) return [];

    const allowedStatuses = new Set(['submitted', 'completed']);

    return list
      .filter((result) => {
        if (!allowedStatuses.size) return true;
        const status = result?.status?.toLowerCase?.() || '';
        return allowedStatuses.has(status);
      })
      .sort((a, b) => {
        const getDate = (entry) => new Date(entry?.submittedAt || entry?.updatedAt || entry?.createdAt || 0).getTime();
        return getDate(b) - getDate(a);
      });
  }, [list]);

  const displayResults = useMemo(() => {
    if (!Array.isArray(filteredResults)) return [];

    if (isAdmin) {
      return filteredResults;
    }

    if (isInstructor) {
      return filteredResults.filter((result) => {
        const creatorId = getQuizCreatorId(result?.quiz);
        return currentUserId && creatorId === currentUserId;
      });
    }

    if (currentUserId) {
      return filteredResults.filter((result) => {
        const resultUserId = getResultUserId(result);
        return resultUserId === currentUserId;
      });
    }

    return filteredResults;
  }, [filteredResults, isAdmin, isInstructor, currentUserId]);

  return (
    <section className="card">
      <h1>Exam History</h1>
      <p style={{ color: '#64748b' }}>
        {isAdmin
          ? 'Review all student submissions, scores, and proctoring alerts.'
          : isInstructor
            ? 'Monitor learner submissions, scores, and proctoring alerts for your quizzes.'
            : 'Review your scores and any proctoring alerts captured during each session.'}
      </p>
      {listStatus === 'loading' && <p>Loading results…</p>}
      {listError && <p style={{ color: '#ef4444' }}>{listError}</p>}
      {listStatus !== 'loading' && (
        <div className="grid">
          {displayResults.map((result) => {
            const submittedDate = result.submittedAt || result.updatedAt || result.createdAt;
            const userName = result.user?.username || 'Unknown';
            const score = result.score || 0;
            const alertCount = result.proctoringLog?.length ?? 0;
            
            return (
              <div 
                key={result._id} 
                className="card" 
                style={{ 
                  boxShadow: 'none', 
                  border: '1px solid #e2e8f0',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{result.quiz?.title || 'Untitled Quiz'}</h3>
                  <span 
                    style={{ 
                      padding: '0.25rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      background: score >= 70 ? '#dcfce7' : score >= 50 ? '#fef3c7' : '#fee2e2',
                      color: score >= 70 ? '#166534' : score >= 50 ? '#854d0e' : '#991b1b'
                    }}
                  >
                    {score}%
                  </span>
                </div>
                
                {(isAdmin || isInstructor) && (
                  <p style={{ color: '#64748b', margin: '0.5rem 0', fontSize: '0.9rem' }}>
                    <strong>Student:</strong> {userName}
                  </p>
                )}
                
                {submittedDate && (
                  <p style={{ color: '#94a3b8', margin: '0.5rem 0', fontSize: '0.875rem' }}>
                    📅 {new Date(submittedDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })} at {new Date(submittedDate).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
                
                {alertCount > 0 && (
                  <p style={{ 
                    color: '#ef4444', 
                    margin: '0.5rem 0', 
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}>
                    ⚠️ {alertCount} proctoring alert{alertCount !== 1 ? 's' : ''}
                  </p>
                )}
                
                <button 
                  type="button" 
                  className="primary-btn" 
                  style={{ marginTop: '1rem', width: '100%' }}
                  onClick={() => navigate(`/results/${result._id}`)}
                >
                  {isAdmin || isInstructor ? 'Review Submission' : 'View Details'}
                </button>
              </div>
            );
          })}
          {listStatus === 'succeeded' && displayResults.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              color: '#94a3b8',
              gridColumn: '1 / -1'
            }}>
              <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No results yet.</p>
              <p style={{ fontSize: '0.875rem' }}>
                {isAdmin
                  ? 'Student submissions will appear here once they complete quizzes.'
                  : isInstructor
                    ? 'Learner submissions will appear here once your quizzes are attempted.'
                    : 'Start taking quizzes to see your results here.'}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ResultsPage;
