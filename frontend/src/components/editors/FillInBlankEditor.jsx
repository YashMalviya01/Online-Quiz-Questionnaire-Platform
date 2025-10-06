import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

const FillInBlankEditor = ({ value, onChange, maxScore }) => {
  const [questionText, setQuestionText] = useState(value?.questionText || '');
  const [acceptableAnswers, setAcceptableAnswers] = useState(value?.acceptableAnswers || ['']);
  const [caseSensitive, setCaseSensitive] = useState(value?.caseSensitive || false);
  const [partialCredit, setPartialCredit] = useState(value?.partialCredit || false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // Update parent component with current values
    onChange({
      questionText,
      acceptableAnswers: acceptableAnswers.filter(a => a.trim() !== ''),
      caseSensitive,
      partialCredit,
      type: 'fill-in-blank'
    });
  }, [questionText, acceptableAnswers, caseSensitive, partialCredit]);

  const handleAddAnswer = () => {
    setAcceptableAnswers([...acceptableAnswers, '']);
  };

  const handleRemoveAnswer = (index) => {
    if (acceptableAnswers.length > 1) {
      const newAnswers = acceptableAnswers.filter((_, i) => i !== index);
      setAcceptableAnswers(newAnswers);
    }
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...acceptableAnswers];
    newAnswers[index] = value;
    setAcceptableAnswers(newAnswers);
  };

  const insertBlank = () => {
    const textarea = document.getElementById('fillInBlankText');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = questionText;
      const before = text.substring(0, start);
      const after = text.substring(end);
      setQuestionText(before + '[blank]' + after);
      
      // Set cursor position after [blank]
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 7, start + 7);
      }, 0);
    }
  };

  const getPreviewText = () => {
    return questionText.replace(/\[blank\]/g, '______');
  };

  const countBlanks = () => {
    return (questionText.match(/\[blank\]/g) || []).length;
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">📝 Fill-in-the-Blank Instructions</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Type your question and use [blank] to mark where students should fill in answers</li>
          <li>• You can use the "Insert [blank]" button to add blanks at cursor position</li>
          <li>• Provide multiple acceptable answers (separated by adding more answers below)</li>
          <li>• Enable case sensitivity if capitalization matters</li>
          <li>• Enable partial credit to award points for correct answers when multiple blanks exist</li>
        </ul>
      </div>

      {/* Question Text */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Question Text with [blank] markers *
          </label>
          <Button variant="secondary" size="sm" onClick={insertBlank}>
            ➕ Insert [blank]
          </Button>
        </div>
        <textarea
          id="fillInBlankText"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 font-mono"
          rows={6}
          placeholder="Example: The capital of France is [blank], which is known as the [blank] of Lights."
          required
        />
        <div className="mt-2 flex justify-between items-center text-sm">
          <span className="text-gray-600">
            Blanks detected: <span className="font-semibold text-orange-600">{countBlanks()}</span>
          </span>
          <Button variant="secondary" size="sm" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? '📝 Edit' : '👁️ Preview'}
          </Button>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Preview (Student View):</h4>
          <p className="text-gray-800 whitespace-pre-wrap">{getPreviewText()}</p>
        </div>
      )}

      {/* Acceptable Answers */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Acceptable Answers * ({acceptableAnswers.filter(a => a.trim()).length} defined)
        </label>
        <div className="space-y-3">
          {acceptableAnswers.map((answer, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2"
                placeholder={`Acceptable answer ${index + 1} (e.g., Paris)`}
                required
              />
              {acceptableAnswers.length > 1 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleRemoveAnswer(index)}
                  className="text-red-600 hover:bg-red-50"
                >
                  ❌
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button variant="secondary" size="sm" onClick={handleAddAnswer} className="mt-3">
          ➕ Add Alternative Answer
        </Button>
        <p className="text-xs text-gray-600 mt-2">
          💡 Add multiple acceptable answers if different phrasings are correct (e.g., "USA", "United States", "America")
        </p>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-gray-900 mb-3">Grading Options</h4>
          
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="caseSensitive"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="mt-1"
            />
            <div>
              <label htmlFor="caseSensitive" className="text-sm font-medium text-gray-900 cursor-pointer">
                Case Sensitive
              </label>
              <p className="text-xs text-gray-600">
                If enabled, "Paris" and "paris" will be considered different answers
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="partialCredit"
              checked={partialCredit}
              onChange={(e) => setPartialCredit(e.target.checked)}
              className="mt-1"
            />
            <div>
              <label htmlFor="partialCredit" className="text-sm font-medium text-gray-900 cursor-pointer">
                Allow Partial Credit
              </label>
              <p className="text-xs text-gray-600">
                Award points proportionally when multiple blanks exist (e.g., 2/3 correct = {((maxScore || 10) * 2/3).toFixed(1)} points)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Warning */}
      {countBlanks() === 0 && questionText.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ No [blank] markers found in your question. Add at least one [blank] to mark where students should answer.
          </p>
        </div>
      )}

      {acceptableAnswers.filter(a => a.trim()).length === 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">
            ⚠️ No acceptable answers defined. Add at least one acceptable answer.
          </p>
        </div>
      )}

      {/* Example */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">✨ Example Question:</h4>
        <p className="text-sm text-green-800 mb-2">
          "The ____ is the largest planet in our solar system."
        </p>
        <p className="text-xs text-green-700">
          Acceptable answers: "Jupiter", "jupiter" (if case insensitive)
        </p>
      </div>
    </div>
  );
};

export default FillInBlankEditor;
