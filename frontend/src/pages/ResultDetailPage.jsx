import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchResultDetail } from '../store/slices/resultSlice.js';
import { ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';

const severityColor = {
  low: '#22c55e',
  medium: '#f97316',
  high: '#ef4444'
};

const ResultDetailPage = () => {
  const { resultId } = useParams();
  const dispatch = useDispatch();
  const { current, detailStatus } = useSelector((state) => state.results);
  const [showProctoring, setShowProctoring] = useState(false);

  useEffect(() => {
    if (resultId) {
      dispatch(fetchResultDetail(resultId));
    }
  }, [dispatch, resultId]);

  if (detailStatus === 'loading' || !current) {
    return (
      <section className="card">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#64748b' }}>Loading your results...</p>
        </div>
      </section>
    );
  }

  if (detailStatus === 'failed') {
    return (
      <section className="card">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
          <p style={{ color: '#ef4444' }}>Failed to load results. Please try again.</p>
        </div>
      </section>
    );
  }

  const totalQuestions = current.quiz?.questions?.length || 0;
  const totalPointsPossible = Number.isFinite(current.totalScore)
    ? current.totalScore
    : Number.isFinite(current.autoMaxScore)
      ? current.autoMaxScore
      : totalQuestions;
  const pointsEarned = Number.isFinite(current.pointsEarned)
    ? current.pointsEarned
    : Number.isFinite(current.autoScore)
      ? current.autoScore
      : 0;

  // Count correct answers based on awardedScore/pointsAwarded
  const correctAnswers = (current.answers || []).filter(answer => {
    if (answer.isCorrect !== undefined) return answer.isCorrect;
    if (answer.awardedScore !== undefined) return answer.awardedScore > 0;
    if (answer.pointsAwarded !== undefined) return answer.pointsAwarded > 0;
    // Fallback comparison
    const question = current.quiz?.questions?.find(q => q._id === answer.questionId);
    const userAnswer = answer.answer || answer.selectedOption || answer.textAnswer || '';
    return userAnswer && userAnswer === question?.correctAnswer;
  }).length;
  
  const scorePercentage = Number.isFinite(current.score)
    ? Math.round(current.score)
    : (totalPointsPossible > 0 ? Math.round((pointsEarned / totalPointsPossible) * 100) : 0);

  const roundedPointsEarned = Math.round(pointsEarned * 100) / 100;
  const roundedTotalPoints = Math.round((totalPointsPossible || 0) * 100) / 100;

  return (
    <section className="card">
      {/* Score Summary */}
      <div style={{ textAlign: 'center', marginBottom: '2rem', padding: '2rem', background: '#f8fafc', borderRadius: '12px' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>{current.quiz?.title}</h1>
        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: scorePercentage >= 70 ? '#10b981' : scorePercentage >= 50 ? '#f59e0b' : '#ef4444', marginBottom: '0.5rem' }}>
          {scorePercentage}%
        </div>
        <p style={{ color: '#64748b', fontSize: '1.125rem' }}>
          Score: {roundedPointsEarned} / {roundedTotalPoints} pts · {correctAnswers} of {totalQuestions} questions correct
        </p>
      </div>

      {/* Your Answers Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>Your Answers</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {(current.answers || []).map((answer, index) => {
            const question = current.quiz?.questions?.find((q) => q._id === answer.questionId || q._id === answer.question);
            
            // Determine if answer is correct based on multiple criteria
            let isCorrect = false;
            if (answer.isCorrect !== undefined) {
              isCorrect = answer.isCorrect;
            } else if (answer.awardedScore !== undefined && answer.awardedScore > 0) {
              // Backend stores awardedScore - if > 0, answer is correct
              isCorrect = true;
            } else if (answer.pointsAwarded !== undefined && answer.pointsAwarded > 0) {
              isCorrect = true;
            } else {
              // Fallback: compare answers directly
              const userAnswer = answer.answer || answer.selectedOption || answer.textAnswer || '';
              isCorrect = userAnswer && userAnswer === question?.correctAnswer;
            }
            
            return (
              <li 
                key={answer.questionId} 
                style={{ 
                  marginBottom: '1.5rem',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: `2px solid ${isCorrect ? '#d1fae5' : '#fee2e2'}`,
                  background: isCorrect ? '#f0fdf4' : '#fef2f2'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ 
                    minWidth: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: isCorrect ? '#10b981' : '#ef4444',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '1.125rem' }}>
                      {question?.questionText}
                    </p>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        {isCorrect ? (
                          <CheckCircle size={20} color="#10b981" />
                        ) : (
                          <XCircle size={20} color="#ef4444" />
                        )}
                        <span style={{ fontWeight: '600', color: isCorrect ? '#10b981' : '#ef4444' }}>
                          Your Answer:
                        </span>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '6px',
                          background: isCorrect ? '#d1fae5' : '#fee2e2',
                          color: isCorrect ? '#065f46' : '#991b1b',
                          fontWeight: '500'
                        }}>
                          {answer.answer || answer.selectedOption || answer.textAnswer || 'Not answered'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={20} color="#10b981" />
                        <span style={{ fontWeight: '600', color: '#10b981' }}>
                          Correct Answer:
                        </span>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '6px',
                          background: '#d1fae5',
                          color: '#065f46',
                          fontWeight: '500'
                        }}>
                          {question?.correctAnswer}
                        </span>
                      </div>
                    </div>

                    {question?.questionType === 'multiple-choice' && question?.options && (
                      <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '8px' }}>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: '600' }}>
                          All Options:
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {question.options.map((option, idx) => (
                            <li 
                              key={idx}
                              style={{
                                padding: '0.5rem 0.75rem',
                                borderRadius: '6px',
                                background: option === question.correctAnswer ? '#f0fdf4' : '#f8fafc',
                                border: `1px solid ${option === question.correctAnswer ? '#10b981' : '#e2e8f0'}`,
                                fontSize: '0.875rem'
                              }}
                            >
                              {option}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Proctoring Timeline Section - Collapsible */}
      <div style={{ 
        marginTop: '2rem',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <button
          onClick={() => setShowProctoring(!showProctoring)}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            background: '#f8fafc',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '1.125rem',
            fontWeight: '600',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span>🔒 Proctoring Timeline</span>
            {current.proctoringLog && current.proctoringLog.length > 0 && (
              <span style={{
                padding: '0.25rem 0.75rem',
                background: '#fee2e2',
                color: '#991b1b',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {current.proctoringLog.length} {current.proctoringLog.length === 1 ? 'event' : 'events'}
              </span>
            )}
          </div>
          {showProctoring ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>

        {showProctoring && (
          <div style={{ padding: '1.5rem', background: 'white' }}>
            {current.proctoringLog && current.proctoringLog.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {current.proctoringLog.map((event) => (
                  <li
                    key={event._id}
                    style={{
                      marginBottom: '1rem',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      background: '#fafafa'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '1rem' }}>{event.eventType}</strong>
                      <span style={{ 
                        color: severityColor[event.severity],
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        padding: '0.25rem 0.5rem',
                        background: `${severityColor[event.severity]}20`,
                        borderRadius: '6px'
                      }}>
                        {event.severity.toUpperCase()}
                      </span>
                    </div>
                    <small style={{ color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>
                      {new Date(event.timestamp).toLocaleString()}
                    </small>
                    {event.eventData && Object.keys(event.eventData).length > 0 && (
                      <pre
                        style={{
                          background: '#f1f5f9',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          marginTop: '0.5rem',
                          overflowX: 'auto',
                          fontSize: '0.875rem'
                        }}
                      >
                        {JSON.stringify(event.eventData, null, 2)}
                      </pre>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <p style={{ color: '#10b981', fontWeight: '600', fontSize: '1.125rem' }}>
                  No proctoring events recorded
                </p>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  You completed this quiz without any issues!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ResultDetailPage;
