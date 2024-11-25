import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = (props) => {
    const getAccessTokenFromCookie = () => {
        const accessToken = Cookies.get('access_token');
        console.log('Cookies: ', Cookies.get());
        console.log('Document Cookies: ', document.cookie);
        console.log('getAccessTokenFromCookie: ' + accessToken);
        return !!accessToken;
    };

    const getUserFromLocalStorage = () => {
        const user = localStorage.getItem('user');
        console.log('getUserFromLocalStorage: ' + user);
        return user ? JSON.parse(user) : null;
    };

    const [authUser, setAuthUser] = useState(getUserFromLocalStorage());
    const [isAuthenticated, setIsAuthenticated] = useState(getAccessTokenFromCookie());

    useEffect(() => {
        if (!authUser) {
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
