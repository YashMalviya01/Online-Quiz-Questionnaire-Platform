import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

const EssayEditor = ({ value, onChange, maxScore }) => {
  const [wordLimitMin, setWordLimitMin] = useState(value?.wordLimitMin || 0);
  const [wordLimitMax, setWordLimitMax] = useState(value?.wordLimitMax || 0);
  const [rubric, setRubric] = useState(value?.rubric || []);
  const [sampleAnswer, setSampleAnswer] = useState(value?.sampleAnswer || '');
  const [gradingGuidelines, setGradingGuidelines] = useState(value?.gradingGuidelines || '');
  const [useRubric, setUseRubric] = useState(value?.rubric?.length > 0);

  useEffect(() => {
    // Update parent component with current values
    onChange({
      wordLimitMin: parseInt(wordLimitMin) || 0,
      wordLimitMax: parseInt(wordLimitMax) || 0,
      rubric: useRubric ? rubric.filter(r => r.criteria.trim() !== '') : [],
      sampleAnswer,
      gradingGuidelines,
      type: 'essay'
    });
  }, [wordLimitMin, wordLimitMax, rubric, sampleAnswer, gradingGuidelines, useRubric]);

  const handleAddCriteria = () => {
    const remainingPoints = (maxScore || 10) - rubric.reduce((sum, r) => sum + (parseFloat(r.maxScore) || 0), 0);
    setRubric([
      ...rubric,
      {
        id: Date.now(),
        criteria: '',
        description: '',
        maxScore: remainingPoints > 0 ? remainingPoints : 1
      }
    ]);
  };

  const handleRemoveCriteria = (id) => {
    if (rubric.length > 1) {
      setRubric(rubric.filter(r => r.id !== id));
    }
  };

  const handleCriteriaChange = (id, field, value) => {
    setRubric(rubric.map(r =>
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const getTotalRubricPoints = () => {
    return rubric.reduce((sum, r) => sum + (parseFloat(r.maxScore) || 0), 0);
  };

  const getRubricValidation = () => {
    const total = getTotalRubricPoints();
    if (total > (maxScore || 10)) {
      return { valid: false, message: `Rubric total (${total}) exceeds max score (${maxScore || 10})` };
    }
    if (total < (maxScore || 10)) {
      return { valid: false, message: `Rubric total (${total}) is less than max score (${maxScore || 10})` };
    }
    return { valid: true, message: `Rubric total matches max score (${total})` };
  };

  const getWordLimitText = () => {
    if (wordLimitMin > 0 && wordLimitMax > 0) {
      return `${wordLimitMin}-${wordLimitMax} words`;
    } else if (wordLimitMin > 0) {
      return `Minimum ${wordLimitMin} words`;
    } else if (wordLimitMax > 0) {
      return `Maximum ${wordLimitMax} words`;
    }
    return 'No word limit';
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">📝 Essay Question Instructions</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Set word limits to guide student responses (optional)</li>
          <li>• Create a grading rubric with multiple criteria for consistent evaluation</li>
          <li>• Provide a sample answer to guide graders</li>
          <li>• Add grading guidelines with key points to look for</li>
          <li>• Essay questions require manual grading by instructors</li>
        </ul>
      </div>

      {/* Word Limits */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Word Limits</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Minimum Words (optional)
            </label>
            <input
              type="number"
              min="0"
              value={wordLimitMin}
              onChange={(e) => setWordLimitMin(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Maximum Words (optional)
            </label>
            <input
              type="number"
              min="0"
              value={wordLimitMax}
              onChange={(e) => setWordLimitMax(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="0"
            />
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Current setting: <span className="font-medium">{getWordLimitText()}</span>
        </p>
      </div>

      {/* Rubric Toggle */}
      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
        <input
          type="checkbox"
          id="useRubric"
          checked={useRubric}
          onChange={(e) => setUseRubric(e.target.checked)}
        />
        <div>
          <label htmlFor="useRubric" className="text-sm font-medium text-gray-900 cursor-pointer">
            Use Grading Rubric
          </label>
          <p className="text-xs text-gray-600">
            Break down grading into specific criteria for more consistent evaluation
          </p>
        </div>
      </div>

      {/* Rubric Builder */}
      {useRubric && (
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium text-gray-900">
              Grading Rubric ({rubric.length} criteria)
            </h4>
            <Button variant="secondary" size="sm" onClick={handleAddCriteria}>
              ➕ Add Criteria
            </Button>
          </div>

          {rubric.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm">No criteria added yet. Click "Add Criteria" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rubric.map((criteria, index) => (
                <div key={criteria.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="text-sm font-medium text-gray-900">
                      Criteria {index + 1}
                    </h5>
                    {rubric.length > 1 && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRemoveCriteria(criteria.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        ❌ Remove
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-700 mb-1">
                        Criteria Name *
                      </label>
                      <input
                        type="text"
                        value={criteria.criteria}
                        onChange={(e) => handleCriteriaChange(criteria.id, 'criteria', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="e.g., Thesis Statement, Supporting Evidence, Grammar"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={criteria.description}
                        onChange={(e) => handleCriteriaChange(criteria.id, 'description', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        rows={2}
                        placeholder="What to look for in this criteria..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-700 mb-1">
                        Max Points *
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={maxScore || 10}
                        step="0.5"
                        value={criteria.maxScore}
                        onChange={(e) => handleCriteriaChange(criteria.id, 'maxScore', e.target.value)}
                        className="w-32 border border-gray-300 rounded px-3 py-2"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Rubric Total */}
          <div className={`mt-4 p-3 rounded-lg ${
            getRubricValidation().valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">Rubric Total:</span>
              <span className={`text-lg font-bold ${
                getRubricValidation().valid ? 'text-green-600' : 'text-red-600'
              }`}>
                {getTotalRubricPoints()} / {maxScore || 10} points
              </span>
            </div>
            <p className={`text-xs mt-1 ${
              getRubricValidation().valid ? 'text-green-700' : 'text-red-700'
            }`}>
              {getRubricValidation().message}
            </p>
          </div>
        </div>
      )}

      {/* Sample Answer */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Sample Answer (for graders)
        </label>
        <textarea
          value={sampleAnswer}
          onChange={(e) => setSampleAnswer(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          rows={6}
          placeholder="Provide an exemplary answer that demonstrates what you're looking for. This will only be visible to instructors grading the essay."
        />
        <p className="text-xs text-gray-600 mt-1">
          Word count: {sampleAnswer.split(/\s+/).filter(w => w.length > 0).length}
        </p>
      </div>

      {/* Grading Guidelines */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Grading Guidelines
        </label>
        <textarea
          value={gradingGuidelines}
          onChange={(e) => setGradingGuidelines(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          rows={4}
          placeholder="Key points to look for when grading:&#10;• Clear thesis statement&#10;• Well-supported arguments&#10;• Proper grammar and spelling&#10;• Logical flow of ideas"
        />
        <p className="text-xs text-gray-600 mt-1">
          These guidelines will be shown to instructors during grading
        </p>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Preview (Student View):</h4>
        <div className="bg-white border border-gray-300 rounded p-4">
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={8}
            placeholder="Student will type their essay here..."
            disabled
          />
          {(wordLimitMin > 0 || wordLimitMax > 0) && (
            <p className="text-xs text-gray-600 mt-2">
              Word limit: {getWordLimitText()}
            </p>
          )}
        </div>
      </div>

      {/* Example */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">✨ Example Essay Question:</h4>
        <p className="text-sm text-green-800 mb-2">
          "Discuss the impact of social media on modern communication. (300-500 words)"
        </p>
        <div className="text-xs text-green-700 space-y-1">
          <p><strong>Rubric:</strong></p>
          <p>• Thesis and Arguments (4 pts)</p>
          <p>• Supporting Evidence (3 pts)</p>
          <p>• Grammar and Style (3 pts)</p>
        </div>
      </div>
    </div>
  );
};

export default EssayEditor;
