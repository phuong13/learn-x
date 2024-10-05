import axios from '../../axios/axios';
import Cookies from 'js-cookie';
const BASE_AUTH_URL = '/auth';

class AuthService {
    static register = async (fullName, email, password) => {
        const routePath = `${BASE_AUTH_URL}/register`;
        const res = await axios
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
            });
        return res;
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
        const data = await axios
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
                Cookies.set('access_token', accessToken);
                Cookies.set('refresh_token', refreshToken);
                localStorage.setItem('user', JSON.stringify(user));

                return res.data;
            })
            .catch((err) => {
                console.log(err);
            });
        return data;
    };

    static async loginGoogle(idToken) {
        const routePath = `${BASE_AUTH_URL}/oauth2/google`;
        console.log(idToken);
        const data = await axios
            .post(
                routePath,
                { idToken: idToken },
                {
                    withCredentials: true,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                },
            )
            .then((res) => {
                console.log(res);
                const { accessToken, refreshToken, ...user } = res.data.data;
                Cookies.remove('access_token');
                Cookies.remove('refresh_token');
                Cookies.set('access_token', accessToken);
                Cookies.set('refresh_token', refreshToken);
                localStorage.setItem('user', JSON.stringify(user));
                return res.data;
            })
            .catch((err) => {
                console.log(err);
            });

        return data;
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
                console.log(err);
            });

        return data;
    }

    static async resetPassword(token, password) {
        const routePath = `${BASE_AUTH_URL}/forgot-password/confirm`;
        const data = await axios
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
                console.log(err);
            });

        return data;
    }

    static async logout() {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        localStorage.clear();
    }
}

export default AuthService;
