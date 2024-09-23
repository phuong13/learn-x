import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
const AuthContext = createContext();

export const AuthProvider = (props) => {
    const getAccessTokenFromCookie = () => {
        const accessToken = Cookies.get('access_token');

        return accessToken ? true : false;
    };

    const getUserFromLocalStorage = () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    };
    const [authUser, setAuthUser] = useState(getUserFromLocalStorage());
    const [isAuthenticated, setIsAuthenticated] = useState(getAccessTokenFromCookie());

    const value = { authUser, setAuthUser, isAuthenticated, setIsAuthenticated };

    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
