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
const DetailCourse = lazy(() => import('./pages/DetailCourse'));
const Login = lazy(() => import('@/pages/Login'));
const Home = lazy(() => import('@/pages/Home'));
const ConfirmRegister = lazy(() => import('@/pages/ConfirmRegister'));
const IdentifyAccount = lazy(() => import('@/pages/IdentifyAccount'));
const Profile = lazy(() => import('@/pages/Profile'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
// utils

// contexts
import { useWindowSize } from 'react-use';

import theme from './theme/theme';
import { AuthProvider } from './contexts/auth/AuthContext';
import { GlobalLoader } from './components/GlobalLoader';
import Loader from './components/Loader';
import { useAuth } from './contexts/auth/useAuth';
import ProtectedRoute from './utils/ProtectedRoute';

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
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <HomePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/myCourse"
                            element={
                                <ProtectedRoute>
                                    <MyCourse />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/detailCourse/:id"
                            element={
                                <ProtectedRoute>
                                    <DetailCourse />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        {/*                         <Route path="/" element={<HomePage/>} />        
                         <Route path="/myCourse" element={<MyCourse/>} />  
                     <Route path="/detailCourse" element={<DetailCourse/>} /> */}
                        <Route path="/identify" element={<IdentifyAccount />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register/verify" element={<ConfirmRegister />} />
                        <Route path="reset-password" element={<ResetPassword />} />
                        
                    </Routes>
                </div>
            </Suspense>
        </AuthProvider>
    );
}

export default App;
