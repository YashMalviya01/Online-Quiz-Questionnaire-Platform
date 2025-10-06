import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

const QuizConfiguration = ({ value, onChange }) => {
  const [config, setConfig] = useState({
    // Question Randomization
    randomizeQuestions: value?.randomizeQuestions || false,
    randomizeOptions: value?.randomizeOptions || false,

    // Question Pool
    enableQuestionPool: value?.enableQuestionPool || false,
    questionPoolSize: value?.questionPoolSize || 10,
    selectedQuestions: value?.selectedQuestions || [],

    // Adaptive Testing
    enableAdaptiveTesting: value?.enableAdaptiveTesting || false,
    adaptiveStartingDifficulty: value?.adaptiveStartingDifficulty || 'medium',
    adaptiveAdjustmentThreshold: value?.adaptiveAdjustmentThreshold || 0.7,
    adaptiveMinQuestions: value?.adaptiveMinQuestions || 5,
    adaptiveMaxQuestions: value?.adaptiveMaxQuestions || 20,
    adaptiveTerminationThreshold: value?.adaptiveTerminationThreshold || 0.95,

    // Enhanced Proctoring
    enableEyeTracking: value?.enableEyeTracking || false,
    enableAudioMonitoring: value?.enableAudioMonitoring || false,
    enableScreenRecording: value?.enableScreenRecording || false,
    enableKeystrokeAnalysis: value?.enableKeystrokeAnalysis || false,
    enableIdVerification: value?.enableIdVerification || false,
    enableBrowserLockdown: value?.enableBrowserLockdown || false,
    enableFaceDetection: value?.enableFaceDetection || false,
    enableNetworkMonitoring: value?.enableNetworkMonitoring || false,
    ipWhitelist: value?.ipWhitelist || [],
    blockVpn: value?.blockVpn || false,

    // Grading Settings
    passingScore: value?.passingScore || 60,
    allowPartialCredit: value?.allowPartialCredit !== false,
    gradeCurve: value?.gradeCurve || 'none',
    autoReleaseGrades: value?.autoReleaseGrades || false,
    showCorrectAnswers: value?.showCorrectAnswers || false,
    showFeedback: value?.showFeedback || true,
    gradeReleaseTiming: value?.gradeReleaseTiming || 'manual'
  });

  const [expandedSections, setExpandedSections] = useState({
    randomization: true,
    pool: false,
    adaptive: false,
    proctoring: false,
    grading: true
  });

  useEffect(() => {
    // Update parent component whenever config changes
    onChange(config);
  }, [config]);

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const updateConfig = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  const handleIpWhitelistChange = (text) => {
    const ips = text.split('\n').filter(ip => ip.trim() !== '');
    updateConfig('ipWhitelist', ips);
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all configuration to defaults?')) {
      setConfig({
        randomizeQuestions: false,
        randomizeOptions: false,
        enableQuestionPool: false,
        questionPoolSize: 10,
        selectedQuestions: [],
        enableAdaptiveTesting: false,
        adaptiveStartingDifficulty: 'medium',
        adaptiveAdjustmentThreshold: 0.7,
        adaptiveMinQuestions: 5,
        adaptiveMaxQuestions: 20,
        adaptiveTerminationThreshold: 0.95,
        enableEyeTracking: false,
        enableAudioMonitoring: false,
        enableScreenRecording: false,
        enableKeystrokeAnalysis: false,
        enableIdVerification: false,
        enableBrowserLockdown: false,
        enableFaceDetection: false,
        enableNetworkMonitoring: false,
        ipWhitelist: [],
        blockVpn: false,
        passingScore: 60,
        allowPartialCredit: true,
        gradeCurve: 'none',
        autoReleaseGrades: false,
        showCorrectAnswers: false,
        showFeedback: true,
        gradeReleaseTiming: 'manual'
      });
    }
  };

  const getProctoringCount = () => {
    return [
      config.enableEyeTracking,
      config.enableAudioMonitoring,
      config.enableScreenRecording,
      config.enableKeystrokeAnalysis,
      config.enableIdVerification,
      config.enableBrowserLockdown,
      config.enableFaceDetection,
      config.enableNetworkMonitoring
    ].filter(Boolean).length;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Quiz Configuration</h3>
          <p className="text-sm text-gray-600">Advanced settings for quiz behavior and security</p>
        </div>
        <Button variant="secondary" size="sm" onClick={resetToDefaults}>
          🔄 Reset to Defaults
        </Button>
      </div>

      {/* Question Randomization Section */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('randomization')}
          className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔀</span>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Question Randomization</h4>
              <p className="text-sm text-gray-600">Shuffle questions and answer options</p>
            </div>
          </div>
          <span className="text-gray-600">
            {expandedSections.randomization ? '▼' : '▶'}
          </span>
        </button>

        {expandedSections.randomization && (
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="randomizeQuestions"
                checked={config.randomizeQuestions}
                onChange={(e) => updateConfig('randomizeQuestions', e.target.checked)}
                className="mt-1"
              />
              <div>
                <label htmlFor="randomizeQuestions" className="text-sm font-medium text-gray-900 cursor-pointer">
                  Randomize Question Order
                </label>
                <p className="text-xs text-gray-600">
                  Each student will see questions in a different order
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="randomizeOptions"
                checked={config.randomizeOptions}
                onChange={(e) => updateConfig('randomizeOptions', e.target.checked)}
                className="mt-1"
              />
              <div>
                <label htmlFor="randomizeOptions" className="text-sm font-medium text-gray-900 cursor-pointer">
                  Randomize Answer Options
                </label>
                <p className="text-xs text-gray-600">
                  Shuffle multiple-choice answer options for each question
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Question Pool Section */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('pool')}
          className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎲</span>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Question Pool</h4>
              <p className="text-sm text-gray-600">Select random questions from a larger pool</p>
            </div>
          </div>
          <span className="text-gray-600">
            {expandedSections.pool ? '▼' : '▶'}
          </span>
        </button>

        {expandedSections.pool && (
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="enableQuestionPool"
                checked={config.enableQuestionPool}
                onChange={(e) => updateConfig('enableQuestionPool', e.target.checked)}
                className="mt-1"
              />
              <div>
                <label htmlFor="enableQuestionPool" className="text-sm font-medium text-gray-900 cursor-pointer">
                  Enable Question Pool
                </label>
                <p className="text-xs text-gray-600">
                  Randomly select questions from a larger set for each student
                </p>
              </div>
            </div>

            {config.enableQuestionPool && (
              <div className="ml-6 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Pool Size (Questions to Show)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={config.questionPoolSize}
                    onChange={(e) => updateConfig('questionPoolSize', parseInt(e.target.value))}
                    className="w-32 border border-gray-300 rounded px-3 py-2"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Each student will receive this many random questions
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm text-blue-800">
                    💡 Add questions to the pool from your question banks during quiz creation
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Adaptive Testing Section */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('adaptive')}
          className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Adaptive Testing</h4>
              <p className="text-sm text-gray-600">Adjust difficulty based on student performance</p>
            </div>
          </div>
          <span className="text-gray-600">
            {expandedSections.adaptive ? '▼' : '▶'}
          </span>
        </button>

        {expandedSections.adaptive && (
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="enableAdaptiveTesting"
                checked={config.enableAdaptiveTesting}
                onChange={(e) => updateConfig('enableAdaptiveTesting', e.target.checked)}
                className="mt-1"
              />
              <div>
                <label htmlFor="enableAdaptiveTesting" className="text-sm font-medium text-gray-900 cursor-pointer">
                  Enable Adaptive Testing
                </label>
                <p className="text-xs text-gray-600">
                  Dynamically adjust question difficulty based on student answers
                </p>
              </div>
            </div>

            {config.enableAdaptiveTesting && (
              <div className="ml-6 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Starting Difficulty
                  </label>
                  <select
                    value={config.adaptiveStartingDifficulty}
                    onChange={(e) => updateConfig('adaptiveStartingDifficulty', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Adjustment Threshold (0-1)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={config.adaptiveAdjustmentThreshold}
                    onChange={(e) => updateConfig('adaptiveAdjustmentThreshold', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Increase difficulty if accuracy &gt; threshold, decrease if below
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Min Questions
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={config.adaptiveMinQuestions}
                      onChange={(e) => updateConfig('adaptiveMinQuestions', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Max Questions
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={config.adaptiveMaxQuestions}
                      onChange={(e) => updateConfig('adaptiveMaxQuestions', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Termination Threshold (0-1)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={config.adaptiveTerminationThreshold}
                    onChange={(e) => updateConfig('adaptiveTerminationThreshold', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Stop early if confidence in skill level reaches this threshold
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Proctoring Section */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('proctoring')}
          className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">👁️</span>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Enhanced Proctoring</h4>
              <p className="text-sm text-gray-600">
                Anti-cheating monitoring systems ({getProctoringCount()}/8 enabled)
              </p>
            </div>
          </div>
          <span className="text-gray-600">
            {expandedSections.proctoring ? '▼' : '▶'}
          </span>
        </button>

        {expandedSections.proctoring && (
          <div className="px-6 py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="enableEyeTracking"
                  checked={config.enableEyeTracking}
                  onChange={(e) => updateConfig('enableEyeTracking', e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="enableEyeTracking" className="text-sm font-medium text-gray-900 cursor-pointer">
                    👁️ Eye Tracking
                  </label>
                  <p className="text-xs text-gray-600">Monitor where student is looking</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="enableAudioMonitoring"
                  checked={config.enableAudioMonitoring}
                  onChange={(e) => updateConfig('enableAudioMonitoring', e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="enableAudioMonitoring" className="text-sm font-medium text-gray-900 cursor-pointer">
                    🔊 Audio Monitoring
                  </label>
                  <p className="text-xs text-gray-600">Detect suspicious sounds</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="enableScreenRecording"
                  checked={config.enableScreenRecording}
                  onChange={(e) => updateConfig('enableScreenRecording', e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="enableScreenRecording" className="text-sm font-medium text-gray-900 cursor-pointer">
                    🖥️ Screen Recording
                  </label>
                  <p className="text-xs text-gray-600">Record student's screen</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="enableKeystrokeAnalysis"
                  checked={config.enableKeystrokeAnalysis}
                  onChange={(e) => updateConfig('enableKeystrokeAnalysis', e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="enableKeystrokeAnalysis" className="text-sm font-medium text-gray-900 cursor-pointer">
                    ⌨️ Keystroke Analysis
                  </label>
                  <p className="text-xs text-gray-600">Detect copy-paste behavior</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="enableIdVerification"
                  checked={config.enableIdVerification}
                  onChange={(e) => updateConfig('enableIdVerification', e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="enableIdVerification" className="text-sm font-medium text-gray-900 cursor-pointer">
                    🪪 ID Verification
                  </label>
                  <p className="text-xs text-gray-600">Verify student identity</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="enableBrowserLockdown"
                  checked={config.enableBrowserLockdown}
                  onChange={(e) => updateConfig('enableBrowserLockdown', e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="enableBrowserLockdown" className="text-sm font-medium text-gray-900 cursor-pointer">
                    🔒 Browser Lockdown
                  </label>
                  <p className="text-xs text-gray-600">Restrict tab switching</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="enableFaceDetection"
                  checked={config.enableFaceDetection}
                  onChange={(e) => updateConfig('enableFaceDetection', e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="enableFaceDetection" className="text-sm font-medium text-gray-900 cursor-pointer">
                    👤 Face Detection
                  </label>
                  <p className="text-xs text-gray-600">Ensure student is present</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="enableNetworkMonitoring"
                  checked={config.enableNetworkMonitoring}
                  onChange={(e) => updateConfig('enableNetworkMonitoring', e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="enableNetworkMonitoring" className="text-sm font-medium text-gray-900 cursor-pointer">
                    🌐 Network Monitoring
                  </label>
                  <p className="text-xs text-gray-600">Track network activity</p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  IP Whitelist (one per line)
                </label>
                <textarea
                  value={config.ipWhitelist.join('\n')}
                  onChange={(e) => handleIpWhitelistChange(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-sm"
                  rows={4}
                  placeholder="192.168.1.1&#10;10.0.0.1&#10;172.16.0.1"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Only allow quiz access from these IP addresses (optional)
                </p>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="blockVpn"
                  checked={config.blockVpn}
                  onChange={(e) => updateConfig('blockVpn', e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="blockVpn" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Block VPN/Proxy Connections
                  </label>
                  <p className="text-xs text-gray-600">
                    Prevent students from using VPN or proxy servers
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grading Settings Section */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('grading')}
          className="w-full px-6 py-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <div className="text-left">
              <h4 className="font-semibold text-gray-900">Grading Settings</h4>
              <p className="text-sm text-gray-600">Configure scoring and result display</p>
            </div>
          </div>
          <span className="text-gray-600">
            {expandedSections.grading ? '▼' : '▶'}
          </span>
        </button>

        {expandedSections.grading && (
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Passing Score (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={config.passingScore}
                onChange={(e) => updateConfig('passingScore', parseInt(e.target.value))}
                className="w-32 border border-gray-300 rounded px-3 py-2"
              />
              <p className="text-xs text-gray-600 mt-1">
                Minimum score required to pass the quiz
              </p>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="allowPartialCredit"
                checked={config.allowPartialCredit}
                onChange={(e) => updateConfig('allowPartialCredit', e.target.checked)}
                className="mt-1"
              />
              <div>
                <label htmlFor="allowPartialCredit" className="text-sm font-medium text-gray-900 cursor-pointer">
                  Allow Partial Credit
                </label>
                <p className="text-xs text-gray-600">
                  Award points for partially correct answers (fill-in-blank, matching)
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Grade Curve
              </label>
              <select
                value={config.gradeCurve}
                onChange={(e) => updateConfig('gradeCurve', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="none">None (Raw Scores)</option>
                <option value="linear">Linear Curve</option>
                <option value="bell-curve">Bell Curve (Normal Distribution)</option>
              </select>
              <p className="text-xs text-gray-600 mt-1">
                Apply a curve to adjust final scores
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t">
              <h5 className="font-medium text-gray-900">Student Result Display</h5>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Release Timing
                </label>
                <select
                  value={config.gradeReleaseTiming}
                  onChange={(e) => updateConfig('gradeReleaseTiming', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="immediate">Immediately After Submission</option>
                  <option value="after-deadline">After Quiz Deadline</option>
                  <option value="manual">Manual Release by Instructor</option>
                </select>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="autoReleaseGrades"
                  checked={config.autoReleaseGrades}
                  onChange={(e) => updateConfig('autoReleaseGrades', e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="autoReleaseGrades" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Auto-Release Grades
                  </label>
                  <p className="text-xs text-gray-600">
                    Automatically release grades based on timing setting above
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="showCorrectAnswers"
                  checked={config.showCorrectAnswers}
                  onChange={(e) => updateConfig('showCorrectAnswers', e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="showCorrectAnswers" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Show Correct Answers
                  </label>
                  <p className="text-xs text-gray-600">
                    Display correct answers to students after submission
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="showFeedback"
                  checked={config.showFeedback}
                  onChange={(e) => updateConfig('showFeedback', e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="showFeedback" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Show Feedback
                  </label>
                  <p className="text-xs text-gray-600">
                    Display instructor feedback and explanations
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Configuration Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-800">
          <div>
            <p className="font-medium">Randomization</p>
            <p>{config.randomizeQuestions || config.randomizeOptions ? 'Enabled' : 'Disabled'}</p>
          </div>
          <div>
            <p className="font-medium">Question Pool</p>
            <p>{config.enableQuestionPool ? `${config.questionPoolSize} questions` : 'Disabled'}</p>
          </div>
          <div>
            <p className="font-medium">Proctoring</p>
            <p>{getProctoringCount()} systems enabled</p>
          </div>
          <div>
            <p className="font-medium">Passing Score</p>
            <p>{config.passingScore}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizConfiguration;
