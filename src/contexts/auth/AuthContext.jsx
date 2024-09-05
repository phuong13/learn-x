import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = (props) => {
    const [authUser, setAuthUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const value = {
        authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn,
    };

    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
