import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getPendingGrading,
  gradeAnswer,
  gradeWithRubric,
  bulkGrade,
  addFeedback,
  getGradingStatistics,
  autoGrade
} from '../../services/gradingService';
import Button from '../../components/ui/Button';

const GradingInterface = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    questionType: ''
  });
  const [gradeForm, setGradeForm] = useState({
    awardedScore: '',
    feedback: '',
    rubricScores: {}
  });
  const [bulkGradeForm, setBulkGradeForm] = useState({
    scores: {}
  });
  const [feedbackForm, setFeedbackForm] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBulkMode, setShowBulkMode] = useState(false);

  useEffect(() => {
    if (quizId) {
      fetchData();
    }
  }, [quizId, filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingData, statsData] = await Promise.all([
        getPendingGrading(quizId, filters.questionType),
        getGradingStatistics(quizId)
      ]);
      const pendingResults = pendingData.data || [];
      setResults(pendingResults);
      setStatistics(statsData.data);

      if (pendingResults.length > 0) {
        const currentId = selectedResult?._id;
        const nextIndex = currentId
          ? pendingResults.findIndex(result => result._id === currentId)
          : 0;
        const resolvedIndex = nextIndex >= 0 ? nextIndex : 0;
        const nextSelection = pendingResults[resolvedIndex];

        setSelectedResult(nextSelection);
        setCurrentIndex(resolvedIndex);

        if (!currentId || nextSelection._id !== currentId) {
          setGradeForm({ awardedScore: '', feedback: '', rubricScores: {} });
          setFeedbackForm('');
          setSelectedAnswers([]);
          setBulkGradeForm({ scores: {} });
        }
      } else {
        setSelectedResult(null);
        setCurrentIndex(0);
        setSelectedAnswers([]);
        setBulkGradeForm({ scores: {} });
      }
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load grading data');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (direction) => {
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < results.length) {
      setCurrentIndex(newIndex);
      setSelectedResult(results[newIndex]);
      setGradeForm({ awardedScore: '', feedback: '', rubricScores: {} });
      setFeedbackForm('');
      setSelectedAnswers([]);
      setBulkGradeForm({ scores: {} });
      setError('');
    }
  };

  const handleGradeAnswer = async (questionId) => {
    try {
      if (!selectedResult) {
        setError('No submission selected');
        return;
      }

      const answer = selectedResult.answers.find(
        a => (a.questionId?._id || a.questionId) === questionId
      );
      if (!answer) return;

      const rubricEntries = Object.entries(gradeForm.rubricScores || {}).filter(([, value]) => value !== '' && value !== null && value !== undefined);
      const hasRubric = Boolean(answer.questionId?.rubric);
      const useRubric = hasRubric && rubricEntries.length > 0;

      if (!useRubric && (gradeForm.awardedScore === '' || gradeForm.awardedScore === null || gradeForm.awardedScore === undefined)) {
        setError('Please enter a score');
        return;
      }

      // Check if rubric exists and use rubric grading
      if (useRubric) {
        const rubricScoresPayload = Object.fromEntries(
          rubricEntries.map(([criteriaId, score]) => [criteriaId, parseFloat(score || 0)])
        );

        await gradeWithRubric(
          selectedResult._id,
          questionId,
          rubricScoresPayload,
          gradeForm.feedback
        );
      } else {
        const awardedScore = parseFloat(gradeForm.awardedScore);

        if (Number.isNaN(awardedScore)) {
          setError('Please enter a valid numeric score');
          return;
        }

        await gradeAnswer(
          selectedResult._id,
          questionId,
          {
            awardedScore,
            feedback: gradeForm.feedback
          }
        );
      }

      await fetchData();
      setGradeForm({ awardedScore: '', feedback: '', rubricScores: {} });
      setSelectedAnswers([]);
      setBulkGradeForm({ scores: {} });
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to grade answer');
    }
  };

  const buildAnswerKey = (resultId, answer) =>
    answer._id || `${resultId}-${answer.questionId?._id || answer.questionId}`;

  const findAnswerByKey = (key) => {
    for (const result of results) {
      for (const answer of result.answers) {
        if (buildAnswerKey(result._id, answer) === key) {
          const resolvedResultId =
            typeof result._id === 'string' ? result._id : result._id?.toString?.();
          return { answer, resultId: resolvedResultId || result._id };
        }
      }
    }
    return null;
  };

  const handleBulkGrade = async () => {
    try {
      const gradingsByResult = new Map();

      selectedAnswers.forEach(answerKey => {
        const resolved = findAnswerByKey(answerKey);
        if (!resolved) {
          return;
        }

        const { answer, resultId } = resolved;
        if (!resultId) {
          return;
        }
        const questionId = answer.questionId?._id || answer.questionId;
        const awardedScore = parseFloat(bulkGradeForm.scores[answerKey] || 0);

        if (!gradingsByResult.has(resultId)) {
          gradingsByResult.set(resultId, []);
        }

        gradingsByResult.get(resultId).push({
          questionId,
          awardedScore,
          feedback: ''
        });
      });

      if (gradingsByResult.size === 0) {
        setError('Please select answers and enter scores before bulk grading');
        return;
      }

      for (const [resultId, gradings] of gradingsByResult.entries()) {
        if (gradings.length > 0) {
          await bulkGrade(resultId, gradings);
        }
      }

      await fetchData();
      setShowBulkMode(false);
      setSelectedAnswers([]);
      setBulkGradeForm({ scores: {} });
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to bulk grade');
    }
  };

  const handleAddFeedback = async () => {
    try {
      if (!feedbackForm) {
        setError('Please enter feedback');
        return;
      }
      await addFeedback(selectedResult._id, feedbackForm);
      await fetchData();
      setFeedbackForm('');
    } catch (err) {
      setError(err.message || 'Failed to add feedback');
    }
  };

  const handleAutoGrade = async () => {
    try {
      if (!selectedResult) {
        setError('No submission selected');
        return;
      }

      await autoGrade(selectedResult._id);
      await fetchData();
      setShowBulkMode(false);
      setBulkGradeForm({ scores: {} });
      setSelectedAnswers([]);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to auto-grade');
    }
  };

  const toggleAnswerSelection = (answerId) => {
    setSelectedAnswers(prev =>
      prev.includes(answerId)
        ? prev.filter(id => id !== answerId)
        : [...prev, answerId]
    );
  };

  const getQuestionTypeColor = (type) => {
    const colors = {
      'multiple-choice': 'bg-blue-100 text-blue-800',
      'code': 'bg-purple-100 text-purple-800',
      'fill-in-blank': 'bg-green-100 text-green-800',
      'matching': 'bg-yellow-100 text-yellow-800',
      'essay': 'bg-red-100 text-red-800',
      'file-upload': 'bg-indigo-100 text-indigo-800',
      'true-false': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const calculateRubricTotal = () => {
    return Object.values(gradeForm.rubricScores).reduce((sum, score) => sum + parseFloat(score || 0), 0);
  };

  if (loading && results.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading grading queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Grading Interface</h1>
            <p className="mt-2 text-gray-600">
              Review and grade student submissions
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setShowBulkMode(!showBulkMode)}
            >
              {showBulkMode ? '📋 Single Mode' : '📦 Bulk Mode'}
            </Button>
            <Button variant="secondary" onClick={handleAutoGrade} disabled={!selectedResult}>
              ⚡ Auto-Grade
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Statistics */}
        {statistics && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600 mb-1">Total Results</p>
              <p className="text-3xl font-bold text-gray-900">{statistics.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600 mb-1">Needs Grading</p>
              <p className="text-3xl font-bold text-orange-600">{statistics.needsGrading}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600 mb-1">Fully Graded</p>
              <p className="text-3xl font-bold text-green-600">{statistics.fullyGraded}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600 mb-1">Progress</p>
              <p className="text-3xl font-bold text-blue-600">
                {statistics.percentageGraded?.toFixed(0)}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${statistics.percentageGraded || 0}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Question Type
              </label>
              <select
                value={filters.questionType}
                onChange={(e) => setFilters({ ...filters, questionType: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">All Types</option>
                <option value="essay">Essay</option>
                <option value="code">Code</option>
                <option value="file-upload">File Upload</option>
              </select>
            </div>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              All Caught Up!
            </h3>
            <p className="text-gray-600">
              There are no submissions requiring manual grading at this time.
            </p>
          </div>
        ) : showBulkMode ? (
          /* Bulk Grading Mode */
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Bulk Grading</h3>
                <p className="text-sm text-gray-600">
                  Selected: {selectedAnswers.length} answers
                </p>
              </div>
              <Button onClick={handleBulkGrade} disabled={selectedAnswers.length === 0}>
                Grade Selected ({selectedAnswers.length})
              </Button>
            </div>
            <div className="p-6 space-y-4">
              {results.map((result) =>
                result.answers
                  .filter(a => a.needsGrading)
                  .map((answer) => {
                    const answerKey = buildAnswerKey(result._id, answer);
                    return (
                      <div
                        key={answerKey}
                        className={`border rounded-lg p-4 ${
                          selectedAnswers.includes(answerKey) ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex gap-4">
                          <input
                            type="checkbox"
                            checked={selectedAnswers.includes(answerKey)}
                            onChange={() => toggleAnswerSelection(answerKey)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 text-xs rounded ${getQuestionTypeColor(answer.questionId.type)}`}>
                                {answer.questionId.type}
                              </span>
                              <span className="text-sm text-gray-600">
                                {result.studentId?.name} - Max: {answer.questionId.maxScore}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 mb-2">
                              <strong>Q:</strong> {answer.questionId.questionText}
                            </p>
                            <div className="bg-gray-50 rounded p-3 mb-2">
                              <p className="text-sm text-gray-700">
                                <strong>A:</strong> {answer.answer?.text || 'No text answer'}
                              </p>
                            </div>
                            {selectedAnswers.includes(answerKey) && (
                              <input
                                type="number"
                                min="0"
                                max={answer.questionId.maxScore}
                                step="0.1"
                                value={bulkGradeForm.scores[answerKey] || ''}
                                onChange={(e) => setBulkGradeForm({
                                  ...bulkGradeForm,
                                  scores: { ...bulkGradeForm.scores, [answerKey]: e.target.value }
                                })}
                                placeholder="Score"
                                className="w-32 border border-gray-300 rounded px-3 py-2"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        ) : (
          /* Single Grading Mode */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Navigation Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-4 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Grading Queue ({results.length})
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <button
                      key={result._id}
                      onClick={() => {
                        setCurrentIndex(index);
                        setSelectedResult(result);
                        setGradeForm({ awardedScore: '', feedback: '', rubricScores: {} });
                        setFeedbackForm('');
                        setSelectedAnswers([]);
                        setBulkGradeForm({ scores: {} });
                        setError('');
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedResult?._id === result._id
                          ? 'bg-orange-100 border-2 border-orange-500'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{result.studentId?.name}</p>
                      <p className="text-sm text-gray-600">
                        {result.answers.filter(a => a.needsGrading).length} questions pending
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grading Panel */}
            <div className="lg:col-span-2">
              {selectedResult && (
                <div className="space-y-6">
                  {/* Student Info */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {selectedResult.studentId?.name}
                        </h2>
                        <p className="text-gray-600">{selectedResult.studentId?.email}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Submitted: {new Date(selectedResult.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Current Score</p>
                        <p className="text-3xl font-bold text-gray-900">
                          {selectedResult.score?.toFixed(1)}
                        </p>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center">
                      <Button
                        variant="secondary"
                        onClick={() => handleNavigate('prev')}
                        disabled={currentIndex === 0}
                      >
                        ← Previous
                      </Button>
                      <span className="text-sm text-gray-600">
                        {currentIndex + 1} of {results.length}
                      </span>
                      <Button
                        variant="secondary"
                        onClick={() => handleNavigate('next')}
                        disabled={currentIndex === results.length - 1}
                      >
                        Next →
                      </Button>
                    </div>
                  </div>

                  {/* Questions to Grade */}
                  {selectedResult.answers
                    .filter(a => a.needsGrading)
                    .map((answer, index) => {
                      const answerKey = buildAnswerKey(selectedResult._id, answer);
                      return (
                        <div key={answerKey} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className={`px-2 py-1 text-xs rounded ${getQuestionTypeColor(answer.questionId.type)}`}>
                              {answer.questionId.type}
                            </span>
                            <h3 className="text-lg font-semibold text-gray-900 mt-2">
                              Question {index + 1}
                            </h3>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Max Score</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {answer.questionId.maxScore}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-gray-900 mb-4">{answer.questionId.questionText}</p>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Student Answer:</h4>
                            {answer.questionId.type === 'essay' && (
                              <div>
                                <p className="text-gray-700 whitespace-pre-wrap">{answer.answer?.text}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                  Word count: {answer.answer?.text?.split(/\s+/).length || 0}
                                </p>
                              </div>
                            )}
                            {answer.questionId.type === 'code' && (
                              <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
                                <code>{answer.answer?.code}</code>
                              </pre>
                            )}
                            {answer.questionId.type === 'file-upload' && (
                              <div className="space-y-2">
                                {answer.answer?.files?.map((file, i) => (
                                  <div key={i} className="flex items-center gap-2 p-2 bg-white rounded">
                                    <span className="text-2xl">📎</span>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900">{file.filename}</p>
                                      <p className="text-xs text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                    <Button variant="secondary" size="sm">
                                      Download
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Grading Form */}
                        <div className="border-t pt-4">
                          {answer.questionId.rubric && answer.questionId.rubric.length > 0 ? (
                            /* Rubric Grading */
                            <div>
                              <h4 className="font-medium text-gray-900 mb-3">Grade with Rubric:</h4>
                              <div className="space-y-3 mb-4">
                                {answer.questionId.rubric.map((criteria, criteriaIndex) => {
                                  const criteriaKey =
                                    criteria._id ||
                                    criteria.id ||
                                    criteria.name ||
                                    criteria.criteria ||
                                    `criterion-${criteriaIndex}`;
                                  const criteriaLabel =
                                    criteria.criteria ||
                                    criteria.name ||
                                    criteria.label ||
                                    `Criterion ${criteriaIndex + 1}`;
                                  const criteriaMax =
                                    criteria.maxScore ??
                                    criteria.maxPoints ??
                                    criteria.points ??
                                    criteria.maxValue ??
                                    0;

                                  return (
                                    <div key={criteriaKey} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-900">{criteriaLabel}</p>
                                        <p className="text-sm text-gray-600">Max: {criteriaMax} points</p>
                                      </div>
                                      <input
                                        type="number"
                                        min="0"
                                        max={criteriaMax}
                                        step="0.1"
                                        value={gradeForm.rubricScores[criteriaKey] ?? ''}
                                        onChange={(e) => setGradeForm({
                                          ...gradeForm,
                                          rubricScores: {
                                            ...gradeForm.rubricScores,
                                            [criteriaKey]: e.target.value
                                          }
                                        })}
                                        className="w-24 border border-gray-300 rounded px-3 py-2"
                                        placeholder="0.0"
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="bg-blue-50 p-3 rounded mb-4">
                                <p className="text-sm text-gray-600">Total Score:</p>
                                <p className="text-2xl font-bold text-blue-600">
                                  {calculateRubricTotal()} / {answer.questionId.maxScore}
                                </p>
                              </div>
                            </div>
                          ) : (
                            /* Direct Score Input */
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Awarded Score *
                              </label>
                              <input
                                type="number"
                                min="0"
                                max={answer.questionId.maxScore}
                                step="0.1"
                                value={gradeForm.awardedScore}
                                onChange={(e) => setGradeForm({ ...gradeForm, awardedScore: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                placeholder={`0 - ${answer.questionId.maxScore}`}
                                required
                              />
                            </div>
                          )}

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Feedback
                            </label>
                            <textarea
                              value={gradeForm.feedback}
                              onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                              className="w-full border border-gray-300 rounded px-3 py-2"
                              rows={3}
                              placeholder="Provide feedback for this answer..."
                            />
                          </div>

                          <Button onClick={() => handleGradeAnswer(answer.questionId?._id || answer.questionId)}>
                            Submit Grade
                          </Button>
                        </div>
                        </div>
                      );
                    })}

                  {/* Overall Feedback */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Feedback</h3>
                    <textarea
                      value={feedbackForm}
                      onChange={(e) => setFeedbackForm(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                      rows={4}
                      placeholder="Add overall feedback for this student's attempt..."
                    />
                    <Button onClick={handleAddFeedback} disabled={!feedbackForm}>
                      Add Feedback
                    </Button>

                    {selectedResult.instructorFeedback && selectedResult.instructorFeedback.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium text-gray-900">Previous Feedback:</h4>
                        {selectedResult.instructorFeedback.map((fb, i) => (
                          <div key={i} className="bg-gray-50 rounded p-3">
                            <p className="text-sm text-gray-700">{fb.feedback}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(fb.timestamp).toLocaleString()} by {fb.instructor?.name || 'Unknown'}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradingInterface;
