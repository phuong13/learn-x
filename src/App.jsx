/* eslint-disable no-unused-vars */

import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { useTheme } from 'styled-components';
// styles
import '@styles/index.scss';
import 'react-toastify/dist/ReactToastify.min.css';
import { CircularProgress, CssBaseline, ThemeProvider, useColorScheme } from '@mui/material';
// fonts

// components
import ScrollToTop from '@components/ScrollToTop';
// hooks

// pages
const MyCourse = lazy(() => import('./pages/MyCourse'));
const HomePage = lazy(() => import('./pages/HomePage'));
const DetailCourse = lazy(() => import('@/pages/DetailCourse'));
const Login = lazy(() => import('@/pages/Login'));
const Home = lazy(() => import('@/pages/Home'));
const ConfirmRegister = lazy(() => import('@/pages/ConfirmRegister'));
const IdentifyAccount = lazy(() => import('@/pages/IdentifyAccount'));
const Profile = lazy(() => import('@/pages/Profile'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const DashBoard = lazy(() => import('@/pages/DashBoard'));
const Submission = lazy(() => import('@/pages/Submission'));
const AddCourse = lazy(() => import('@/pages/AddCourse'));
// utils

// contexts
import { useWindowSize } from 'react-use';

import theme from './theme/theme';
import { AuthProvider } from './contexts/auth/AuthContext';
import { GlobalLoader } from './components/GlobalLoader';
import Loader from './components/Loader';
import { useAuth } from './contexts/auth/useAuth';
import ProtectedRoute from './utils/ProtectedRoute';
import AuthService from './services/auth/auth.service';

function App() {
    // const { mode, setMode } = useColorScheme();
    // if (!mode) {
    //     return null;
    // }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { width } = useWindowSize();
    const path = useLocation().pathname;
    const withSidebar = path !== '/login' && path !== '/404';
    const navigate = useNavigate();
    const isLoggedIn = useAuth();

    // useEffect(() => {
    //     if (!isLoggedIn && path !== '/login') {
    //         navigate('/login');
    //     }
    // }, [isLoggedIn, path, navigate]);

    return (
        <AuthProvider>
            <Suspense fallback={<Loader />}>
                <ScrollToTop />
                <div className="main">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register/verify" element={<ConfirmRegister />} />
                        <Route path="reset-password" element={<ResetPassword />} />
                        <Route path="/identify" element={<IdentifyAccount />} />

                        <Route path="/" element={<HomePage />} />
                        <Route path="/myCourse" element={<MyCourse />} />
                        <Route path="/dashboard" element={<DashBoard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/detailCourse" element={<DetailCourse />} />
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
            AuthService.logout();
            navigate('/login');
        }, []);

        return null;
    }
}

export default App;
