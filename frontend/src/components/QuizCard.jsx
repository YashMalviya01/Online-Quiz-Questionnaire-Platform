const QuizCard = ({ quiz, ctaLabel = 'Start Quiz', onAction }) => (
  <div className="card">
    <h3>{quiz.title}</h3>
    <p style={{ color: '#64748b' }}>{quiz.description}</p>
    <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{quiz.questions.length} questions</p>
    <button type="button" className="primary-btn" onClick={() => onAction?.(quiz)}>
      {ctaLabel}
    </button>
  </div>
);

export default QuizCard;
