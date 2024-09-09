import { useAuth } from '../contexts/auth/useAuth';
import Cookies from 'js-cookie';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useEffect, useState } from 'react';
const Home = () => {
    const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const [data, setData] = useState([]);

    useEffect(() => {
        axiosPrivate.get('categories').then((res) => {
            setData(res.data.data);
        });
    }, [axiosPrivate, data]);

    return (
        <div>
            <h1>Welcome {authUser?.email}</h1>
            {isLoggedIn === true && (
                <button
                    className="btn"
                    onClick={() => {
                        setIsLoggedIn(false);
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
        </div>
    );
};

export default Home;
