import { useEffect } from 'react';
import { useAuth } from '../contexts/auth/useAuth';
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
