import { useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Build timestamp: 2025-10-06T08:39:00Z - Force cache invalidation
const BUILD_VERSION = '2.0.0-revamped-ui';
import './styles/globals.css';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LandingPageNew from './pages/LandingPageNew.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPageRevamped from './pages/DashboardPageRevamped.jsx';
import FaceEnrollmentPage from './pages/FaceEnrollmentPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import ResultDetailPage from './pages/ResultDetailPage.jsx';
import ManageQuizPage from './pages/ManageQuizPage.jsx';
import AboutPageRevamped from './pages/AboutPageRevamped.jsx';
import MyAttemptsPage from './pages/MyAttemptsPage.jsx';
import RecentActivityPage from './pages/RecentActivityPage.jsx';
import AvailableQuizzesPage from './pages/AvailableQuizzesPage.jsx';
import AdminReferenceManager from './components/AdminReferenceManager.jsx';
import { loadProfile } from './store/slices/authSlice.js';

const App = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const profileRequestedRef = useRef(false);
  const requiresVerification =
    user && user.role === 'student' && Boolean(user.hasReferenceFace) && !user.isFaceVerified;
  const missingReference = user && user.role === 'student' && !user.hasReferenceFace;

  useEffect(() => {
    if (!token) {
      profileRequestedRef.current = false;
      return;
    }

    if (profileRequestedRef.current) return;

    profileRequestedRef.current = true;
    dispatch(loadProfile());
  }, [dispatch, token]);

  return (
    <div className="app-shell">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPageNew />} />
          <Route path="/about" element={<AboutPageRevamped />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/face-enrollment"
            element={
              <ProtectedRoute>
                <FaceEnrollmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {requiresVerification || missingReference ? (
                  <Navigate to="/face-enrollment" replace />
                ) : (
                  <DashboardPageRevamped />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:quizId"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/quizzes/:quizId"
            element={
              <ProtectedRoute>
                <ManageQuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <ResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results/:resultId"
            element={
              <ProtectedRoute>
                <ResultDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-attempts"
            element={
              <ProtectedRoute>
                <MyAttemptsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity"
            element={
              <ProtectedRoute>
                <RecentActivityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quizzes"
            element={
              <ProtectedRoute>
                <AvailableQuizzesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-quiz"
            element={
              <ProtectedRoute>
                <ManageQuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/references"
            element={
              <ProtectedRoute>
                <AdminReferenceManager />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
