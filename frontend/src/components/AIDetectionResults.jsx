import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Info, Eye } from 'lucide-react';

const AIDetectionResults = ({ detection }) => {
  if (!detection || !detection.analyzed) {
    return null;
  }

  const getRiskLevel = (score) => {
    if (score < 20) return { label: 'MINIMAL', color: 'green', icon: CheckCircle };
    if (score < 35) return { label: 'LOW', color: 'blue', icon: Info };
    if (score < 50) return { label: 'MODERATE', color: 'yellow', icon: AlertTriangle };
    return { label: 'HIGH', color: 'red', icon: AlertTriangle };
  };

  const risk = getRiskLevel(detection.aiScore);
  const RiskIcon = risk.icon;

  return (
    <div className={`mt-4 p-4 rounded-lg border-2 bg-${risk.color}-50 border-${risk.color}-200`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className={`w-5 h-5 text-${risk.color}-600`} />
          <h3 className={`font-semibold text-${risk.color}-900`}>
            AI Detection Analysis
          </h3>
        </div>
        <div className={`px-3 py-1 rounded-full bg-${risk.color}-100 text-${risk.color}-700 text-sm font-bold`}>
          {risk.label} RISK
        </div>
      </div>

      {/* Score Display */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium text-${risk.color}-800`}>AI Detection Score</span>
          <span className={`text-2xl font-bold text-${risk.color}-900`}>
            {detection.aiScore.toFixed(1)}/100
          </span>
        </div>
        <div className="h-3 bg-white rounded-full overflow-hidden border border-current border-opacity-30">
          <div
            className={`h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500`}
            style={{ width: `${detection.aiScore}%` }}
          />
        </div>
      </div>

      {/* Composite Score */}
      {detection.compositeScore && (
        <div className="mb-4 p-3 bg-white rounded-lg border border-current border-opacity-20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700">Composite Analysis Score</span>
            <span className="text-lg font-bold text-gray-900">
              {detection.compositeScore.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-gray-600">
            Weighted analysis across comment ratio, variable naming, boilerplate, and GPT patterns
          </p>
        </div>
      )}

      {/* Indicators */}
      {detection.indicators && detection.indicators.length > 0 && (
        <div className="mb-4">
          <h4 className={`text-sm font-semibold text-${risk.color}-900 mb-2`}>
            Detection Factors:
          </h4>
          <div className="space-y-2">
            {detection.indicators.slice(0, 4).map((indicator, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-white rounded-lg border border-current border-opacity-20">
                <RiskIcon className={`w-4 h-4 text-${risk.color}-600 flex-shrink-0 mt-0.5`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      indicator.severity === 'high' ? 'bg-red-100 text-red-700' :
                      indicator.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {indicator.severity?.toUpperCase()}
                    </span>
                    <span className="text-xs font-medium text-gray-600">
                      {indicator.type?.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{indicator.message}</p>
                </div>
              </div>
            ))}
            {detection.indicators.length > 4 && (
              <p className="text-xs text-gray-500 text-center">
                +{detection.indicators.length - 4} additional factors detected
              </p>
            )}
          </div>
        </div>
      )}

      {/* Recommendation */}
      <div className={`p-3 bg-white rounded-lg border-2 border-${risk.color}-300`}>
        <div className="flex items-start gap-2">
          <Eye className={`w-4 h-4 text-${risk.color}-600 flex-shrink-0 mt-0.5`} />
          <div>
            <h4 className={`text-sm font-semibold text-${risk.color}-900 mb-1`}>
              Recommendation:
            </h4>
            <p className="text-sm text-gray-700">{detection.recommendation}</p>
          </div>
        </div>
      </div>

      {/* What This Means */}
      <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">
          Understanding AI Detection:
        </h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• This analysis checks for patterns typical of AI-generated code</li>
          <li>• Factors include comment style, variable naming, formatting, and code structure</li>
          <li>• A high score doesn't necessarily mean cheating - it indicates patterns for review</li>
          <li>• Your instructor may manually review submissions with elevated scores</li>
        </ul>
      </div>

      {/* Timestamp */}
      {detection.analyzedAt && (
        <div className="mt-3 text-xs text-gray-500 text-center">
          Analyzed on {new Date(detection.analyzedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default AIDetectionResults;
