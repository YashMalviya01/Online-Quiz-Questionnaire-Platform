import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import './QuizForm.css';

const defaultCodeLanguage = 'javascript';
const supportedLanguages = ['javascript', 'typescript', 'python', 'java', 'csharp', 'cpp'];

const newBlankQuestion = () => ({
  questionText: '',
  questionType: 'multiple-choice',
  options: ['', ''],
  correctAnswer: '',
  codeLanguage: defaultCodeLanguage,
  starterCode: '',
  evaluationNotes: '',
  referenceSolution: '',
  maxScore: 1
});

const normaliseInitial = (initial) => {
  if (!initial) {
    return {
      title: '',
      description: '',
      isPublished: true,
      timeLimit: null,
      expiryDate: null,
      maxAttempts: null,
      questions: [newBlankQuestion()]
    };
  }

  return {
    title: initial.title || '',
    description: initial.description || '',
    isPublished: initial.isPublished !== undefined ? initial.isPublished : true,
    timeLimit: initial.timeLimit || null,
    expiryDate: initial.expiryDate || null,
    maxAttempts: initial.maxAttempts || null,
    questions: (initial.questions || []).map((question) => {
      const type = question.questionType === 'code' ? 'code' : 'multiple-choice';
      const maxScore = Number.isFinite(question.maxScore) && question.maxScore > 0 ? question.maxScore : 1;
      if (type === 'code') {
        return {
          questionText: question.questionText || '',
          questionType: 'code',
          options: [],
          correctAnswer: question.correctAnswer || '',
          codeLanguage: question.codeLanguage || defaultCodeLanguage,
          starterCode: question.starterCode || '',
          evaluationNotes: question.evaluationNotes || '',
          referenceSolution: question.referenceSolution || '',
          maxScore
        };
      }

      const options =
        question.options && question.options.length >= 2
          ? question.options.map((opt) => `${opt}`)
          : ['', ''];
      const safeCorrect = options.includes(question.correctAnswer) ? question.correctAnswer : options[0];
      return {
        questionText: question.questionText || '',
        questionType: 'multiple-choice',
        options,
        correctAnswer: safeCorrect || '',
        codeLanguage: defaultCodeLanguage,
        starterCode: '',
        evaluationNotes: '',
        referenceSolution: '',
        maxScore
      };
    })
  };
};

