import Header from '@layout/Header';
import Footer from '@layout/Footer';
import Navbar from '@layout/NavBar';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-20">
                <Header />
                <Navbar />
            </div>
            <main className="flex-grow">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default AppLayout;
