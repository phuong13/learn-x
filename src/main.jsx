import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from '@mui/material';
import './config/i18n.js';

import { BrowserRouter } from 'react-router-dom';

import theme from './theme/theme';

import './styles/index.scss';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ThemeProvider theme={theme}>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <App />
            </GoogleOAuthProvider>
        </ThemeProvider>
    </BrowserRouter>,
);
