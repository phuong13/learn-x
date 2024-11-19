import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

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

// utils
// eslint-disable-next-line no-unused-vars
import ProtectedRoute from './utils/ProtectedRoute';

// contexts
import { AuthProvider } from './contexts/auth/AuthContext';

// services
import Loader from './components/Loader';
import AuthService from './services/auth/auth.service';

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
            <Suspense fallback={<Loader isLoading />}>
                <ScrollToTop />
                <div className="main">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register/verify" element={<ConfirmRegister />} />
                        <Route path="reset-password" element={<ResetPassword />} />
                        <Route path="/identify" element={<IdentifyAccount />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="/public" element={<HomePage />} />
                        <Route path="/my-course" element={<MyCourse />} />
                        <Route path="/dashboard" element={<DashBoard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/course-detail/:courseId" element={<DetailCourse />} />
                        <Route path="/submission" element={<Submission />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/add-course" element={<AddCourse />} />
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
