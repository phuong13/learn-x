import { useContext } from 'react';
import AuthContext from '../contexts/auth/AuthContext.jsx';

export const useAuth = () => {
    return useContext(AuthContext);
};
