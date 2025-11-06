import React, { useState, useEffect } from 'react';
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Brain,
  Code,
  BarChart3,
  Loader,
  AlertCircle,
  FileText,
  Eye
} from 'lucide-react';
import api from '../services/apiClient';

const AIDetectionDashboard = ({ userId, quizId, resultId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detectionData, setDetectionData] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDetectionData();
  }, [userId, quizId, resultId]);

  const fetchDetectionData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch detection data for specific result or user
      let endpoint = '/api/results';
      if (resultId) {
        endpoint += `/${resultId}`;
      } else if (userId) {
        endpoint += `?userId=${userId}`;
      }

      const response = await api.get(endpoint);
      
      // Process detection data
      const results = Array.isArray(response.data) ? response.data : [response.data];
      const processedData = processDetectionResults(results);
      
      setDetectionData(processedData);
      
      // Calculate statistics
      const calculatedStats = calculateStats(processedData);
      setStats(calculatedStats);

    } catch (err) {
      console.error('Error fetching detection data:', err);
      setError('Failed to load AI detection data');
    } finally {
      setLoading(false);
    }
  };

  const processDetectionResults = (results) => {
    const processed = {
      totalAnswers: 0,
      analyzedAnswers: 0,
      flaggedAnswers: 0,
      averageAIScore: 0,
      riskDistribution: {
        minimal: 0,
        low: 0,
        moderate: 0,
        high: 0
      },
      detailedResults: []
    };

    results.forEach(result => {
      if (result.answers && Array.isArray(result.answers)) {
        result.answers.forEach(answer => {
          if (answer.questionType === 'code' && answer.aiDetection) {
            processed.totalAnswers++;
            
            if (answer.aiDetection.analyzed) {
              processed.analyzedAnswers++;
              processed.averageAIScore += answer.aiDetection.aiScore || 0;

              if (answer.aiDetection.isAIGenerated) {
                processed.flaggedAnswers++;
              }

              // Classify risk level
              const score = answer.aiDetection.aiScore || 0;
              if (score < 20) processed.riskDistribution.minimal++;
              else if (score < 35) processed.riskDistribution.low++;
              else if (score < 50) processed.riskDistribution.moderate++;
              else processed.riskDistribution.high++;

              processed.detailedResults.push({
                questionId: answer.questionId,
                questionType: answer.questionType,
                aiScore: answer.aiDetection.aiScore,
                compositeScore: answer.aiDetection.compositeScore,
                isAIGenerated: answer.aiDetection.isAIGenerated,
                confidence: answer.aiDetection.confidence,
                indicators: answer.aiDetection.indicators || [],
                recommendation: answer.aiDetection.recommendation,
                analyzedAt: answer.aiDetection.analyzedAt
              });
            }
          }
        });
      }
    });

    if (processed.analyzedAnswers > 0) {
      processed.averageAIScore = processed.averageAIScore / processed.analyzedAnswers;
    }

    return processed;
  };

  const calculateStats = (data) => {
    return {
      detectionRate: data.totalAnswers > 0 
        ? ((data.analyzedAnswers / data.totalAnswers) * 100).toFixed(1)
        : 0,
      flagRate: data.analyzedAnswers > 0
        ? ((data.flaggedAnswers / data.analyzedAnswers) * 100).toFixed(1)
        : 0,
      avgScore: data.averageAIScore.toFixed(1)
    };
  };

  const getRiskColor = (score) => {
    if (score < 20) return 'text-green-600 bg-green-50 border-green-200';
    if (score < 35) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score < 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRiskLabel = (score) => {
    if (score < 20) return 'MINIMAL RISK';
    if (score < 35) return 'LOW RISK';
    if (score < 50) return 'MODERATE RISK';
    return 'HIGH RISK';
  };

  const getRiskIcon = (score) => {
    if (score < 35) return <CheckCircle className="w-5 h-5" />;
    if (score < 50) return <AlertCircle className="w-5 h-5" />;
    return <AlertTriangle className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!detectionData || detectionData.totalAnswers === 0) {
    return (
      <div className="p-12 text-center">
        <Brain className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Detection Data</h3>
        <p className="text-gray-500">No code submissions have been analyzed yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-lg text-white">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8" />
          <h2 className="text-2xl font-bold">AI Detection Dashboard</h2>
        </div>
        <p className="text-purple-100">
          Advanced heuristics analyze code for AI-generated patterns
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Code className="w-6 h-6 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">
              {detectionData.totalAnswers}
            </span>
          </div>
          <p className="text-sm text-gray-600">Total Submissions</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">
              {detectionData.analyzedAnswers}
            </span>
          </div>
          <p className="text-sm text-gray-600">Analyzed</p>
          <p className="text-xs text-gray-500 mt-1">{stats.detectionRate}% detection rate</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <span className="text-2xl font-bold text-gray-900">
              {detectionData.flaggedAnswers}
            </span>
          </div>
          <p className="text-sm text-gray-600">Flagged</p>
          <p className="text-xs text-gray-500 mt-1">{stats.flagRate}% flagged</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">
              {stats.avgScore}
            </span>
          </div>
          <p className="text-sm text-gray-600">Avg AI Score</p>
          <p className="text-xs text-gray-500 mt-1">Out of 100</p>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'minimal', label: 'Minimal Risk', color: 'green' },
            { key: 'low', label: 'Low Risk', color: 'yellow' },
            { key: 'moderate', label: 'Moderate Risk', color: 'orange' },
            { key: 'high', label: 'High Risk', color: 'red' }
          ].map(({ key, label, color }) => (
            <div key={key} className={`p-4 rounded-lg border-2 bg-${color}-50 border-${color}-200`}>
              <div className={`text-2xl font-bold text-${color}-700 mb-1`}>
                {detectionData.riskDistribution[key]}
              </div>
              <div className={`text-sm text-${color}-600`}>{label}</div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${color}-500`}
                  style={{
                    width: `${detectionData.analyzedAnswers > 0 
                      ? (detectionData.riskDistribution[key] / detectionData.analyzedAnswers) * 100
                      : 0}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Results */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Detailed Analysis ({detectionData.detailedResults.length})
        </h3>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {detectionData.detailedResults.map((result, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${getRiskColor(result.aiScore)}`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getRiskIcon(result.aiScore)}
                  <span className="font-semibold">{getRiskLabel(result.aiScore)}</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{result.aiScore.toFixed(1)}</div>
                  <div className="text-xs">AI Score</div>
                </div>
              </div>

              {/* Composite Score */}
              <div className="mb-3 p-3 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Composite Score</span>
                  <span className="text-lg font-bold text-gray-900">{result.compositeScore?.toFixed(1) || 'N/A'}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                    style={{ width: `${result.compositeScore || 0}%` }}
                  />
                </div>
              </div>

              {/* Indicators */}
              {result.indicators && result.indicators.length > 0 && (
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Detection Indicators:</div>
                  <div className="space-y-1">
                    {result.indicators.slice(0, 3).map((indicator, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          indicator.severity === 'high' ? 'bg-red-100 text-red-700' :
                          indicator.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {indicator.severity?.toUpperCase()}
                        </span>
                        <span className="text-gray-700">{indicator.message}</span>
                      </div>
                    ))}
                    {result.indicators.length > 3 && (
                      <div className="text-xs text-gray-500 pl-2">
                        +{result.indicators.length - 3} more indicators
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recommendation */}
              <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                <div className="flex items-start gap-2">
                  <Eye className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{result.recommendation}</p>
                </div>
              </div>

              {/* Timestamp */}
              {result.analyzedAt && (
                <div className="mt-2 text-xs opacity-70">
                  Analyzed: {new Date(result.analyzedAt).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Detection Metrics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600">
          <div>
            <strong>AI Score:</strong> Overall likelihood of AI generation (0-100)
          </div>
          <div>
            <strong>Composite Score:</strong> Weighted analysis across multiple factors
          </div>
          <div>
            <strong>Comment Ratio:</strong> Proportion of comments to code
          </div>
          <div>
            <strong>Variable Naming:</strong> Analysis of naming patterns
          </div>
          <div>
            <strong>Boilerplate:</strong> Detection of standard templates
          </div>
          <div>
            <strong>GPT Fingerprints:</strong> AI-specific code patterns
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDetectionDashboard;
