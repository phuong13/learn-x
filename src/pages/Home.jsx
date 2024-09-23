import { useAuth } from '../contexts/auth/useAuth';

const Home = () => {
    const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn } = useAuth();

    return (
        <div>
            <h1>Welcome{authUser?.email}</h1>
            {isLoggedIn === true && (
                <button
                    className="btn"
                    onClick={() => {
                        setIsLoggedIn(false);
                        setAuthUser(null);
                        localStorage.removeItem('access_token');
                    }}>
                    Logout
                </button>
            )}
            
        </div>
        
    );
};

export default Home;
