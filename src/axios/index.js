import axios from 'axios';
import { redirect } from 'react-router-dom';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:9191/api/v1',
});

axiosInstance.interceptors.request.use((config) => {
    config.headers = config.headers || {};

    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 404) {
            // Add the URL to the notFoundUrls set if the response status is 404
            redirect('/404');
        }
        return Promise.reject(error);
    },
);

export default axiosInstance;
