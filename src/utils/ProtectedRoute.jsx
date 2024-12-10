import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.isAuthenticated || !auth.authUser) {
            navigate('/login');
        }
    }, [auth, navigate]);

    if (!auth.isAuthenticated || !auth.authUser) {
        return null;
    }

    return children;
};

export default ProtectedRoute;
