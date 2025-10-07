import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import QuizForm from '../components/QuizForm.jsx';
import { fetchQuizById, fetchQuizzes, updateQuiz, createQuiz } from '../store/slices/quizSlice.js';
import { ArrowLeft, BookOpen } from 'lucide-react';

const ManageQuizPage = () => {
  const { quizId: paramQuizId } = useParams();
  const [searchParams] = useSearchParams();
  const queryQuizId = searchParams.get('edit');
  const quizId = paramQuizId || queryQuizId;
  const isEditMode = !!quizId;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { current: quiz, status, error } = useSelector((state) => state.quizzes);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const canManageQuizzes = user?.role === 'admin' || user?.role === 'instructor';

  useEffect(() => {
    if (!canManageQuizzes) {
      return;
    }

    if (quizId) {
      dispatch(fetchQuizById(quizId));
    }
  }, [dispatch, quizId, canManageQuizzes]);

  if (!canManageQuizzes) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setSubmitError('');
    setSuccessMessage('');
    try {
      if (isEditMode) {
        await dispatch(updateQuiz({ quizId, payload })).unwrap();
        await dispatch(fetchQuizzes());
        setSuccessMessage('Quiz updated successfully!');
      } else {
        await dispatch(createQuiz(payload)).unwrap();
        await dispatch(fetchQuizzes());
        setSuccessMessage('Quiz created successfully!');
        setResetSignal((prev) => prev + 1);
      }
      return true;
    } catch (err) {
      setSubmitError(err?.message || `Failed to ${isEditMode ? 'update' : 'create'} quiz`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (isEditMode) {
    if (status === 'loading' && (!quiz || quiz._id !== quizId)) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading quiz…</p>
        </div>
      );
    }

    if (status === 'failed' && (!quiz || quiz._id !== quizId)) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
          <p>{error || 'Unable to load quiz.'}</p>
        </div>
      );
    }

    if (!quiz || quiz._id !== quizId) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading quiz…</p>
        </div>
      );
    }
  }

  return (
    <section style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }}>
        <button
          type="button"
          className="primary-btn outline"
          onClick={() => navigate('/dashboard')}
          style={{ 
            marginBottom: '1rem', 
            width: 'fit-content',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
          Back to Dashboard
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <BookOpen size={32} />
          <h1 style={{ margin: 0, fontSize: '2rem' }}>
            {isEditMode ? 'Edit Quiz' : 'Create New Quiz'}
          </h1>
        </div>
        <p style={{ margin: 0, opacity: 0.9 }}>
          {isEditMode 
            ? 'Update the quiz content or correct answer set. Changes apply immediately for students.'
            : 'Design your quiz with multiple-choice or coding questions. Add as many questions as you need.'
          }
        </p>
      </div>
      <QuizForm
        initialQuiz={isEditMode ? quiz : null}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={isEditMode ? 'Save Changes' : 'Publish Quiz'}
        isSubmitting={isSubmitting}
        errorMessage={submitError}
        successMessage={successMessage}
        resetSignal={resetSignal}
      />
    </section>
  );
};

export default ManageQuizPage;
