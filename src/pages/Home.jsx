import { useAuth } from '@hooks/useAuth.js';
import Cookies from 'js-cookie';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useEffect, useState } from 'react';
const Home = () => {
    const { authUser, setAuthUser, isAuthenticated, setIsAuthenticated } = useAuth();
    console.log(authUser);
    const axiosPrivate = useAxiosPrivate();

    const [data, setData] = useState([]);

    useEffect(() => {
        axiosPrivate.get('categories').then((res) => {
            setData(res.data.data);
            console.log(res.data.data);
        });
    }, []);

    return (

        <div className="h-full">
            <h1>Welcome {authUser?.email}</h1>
            {isAuthenticated === true && (
                <button
                    className="btn"
                    onClick={() => {
                        setIsAuthenticated(false);
                        setAuthUser(null);
                        Cookies.remove('access_token');
                        Cookies.remove('refresh_token');
                    }}>
                    Logout
                </button>
            )}


            {data.map((item, index) => (
                <div className="max-w-[200]" key={index}>
                    <h6>{item.name}</h6>
                </div>
            ))}

            <button
                className="btn"
                onClick={() => {
                    window.location.href = '/profile';
                }}>
                Go to Profile
            </button>
        </div>

    );
};

export default Home;
