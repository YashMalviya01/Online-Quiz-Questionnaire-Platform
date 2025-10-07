import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ProctoringWrapper from '../components/ProctoringWrapper.jsx';
import CodeEditor from '../components/CodeEditor.jsx';
import { fetchQuizById } from '../store/slices/quizSlice.js';
import { startExam, submitExam } from '../store/slices/resultSlice.js';
import { verifyFaceDescriptor } from '../store/slices/authSlice.js';
import faceapi, { loadFaceApiModels } from '../utils/faceApiLoader.js';
import { getQuizId, getResultUserId, getUserId } from '../utils/idUtils.js';
import { Camera, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const QuizPage = () => {
  const { quizId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: quiz, status: quizStatus } = useSelector((state) => state.quizzes);
  const { current: result } = useSelector((state) => state.results);
  const { user } = useSelector((state) => state.auth);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  
  // Timer states
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const timerInterval = useRef(null);
  
  // Face verification states
  const [faceVerificationComplete, setFaceVerificationComplete] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('idle'); // idle, loading, ready, verifying, success, error
  const [verificationMessage, setVerificationMessage] = useState('');
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const currentUserId = useMemo(() => getUserId(user), [user]);

  useEffect(() => {
    dispatch(fetchQuizById(quizId));
  }, [dispatch, quizId]);

  useEffect(() => {
    if (quiz && (!result || result.quiz !== quiz._id || result.status !== 'in-progress')) {
      dispatch(startExam(quiz._id));
    }
  }, [dispatch, quiz, result]);

  // Initialize timer when quiz loads
  useEffect(() => {
    if (quiz?.timeLimit && result?.status === 'in-progress') {
      const startTime = Date.now();
      setQuizStartTime(startTime);
      setTimeRemaining(quiz.timeLimit * 60); // Convert minutes to seconds

      // Start countdown
      timerInterval.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = (quiz.timeLimit * 60) - elapsed;
        
        if (remaining <= 0) {
          setTimeRemaining(0);
          clearInterval(timerInterval.current);
          // Auto-submit when time runs out
          handleSubmit();
        } else {
          setTimeRemaining(remaining);
        }
      }, 1000);

      return () => {
        if (timerInterval.current) {
          clearInterval(timerInterval.current);
        }
      };
    }
  }, [quiz, result]);

  // Check if quiz has expired
  const isQuizExpired = useMemo(() => {
    if (!quiz?.expiryDate) return false;
    return new Date(quiz.expiryDate) < new Date();
  }, [quiz]);

  // Get all results to check attempts
  const { list: allResults } = useSelector((state) => state.results);

  // Check attempts remaining
  const { attemptsTaken, attemptsRemaining, canTakeQuiz } = useMemo(() => {
    const quizId = getQuizId(quiz);
    if (!quizId || !currentUserId) {
      return { attemptsTaken: 0, attemptsRemaining: null, canTakeQuiz: true };
    }
    
    // Get all results for this quiz by this user
    const userResults = allResults.filter((r) => {
      const resultQuizId = getQuizId(r.quiz);
      const resultUserId = getResultUserId(r);
      const statusMatch = r.status === 'submitted' || r.status === 'completed';
      return statusMatch && resultQuizId === quizId && resultUserId === currentUserId;
    });
    
    const taken = userResults.length;
    const maxAttempts = quiz.maxAttempts;
    
    if (!maxAttempts) {
      return { attemptsTaken: taken, attemptsRemaining: null, canTakeQuiz: true };
    }
    
    const remaining = maxAttempts - taken;
    return { 
      attemptsTaken: taken, 
      attemptsRemaining: remaining, 
      canTakeQuiz: remaining > 0 
    };
  }, [quiz, allResults, currentUserId]);

  // Check if user needs face verification
  useEffect(() => {
    if (user) {
      // Admin or already verified - skip face verification
      if (user.role === 'admin' || user.role === 'instructor' || user.isFaceVerified) {
        setFaceVerificationComplete(true);
      }
      // No reference face - skip verification but show warning
      else if (!user.hasReferenceFace) {
        setFaceVerificationComplete(true);
      }
      // Student with reference face but not verified - needs verification
      else if (user.role === 'student' && user.hasReferenceFace && !user.isFaceVerified) {
        setFaceVerificationComplete(false);
        setVerificationStatus('idle');
      }
    }
  }, [user]);

  // Enable camera for face verification
  const enableCamera = async () => {
    try {
      setVerificationStatus('loading');
      setVerificationMessage('Loading face detection models...');
      
      // Load face-api models
      await loadFaceApiModels();
      
      setVerificationMessage('Requesting camera access...');
      
      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setVerificationStatus('ready');
      setVerificationMessage('Camera ready. Click "Verify my identity" to begin.');
    } catch (error) {
      console.error('Camera access error:', error);
      setVerificationStatus('error');
      setVerificationMessage(
        error.name === 'NotAllowedError' 
          ? 'Camera access denied. Please allow camera access in your browser settings.'
          : 'Failed to access camera. Please check your camera connection.'
      );
    }
  };

  // Verify face identity
  const verifyIdentity = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      setVerificationStatus('verifying');
      setVerificationMessage('Analyzing your face...');

      // Capture frame and detect face
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks(true)
        .withFaceDescriptor();

      if (!detection) {
        setVerificationStatus('error');
        setVerificationMessage('No face detected. Please ensure your face is clearly visible and try again.');
        return;
      }

      // Send descriptor to backend for verification
      const descriptor = Array.from(detection.descriptor);
      await dispatch(verifyFaceDescriptor(descriptor)).unwrap();

      // Success
      setVerificationStatus('success');
      setVerificationMessage('Identity confirmed! You may now start the quiz.');
      
      // Stop camera stream
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }

      // Wait a moment then proceed
      setTimeout(() => {
        setFaceVerificationComplete(true);
      }, 2000);
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      setVerificationMessage(
        error.message || 'Verification failed. Please adjust lighting and try again.'
      );
    }
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const questions = useMemo(() => quiz?.questions ?? [], [quiz]);
  const currentQuestion = questions[currentIndex];
  const currentResponse = currentQuestion ? answers[currentQuestion._id] || {} : {};

  useEffect(() => {
    if (quiz?._id) {
      setAnswers({});
      setCurrentIndex(0);
    }
  }, [quiz?._id]);

  const isQuestionAnswered = useCallback((question, response) => {
    if (!question) return false;
    const value = response || {};

    switch (question.questionType) {
      case 'multiple-choice':
      case 'true-false':
        return Boolean(value.selectedOption);
      case 'code':
        return Boolean(value.codeAnswer && value.codeAnswer.trim());
      case 'fill-in-blank': {
        const totalBlanks = question.blankAnswers?.length || 1;
        const blanks = Array.isArray(value.blankAnswers) ? value.blankAnswers : [];
        if (blanks.length < totalBlanks) return false;
        return blanks.every((answer) => typeof answer === 'string' && answer.trim());
      }
      case 'matching': {
        const requiredMatches = question.matchingPairs?.length || 0;
        const matches = Array.isArray(value.matchingAnswers) ? value.matchingAnswers : [];
        if (matches.length < requiredMatches) return false;
        return question.matchingPairs.every((pair) => {
          const userPair = matches.find((entry) => entry.left === pair.left);
          return userPair && userPair.right;
        });
      }
      case 'essay':
        return Boolean(value.essayAnswer && value.essayAnswer.trim());
      case 'file-upload':
        return Array.isArray(value.uploadedFiles) && value.uploadedFiles.length > 0;
      default:
        return Boolean(value.selectedOption);
    }
  }, []);

  const { answeredCount, unansweredCount } = useMemo(() => {
    const answered = questions.reduce((count, question) => {
      const response = answers[question._id];
      return isQuestionAnswered(question, response) ? count + 1 : count;
    }, 0);

    return {
      answeredCount: answered,
      unansweredCount: Math.max(questions.length - answered, 0)
    };
  }, [questions, answers, isQuestionAnswered]);

  // Ensure currentIndex is valid for the available questions
  useEffect(() => {
    if (questions.length === 0) {
      setCurrentIndex(0);
      return;
    }

    setCurrentIndex((prev) => {
      if (prev >= questions.length) {
        return questions.length - 1;
      }
      if (prev < 0) {
        return 0;
      }
      return prev;
    });
  }, [questions.length]);

  const updateAnswer = useCallback((questionId, updater) => {
    setAnswers((prev) => {
      const current = prev[questionId] || {};
      const next = updater(current) || {};
      return {
        ...prev,
        [questionId]: next
      };
    });
  }, []);

  const handleSelectOption = useCallback(
    (questionId, option) => {
      updateAnswer(questionId, (current) => ({
        ...current,
        selectedOption: option
      }));
    },
    [updateAnswer]
  );

  const handleCodeChange = useCallback(
    (questionId, code) => {
      updateAnswer(questionId, (current) => ({
        ...current,
        codeAnswer: code
      }));
    },
    [updateAnswer]
  );

  const handleBlankChange = useCallback(
    (questionId, blankIndex, value, totalBlanks) => {
      updateAnswer(questionId, (current) => {
        const blanks = Array.from({ length: totalBlanks }, (_, idx) => current.blankAnswers?.[idx] || '');
        blanks[blankIndex] = value;
        return {
          ...current,
          blankAnswers: blanks
        };
      });
    },
    [updateAnswer]
  );

  const handleMatchingChange = useCallback(
    (questionId, leftPrompt, value) => {
      updateAnswer(questionId, (current) => {
        const matches = Array.isArray(current.matchingAnswers) ? [...current.matchingAnswers] : [];
        const existingIndex = matches.findIndex((pair) => pair.left === leftPrompt);
        const nextPair = { left: leftPrompt, right: value };
        if (existingIndex >= 0) {
          matches[existingIndex] = nextPair;
        } else {
          matches.push(nextPair);
        }
        return {
          ...current,
          matchingAnswers: matches
        };
      });
    },
    [updateAnswer]
  );

  const handleEssayChange = useCallback(
    (questionId, value) => {
      updateAnswer(questionId, (current) => ({
        ...current,
        essayAnswer: value
      }));
    },
    [updateAnswer]
  );

  const handleFileUpload = useCallback(
    (questionId, fileList) => {
      const summaries = Array.from(fileList || []).map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));
      updateAnswer(questionId, (current) => ({
        ...current,
        uploadedFiles: summaries
      }));
    },
    [updateAnswer]
  );

  const goNext = () => {
    setCurrentIndex((prev) => {
      const lastIndex = Math.max(questions.length - 1, 0);
      return Math.min(prev + 1, lastIndex);
    });
  };

  const goBack = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!result || !quiz) return;
    setSubmitting(true);

    const submission = questions.reduce(
      (acc, question) => {
        const response = answers[question._id] || {};
        const entry = { questionId: question._id };
        const maxScore = Number(question.maxScore) > 0 ? Number(question.maxScore) : 1;

        switch (question.questionType) {
          case 'multiple-choice':
            entry.selectedOption = response.selectedOption || '';
            if (entry.selectedOption) {
              const normalized = `${entry.selectedOption}`.trim().toLowerCase();
              const normalizedCorrect = `${question.correctAnswer || ''}`.trim().toLowerCase();
              if (normalized && normalized === normalizedCorrect) {
                acc.score += maxScore;
              }
            }
            acc.maxScore += maxScore;
            break;
          case 'true-false': {
            const selected = response.selectedOption ?? '';
            entry.selectedOption = selected;
            if (selected !== '') {
              const normalized = `${selected}`.trim().toLowerCase();
              const normalizedCorrect = `${question.correctAnswer || ''}`.trim().toLowerCase();
              if (normalized && normalized === normalizedCorrect) {
                acc.score += maxScore;
              }
            }
            acc.maxScore += maxScore;
            break;
          }
          case 'code': {
            const codeAnswer = response.codeAnswer || '';
            entry.textAnswer = codeAnswer;
            entry.codeAnswer = codeAnswer;
            acc.maxScore += maxScore;
            break;
          }
          case 'fill-in-blank': {
            const blanks = Array.isArray(response.blankAnswers)
              ? response.blankAnswers
              : Array.from({ length: question.blankAnswers?.length || 1 }, () => '');
            entry.blankAnswers = blanks;
            entry.textAnswer = blanks.join(' || ');
            entry.partialCredit = Boolean(question.partialCredit);
            acc.maxScore += maxScore;
            break;
          }
          case 'matching': {
            const matches = Array.isArray(response.matchingAnswers) ? response.matchingAnswers : [];
            entry.matchingAnswers = matches;
            entry.textAnswer = matches
              .filter((pair) => pair && pair.left && pair.right)
              .map((pair) => `${pair.left} → ${pair.right}`)
              .join(' | ');
            entry.partialCredit = Boolean(question.partialCredit);
            acc.maxScore += maxScore;
            break;
          }
          case 'essay': {
            const essayAnswer = response.essayAnswer || '';
            entry.essayAnswer = essayAnswer;
            entry.textAnswer = essayAnswer;
            acc.maxScore += maxScore;
            break;
          }
          case 'file-upload': {
            const uploads = Array.isArray(response.uploadedFiles) ? response.uploadedFiles : [];
            entry.uploadedFiles = uploads;
            entry.textAnswer = uploads.map((file) => file.name).join(', ');
            entry.maxFileSize = question.maxFileSize;
            acc.maxScore += maxScore;
            break;
          }
          default:
            entry.selectedOption = response.selectedOption || '';
            acc.maxScore += maxScore;
        }

        acc.answers.push(entry);
        return acc;
      },
      { answers: [], score: 0, maxScore: 0 }
    );

    try {
      await dispatch(
        submitExam({
          resultId: result._id,
          answers: submission.answers,
          score: submission.score
        })
      ).unwrap();
      navigate(`/results/${result._id}`);
    } catch (error) {
      // notify user? For now console
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatFileSize = useCallback((bytes) => {
    if (!Number.isFinite(bytes) || bytes <= 0) {
      return '';
    }
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${bytes} B`;
  }, []);

  if (quizStatus === 'loading' || !quiz) {
    return <p>Loading quiz…</p>;
  }

  // Show face verification screen if needed
  if (!faceVerificationComplete && user?.role === 'student' && user?.hasReferenceFace && !user?.isFaceVerified) {
    return (
      <section className="card" style={{ maxWidth: '900px', margin: '2rem auto' }}>
        <h1>Face Verification</h1>
        <p style={{ color: '#64748b', maxWidth: '600px', marginBottom: '1.5rem' }}>
          Please verify your identity before starting proctored exams. The captured frame is used only for comparison with the administrator-approved reference photo.
        </p>

        {/* Verification Status Message */}
        {verificationMessage && (
          <div 
            style={{
              margin: '1rem 0',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              border: '1px solid rgba(148, 163, 184, 0.35)',
              background: 
                verificationStatus === 'success' ? '#dcfce7' :
                verificationStatus === 'error' ? '#fee2e2' :
                verificationStatus === 'verifying' ? '#fef9c3' :
                '#f1f5f9',
              color:
                verificationStatus === 'success' ? '#166534' :
                verificationStatus === 'error' ? '#b91c1c' :
                verificationStatus === 'verifying' ? '#854d0e' :
                '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            {verificationStatus === 'success' && <CheckCircle size={20} />}
            {verificationStatus === 'error' && <XCircle size={20} />}
            {verificationStatus === 'verifying' && <AlertTriangle size={20} />}
            <span>{verificationMessage}</span>
          </div>
        )}

        {/* Camera Preview */}
        <div style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '480px',
                maxWidth: '100%',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                background: '#0f172a',
                display: cameraStream ? 'block' : 'none'
              }}
            />
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />
            {!cameraStream && (
              <div 
                style={{
                  width: '480px',
                  maxWidth: '100%',
                  height: '360px',
                  borderRadius: '12px',
                  border: '2px dashed #cbd5e1',
                  background: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  color: '#64748b'
                }}
              >
                <Camera size={48} />
                <p>Camera preview will appear here</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {!cameraStream && verificationStatus !== 'success' && (
              <button
                type="button"
                className="primary-btn"
                onClick={enableCamera}
                disabled={verificationStatus === 'loading'}
                style={{ minWidth: '200px' }}
              >
                {verificationStatus === 'loading' ? 'Loading...' : 'Enable camera'}
              </button>
            )}
            
            {cameraStream && verificationStatus === 'ready' && (
              <button
                type="button"
                className="primary-btn"
                onClick={verifyIdentity}
                style={{ minWidth: '200px' }}
              >
                Verify my identity
              </button>
            )}

            {verificationStatus === 'error' && cameraStream && (
              <button
                type="button"
                className="primary-btn"
                onClick={verifyIdentity}
                style={{ minWidth: '200px' }}
              >
                Try again
              </button>
            )}
          </div>
        </div>

        {/* Verification Steps */}
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Verification steps</h3>
          <ol style={{ paddingLeft: '1.5rem', margin: 0, color: '#475569', lineHeight: '1.8' }}>
            <li>Click "Enable camera" and allow access in the browser prompt.</li>
            <li>Look directly at the camera with even lighting.</li>
            <li>Press "Verify my identity" to begin the comparison. If you see a mismatch, adjust your lighting and try again.</li>
          </ol>
        </div>

        {/* Back to Dashboard */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'transparent',
              border: '1px solid #cbd5e1',
              padding: '0.5rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#475569'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </section>
    );
  }

  // Check if quiz is expired
  if (isQuizExpired) {
    return (
      <section className="card" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏰</div>
        <h1>Quiz Expired</h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          This quiz expired on {new Date(quiz.expiryDate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}.
        </p>
        <button
          type="button"
          className="primary-btn"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </section>
    );
  }

  // Check if max attempts reached
  if (!canTakeQuiz && user?.role !== 'admin') {
    return (
      <section className="card" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚫</div>
        <h1>Maximum Attempts Reached</h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          You have reached the maximum number of attempts ({quiz.maxAttempts}) for this quiz.
          You have already attempted this quiz {attemptsTaken} time{attemptsTaken !== 1 ? 's' : ''}.
        </p>
        <button
          type="button"
          className="primary-btn"
          onClick={() => navigate('/results')}
        >
          View My Results
        </button>
      </section>
    );
  }

  if (!result) {
    return <p>Preparing your proctoring session…</p>;
  }

  return (
    <ProctoringWrapper resultId={result._id} faceDescriptor={user?.faceDescriptor} quizId={quiz._id}>
      <section className="card" style={{ minHeight: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1>{quiz.title}</h1>
          <span style={{ color: '#94a3b8' }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <p style={{ color: '#64748b', marginBottom: '1rem' }}>{quiz.description}</p>

        {user?.role === 'student' && !user?.hasReferenceFace && (
          <div
            style={{
              marginBottom: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: '1px solid rgba(148, 163, 184, 0.45)',
              background: '#f8fafc',
              color: '#0f172a',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start'
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0, color: '#d97706', marginTop: '0.15rem' }} />
            <div>
              <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Limited proctoring in effect</strong>
              <span style={{ color: '#475569' }}>
                We couldn't find a reference photo for you, so facial matching is disabled for this attempt. Visit your profile to enrol a reference face and unlock full proctoring protection.
              </span>
            </div>
          </div>
        )}

        {/* Timer, Expiry, and Attempts Info */}
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem', 
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          {/* Timer Countdown */}
          {quiz.timeLimit && timeRemaining !== null && (
            <div style={{
              padding: '0.5rem 1rem',
              background: timeRemaining < 300 ? '#fef2f2' : '#eff6ff',
              border: `1px solid ${timeRemaining < 300 ? '#fecaca' : '#bfdbfe'}`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: timeRemaining < 300 ? '#dc2626' : '#2563eb',
              fontWeight: '600'
            }}>
              <span>⏱️</span>
              <span>
                Time Remaining: {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
              </span>
            </div>
          )}

          {/* Max Attempts Info */}
          {quiz.maxAttempts && (
            <div style={{
              padding: '0.5rem 1rem',
              background: '#fef3c7',
              border: '1px solid #fcd34d',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#92400e',
              fontSize: '0.875rem'
            }}>
              <span>📝</span>
              <span>
                Attempt: {attemptsTaken + 1} of {quiz.maxAttempts}
                {attemptsRemaining !== null && ` (${attemptsRemaining} remaining)`}
              </span>
            </div>
          )}

          {/* Expiry Date Warning */}
          {quiz.expiryDate && !isQuizExpired && (
            <div style={{
              padding: '0.5rem 1rem',
              background: '#fef3c7',
              border: '1px solid #fcd34d',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#92400e',
              fontSize: '0.875rem'
            }}>
              <span>📅</span>
              <span>
                Expires: {new Date(quiz.expiryDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}
        </div>

        {/* Question Status Summary */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '1.5rem',
          padding: '1rem',
          background: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{answeredCount}</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Answered</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{unansweredCount}</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Unanswered</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>{questions.length}</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Total</div>
          </div>
        </div>

        {/* Question Navigation */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Question Navigation:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {questions.map((q, idx) => {
              const answered = isQuestionAnswered(q, answers[q._id]);
              return (
                <button
                  key={q._id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    border: currentIndex === idx ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    background: answered ? '#10b98133' : '#ffffff',
                    color: currentIndex === idx ? '#2563eb' : '#0f172a',
                    cursor: 'pointer',
                    fontWeight: currentIndex === idx ? '600' : '400',
                    minWidth: '40px'
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Question */}
        {currentQuestion ? (
          <article style={{ marginTop: '1.5rem', minHeight: '300px' }}>
            <h2 style={{ color: '#0f172a', marginBottom: '1rem' }}>{currentQuestion.questionText}</h2>
            
            {/* Multiple Choice Question */}
            {currentQuestion.questionType === 'multiple-choice' && (
              <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
                {currentQuestion.options && currentQuestion.options.length > 0 ? (
                  currentQuestion.options.map((option, optIdx) => {
                    const checked = currentResponse.selectedOption === option;
                    return (
                      <label
                        key={`${currentQuestion._id}-${optIdx}`}
                        style={{
                          padding: '0.9rem 1rem',
                          borderRadius: '10px',
                          border: checked ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          cursor: 'pointer',
                          background: checked ? '#eff6ff' : '#ffffff',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input
                          type="radio"
                          name={currentQuestion._id}
                          value={option}
                          checked={checked}
                          onChange={() => handleSelectOption(currentQuestion._id, option)}
                          style={{ marginRight: '0.75rem' }}
                        />
                        <span style={{ color: '#0f172a' }}>{option}</span>
                      </label>
                    );
                  })
                ) : (
                  <p style={{ color: '#ef4444' }}>No options available for this question.</p>
                )}
              </div>
            )}

            {/* True / False Question */}
            {currentQuestion.questionType === 'true-false' && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                {['True', 'False'].map((option) => {
                  const checked = currentResponse.selectedOption === option;
                  return (
                    <label
                      key={`${currentQuestion._id}-${option}`}
                      style={{
                        padding: '0.9rem 1rem',
                        borderRadius: '10px',
                        border: checked ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        background: checked ? '#eff6ff' : '#ffffff',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <input
                        type="radio"
                        name={currentQuestion._id}
                        value={option}
                        checked={checked}
                        onChange={() => handleSelectOption(currentQuestion._id, option)}
                        style={{ marginRight: '0.75rem' }}
                      />
                      <span style={{ color: '#0f172a' }}>{option}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Code Question */}
            {currentQuestion.questionType === 'code' && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ 
                  padding: '0.75rem', 
                  background: '#f1f5f9', 
                  borderRadius: '6px',
                  marginBottom: '1rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                    <strong>Language:</strong> {currentQuestion.codeLanguage || 'javascript'}
                  </p>
                  {currentQuestion.evaluationNotes && (
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#475569' }}>
                      <strong>Note:</strong> {currentQuestion.evaluationNotes}
                    </p>
                  )}
                </div>
                <CodeEditor
                  initialCode={currentResponse.codeAnswer ?? currentQuestion.starterCode ?? ''}
                  language={currentQuestion.codeLanguage || 'javascript'}
                  onCodeChange={(code) => handleCodeChange(currentQuestion._id, code)}
                  height="400px"
                  showToolbar={false}
                  allowLanguageChange={false}
                />
              </div>
            )}

            {/* Fill in the Blank Question */}
            {currentQuestion.questionType === 'fill-in-blank' && (() => {
              const blankCount = currentQuestion.blankAnswers?.length || 1;
              const answersForBlanks = Array.from({ length: blankCount }, (_, idx) => currentResponse.blankAnswers?.[idx] || '');

              return (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {answersForBlanks.map((value, blankIdx) => (
                    <div key={`${currentQuestion._id}-blank-${blankIdx}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontWeight: 600, color: '#0f172a' }}>Blank {blankIdx + 1}</label>
                      <input
                        value={value}
                        onChange={(event) => handleBlankChange(currentQuestion._id, blankIdx, event.target.value, blankCount)}
                        placeholder={`Enter response for blank ${blankIdx + 1}`}
                        style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  ))}
                  <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span>
                      {currentQuestion.caseSensitive
                        ? 'Answers are case sensitive.'
                        : 'Answers are not case sensitive.'}
                    </span>
                    {currentQuestion.partialCredit && (
                      <span>Partial credit is available for partially correct responses.</span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Matching Question */}
            {currentQuestion.questionType === 'matching' && (() => {
              const rightOptions = Array.from(
                new Set((currentQuestion.matchingPairs || []).map((pair) => pair?.right).filter(Boolean))
              );
              const matches = Array.isArray(currentResponse.matchingAnswers) ? currentResponse.matchingAnswers : [];

              return (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {currentQuestion.matchingPairs?.map((pair, pairIdx) => {
                    const selected = matches.find((entry) => entry.left === pair.left)?.right || '';
                    return (
                      <div
                        key={`${currentQuestion._id}-match-${pairIdx}`}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(160px, 1fr) minmax(200px, 2fr)',
                          gap: '1rem',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{
                          padding: '0.75rem 1rem',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          color: '#0f172a'
                        }}>
                          {pair.left}
                        </div>
                        <select
                          aria-label={`Match for ${pair.left}`}
                          value={selected}
                          onChange={(event) => handleMatchingChange(currentQuestion._id, pair.left, event.target.value)}
                          style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                        >
                          <option value="">Select the matching answer</option>
                          {rightOptions.map((option) => (
                            <option key={`${currentQuestion._id}-target-${option}`} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                  {currentQuestion.partialCredit && (
                    <small style={{ color: '#64748b' }}>Partial credit may be awarded for partially correct matches.</small>
                  )}
                </div>
              );
            })()}

            {/* Essay Question */}
            {currentQuestion.questionType === 'essay' && (
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {currentQuestion.wordLimit && (
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    Word limit: {currentQuestion.wordLimit} words
                  </span>
                )}
                <textarea
                  rows={currentQuestion.wordLimit && currentQuestion.wordLimit <= 200 ? 8 : 10}
                  value={currentResponse.essayAnswer || ''}
                  onChange={(event) => handleEssayChange(currentQuestion._id, event.target.value)}
                  placeholder="Write your response here..."
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    minHeight: '200px',
                    lineHeight: 1.5
                  }}
                />
                {currentQuestion.rubric && (
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                    <strong>Focus on:</strong> {currentQuestion.rubric}
                  </div>
                )}
                {currentQuestion.sampleAnswer && (
                  <details style={{ fontSize: '0.85rem', color: '#475569' }}>
                    <summary style={{ cursor: 'pointer' }}>View instructor sample answer</summary>
                    <p style={{ marginTop: '0.5rem' }}>{currentQuestion.sampleAnswer}</p>
                  </details>
                )}
              </div>
            )}

            {/* File Upload Question */}
            {currentQuestion.questionType === 'file-upload' && (
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label
                    htmlFor={`${currentQuestion._id}-file-upload`}
                    style={{ fontWeight: 600, color: '#0f172a', display: 'block', marginBottom: '0.35rem' }}
                  >
                    Upload supporting files
                  </label>
                  <input
                    id={`${currentQuestion._id}-file-upload`}
                    type="file"
                    multiple
                    accept={(currentQuestion.allowedFileTypes || []).map((ext) => `.${ext}`).join(',') || undefined}
                    onChange={(event) => {
                      handleFileUpload(currentQuestion._id, event.target.files);
                      event.target.value = '';
                    }}
                  />
                  <small style={{ display: 'block', marginTop: '0.35rem', color: '#64748b' }}>
                    {currentQuestion.allowedFileTypes && currentQuestion.allowedFileTypes.length
                      ? `Allowed types: ${currentQuestion.allowedFileTypes.join(', ')}`
                      : 'All file types allowed'}
                    {currentQuestion.maxFileSize &&
                      ` • Max size: ${currentQuestion.maxFileSize} MB per file`}
                  </small>
                </div>
                {Array.isArray(currentResponse.uploadedFiles) && currentResponse.uploadedFiles.length > 0 ? (
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    {currentResponse.uploadedFiles.map((file, idx) => (
                      <li
                        key={`${currentQuestion._id}-file-${idx}`}
                        style={{
                          padding: '0.65rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          background: '#f8fafc',
                          color: '#0f172a',
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '1rem'
                        }}
                      >
                        <span>{file.name}</span>
                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{formatFileSize(file.size)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    No files selected yet. Attach your work before submitting.
                  </p>
                )}
                <small style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Files are stored for manual review. Large uploads may take additional time to process.
                </small>
              </div>
            )}
          </article>
        ) : (
          <div style={{ marginTop: '1.5rem', padding: '2rem', textAlign: 'center', background: '#fef3c7', borderRadius: '8px' }}>
            <p style={{ color: '#92400e' }}>⚠️ Unable to load question. Please try refreshing the page.</p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <button type="button" className="primary-btn" onClick={goBack} disabled={currentIndex === 0}>
            Previous
          </button>
          {currentIndex < questions.length - 1 ? (
            <button type="button" className="primary-btn" onClick={goNext}>
              Next
            </button>
          ) : (
            <button 
              type="button" 
              className="primary-btn" 
              onClick={handleSubmit} 
              disabled={submitting || unansweredCount > 0}
              title={unansweredCount > 0 ? `Please answer all questions (${unansweredCount} remaining)` : 'Submit your exam'}
            >
              {submitting ? 'Submitting…' : unansweredCount > 0 ? `Answer ${unansweredCount} more to submit` : 'Submit Exam'}
            </button>
          )}
        </div>

        {/* Warning for unanswered questions */}
        {currentIndex === questions.length - 1 && unansweredCount > 0 && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#fef3c7',
            border: '1px solid #fbbf24',
            borderRadius: '8px',
            color: '#92400e'
          }}>
            <strong>⚠️ Attention:</strong> You have {unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}. 
            Please answer all questions before submitting.
          </div>
        )}
      </section>
    </ProctoringWrapper>
  );
};

export default QuizPage;
