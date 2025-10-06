import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

const FileUploadEditor = ({ value, onChange, maxScore }) => {
  const [allowedFileTypes, setAllowedFileTypes] = useState(value?.allowedFileTypes || []);
  const [maxFileSize, setMaxFileSize] = useState(value?.maxFileSize || 5);
  const [maxFiles, setMaxFiles] = useState(value?.maxFiles || 1);
  const [instructions, setInstructions] = useState(value?.instructions || '');
  const [rubric, setRubric] = useState(value?.rubric || []);
  const [useRubric, setUseRubric] = useState(value?.rubric?.length > 0);

  const availableFileTypes = [
    { value: 'pdf', label: 'PDF (.pdf)', icon: '📄' },
    { value: 'doc', label: 'Word (.doc, .docx)', icon: '📝' },
    { value: 'image', label: 'Images (.jpg, .png, .gif)', icon: '🖼️' },
    { value: 'video', label: 'Videos (.mp4, .mov, .avi)', icon: '🎬' },
    { value: 'audio', label: 'Audio (.mp3, .wav)', icon: '🎵' },
    { value: 'zip', label: 'Archives (.zip, .rar)', icon: '📦' },
    { value: 'code', label: 'Code (.js, .py, .java, .cpp)', icon: '💻' },
    { value: 'excel', label: 'Spreadsheets (.xls, .xlsx)', icon: '📊' },
    { value: 'ppt', label: 'Presentations (.ppt, .pptx)', icon: '📽️' },
    { value: 'txt', label: 'Text Files (.txt)', icon: '📃' }
  ];

  useEffect(() => {
    // Update parent component with current values
    onChange({
      allowedFileTypes,
      maxFileSize: parseFloat(maxFileSize) || 5,
      maxFiles: parseInt(maxFiles) || 1,
      instructions,
      rubric: useRubric ? rubric.filter(r => r.criteria.trim() !== '') : [],
      type: 'file-upload'
    });
  }, [allowedFileTypes, maxFileSize, maxFiles, instructions, rubric, useRubric]);

  const toggleFileType = (type) => {
    if (allowedFileTypes.includes(type)) {
      setAllowedFileTypes(allowedFileTypes.filter(t => t !== type));
    } else {
      setAllowedFileTypes([...allowedFileTypes, type]);
    }
  };

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

  const getFileTypeExtensions = (type) => {
    const extensions = {
      pdf: '.pdf',
      doc: '.doc, .docx',
      image: '.jpg, .jpeg, .png, .gif, .bmp',
      video: '.mp4, .mov, .avi, .wmv',
      audio: '.mp3, .wav, .ogg',
      zip: '.zip, .rar, .7z',
      code: '.js, .py, .java, .cpp, .c, .html, .css',
      excel: '.xls, .xlsx, .csv',
      ppt: '.ppt, .pptx',
      txt: '.txt'
    };
    return extensions[type] || '';
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">📎 File Upload Question Instructions</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Select which file types students are allowed to upload</li>
          <li>• Set maximum file size to prevent large uploads</li>
          <li>• Specify how many files students can submit</li>
          <li>• Provide clear instructions on what to upload</li>
          <li>• Create a rubric for consistent grading of submissions</li>
        </ul>
      </div>

      {/* Allowed File Types */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Allowed File Types * ({allowedFileTypes.length} selected)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableFileTypes.map((fileType) => (
            <div
              key={fileType.value}
              className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                allowedFileTypes.includes(fileType.value)
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              onClick={() => toggleFileType(fileType.value)}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={allowedFileTypes.includes(fileType.value)}
                  onChange={() => toggleFileType(fileType.value)}
                  className="pointer-events-none"
                />
                <span className="text-2xl">{fileType.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{fileType.label}</p>
                  <p className="text-xs text-gray-600">{getFileTypeExtensions(fileType.value)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {allowedFileTypes.length === 0 && (
          <p className="text-xs text-red-600 mt-2">
            ⚠️ Please select at least one allowed file type
          </p>
        )}
      </div>

      {/* File Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Max File Size (MB) *
          </label>
          <input
            type="number"
            min="0.1"
            max="100"
            step="0.5"
            value={maxFileSize}
            onChange={(e) => setMaxFileSize(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <p className="text-xs text-gray-600 mt-1">
            Recommended: 5-10 MB for documents, 50-100 MB for videos
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Max Number of Files *
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={maxFiles}
            onChange={(e) => setMaxFiles(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
          <p className="text-xs text-gray-600 mt-1">
            How many files can a student upload?
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Upload Instructions
        </label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          rows={4}
          placeholder="Provide clear instructions on what students should upload. Example:&#10;• Upload your project report as a PDF&#10;• Include screenshots of your working application&#10;• Ensure all files are properly labeled"
        />
        <p className="text-xs text-gray-600 mt-1">
          These instructions will be shown to students when they upload files
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
            Define criteria for evaluating uploaded files
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
                        placeholder="e.g., Completeness, Quality, Organization"
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
          {rubric.length > 0 && (
            <div className={`mt-4 p-3 rounded-lg ${
              getTotalRubricPoints() === (maxScore || 10) ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Rubric Total:</span>
                <span className={`text-lg font-bold ${
                  getTotalRubricPoints() === (maxScore || 10) ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {getTotalRubricPoints()} / {maxScore || 10} points
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Preview (Student View):</h4>
        <div className="bg-white border-2 border-dashed border-gray-400 rounded-lg p-8 text-center">
          <div className="text-6xl mb-3">📎</div>
          <p className="text-gray-900 font-medium mb-2">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-600 mb-1">
            Accepted: {allowedFileTypes.map(t => availableFileTypes.find(f => f.value === t)?.label.split('(')[1].split(')')[0]).join(', ') || 'No file types selected'}
          </p>
          <p className="text-xs text-gray-600">
            Max {maxFiles} file{maxFiles > 1 ? 's' : ''}, up to {maxFileSize} MB each
          </p>
        </div>
        {instructions && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-900 whitespace-pre-wrap">{instructions}</p>
          </div>
        )}
      </div>

      {/* Example */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">✨ Example File Upload Question:</h4>
        <div className="text-sm text-green-800 space-y-2">
          <p><strong>Instructions:</strong> Upload your final project documentation</p>
          <p><strong>Allowed:</strong> PDF, Word documents</p>
          <p><strong>Limits:</strong> Max 2 files, 10 MB each</p>
          <p><strong>Rubric:</strong> Completeness (3 pts), Clarity (4 pts), Formatting (3 pts)</p>
        </div>
      </div>
    </div>
  );
};

export default FileUploadEditor;
