const formatDateTime = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch (error) {
    return value;
  }
};

const ResultTable = ({
  results,
  onViewDetail,
  emptyMessage = 'No results yet.',
  maxHeight = '420px'
}) => {
  if (!results || results.length === 0) {
    return emptyMessage ? <p>{emptyMessage}</p> : null;
  }

  return (
    <div className="table-container" style={{ maxHeight, overflow: 'auto', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }}>
      <table className="result-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f8fafc', textAlign: 'left' }}>
          <tr>
            <th style={{ padding: '0.75rem 1rem' }}>Quiz</th>
            <th style={{ padding: '0.75rem 1rem' }}>Participant</th>
            <th style={{ padding: '0.75rem 1rem' }}>Score</th>
            <th style={{ padding: '0.75rem 1rem' }}>Proctoring events</th>
            <th style={{ padding: '0.75rem 1rem' }}>Started</th>
            <th style={{ padding: '0.75rem 1rem' }}>Completed</th>
            {onViewDetail && <th style={{ padding: '0.75rem 1rem' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result._id} style={{ borderTop: '1px solid #e2e8f0' }}>
              <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{result.quiz?.title || '—'}</td>
              <td style={{ padding: '0.75rem 1rem' }}>{result.user?.username || '—'}</td>
              <td style={{ padding: '0.75rem 1rem' }}>{typeof result.score === 'number' ? `${result.score}%` : 'Pending'}</td>
              <td style={{ padding: '0.75rem 1rem' }}>{result.proctoringLog?.length ?? 0}</td>
              <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>{formatDateTime(result.startedAt)}</td>
              <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>{formatDateTime(result.submittedAt)}</td>
              {onViewDetail && (
                <td style={{ padding: '0.75rem 1rem' }}>
                  <button type="button" className="primary-btn" onClick={() => onViewDetail(result)}>
                    View detail
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;
