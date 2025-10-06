import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getQuizAnalytics,
  getAtRiskStudents,
  getTopPerformers,
  exportAnalyticsReport,
  recalculateAnalytics
} from '../../services/analyticsService';
import Button from '../../components/ui/Button';

const AnalyticsDashboard = () => {
  const { quizId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (quizId) {
      fetchAnalytics();
    }
  }, [quizId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsData, atRisk, performers] = await Promise.all([
        getQuizAnalytics(quizId),
        getAtRiskStudents(quizId),
        getTopPerformers(quizId)
      ]);
      setAnalytics(analyticsData.data);
      setAtRiskStudents(atRisk.data);
      setTopPerformers(performers.data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = async () => {
    try {
      setLoading(true);
      await recalculateAnalytics(quizId);
      await fetchAnalytics();
    } catch (err) {
      setError(err.message || 'Failed to recalculate analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      await exportAnalyticsReport(quizId, format);
    } catch (err) {
      setError(err.message || 'Failed to export report');
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      A: 'text-green-600',
      B: 'text-blue-600',
      C: 'text-yellow-600',
      D: 'text-orange-600',
      F: 'text-red-600'
    };
    return colors[grade] || 'text-gray-600';
  };

  const getRiskLevelColor = (level) => {
    const colors = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-red-600 bg-red-100'
    };
    return colors[level] || 'text-gray-600 bg-gray-100';
  };

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchAnalytics} className="mt-4">
            Retry
          </Button>
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
            <h1 className="text-3xl font-bold text-gray-900">Quiz Analytics</h1>
            <p className="mt-2 text-gray-600">
              Comprehensive performance insights and statistics
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleRecalculate} disabled={loading}>
              🔄 Recalculate
            </Button>
            <Button variant="secondary" onClick={() => handleExport('json')}>
              📊 Export JSON
            </Button>
            <Button variant="secondary" onClick={() => handleExport('csv')}>
              📄 Export CSV
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'questions', 'students', 'violations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && analytics && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600 mb-1">Total Attempts</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalAttempts}</p>
                <p className="text-sm text-green-600 mt-2">
                  {analytics.completionRate?.toFixed(1)}% completion rate
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics.averageScore?.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Median: {analytics.medianScore?.toFixed(1)}%
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600 mb-1">Pass Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {analytics.passRate?.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Threshold: {analytics.passingThreshold}%
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-600 mb-1">Avg Time</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.floor(analytics.averageCompletionTime / 60)}m
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Range: {Math.floor(analytics.fastestCompletion / 60)}-{Math.floor(analytics.slowestCompletion / 60)}m
                </p>
              </div>
            </div>

            {/* Score Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h3>
              <div className="space-y-3">
                {Object.entries(analytics.scoreDistribution || {}).map(([range, count]) => (
                  <div key={range}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{range}%</span>
                      <span className="font-medium text-gray-900">{count} students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{
                          width: `${analytics.totalAttempts > 0 ? (count / analytics.totalAttempts) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grade Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
              <div className="grid grid-cols-5 gap-4">
                {Object.entries(analytics.gradeDistribution || {}).map(([grade, count]) => (
                  <div key={grade} className="text-center">
                    <div className={`text-4xl font-bold ${getGradeColor(grade)}`}>
                      {grade}
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-gray-900">
                      {count}
                    </div>
                    <div className="text-sm text-gray-600">students</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Highest Score:</span>
                    <span className="font-semibold text-gray-900">
                      {analytics.highestScore?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lowest Score:</span>
                    <span className="font-semibold text-gray-900">
                      {analytics.lowestScore?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Standard Deviation:</span>
                    <span className="font-semibold text-gray-900">
                      {analytics.standardDeviation?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Time:</span>
                    <span className="font-semibold text-gray-900">
                      {Math.floor(analytics.averageCompletionTime / 60)} min {analytics.averageCompletionTime % 60} sec
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fastest:</span>
                    <span className="font-semibold text-gray-900">
                      {Math.floor(analytics.fastestCompletion / 60)} min {analytics.fastestCompletion % 60} sec
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Slowest:</span>
                    <span className="font-semibold text-gray-900">
                      {Math.floor(analytics.slowestCompletion / 60)} min {analytics.slowestCompletion % 60} sec
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && analytics && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Question Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Question
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Avg Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Disc. Index
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.questionAnalytics?.map((q, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        Question {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className={`font-semibold ${
                            q.successRate >= 70 ? 'text-green-600' :
                            q.successRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {q.successRate?.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {Math.floor(q.averageTimeSpent / 60)}:{(q.averageTimeSpent % 60).toString().padStart(2, '0')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded ${
                          q.perceivedDifficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          q.perceivedDifficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {q.perceivedDifficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {q.discriminationIndex?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* At-Risk Students */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">At-Risk Students</h3>
                <p className="text-sm text-gray-600 mt-1">Students who may need additional support</p>
              </div>
              <div className="p-6">
                {atRiskStudents.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No at-risk students identified</p>
                ) : (
                  <div className="space-y-3">
                    {atRiskStudents.map((student, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.studentId?.name || 'Unknown Student'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {student.studentId?.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-600">
                            {student.score?.toFixed(1)}%
                          </p>
                          <span className={`inline-block px-2 py-1 text-xs rounded ${getRiskLevelColor(student.riskLevel)}`}>
                            {student.riskLevel}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
                <p className="text-sm text-gray-600 mt-1">Students with highest scores</p>
              </div>
              <div className="p-6">
                {topPerformers.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No top performers yet</p>
                ) : (
                  <div className="space-y-3">
                    {topPerformers.map((student, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-yellow-400 text-yellow-900' :
                            index === 1 ? 'bg-gray-300 text-gray-700' :
                            index === 2 ? 'bg-orange-400 text-orange-900' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {student.studentId?.name || 'Unknown Student'}
                            </p>
                            <p className="text-sm text-gray-600">
                              Completed in {Math.floor(student.completionTime / 60)} min
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">
                            {student.score?.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Violations Tab */}
        {activeTab === 'violations' && analytics && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Proctoring Violations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Violations</p>
                <p className="text-3xl font-bold text-red-600">
                  {analytics.violationStats?.totalViolations || 0}
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Flagged Attempts</p>
                <p className="text-3xl font-bold text-orange-600">
                  {analytics.violationStats?.flaggedAttempts || 0}
                </p>
              </div>
              {Object.entries(analytics.violationStats?.violationTypes || {}).map(([type, count]) => (
                <div key={type} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1 capitalize">
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
