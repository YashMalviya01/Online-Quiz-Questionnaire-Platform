import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

const MatchingEditor = ({ value, onChange, maxScore }) => {
  const [pairs, setPairs] = useState(value?.pairs || [
    { left: '', right: '', id: Date.now() }
  ]);
  const [partialCredit, setPartialCredit] = useState(value?.partialCredit !== false);
  const [shuffleRight, setShuffleRight] = useState(value?.shuffleRight !== false);

  useEffect(() => {
    // Update parent component with current values
    onChange({
      pairs: pairs.filter(p => p.left.trim() !== '' && p.right.trim() !== ''),
      partialCredit,
      shuffleRight,
      type: 'matching'
    });
  }, [pairs, partialCredit, shuffleRight]);

  const handleAddPair = () => {
    setPairs([...pairs, { left: '', right: '', id: Date.now() }]);
  };

  const handleRemovePair = (id) => {
    if (pairs.length > 1) {
      setPairs(pairs.filter(p => p.id !== id));
    }
  };

  const handlePairChange = (id, field, value) => {
    setPairs(pairs.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      const newPairs = [...pairs];
      [newPairs[index - 1], newPairs[index]] = [newPairs[index], newPairs[index - 1]];
      setPairs(newPairs);
    }
  };

  const handleMoveDown = (index) => {
    if (index < pairs.length - 1) {
      const newPairs = [...pairs];
      [newPairs[index], newPairs[index + 1]] = [newPairs[index + 1], newPairs[index]];
      setPairs(newPairs);
    }
  };

  const getValidPairsCount = () => {
    return pairs.filter(p => p.left.trim() !== '' && p.right.trim() !== '').length;
  };

  const calculatePartialCreditExample = () => {
    const validPairs = getValidPairsCount();
    if (validPairs === 0) return '0';
    const pointsPerPair = (maxScore || 10) / validPairs;
    return pointsPerPair.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">🔗 Matching Question Instructions</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Create pairs by entering items in the left and right columns</li>
          <li>• Left column items will be shown in order (or shuffled if desired)</li>
          <li>• Right column items will be shuffled for students to match</li>
          <li>• Use the arrow buttons to reorder pairs</li>
          <li>• Partial credit awards points for each correct match</li>
        </ul>
      </div>

      {/* Pairs */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Matching Pairs * ({getValidPairsCount()} defined)
          </label>
          <Button variant="secondary" size="sm" onClick={handleAddPair}>
            ➕ Add Pair
          </Button>
        </div>

        <div className="space-y-3">
          {/* Header */}
          <div className="grid grid-cols-12 gap-3 text-sm font-medium text-gray-700 px-2">
            <div className="col-span-5">Left Item (Prompt)</div>
            <div className="col-span-5">Right Item (Answer)</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

          {/* Pairs List */}
          {pairs.map((pair, index) => (
            <div key={pair.id} className="grid grid-cols-12 gap-3 items-start">
              {/* Left Input */}
              <div className="col-span-5">
                <input
                  type="text"
                  value={pair.left}
                  onChange={(e) => handlePairChange(pair.id, 'left', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder={`Left item ${index + 1} (e.g., France)`}
                  required
                />
              </div>

              {/* Arrow */}
              <div className="col-span-0 flex items-center justify-center pt-2">
                <span className="text-gray-400">→</span>
              </div>

              {/* Right Input */}
              <div className="col-span-5">
                <input
                  type="text"
                  value={pair.right}
                  onChange={(e) => handlePairChange(pair.id, 'right', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder={`Right item ${index + 1} (e.g., Paris)`}
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="col-span-2 flex gap-1 pt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  title="Move up"
                  className="text-xs px-2"
                >
                  ↑
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === pairs.length - 1}
                  title="Move down"
                  className="text-xs px-2"
                >
                  ↓
                </Button>
                {pairs.length > 1 && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRemovePair(pair.id)}
                    className="text-red-600 hover:bg-red-50 text-xs px-2"
                    title="Remove"
                  >
                    ❌
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-600 mt-2">
          💡 Tip: The right column items will be shuffled when shown to students
        </p>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-gray-900 mb-3">Display & Grading Options</h4>
          
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="shuffleRight"
              checked={shuffleRight}
              onChange={(e) => setShuffleRight(e.target.checked)}
              className="mt-1"
            />
            <div>
              <label htmlFor="shuffleRight" className="text-sm font-medium text-gray-900 cursor-pointer">
                Shuffle Right Column
              </label>
              <p className="text-xs text-gray-600">
                Randomize the order of right column items for each student (recommended)
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
                Award points for each correct match ({calculatePartialCreditExample()} points per pair)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      {getValidPairsCount() > 0 && (
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Preview (Student View):</h4>
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Match these items:</h5>
              <div className="space-y-2">
                {pairs.filter(p => p.left.trim() !== '').map((pair, index) => (
                  <div key={index} className="bg-white border border-gray-300 rounded px-3 py-2">
                    {index + 1}. {pair.left}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (Shuffled Preview) */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">With these answers:</h5>
              <div className="space-y-2">
                {pairs
                  .filter(p => p.right.trim() !== '')
                  .sort(() => Math.random() - 0.5)
                  .map((pair, index) => (
                    <div key={index} className="bg-white border border-gray-300 rounded px-3 py-2 flex items-center gap-2">
                      <select className="text-sm border border-gray-300 rounded px-2 py-1">
                        <option value="">Select...</option>
                        {pairs.filter(p => p.left.trim() !== '').map((p, i) => (
                          <option key={i} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                      <span>{pair.right}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Warning */}
      {getValidPairsCount() < 2 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ Add at least 2 complete pairs to create a matching question
          </p>
        </div>
      )}

      {/* Example */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">✨ Example Question:</h4>
        <div className="text-sm text-green-800 space-y-1">
          <p><strong>Left:</strong> France → <strong>Right:</strong> Paris</p>
          <p><strong>Left:</strong> Spain → <strong>Right:</strong> Madrid</p>
          <p><strong>Left:</strong> Germany → <strong>Right:</strong> Berlin</p>
        </div>
      </div>
    </div>
  );
};

export default MatchingEditor;
