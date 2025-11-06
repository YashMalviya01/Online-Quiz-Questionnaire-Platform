import React, { useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  Code, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Loader,
  Save,
  Eye,
  RefreshCw
} from 'lucide-react';
import api from '../services/apiClient';

const AIQuizGenerator = ({ onQuestionsGenerated, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [aiAvailable, setAIAvailable] = useState(true);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const [formData, setFormData] = useState({
    topic: '',
    customPrompt: '',
    questionType: 'multiple-choice',
    difficulty: 'medium',
    count: 5,
    language: 'javascript',
    category: '',
    saveToBank: false
  });

  // Check AI availability on mount
  React.useEffect(() => {
    // Ensure auth token is set before making API call
    const token = localStorage.getItem('qp_token');
    if (token && !api.defaults.headers.common.Authorization) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    checkAIAvailability();
  }, []);

  const checkAIAvailability = async () => {
    try {
      const token = localStorage.getItem('qp_token');
      if (!token) {
        setAIAvailable(false);
        setError('Please log in to use AI features');
        return;
      }

      const response = await api.get('/api/ai-quiz/check-availability', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAIAvailable(response.data.available);
      if (!response.data.available) {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error checking AI availability:', err);
      setAIAvailable(false);
      setError('Failed to check AI availability. Please try logging in again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateQuestions = async () => {
    // Validate: custom prompt must be provided
    if (!formData.customPrompt.trim()) {
      setError('Please provide a custom prompt describing what questions you want to generate');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setProgress({ current: 0, total: parseInt(formData.count) });

    // Simulate progress updates during generation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev.current < prev.total) {
          return { ...prev, current: prev.current + 1 };
        }
        return prev;
      });
    }, 15000); // Update every 15 seconds (rough estimate per question)

    try {
      let endpoint = '';
      const payload = {
        difficulty: formData.difficulty,
        count: parseInt(formData.count),
        saveToBank: formData.saveToBank,
        category: formData.category || 'AI-Generated',
        customPrompt: formData.customPrompt.trim(),
        language: formData.language
      };

      switch (formData.questionType) {
        case 'multiple-choice':
          endpoint = '/api/ai-quiz/generate/multiple-choice';
          break;
        case 'true-false':
          endpoint = '/api/ai-quiz/generate/true-false';
          break;
        case 'fill-in-the-blank':
          endpoint = '/api/ai-quiz/generate/fill-in-the-blank';
          break;
        case 'code':
          endpoint = '/api/ai-quiz/generate/coding';
          break;
        case 'mixed':
          endpoint = '/api/ai-quiz/generate/mixed';
          break;
        default:
          throw new Error('Invalid question type');
      }

      const token = localStorage.getItem('qp_token');
      if (!token) {
        setError('Please log in to use AI features');
        setLoading(false);
        return;
      }

      // Use longer timeout for mixed questions (multiple AI calls)
      const timeoutDuration = formData.questionType === 'mixed' ? 300000 : 180000; // 5 min for mixed, 3 min for others

      const response = await api.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: timeoutDuration
      });
      
      setGeneratedQuestions(response.data.questions);
      setSuccess(response.data.message);

      if (onQuestionsGenerated) {
        onQuestionsGenerated(response.data.questions);
      }

    } catch (err) {
      console.error('Error generating questions:', err);
      let errorMessage = 'Failed to generate questions';
      
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        errorMessage = 'Generation is taking longer than expected. Please try with fewer questions or a simpler topic.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.details) {
        errorMessage = err.response.data.details;
      }
      
      // Add helpful suggestions based on error
      if (errorMessage.includes('empty response') || errorMessage.includes('parse JSON')) {
        errorMessage += '\n\nTips:\n• Try reducing the number of questions (start with 2-3)\n• Use simpler topics\n• For coding questions, try topics like "JavaScript Arrays" or "Functions"';
      }
      
      setError(errorMessage);
    } finally {
      clearInterval(progressInterval);
      setProgress({ current: parseInt(formData.count), total: parseInt(formData.count) });
      setLoading(false);
    }
  };

  const handleSaveToBank = async () => {
    setLoading(true);
    setError(null);

    try {
      // Re-generate with saveToBank=true
      await generateQuestions();
      setSuccess('Questions saved to question bank successfully!');
    } catch (err) {
      setError('Failed to save questions to bank');
    } finally {
      setLoading(false);
    }
  };

  if (!aiAvailable) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-900">AI Service Not Available</h3>
          </div>
          <p className="text-yellow-800 mb-4">
            The question generation service is not currently available. Please contact your administrator or try again later.
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full my-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-lg">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-white" />
          <div>
            <h2 className="text-2xl font-bold text-white">Question Generator</h2>
            <p className="text-purple-100 text-sm">Generate questions from our comprehensive question bank</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Info Message */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Note:</span> Provide a <strong>Custom Prompt</strong> to describe what questions you want to generate.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Programming Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Programming Language
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          {/* Custom Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Prompt <span className="text-red-500">*</span>
            </label>
            <textarea
              name="customPrompt"
              value={formData.customPrompt}
              onChange={handleInputChange}
              placeholder="e.g., Generate questions about React Hooks focusing on useState and useEffect, include practical examples..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Describe the topic and specific requirements for the questions you want to generate.
            </p>
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { value: 'multiple-choice', label: 'Multiple Choice', icon: CheckCircle },
                { value: 'true-false', label: 'True/False', icon: CheckCircle },
                { value: 'fill-in-the-blank', label: 'Fill in the Blank', icon: FileText },
                { value: 'code', label: 'Coding', icon: Code },
                { value: 'mixed', label: 'Mixed', icon: Brain }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, questionType: value }))}
                  className={`p-3 rounded-lg border-2 transition flex items-center gap-2 ${
                    formData.questionType === value
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Count */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                name="count"
                value={formData.count}
                onChange={handleInputChange}
                min="1"
                max={formData.questionType === 'code' || formData.questionType === 'essay' ? '10' : '20'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Save to Bank */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="saveToBank"
              id="saveToBank"
              checked={formData.saveToBank}
              onChange={handleInputChange}
              className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
            />
            <label htmlFor="saveToBank" className="text-sm text-gray-700">
              Save generated questions to question bank
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={generateQuestions}
            disabled={loading || !formData.customPrompt.trim()}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>
                  Generating {progress.current > 0 ? `${progress.current}/${progress.total} questions` : 'questions'} 
                  {' '}(this may take {formData.questionType === 'mixed' ? 'up to 5 minutes' : 'up to 3 minutes'})...
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Questions
              </>
            )}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Close
            </button>
          )}
        </div>

        {/* Generated Questions Preview */}
        {generatedQuestions.length > 0 && (
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Generated Questions ({generatedQuestions.length})
              </h3>
              {!formData.saveToBank && (
                <button
                  onClick={handleSaveToBank}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm"
                >
                  <Save className="w-4 h-4" />
                  Save to Bank
                </button>
              )}
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {generatedQuestions.map((question, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-semibold text-purple-600 uppercase">
                      {question.questionType}
                    </span>
                    <span className="text-xs text-gray-500">
                      {question.difficulty} • {question.points || 10} pts
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium mb-2">{question.questionText}</p>
                  
                  {question.options && (
                    <ul className="space-y-1 text-sm text-gray-700">
                      {question.options.map((option, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
                            question.correctAnswer === i
                              ? 'bg-green-100 text-green-700 font-semibold'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          {option}
                        </li>
                      ))}
                    </ul>
                  )}

                  {question.tags && question.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {question.tags.slice(0, 5).map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default AIQuizGenerator;
