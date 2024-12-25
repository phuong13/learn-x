import axios from '../../axios/axios';

const BASE_AUTH_URL = '/auth';

class AuthService {
    static register = async (fullName, email, password) => {
        const routePath = `${BASE_AUTH_URL}/register`;
        return await axios
            .post(
                routePath,
                { email, fullName, password },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                },
            )
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.log(err);
                return err;
            });
    };

    static verifyEmail = async (otp, email) => {
        const routePath = `${BASE_AUTH_URL}/register/confirm`;
        const res = await axios
            .post(
                routePath,
                { otp, email },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                },
            )
            .then((res) => {
                console.log('AXIOS:::', res);

                return res;
            })
            .catch((err) => {
                console.log(err);
            });
        return res;
    };

    static resendOtp = async (email) => {
        const routePath = `${BASE_AUTH_URL}/resend-otp`;
        try {
            const res = await axios.post(
                routePath,
                { email },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                },
            );
            return res;
        } catch (error) {
            return {
                error: true,
                response: error.response,
            };
        }
    };

    static login = async (email, password) => {
        const routePath = `${BASE_AUTH_URL}/authenticate`;
        return await axios
            .post(
                routePath,
                { email, password },
                {
                    // withCredentials: true,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                },
            )
            .then((res) => {
                // localStorage.setItem('access_token', res.data.data.accessToken);
                // localStorage.setItem('refresh_token', res.data.refreshToken);
                const { accessToken, refreshToken, ...user } = res.data.data;
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('refresh_token', refreshToken);
                localStorage.setItem('user', JSON.stringify(user));

                return res.data;
            })
            .catch((err) => {
                return err;
            });
    };

    static logout = async () => {
        const routePath = `${BASE_AUTH_URL}/logout`;
        return await axios.post(routePath).then((res) => {
            console.log(res);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            return res.data;
        });
    };

    static async loginGoogle(idToken) {
        const routePath = `${BASE_AUTH_URL}/oauth2/google`;
        return await axios
            .post(
                routePath,
                { idToken: idToken },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                },
            )
            .then((res) => {
                console.log(res);
                const { accessToken, refreshToken, ...user } = res.data.data;
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('refresh_token', refreshToken);
                localStorage.setItem('user', JSON.stringify(user));
                return res.data;
            })
            .catch((err) => {
                return err.response.data;
            });
    }

    static async sendForgotPasswordEmail(email) {
        const routePath = `${BASE_AUTH_URL}/forgot-password`;
        const data = await axios
            .post(
                routePath,
                { email },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                },
            )
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return err;
            });

        return data;
    }

    static async resetPassword(token, password) {
        const routePath = `${BASE_AUTH_URL}/forgot-password/confirm`;
        return await axios
            .post(
                routePath,
                { token, password },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                },
            )
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return err;
            });
    }
}

export default AuthService;
