import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getQuizProctoringEvents,
  getProctoringEvent,
  reviewProctoringEvent,
  getFlaggedAttempts
} from '../../services/enhancedProctoringService';
import Button from '../../components/ui/Button';

const ProctoringMonitor = () => {
  const { quizId } = useParams();
  const [events, setEvents] = useState([]);
  const [flaggedAttempts, setFlaggedAttempts] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    riskLevel: '',
    reviewStatus: ''
  });
  const [reviewForm, setReviewForm] = useState({
    reviewStatus: 'under-review',
    reviewNotes: '',
    actionTaken: ''
  });
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    if (quizId) {
      fetchEvents();
      fetchFlaggedAttempts();
    }
  }, [quizId, filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getQuizProctoringEvents(quizId, filters);
      setEvents(response.data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load proctoring events');
    } finally {
      setLoading(false);
    }
  };

  const fetchFlaggedAttempts = async () => {
    try {
      const response = await getFlaggedAttempts(quizId);
      setFlaggedAttempts(response.data);
    } catch (err) {
      console.error('Failed to load flagged attempts:', err);
    }
  };

  const handleViewEvent = async (eventId) => {
    try {
      const response = await getProctoringEvent(eventId);
      setSelectedEvent(response.data);
      setShowReviewModal(true);
      setReviewForm({
        reviewStatus: response.data.reviewStatus || 'under-review',
        reviewNotes: '',
        actionTaken: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to load event details');
    }
  };

  const handleSubmitReview = async () => {
    try {
      await reviewProctoringEvent(selectedEvent._id, reviewForm);
      setShowReviewModal(false);
      setSelectedEvent(null);
      await fetchEvents();
      await fetchFlaggedAttempts();
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    }
  };

  const getRiskLevelColor = (riskScore) => {
    if (riskScore >= 80) return 'bg-red-100 text-red-800 border-red-300';
    if (riskScore >= 60) return 'bg-orange-100 text-orange-800 border-orange-300';
    if (riskScore >= 30) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  const getRiskLevel = (riskScore) => {
    if (riskScore >= 80) return 'CRITICAL';
    if (riskScore >= 60) return 'HIGH';
    if (riskScore >= 30) return 'MEDIUM';
    return 'LOW';
  };

  const getReviewStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'under-review': 'bg-blue-100 text-blue-800',
      cleared: 'bg-green-100 text-green-800',
      flagged: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const countViolations = (event) => {
    if (!event) return 0;
    return (
      (event.eyeTrackingViolations?.length || 0) +
      (event.audioViolations?.length || 0) +
      (event.screenRecordingViolations?.length || 0) +
      (event.browserLockdownViolations?.length || 0) +
      (event.keystrokeAnalysisViolations?.length || 0) +
      (event.faceDetectionViolations?.length || 0) +
      (event.idVerificationViolations?.length || 0) +
      (event.networkMonitoringViolations?.length || 0)
    );
  };

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading proctoring events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Proctoring Monitor</h1>
          <p className="mt-2 text-gray-600">
            Real-time monitoring and violation management
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Risk Level
              </label>
              <select
                value={filters.riskLevel}
                onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">All Levels</option>
                <option value="low">Low (0-29)</option>
                <option value="medium">Medium (30-59)</option>
                <option value="high">High (60-79)</option>
                <option value="critical">Critical (80-100)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review Status
              </label>
              <select
                value={filters.reviewStatus}
                onChange={(e) => setFilters({ ...filters, reviewStatus: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="under-review">Under Review</option>
                <option value="cleared">Cleared</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button onClick={fetchEvents} className="w-full">
                🔄 Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Flagged Attempts Alert */}
        {flaggedAttempts.length > 0 && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">
                  ⚠️ {flaggedAttempts.length} High-Risk Attempts Detected
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  These attempts require immediate review due to significant violations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-6xl mb-4">👁️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Proctoring Events
              </h3>
              <p className="text-gray-600">
                No proctoring events have been recorded for this quiz yet.
              </p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event._id}
                className={`bg-white rounded-lg shadow border-l-4 ${
                  event.riskScore >= 80 ? 'border-red-500' :
                  event.riskScore >= 60 ? 'border-orange-500' :
                  event.riskScore >= 30 ? 'border-yellow-500' :
                  'border-green-500'
                } hover:shadow-lg transition-shadow`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {event.studentId?.name || 'Unknown Student'}
                      </h3>
                      <p className="text-sm text-gray-600">{event.studentId?.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Started: {formatTimestamp(event.attemptStartTime)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRiskLevelColor(event.riskScore)}`}>
                        {getRiskLevel(event.riskScore)} RISK
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {event.riskScore}
                      </p>
                      <p className="text-xs text-gray-600">Risk Score</p>
                    </div>
                  </div>

                  {/* Violation Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {event.eyeTrackingViolations?.length > 0 && (
                      <div className="bg-red-50 rounded p-2">
                        <p className="text-xs text-gray-600">Eye Tracking</p>
                        <p className="text-lg font-semibold text-red-600">
                          {event.eyeTrackingViolations.length}
                        </p>
                      </div>
                    )}
                    {event.audioViolations?.length > 0 && (
                      <div className="bg-orange-50 rounded p-2">
                        <p className="text-xs text-gray-600">Audio</p>
                        <p className="text-lg font-semibold text-orange-600">
                          {event.audioViolations.length}
                        </p>
                      </div>
                    )}
                    {event.screenRecordingViolations?.length > 0 && (
                      <div className="bg-yellow-50 rounded p-2">
                        <p className="text-xs text-gray-600">Screen</p>
                        <p className="text-lg font-semibold text-yellow-600">
                          {event.screenRecordingViolations.length}
                        </p>
                      </div>
                    )}
                    {event.browserLockdownViolations?.length > 0 && (
                      <div className="bg-purple-50 rounded p-2">
                        <p className="text-xs text-gray-600">Browser</p>
                        <p className="text-lg font-semibold text-purple-600">
                          {event.browserLockdownViolations.length}
                        </p>
                      </div>
                    )}
                    {event.faceDetectionViolations?.length > 0 && (
                      <div className="bg-blue-50 rounded p-2">
                        <p className="text-xs text-gray-600">Face Detection</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {event.faceDetectionViolations.length}
                        </p>
                      </div>
                    )}
                    {event.idVerificationViolations?.length > 0 && (
                      <div className="bg-indigo-50 rounded p-2">
                        <p className="text-xs text-gray-600">ID Verification</p>
                        <p className="text-lg font-semibold text-indigo-600">
                          {event.idVerificationViolations.length}
                        </p>
                      </div>
                    )}
                    {event.keystrokeAnalysisViolations?.length > 0 && (
                      <div className="bg-pink-50 rounded p-2">
                        <p className="text-xs text-gray-600">Keystroke</p>
                        <p className="text-lg font-semibold text-pink-600">
                          {event.keystrokeAnalysisViolations.length}
                        </p>
                      </div>
                    )}
                    {event.networkMonitoringViolations?.length > 0 && (
                      <div className="bg-red-50 rounded p-2">
                        <p className="text-xs text-gray-600">Network</p>
                        <p className="text-lg font-semibold text-red-600">
                          {event.networkMonitoringViolations.length}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getReviewStatusColor(event.reviewStatus)}`}>
                        {event.reviewStatus || 'Pending'}
                      </span>
                      <span className="ml-3 text-sm text-gray-600">
                        {countViolations(event)} total violations
                      </span>
                    </div>
                    <Button onClick={() => handleViewEvent(event._id)}>
                      📋 Review Details
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Review Modal */}
        {showReviewModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Event Review</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedEvent.studentId?.name} - {formatTimestamp(selectedEvent.attemptStartTime)}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Risk Score */}
                <div className={`p-4 rounded-lg ${getRiskLevelColor(selectedEvent.riskScore)}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Risk Assessment</p>
                      <p className="text-3xl font-bold">{selectedEvent.riskScore}/100</p>
                    </div>
                    <div className="text-2xl font-bold">
                      {getRiskLevel(selectedEvent.riskScore)} RISK
                    </div>
                  </div>
                </div>

                {/* Violations Detail */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Violations</h3>
                  <div className="space-y-4">
                    {selectedEvent.eyeTrackingViolations?.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          👁️ Eye Tracking ({selectedEvent.eyeTrackingViolations.length})
                        </h4>
                        <ul className="space-y-2">
                          {selectedEvent.eyeTrackingViolations.map((v, i) => (
                            <li key={i} className="text-sm text-gray-700">
                              <span className="font-medium">{formatTimestamp(v.timestamp)}:</span> {v.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedEvent.audioViolations?.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          🔊 Audio Monitoring ({selectedEvent.audioViolations.length})
                        </h4>
                        <ul className="space-y-2">
                          {selectedEvent.audioViolations.map((v, i) => (
                            <li key={i} className="text-sm text-gray-700">
                              <span className="font-medium">{formatTimestamp(v.timestamp)}:</span> {v.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedEvent.screenRecordingViolations?.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          🖥️ Screen Recording ({selectedEvent.screenRecordingViolations.length})
                        </h4>
                        <ul className="space-y-2">
                          {selectedEvent.screenRecordingViolations.map((v, i) => (
                            <li key={i} className="text-sm text-gray-700">
                              <span className="font-medium">{formatTimestamp(v.timestamp)}:</span> {v.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedEvent.browserLockdownViolations?.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          🔒 Browser Lockdown ({selectedEvent.browserLockdownViolations.length})
                        </h4>
                        <ul className="space-y-2">
                          {selectedEvent.browserLockdownViolations.map((v, i) => (
                            <li key={i} className="text-sm text-gray-700">
                              <span className="font-medium">{formatTimestamp(v.timestamp)}:</span> {v.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedEvent.faceDetectionViolations?.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          👤 Face Detection ({selectedEvent.faceDetectionViolations.length})
                        </h4>
                        <ul className="space-y-2">
                          {selectedEvent.faceDetectionViolations.map((v, i) => (
                            <li key={i} className="text-sm text-gray-700">
                              <span className="font-medium">{formatTimestamp(v.timestamp)}:</span> {v.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedEvent.idVerificationViolations?.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          🪪 ID Verification ({selectedEvent.idVerificationViolations.length})
                        </h4>
                        <ul className="space-y-2">
                          {selectedEvent.idVerificationViolations.map((v, i) => (
                            <li key={i} className="text-sm text-gray-700">
                              <span className="font-medium">{formatTimestamp(v.timestamp)}:</span> {v.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedEvent.keystrokeAnalysisViolations?.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          ⌨️ Keystroke Analysis ({selectedEvent.keystrokeAnalysisViolations.length})
                        </h4>
                        <ul className="space-y-2">
                          {selectedEvent.keystrokeAnalysisViolations.map((v, i) => (
                            <li key={i} className="text-sm text-gray-700">
                              <span className="font-medium">{formatTimestamp(v.timestamp)}:</span> {v.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedEvent.networkMonitoringViolations?.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          🌐 Network Monitoring ({selectedEvent.networkMonitoringViolations.length})
                        </h4>
                        <ul className="space-y-2">
                          {selectedEvent.networkMonitoringViolations.map((v, i) => (
                            <li key={i} className="text-sm text-gray-700">
                              <span className="font-medium">{formatTimestamp(v.timestamp)}:</span> {v.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Review Form */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Review</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Review Status *
                      </label>
                      <select
                        value={reviewForm.reviewStatus}
                        onChange={(e) => setReviewForm({ ...reviewForm, reviewStatus: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                      >
                        <option value="under-review">Under Review</option>
                        <option value="cleared">Cleared</option>
                        <option value="flagged">Flagged</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Review Notes
                      </label>
                      <textarea
                        value={reviewForm.reviewNotes}
                        onChange={(e) => setReviewForm({ ...reviewForm, reviewNotes: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        rows={4}
                        placeholder="Add your review notes here..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Action Taken
                      </label>
                      <input
                        type="text"
                        value={reviewForm.actionTaken}
                        onChange={(e) => setReviewForm({ ...reviewForm, actionTaken: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="E.g., Warning issued, Score adjusted, etc."
                      />
                    </div>
                  </div>
                </div>

                {/* Previous Actions */}
                {selectedEvent.actionsTaken?.length > 0 && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Action History</h3>
                    <div className="space-y-2">
                      {selectedEvent.actionsTaken.map((action, i) => (
                        <div key={i} className="bg-gray-50 rounded p-3">
                          <p className="text-sm font-medium text-gray-900">{action.action}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {formatTimestamp(action.timestamp)} by {action.reviewedBy?.name || 'Unknown'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitReview}>
                  Submit Review
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProctoringMonitor;
