import { useEffect } from 'react';
import { useAuth } from '@hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate('/login');
        }
    }, [auth, navigate]);

    return children;
};

export default ProtectedRoute;
