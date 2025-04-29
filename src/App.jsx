import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import 'react-toastify/ReactToastify.min.css';
// styles
import '@styles/index.scss';
import 'react-toastify/dist/ReactToastify.min.css';
// fonts

// components
import ScrollToTop from './components/ScrollToTop';
// hooks

// pages
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
const AddQuiz = lazy(()=>import('./pages/AddQuiz'))
// utils

import ProtectedRoute from './utils/ProtectedRoute';

// contexts
import { AuthProvider } from './contexts/auth/AuthContext';

// services
import Loader from './components/Loader';
import AuthService from './services/auth/auth.service';
import { Bounce, ToastContainer } from 'react-toastify';
// import EditCourseContent from '@components/EditCourseContent.jsx';

function App() {
    // const { mode, setMode } = useColorScheme();
    // if (!mode) {
    //     return null;
    // }

    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!isLoggedIn && path !== '/login') {
    //         navigate('/login');
    //     }
    // }, [isLoggedIn, path, navigate]);

    return (
        <AuthProvider>
            <ToastContainer
                position="top-right"
                autoClose={3000}
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
                <div className="main">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register/verify" element={<ConfirmRegister />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/identify" element={<IdentifyAccount />} />
                        <Route path="/" element={<ProtectedRoute><HomePage/></ProtectedRoute>} />
                        <Route path="/public" element={<ProtectedRoute><HomePage/></ProtectedRoute>} />
                        <Route path="/my-course" element={<ProtectedRoute><MyCourse/></ProtectedRoute>} />
                        <Route path="/dashboard" element={<ProtectedRoute><DashBoard/></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
                        <Route path="/forum" element={<Forum/>} />

                        <Route path="/forum/:forumId" element={<Forum/>} />
                        <Route path="/add-quiz" element={<AddQuiz/>} />
                        <Route path="/course-detail/:courseId" element={<ProtectedRoute><DetailCourse/></ProtectedRoute>} />
                        <Route path="/course-detail/:courseId/edit" element={<ProtectedRoute><EditCourseContent/></ProtectedRoute>} />
                        <Route path="/submission/:courseId/:assignmentId" element={<ProtectedRoute><Submission/></ProtectedRoute>} />
                        <Route path="/add-course" element={<ProtectedRoute><AddCourse/></ProtectedRoute>} />
                        <Route path="/grading/:courseId/:assignmentId" element={<ProtectedRoute><Grading/></ProtectedRoute>} />
                        <Route path="/logout" element={<ProtectedRoute><Logout/></ProtectedRoute>} />

                    </Routes>
                </div>
            </Suspense>
        </AuthProvider>
    );

    function Logout() {
        useEffect(() => {
            const logout = async () => {
                await AuthService.logout();
            }
            logout().then(r => console.log("Logout successfully!"));
            navigate('/login');
        }, []);

        return null;
    }
}

export default App;