const QuizForm = ({
  initialQuiz,
  onSubmit,
  onCancel,
  submitLabel = 'Save quiz',
  isSubmitting = false,
  errorMessage = '',
  successMessage = '',
  className = 'card',
  resetSignal = 0
}) => {
  const [form, setForm] = useState(() => normaliseInitial(initialQuiz));
  const resetRef = useRef(resetSignal);

  useEffect(() => {
    setForm(normaliseInitial(initialQuiz));
  }, [initialQuiz]);

  useEffect(() => {
    if (resetSignal !== resetRef.current) {
      setForm(normaliseInitial(initialQuiz));
      resetRef.current = resetSignal;
    }
  }, [initialQuiz, resetSignal]);

  const questionCount = form.questions.length;

  const canSubmit = useMemo(() => {
    if (!form.title.trim()) return false;
    if (form.questions.length === 0) return false;
    return form.questions.every((question) => {
      if (!question.questionText.trim()) return false;
      if (!Number.isFinite(question.maxScore) || question.maxScore <= 0) return false;
      if (question.questionType === 'code') {
        return true;
      }
      return (
        Array.isArray(question.options) &&
        question.options.length >= 2 &&
        question.options.every((opt) => opt.trim()) &&
        question.options.includes(question.correctAnswer)
      );
    });
  }, [form]);

  const updateQuestion = (index, updater) => {
    setForm((prev) => {
      const questions = [...prev.questions];
      const current = { ...questions[index] };
      const next = updater(current);
      questions[index] = next;
      return { ...prev, questions };
    });
  };

  const updateQuestionField = (index, field, value) => {
    updateQuestion(index, (question) => {
      if (field === 'questionType') {
        const nextType = value === 'code' ? 'code' : 'multiple-choice';
        if (nextType === 'code') {
          return {
            ...question,
            questionType: 'code',
            options: [],
            correctAnswer: question.correctAnswer || '',
            codeLanguage: question.codeLanguage || defaultCodeLanguage,
            starterCode: question.starterCode || '',
            evaluationNotes: question.evaluationNotes || '',
            referenceSolution: question.referenceSolution || ''
          };
        }
        const options = question.options && question.options.length >= 2 ? question.options : ['', ''];
        return {
          ...question,
          questionType: 'multiple-choice',
          options,
          correctAnswer: options[0] || '',
          codeLanguage: defaultCodeLanguage,
          starterCode: '',
          evaluationNotes: '',
          referenceSolution: ''
        };
      }

      if (field === 'maxScore') {
        const parsed = Number.parseFloat(value);
        return {
          ...question,
          maxScore: Number.isFinite(parsed) && parsed > 0 ? parsed : 1
        };
      }

      return { ...question, [field]: value };
    });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    updateQuestion(questionIndex, (question) => {
      const options = [...question.options];
      options[optionIndex] = value;
      return { ...question, options };
    });
  };

  const addOption = (questionIndex) => {
    updateQuestion(questionIndex, (question) => ({
      ...question,
      options: [...question.options, '']
    }));
  };

  const removeOption = (questionIndex, optionIndex) => {
    updateQuestion(questionIndex, (question) => {
      if (question.questionType !== 'multiple-choice') return question;
      const options = question.options.filter((_, idx) => idx !== optionIndex);
      if (options.length < 2) {
        return question;
      }
      const nextCorrect = options.includes(question.correctAnswer) ? question.correctAnswer : options[0];
      return {
        ...question,
        options,
        correctAnswer: nextCorrect || ''
      };
    });
  };

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, newBlankQuestion()]
    }));
  };

  const removeQuestion = (index) => {
    setForm((prev) => {
      if (prev.questions.length === 1) return prev;
      return {
        ...prev,
        questions: prev.questions.filter((_, idx) => idx !== index)
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      isPublished: form.isPublished,
      timeLimit: form.timeLimit,
      expiryDate: form.expiryDate,
      maxAttempts: form.maxAttempts,
      questions: form.questions.map((question) => ({
        questionText: question.questionText.trim(),
        questionType: question.questionType,
        options:
          question.questionType === 'multiple-choice'
            ? question.options.map((option) => option.trim())
            : [],
        correctAnswer: question.correctAnswer,
        codeLanguage: question.questionType === 'code' ? question.codeLanguage : undefined,
        starterCode: question.questionType === 'code' ? question.starterCode : undefined,
        evaluationNotes: question.questionType === 'code' ? question.evaluationNotes : undefined,
        referenceSolution: question.questionType === 'code' ? question.referenceSolution : undefined,
        maxScore: question.maxScore
      }))
    };

    onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="quiz-form-container">
      <label htmlFor="quiz-title">Quiz Title</label>
      <input
        id="quiz-title"
        value={form.title}
        onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
        placeholder="e.g., JavaScript Fundamentals Quiz"
        required
      />
      <label htmlFor="quiz-description">Description</label>
      <textarea
        id="quiz-description"
        rows={3}
        value={form.description}
        onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        placeholder="Provide a brief overview of what this quiz covers..."
      />

      {/* Quiz Settings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        <div>
          <label htmlFor="quiz-time-limit">Time Limit (minutes)</label>
          <input
            id="quiz-time-limit"
            type="number"
            min="1"
            value={form.timeLimit || ''}
            onChange={(event) => setForm((prev) => ({ 
              ...prev, 
              timeLimit: event.target.value ? parseInt(event.target.value) : null 
            }))}
            placeholder="Optional (e.g., 30)"
          />
          <small style={{ color: '#6b7280', fontSize: '0.85rem' }}>Leave empty for no time limit</small>
        </div>

        <div>
          <label htmlFor="quiz-expiry-date">Expiry Date</label>
          <input
            id="quiz-expiry-date"
            type="datetime-local"
            value={form.expiryDate ? new Date(form.expiryDate).toISOString().slice(0, 16) : ''}
            onChange={(event) => setForm((prev) => ({ 
              ...prev, 
              expiryDate: event.target.value ? new Date(event.target.value).toISOString() : null 
            }))}
          />
          <small style={{ color: '#6b7280', fontSize: '0.85rem' }}>Leave empty for no expiry</small>
        </div>

        <div>
          <label htmlFor="quiz-max-attempts">Max Attempts</label>
          <input
            id="quiz-max-attempts"
            type="number"
            min="1"
            value={form.maxAttempts || ''}
            onChange={(event) => setForm((prev) => ({ 
              ...prev, 
              maxAttempts: event.target.value ? parseInt(event.target.value) : null 
            }))}
            placeholder="Optional (e.g., 3)"
          />
          <small style={{ color: '#6b7280', fontSize: '0.85rem' }}>Leave empty for unlimited attempts</small>
        </div>
      </div>
      
      {form.questions.map((question, index) => (
        <div key={`question-${index}`} className="question-card">
          <div className="question-header">
            <h3>
              <span className="question-number-badge">Question {index + 1}</span>
            </h3>
            {questionCount > 1 && (
              <button
                type="button"
                className="remove-question-btn"
                onClick={() => removeQuestion(index)}
              >
                <Trash2 size={16} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.25rem' }} />
                Remove
              </button>
            )}
          </div>

          <label htmlFor={`question-type-${index}`}>Question type</label>
          <select
            id={`question-type-${index}`}
            value={question.questionType}
            onChange={(event) => updateQuestionField(index, 'questionType', event.target.value)}
          >
            <option value="multiple-choice">Multiple choice</option>
            <option value="code">Code response</option>
          </select>

          <label htmlFor={`question-text-${index}`}>Prompt</label>
          <input
            id={`question-text-${index}`}
            value={question.questionText}
            onChange={(event) => updateQuestionField(index, 'questionText', event.target.value)}
            required
          />

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 160px' }}>
              <label htmlFor={`max-score-${index}`}>Points available</label>
              <input
                id={`max-score-${index}`}
                type="number"
                min="0.5"
                step="0.5"
                value={question.maxScore}
                onChange={(event) => updateQuestionField(index, 'maxScore', event.target.value)}
                required
              />
            </div>
            {question.questionType === 'code' && (
              <div style={{ flex: '1 1 200px' }}>
                <label htmlFor={`language-${index}`}>Preferred language</label>
                <select
                  id={`language-${index}`}
                  value={question.codeLanguage}
                  onChange={(event) => updateQuestionField(index, 'codeLanguage', event.target.value)}
                >
                  {supportedLanguages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {question.questionType === 'multiple-choice' ? (
            <>
              <h4>Options</h4>
              {question.options.map((option, optionIndex) => (
                <div key={`question-${index}-option-${optionIndex}`} style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    value={option}
                    onChange={(event) => updateOption(index, optionIndex, event.target.value)}
                    required
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                  {question.options.length > 2 && (
                    <button
                      type="button"
                      className="primary-btn danger"
                      onClick={() => removeOption(index, optionIndex)}
                      style={{ padding: '0.35rem 0.75rem' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="primary-btn"
                onClick={() => addOption(index)}
                style={{ marginTop: '0.75rem' }}
              >
                Add option
              </button>
              <label htmlFor={`correct-answer-${index}`}>Correct answer</label>
              <select
                id={`correct-answer-${index}`}
                value={question.correctAnswer}
                onChange={(event) => updateQuestionField(index, 'correctAnswer', event.target.value)}
                required
              >
                <option value="" disabled>
                  Select the correct option
                </option>
                {question.options.map((option, optionIndex) => (
                  <option key={`correct-${index}-${optionIndex}`} value={option}>
                    {option || `Option ${optionIndex + 1}`}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <>
              <label htmlFor={`starter-code-${index}`}>Starter code (optional)</label>
              <textarea
                id={`starter-code-${index}`}
                rows={6}
                value={question.starterCode}
                onChange={(event) => updateQuestionField(index, 'starterCode', event.target.value)}
                style={{ fontFamily: '"Fira Code", "Source Code Pro", monospace' }}
                placeholder={`// Provide starter code or function signature\nfunction solve() {\n  // ...\n}`}
              />
              <label htmlFor={`reference-solution-${index}`}>Reference solution (optional)</label>
              <textarea
                id={`reference-solution-${index}`}
                rows={6}
                value={question.referenceSolution}
                onChange={(event) => updateQuestionField(index, 'referenceSolution', event.target.value)}
                style={{ fontFamily: '"Fira Code", "Source Code Pro", monospace' }}
                placeholder="Keep for graders only. This will not be shown to students."
              />
              <label htmlFor={`evaluation-notes-${index}`}>Evaluation notes for graders (optional)</label>
              <textarea
                id={`evaluation-notes-${index}`}
                rows={3}
                value={question.evaluationNotes}
                onChange={(event) => updateQuestionField(index, 'evaluationNotes', event.target.value)}
                placeholder="Highlight what a strong answer should include."
              />
            </>
          )}
        </div>
      ))}

      <button type="button" className="add-question-btn" onClick={addQuestion}>
        <Plus size={20} />
        Add Another Question
      </button>

      {errorMessage && <div className="message error">{errorMessage}</div>}
      {successMessage && <div className="message success">{successMessage}</div>}

      <div className="form-actions">
        <button type="submit" className="submit-btn" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default QuizForm;
