/* eslint-disable no-unused-vars */
import { Suspense,lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useTheme } from 'styled-components';
// styles
import '@styles/index.scss';
import 'react-toastify/dist/ReactToastify.min.css';
import { CircularProgress, ThemeProvider, useColorScheme } from '@mui/material';
// fonts

// components
import ScrollToTop from '@components/ScrollToTop';
// hooks

// pages
import Login from '@pages/Login';
const MyCourse = lazy(() => import('./pages/MyCourse'));
const HomePage = lazy(() => import('./pages/HomePage'));
const DetailCourse = lazy(() => import('./pages/DetailCourse'));
// utils

// contexts
import { useWindowSize } from 'react-use';

import theme from './theme/theme';
import { AuthProvider } from './contexts/auth/AuthContext';
function App() {
    // const { mode, setMode } = useColorScheme();
    // if (!mode) {
    //     return null;
    // }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { width } = useWindowSize();
    const path = useLocation().pathname;
    const withSidebar = path !== '/login' && path !== '/404';

    return (
        <ThemeProvider theme={{ theme: theme }}>
            <AuthProvider>
                <ScrollToTop />
                <Suspense fallback={<CircularProgress />}>
                    <div className="main">
                        <Routes>
                            <Route path="/" element={<HomePage/>} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/homePage" element={<HomePage />} />
                            <Route path="/myCourse" element={<MyCourse />} />
                            <Route path="/detailCourse" element={<DetailCourse/>} />
                        </Routes>
                    </div>
                </Suspense>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
