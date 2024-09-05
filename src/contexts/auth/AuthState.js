import User from './User.model';

const AuthState = {
    isAuthenticated: Boolean,
    isInitialized: Boolean,
    user: User | null,
};

export default AuthState;
