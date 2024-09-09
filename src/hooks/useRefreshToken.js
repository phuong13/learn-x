import axiosInstance from '../axios/axios';

import Cookies from 'js-cookie';

const useRefreshToken = () => {
    // eslint-disable-next-line no-unused-vars
    const refreshToken = Cookies.get('refresh_token');

    const refresh = async () => {
        try {
            const response = await axiosInstance.post('/auth/refresh', {
                refreshToken,
            });

            const { accessToken, refreshToken } = response.data;
            Cookies.set('access_token', accessToken);
            Cookies.set('refresh_token', refreshToken);

            return accessToken;
        } catch (error) {
            console.error(error);
        }
    };

    return refresh;
};

export default useRefreshToken;
