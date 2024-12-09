import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const baseURL = 'http://localhost:9191/api/v1';

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
        if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp > currentTime) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            } else {
                console.log('Access token is expired');
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post(`${baseURL}/auth/refresh`, {
                    token: refreshToken
                })
                console.log(response);
                if (response.status !== 200) {
                    console.log('Failed to refresh token');
                    return Promise.reject('Failed to refresh token');
                }
                const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('refresh_token', newRefreshToken);
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    error => {
        useNavigate().navigate('/login');
        return Promise.reject(error);
    }
);
