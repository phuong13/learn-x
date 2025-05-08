import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import '@styles/index.scss';

import ScrollToTop from './components/ScrollToTop';
import Loader from './components/Loader';
import ProtectedRoute from './utils/ProtectedRoute';
import { AuthProvider } from './contexts/auth/AuthContext';
import AuthService from './services/auth/auth.service';
import AppLayout from './layout/AppLayout';

// Lazy-loaded pages
const MyCourse = lazy(() => import('./pages/MyCourse'));
const HomePage = lazy(() => import('./pages/HomePage'));
const DetailCourse = lazy(() => import('./pages/DetailCourse'));
const Login = lazy(() => import('./pages/Login'));
const ConfirmRegister = lazy(() => import('./pages/ConfirmRegister'));
const IdentifyAccount = lazy(() => import('./pages/IdentifyAccount'));
const Profile = lazy(() => import('./pages/Profile'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const DashBoard = lazy(() => import('./pages/DashBoard'));
const Submission = lazy(() => import('./pages/Submission'));
const AddCourse = lazy(() => import('./pages/AddCourse'));
const EditCourseContent = lazy(() => import('./components/EditCourseContent'));
const Grading = lazy(() => import('./pages/Grade'));
const Forum = lazy(() => import('./pages/Forum'));
const AddQuiz = lazy(() => import('./pages/AddQuiz'));

function App() {
  const navigate = useNavigate();

  function Logout() {
    useEffect(() => {
      const logout = async () => {
        await AuthService.logout();
        console.log("Logout successfully!");
        navigate('/login');
      };
      logout();
    }, []);

    return null;
  }

  return (
    <AuthProvider>
      <ToastContainer
        position="top-right"
        // autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <Suspense fallback={<Loader isLoading />}>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register/verify" element={<ConfirmRegister />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/identify" element={<IdentifyAccount />} />

          {/* Protected Routes with Layout */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/" element={<HomePage />} />
            <Route path="/my-course" element={<MyCourse />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:forumId" element={<Forum />} />
            <Route path="/add-quiz" element={<AddQuiz />} />
            <Route path="/course-detail/:courseId" element={<DetailCourse />} />
            <Route path="/course-detail/:courseId/edit" element={<EditCourseContent />} />
            <Route path="/submission/:courseId/:assignmentId" element={<Submission />} />
            <Route path="/add-course" element={<AddCourse />} />
            <Route path="/grading/:courseId/:assignmentId" element={<Grading />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
