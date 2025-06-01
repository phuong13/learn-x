import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


const baseURL = 'https://learnx-spring-app-86563bbf71fb.herokuapp.com/api/v1';

export default axios.create({
    baseURL: baseURL,
});

export const axiosPrivate = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosPrivate.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('access_token');
        const lang = localStorage.getItem('lang') || 'vi'; // mặc định là 'vi'
        config.headers['Accept-Language'] = lang;

        if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp > currentTime) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            } else {
                const refreshToken = localStorage.getItem('refresh_token');
                console.log('Access token is expired');
                try {
                    const response = await axios.post(`${baseURL}/auth/refresh`, {
                        token: refreshToken
                    });
                    if (!response.data?.data?.accessToken) {
                        useNavigate().navigate('/login');
                        return Promise.reject('Failed to refresh token');
                    }
                    const { accessToken, refreshToken: newRefreshToken, ...user } = response.data.data;
                    localStorage.setItem('access_token', accessToken);
                    localStorage.setItem('refresh_token', newRefreshToken);
                    localStorage.setItem('user', JSON.stringify(user));
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                } catch (err) {
                    console.error('Error refreshing token:', err);
                    useNavigate().navigate('/login');
                    return Promise.reject(err);
                }

            }
        }
        return config;
    },
    error => {
        useNavigate().navigate('/login');
        return Promise.reject(error);
    }
);
