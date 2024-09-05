import axiosInstance from '../../axios';
import Cookies from 'js-cookie';
import AuthLoginResponse from './auth.dto';
const BASE_AUTH_URL = '/auth';

class AuthService {
    static login = async (email, password) => {
        const routePath = `${BASE_AUTH_URL}/authenticate`;
        console.log(email, password);
        const data = await axiosInstance
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
                localStorage.setItem('access_token', res.data.data.accessToken);
                return res.data;
            })
            .catch((err) => {
                console.log(err);
            });
        return data;
        // localStorage.setItem('access_token', data.data.access_token);
    };

    static async loginGoogle(idToken) {
        const routePath = `${BASE_AUTH_URL}/oauth2/google`;
        console.log(idToken);
        const { data } =
            (await axiosInstance.post) <
            AuthLoginResponse >
            (routePath,
            { idToken: idToken },
            {
                withCredentials: true,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

        localStorage.setItem('access_token', data.data.access_token);
        console.log(data);
        return data;
    }

    static async logout() {
        Cookies.remove('access_token');
        localStorage.clear();
    }
}

export default AuthService;
