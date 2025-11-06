import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Trash2, BookOpen, Sparkles } from 'lucide-react';
import './QuizForm.css';
import AIQuizGenerator from './AIQuizGenerator';

const defaultCodeLanguage = 'javascript';
const supportedLanguages = ['javascript', 'typescript', 'python', 'java', 'csharp', 'cpp'];
const trueFalseOptions = ['True', 'False'];

const newBlankQuestion = () => ({
  questionText: '',
  questionType: 'multiple-choice',
  options: ['', ''],
  correctAnswer: '',
  codeLanguage: defaultCodeLanguage,
  starterCode: '',
  evaluationNotes: '',
  referenceSolution: '',
  maxScore: 1,
  blankAnswers: [''],
  caseSensitive: false,
  matchingPairs: [{ left: '', right: '' }],
  wordLimit: '',
  rubric: '',
  sampleAnswer: '',
  allowedFileTypes: ['pdf'],
  maxFileSize: 5,
  partialCredit: true
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
      const type = question.questionType || 'multiple-choice';
      const maxScore = Number.isFinite(question.maxScore) && question.maxScore > 0 ? question.maxScore : 1;

      const base = {
        questionText: question.questionText || '',
        questionType: type,
        maxScore,
        options: Array.isArray(question.options) ? question.options.map((opt) => `${opt}`) : [],
        correctAnswer: question.correctAnswer || '',
        codeLanguage: question.codeLanguage || defaultCodeLanguage,
        starterCode: question.starterCode || '',
        evaluationNotes: question.evaluationNotes || '',
        referenceSolution: question.referenceSolution || '',
        blankAnswers:
          Array.isArray(question.blankAnswers) && question.blankAnswers.length
            ? question.blankAnswers.map((answer) => `${answer}`)
            : [''],
        caseSensitive: Boolean(question.caseSensitive),
        matchingPairs:
          Array.isArray(question.matchingPairs) && question.matchingPairs.length
            ? question.matchingPairs.map((pair) => ({
                left: pair?.left || '',
                right: pair?.right || ''
              }))
            : [{ left: '', right: '' }],
        wordLimit:
          question.wordLimit !== null && question.wordLimit !== undefined
            ? `${question.wordLimit}`
            : '',
        rubric: question.rubric || '',
        sampleAnswer: question.sampleAnswer || '',
        allowedFileTypes:
          Array.isArray(question.allowedFileTypes) && question.allowedFileTypes.length
            ? question.allowedFileTypes
            : ['pdf'],
        maxFileSize:
          Number.isFinite(question.maxFileSize) && question.maxFileSize > 0
            ? question.maxFileSize
            : 5,
        partialCredit:
          question.partialCredit !== undefined
            ? Boolean(question.partialCredit)
            : type === 'matching'
      };

      switch (type) {
        case 'code':
          return {
            ...base,
            questionType: 'code',
            options: [],
            partialCredit: false
          };
        case 'true-false':
          return {
            ...base,
            questionType: 'true-false',
            options: trueFalseOptions,
            correctAnswer: trueFalseOptions.includes(base.correctAnswer)
              ? base.correctAnswer
              : 'True',
            partialCredit: false
          };
        case 'fill-in-blank':
          return {
            ...base,
            questionType: 'fill-in-blank',
            options: [],
            correctAnswer: '',
            partialCredit: Boolean(base.partialCredit)
          };
        case 'matching':
          return {
            ...base,
            questionType: 'matching',
            options: [],
            correctAnswer: '',
            partialCredit: base.partialCredit !== undefined ? base.partialCredit : true
          };
        case 'essay':
          return {
            ...base,
            questionType: 'essay',
            options: [],
            correctAnswer: '',
            partialCredit: false
          };
        case 'file-upload':
          return {
            ...base,
            questionType: 'file-upload',
            options: [],
            correctAnswer: '',
            partialCredit: false
          };
        case 'multiple-choice':
        default: {
          const options =
            base.options && base.options.length >= 2
              ? base.options
              : ['', ''];
          const safeCorrect = options.includes(base.correctAnswer) ? base.correctAnswer : options[0];
          return {
            ...base,
            questionType: 'multiple-choice',
            options,
            correctAnswer: safeCorrect || '',
            partialCredit: false
          };
        }
      }
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
      const maxScore = Number(question.maxScore);
      if (!Number.isFinite(maxScore) || maxScore <= 0) return false;

      switch (question.questionType) {
        case 'code':
          return true;
        case 'multiple-choice':
          return (
            Array.isArray(question.options) &&
            question.options.length >= 2 &&
            question.options.every((opt) => opt.trim()) &&
            question.options.includes(question.correctAnswer)
          );
        case 'true-false':
          return trueFalseOptions.includes(question.correctAnswer);
        case 'fill-in-blank': {
          const answers = Array.isArray(question.blankAnswers)
            ? question.blankAnswers.map((answer) => answer.trim()).filter(Boolean)
            : [];
          return answers.length > 0;
        }
        case 'matching': {
          const validPairs = Array.isArray(question.matchingPairs)
            ? question.matchingPairs.filter(
                (pair) => pair && pair.left && pair.right && pair.left.trim() && pair.right.trim()
              )
            : [];
          return validPairs.length > 0;
        }
        case 'essay': {
          if (!question.wordLimit) return true;
          const limit = Number(question.wordLimit);
          return !Number.isNaN(limit) && limit > 0;
        }
        case 'file-upload': {
          const fileTypes = Array.isArray(question.allowedFileTypes)
            ? question.allowedFileTypes.filter((type) => type && type.trim())
            : [];
          return fileTypes.length > 0 && Number(question.maxFileSize) > 0;
        }
        default:
          return false;
      }
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
        switch (value) {
          case 'code':
            return {
              ...question,
              questionType: 'code',
              options: [],
              correctAnswer: question.correctAnswer || '',
              codeLanguage: question.codeLanguage || defaultCodeLanguage,
              starterCode: question.starterCode || '',
              evaluationNotes: question.evaluationNotes || '',
              referenceSolution: question.referenceSolution || '',
              partialCredit: false
            };
          case 'true-false':
            return {
              ...question,
              questionType: 'true-false',
              options: trueFalseOptions,
              correctAnswer: trueFalseOptions.includes(question.correctAnswer)
                ? question.correctAnswer
                : 'True',
              partialCredit: false
            };
          case 'fill-in-blank':
            return {
              ...question,
              questionType: 'fill-in-blank',
              options: [],
              correctAnswer: '',
              blankAnswers: question.blankAnswers && question.blankAnswers.length ? question.blankAnswers : [''],
              caseSensitive: Boolean(question.caseSensitive),
              partialCredit: Boolean(question.partialCredit)
            };
          case 'matching':
            return {
              ...question,
              questionType: 'matching',
              options: [],
              correctAnswer: '',
              matchingPairs:
                question.matchingPairs && question.matchingPairs.length
                  ? question.matchingPairs
                  : [{ left: '', right: '' }],
              partialCredit: question.partialCredit !== undefined ? question.partialCredit : true
            };
          case 'essay':
            return {
              ...question,
              questionType: 'essay',
              options: [],
              correctAnswer: '',
              wordLimit: question.wordLimit || '',
              rubric: question.rubric || '',
              sampleAnswer: question.sampleAnswer || '',
              partialCredit: false
            };
          case 'file-upload':
            return {
              ...question,
              questionType: 'file-upload',
              options: [],
              correctAnswer: '',
              allowedFileTypes:
                question.allowedFileTypes && question.allowedFileTypes.length
                  ? question.allowedFileTypes
                  : ['pdf'],
              maxFileSize:
                Number.isFinite(Number(question.maxFileSize)) && Number(question.maxFileSize) > 0
                  ? Number(question.maxFileSize)
                  : 5,
              partialCredit: false
            };
          case 'multiple-choice':
          default: {
            const options = question.options && question.options.length >= 2 ? question.options : ['', ''];
            return {
              ...question,
              questionType: 'multiple-choice',
              options,
              correctAnswer: options[0] || '',
              codeLanguage: defaultCodeLanguage,
              starterCode: '',
              evaluationNotes: '',
              referenceSolution: '',
              partialCredit: false
            };
          }
        }
      }

      if (field === 'maxScore') {
        const parsed = Number.parseFloat(value);
        return {
          ...question,
          maxScore: Number.isFinite(parsed) && parsed > 0 ? parsed : 1
        };
      }

      if (field === 'partialCredit' || field === 'caseSensitive') {
        return {
          ...question,
          [field]: Boolean(value)
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

  const updateBlankAnswer = (questionIndex, answerIndex, value) => {
    updateQuestion(questionIndex, (question) => {
      const answers = Array.isArray(question.blankAnswers) ? [...question.blankAnswers] : [];
      answers[answerIndex] = value;
      return {
        ...question,
        blankAnswers: answers
      };
    });
  };

  const addBlankAnswer = (questionIndex) => {
    updateQuestion(questionIndex, (question) => ({
      ...question,
      blankAnswers: [...(question.blankAnswers || []), '']
    }));
  };

  const removeBlankAnswer = (questionIndex, answerIndex) => {
    updateQuestion(questionIndex, (question) => {
      const answers = Array.isArray(question.blankAnswers) ? question.blankAnswers.filter((_, idx) => idx !== answerIndex) : [];
      return {
        ...question,
        blankAnswers: answers.length > 0 ? answers : ['']
      };
    });
  };

  const updateMatchingPair = (questionIndex, pairIndex, key, value) => {
    updateQuestion(questionIndex, (question) => {
      const pairs = Array.isArray(question.matchingPairs)
        ? question.matchingPairs.map((pair) => ({ ...pair }))
        : [];
      pairs[pairIndex] = {
        ...pairs[pairIndex],
        [key]: value
      };
      return {
        ...question,
        matchingPairs: pairs
      };
    });
  };

  const addMatchingPair = (questionIndex) => {
    updateQuestion(questionIndex, (question) => ({
      ...question,
      matchingPairs: [...(question.matchingPairs || []), { left: '', right: '' }]
    }));
  };

  const removeMatchingPair = (questionIndex, pairIndex) => {
    updateQuestion(questionIndex, (question) => {
      const pairs = Array.isArray(question.matchingPairs)
        ? question.matchingPairs.filter((_, idx) => idx !== pairIndex)
        : [];
      return {
        ...question,
        matchingPairs: pairs.length > 0 ? pairs : [{ left: '', right: '' }]
      };
    });
  };

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, newBlankQuestion()]
    }));
  };

  const [showAIGenerator, setShowAIGenerator] = useState(false);

  const handleAIGeneratedQuestions = (generatedQuestions) => {
    // Filter out invalid questions and log them
    const validQuestions = generatedQuestions.filter(q => {
      // Check for required fields
      if (!q.questionText || q.questionText.trim() === '') {
        console.warn('Skipping question with missing questionText:', q);
        return false;
      }
      if (!q.questionType) {
        console.warn('Skipping question with missing questionType:', q);
        return false;
      }
      return true;
    });

    if (validQuestions.length === 0) {
      console.error('No valid questions received');
      return;
    }

    // Process and normalize AI-generated questions
    const normalizedQuestions = validQuestions.map(q => {
      const question = { ...q };
      
      // Ensure maxScore is set
      if (!question.maxScore || question.maxScore <= 0) {
        question.maxScore = 1;
      }

      // Auto-fill correct answers based on question type
      switch (question.questionType) {
        case 'multiple-choice':
          // Ensure options exist
          if (Array.isArray(question.options) && question.options.length > 0) {
            // correctAnswer is now an index (number), convert it to the actual answer text
            if (typeof question.correctAnswer === 'number') {
              // Validate the index is within bounds
              if (question.correctAnswer >= 0 && question.correctAnswer < question.options.length) {
                question.correctAnswer = question.options[question.correctAnswer];
              } else {
                console.warn('CorrectAnswer index out of bounds:', question.correctAnswer, 'options length:', question.options.length);
                question.correctAnswer = question.options[0];
              }
            } else if (!question.correctAnswer) {
              question.correctAnswer = question.options[0];
            } else if (typeof question.correctAnswer === 'string' && !question.options.includes(question.correctAnswer)) {
              // If correctAnswer doesn't match any option, try to find it
              // The AI might return just "B" but options might be "B. tuple"
              const matchingOption = question.options.find(opt => 
                opt.startsWith(question.correctAnswer) || 
                opt.includes(question.correctAnswer) ||
                question.correctAnswer.includes(opt)
              );
              if (matchingOption) {
                question.correctAnswer = matchingOption;
              } else {
                // Last resort: keep original correctAnswer or use first option
                console.warn('Could not match correct answer to options:', question.correctAnswer, question.options);
                question.correctAnswer = question.correctAnswer || question.options[0];
              }
            }
          } else {
            console.warn('Question has no options:', question.questionText);
            question.options = ['', ''];
            question.correctAnswer = '';
          }
          break;

        case 'true-false':
          // Ensure True/False options and correct answer
          question.options = ['True', 'False'];
          if (!['True', 'False'].includes(question.correctAnswer)) {
            question.correctAnswer = 'True'; // Default to True
          }
          break;

        case 'code':
          // Ensure code-specific fields are present
          question.codeLanguage = question.codeLanguage || 'javascript';
          question.starterCode = question.starterCode || '';
          question.referenceSolution = question.referenceSolution || '';
          question.evaluationNotes = question.evaluationNotes || '';
          break;

        case 'fill-in-blank':
        case 'fill-in-the-blank':
          // Normalize the question type to frontend format
          question.questionType = 'fill-in-blank';
          // Ensure blank answers array exists
          if (!Array.isArray(question.blankAnswers) || question.blankAnswers.length === 0) {
            question.blankAnswers = [''];
          }
          question.caseSensitive = question.caseSensitive || false;
          question.partialCredit = question.partialCredit !== undefined ? question.partialCredit : true;
          break;

        case 'essay':
          // Ensure essay-specific fields
          question.wordLimit = question.wordLimit || '';
          question.rubric = question.rubric || '';
          question.sampleAnswer = question.sampleAnswer || '';
          break;

        default:
          break;
      }

      return question;
    });

    setForm((prev) => {
      // Check if the current questions array only has one empty question
      const hasOnlyEmptyQuestion = prev.questions.length === 1 && 
        prev.questions[0].questionText.trim() === '';
      
      return {
        ...prev,
        // If there's only an empty question, replace it; otherwise append
        questions: hasOnlyEmptyQuestion ? normalizedQuestions : [...prev.questions, ...normalizedQuestions]
      };
    });
    setShowAIGenerator(false);
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
      questions: form.questions.map((question) => {
        const base = {
          questionText: question.questionText.trim(),
          questionType: question.questionType,
          maxScore: Number(question.maxScore) > 0 ? Number(question.maxScore) : 1
        };

        switch (question.questionType) {
          case 'multiple-choice': {
            const options = (question.options || []).map((option) => option.trim());
            base.options = options;
            base.correctAnswer = question.correctAnswer;
            break;
          }
          case 'true-false': {
            base.options = [...trueFalseOptions];
            base.correctAnswer = trueFalseOptions.includes(question.correctAnswer)
              ? question.correctAnswer
              : trueFalseOptions[0];
            break;
          }
          case 'code': {
            base.codeLanguage = question.codeLanguage;
            base.starterCode = question.starterCode || undefined;
            base.referenceSolution = question.referenceSolution || undefined;
            base.evaluationNotes = question.evaluationNotes || undefined;
            break;
          }
          case 'fill-in-blank': {
            base.blankAnswers = (question.blankAnswers || [])
              .map((answer) => answer.trim())
              .filter(Boolean);
            base.caseSensitive = Boolean(question.caseSensitive);
            base.partialCredit = Boolean(question.partialCredit);
            break;
          }
          case 'matching': {
            base.matchingPairs = (question.matchingPairs || [])
              .map((pair) => ({
                left: pair?.left?.trim() || '',
                right: pair?.right?.trim() || ''
              }))
              .filter((pair) => pair.left && pair.right);
            base.partialCredit = Boolean(question.partialCredit);
            break;
          }
          case 'essay': {
            const parsedLimit = Number(question.wordLimit);
            base.wordLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : undefined;
            base.rubric = question.rubric?.trim() || undefined;
            base.sampleAnswer = question.sampleAnswer?.trim() || undefined;
            break;
          }
          case 'file-upload': {
            base.allowedFileTypes = (question.allowedFileTypes || [])
              .map((type) => type.trim())
              .filter(Boolean);
            const parsedSize = Number(question.maxFileSize);
            base.maxFileSize = Number.isFinite(parsedSize) && parsedSize > 0 ? parsedSize : undefined;
            break;
          }
          default: {
            base.correctAnswer = question.correctAnswer;
          }
        }

        return Object.fromEntries(
          Object.entries(base).filter(([, value]) => value !== undefined)
        );
      })
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

      {/* AI Question Generation Section */}
      <div style={{ 
        marginTop: '1.5rem', 
        marginBottom: '1.5rem', 
        padding: '1.5rem', 
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        borderRadius: '8px',
        border: '1px solid rgba(102, 126, 234, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#1f2937' }}>
              Automated Question Generation
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
              Automatically generate quiz questions from our question bank with pre-filled correct answers and points
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              type="button" 
              className="add-question-btn"
              onClick={() => setShowAIGenerator(true)}
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
                minWidth: '200px'
              }}
            >
              <Sparkles size={20} />
              Generate Questions
            </button>
            <div style={{ 
              textAlign: 'center',
              fontSize: '0.8rem',
              color: '#4b5563',
              fontWeight: '600'
            }}>
              Question Generator
            </div>
          </div>
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
            <option value="true-false">True / False</option>
            <option value="code">Code response</option>
            <option value="fill-in-blank">Fill in the blank</option>
            <option value="matching">Matching pairs</option>
            <option value="essay">Essay response</option>
            <option value="file-upload">File upload</option>
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

          {question.questionType === 'multiple-choice' && (
            <>
              <h4>Options</h4>
              {question.options.map((option, optionIndex) => (
                <div
                  key={`question-${index}-option-${optionIndex}`}
                  style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
                >
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
              <div
                style={{
                  marginTop: '0.75rem',
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}
              >
                <button type="button" className="primary-btn" onClick={() => addOption(index)}>
                  Add option
                </button>
                <label
                  htmlFor={`correct-answer-${index}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  Correct answer
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
                </label>
              </div>
            </>
          )}

          {question.questionType === 'true-false' && (
            <div style={{ marginTop: '1rem' }}>
              <h4>Correct answer</h4>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {trueFalseOptions.map((option) => (
                  <label
                    key={`${option}-${index}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <input
                      type="radio"
                      name={`true-false-${index}`}
                      value={option}
                      checked={question.correctAnswer === option}
                      onChange={(event) => updateQuestionField(index, 'correctAnswer', event.target.value)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          )}

          {question.questionType === 'code' && (
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

          {question.questionType === 'fill-in-blank' && (
            <div
              className="question-subsection"
              style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <h4>Acceptable answers</h4>
              {question.blankAnswers?.map((answer, answerIndex) => (
                <div
                  key={`blank-${index}-${answerIndex}`}
                  style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
                >
                  <input
                    value={answer}
                    onChange={(event) => updateBlankAnswer(index, answerIndex, event.target.value)}
                    placeholder="Accepted answer"
                    required
                  />
                  {Array.isArray(question.blankAnswers) && question.blankAnswers.length > 1 && (
                    <button
                      type="button"
                      className="primary-btn danger"
                      onClick={() => removeBlankAnswer(index, answerIndex)}
                      style={{ padding: '0.35rem 0.75rem' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="primary-btn" onClick={() => addBlankAnswer(index)}>
                Add acceptable answer
              </button>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(question.caseSensitive)}
                    onChange={(event) => updateQuestionField(index, 'caseSensitive', event.target.checked)}
                  />
                  Case sensitive
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(question.partialCredit)}
                    onChange={(event) => updateQuestionField(index, 'partialCredit', event.target.checked)}
                  />
                  Allow partial credit
                </label>
              </div>
            </div>
          )}

          {question.questionType === 'matching' && (
            <div
              className="question-subsection"
              style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <h4>Matching pairs</h4>
              {question.matchingPairs?.map((pair, pairIndex) => (
                <div
                  key={`matching-${index}-${pairIndex}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '0.75rem',
                    alignItems: 'center'
                  }}
                >
                  <input
                    value={pair?.left || ''}
                    onChange={(event) => updateMatchingPair(index, pairIndex, 'left', event.target.value)}
                    placeholder="Prompt"
                    required
                  />
                  <input
                    value={pair?.right || ''}
                    onChange={(event) => updateMatchingPair(index, pairIndex, 'right', event.target.value)}
                    placeholder="Correct match"
                    required
                  />
                  {Array.isArray(question.matchingPairs) && question.matchingPairs.length > 1 && (
                    <button
                      type="button"
                      className="primary-btn danger"
                      onClick={() => removeMatchingPair(index, pairIndex)}
                      style={{ padding: '0.35rem 0.75rem' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="primary-btn" onClick={() => addMatchingPair(index)}>
                Add pair
              </button>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={Boolean(question.partialCredit)}
                  onChange={(event) => updateQuestionField(index, 'partialCredit', event.target.checked)}
                />
                Allow partial credit for partially correct matches
              </label>
            </div>
          )}

          {question.questionType === 'essay' && (
            <div
              className="question-subsection"
              style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <div>
                <label htmlFor={`word-limit-${index}`}>Word limit (optional)</label>
                <input
                  id={`word-limit-${index}`}
                  type="number"
                  min="1"
                  value={question.wordLimit || ''}
                  onChange={(event) => updateQuestionField(index, 'wordLimit', event.target.value)}
                  placeholder="e.g., 250"
                />
              </div>
              <div>
                <label htmlFor={`rubric-${index}`}>Rubric criteria (optional)</label>
                <input
                  id={`rubric-${index}`}
                  value={question.rubric || ''}
                  onChange={(event) => updateQuestionField(index, 'rubric', event.target.value)}
                  placeholder="e.g., Thesis|Evidence|Clarity"
                />
                <small style={{ color: '#6b7280' }}>Separate criteria with the | character</small>
              </div>
              <div>
                <label htmlFor={`sample-answer-${index}`}>Sample answer (optional)</label>
                <textarea
                  id={`sample-answer-${index}`}
                  rows={4}
                  value={question.sampleAnswer || ''}
                  onChange={(event) => updateQuestionField(index, 'sampleAnswer', event.target.value)}
                  placeholder="Provide a model answer or grading notes..."
                />
              </div>
            </div>
          )}

          {question.questionType === 'file-upload' && (
            <div
              className="question-subsection"
              style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <div>
                <label htmlFor={`file-types-${index}`}>Allowed file types</label>
                <input
                  id={`file-types-${index}`}
                  value={(question.allowedFileTypes || []).join(', ')}
                  onChange={(event) => {
                    const types = event.target.value
                      .split(',')
                      .map((type) => type.trim())
                      .filter(Boolean);
                    updateQuestionField(index, 'allowedFileTypes', types.length ? types : ['pdf']);
                  }}
                  placeholder="e.g., pdf, docx, zip"
                />
                <small style={{ color: '#6b7280' }}>Separate file extensions with commas</small>
              </div>
              <div>
                <label htmlFor={`max-file-size-${index}`}>Max file size (MB)</label>
                <input
                  id={`max-file-size-${index}`}
                  type="number"
                  min="1"
                  value={question.maxFileSize || ''}
                  onChange={(event) => {
                    const parsed = Number.parseFloat(event.target.value);
                    updateQuestion(index, (prevQuestion) => ({
                      ...prevQuestion,
                      maxFileSize: Number.isFinite(parsed) && parsed > 0 ? parsed : ''
                    }));
                  }}
                  placeholder="e.g., 10"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button type="button" className="add-question-btn" onClick={addQuestion}>
        <Plus size={20} />
        Add Another Question
      </button>

      {showAIGenerator && (
        <AIQuizGenerator
          onQuestionsGenerated={handleAIGeneratedQuestions}
          onClose={() => setShowAIGenerator(false)}
        />
      )}

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
