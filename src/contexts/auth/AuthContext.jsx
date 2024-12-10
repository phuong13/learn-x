import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';


const AuthContext = createContext();

export const AuthProvider = (props) => {
    const getAccessTokenFromCookie = () => {
        const accessToken = localStorage.getItem('access_token');
        return !!accessToken;
    };

    const getUserFromLocalStorage = () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    };

    const [authUser, setAuthUser] = useState(getUserFromLocalStorage());
    const [isAuthenticated, setIsAuthenticated] = useState(getAccessTokenFromCookie());

    useEffect(() => {
        setAuthUser(getUserFromLocalStorage());
    }, []);

    useEffect(() => {
        if (!authUser) {
            setIsAuthenticated(false);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
        }
    }, [authUser]);

    const value = { authUser, setAuthUser, isAuthenticated, setIsAuthenticated };

    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
