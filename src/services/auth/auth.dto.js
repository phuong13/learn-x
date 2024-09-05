const AuthLoginResponse = {
    success: Boolean,
    code: Number,
    message: String,
    data: {
        accessToken: String,
        refreshToken: String,
        fullName: String,
        email: String,
        avatar: String,
        role: String,
    },
};

export default AuthLoginResponse;
