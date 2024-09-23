import { useEffect } from 'react';
import { axiosPrivate } from '../axios/axios';
import useRefreshToken from './useRefreshToken';
import Cookies from 'js-cookie';

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();

    useEffect(() => {
        const requestInterceptor = axiosPrivate.interceptors.request.use(
            (config) => {
                config.withCredentials = true;
                return config;
            },
            (error) => {
                return Promise.reject(error);
            },
        );

        const responseInterceptor = axiosPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error?.config;
                if (error?.response?.status === 403 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    const accessToken = await refresh();
                    if (!accessToken) {
                        Cookies.remove('access_token');
                        return Promise.reject(error);
                    }
                    Cookies.set('access_token', accessToken);
                    originalRequest.withCredentials = true;
                    return axiosPrivate(originalRequest);
                }
                return Promise.reject(error);
            },
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestInterceptor);
            axiosPrivate.interceptors.response.eject(responseInterceptor);
        };
    }, [refresh]);

    return axiosPrivate;
};

export default useAxiosPrivate;
