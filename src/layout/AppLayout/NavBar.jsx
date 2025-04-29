import { useAuth } from '@hooks/useAuth.js';
import { useTranslation } from 'react-i18next';
import LogoLearnX from '@assets/learnX.jsx';
import { Link } from 'react-router-dom';


function Navbar() {

    const { authUser } = useAuth();
    const { t } = useTranslation();
    return (
        <nav className='bg-slate-200 shadow-lg py-2'>
            <div className=" flex justify-end items-center p-2 px-6">
                {/* Logo bên trái
                <div className="text-white text-xl font-bold">
                    <a href="/" className="hover:text-gray-200">
                        <img src={LogoLearnX} alt="Logo" width={150} height={40}/>
                    </a>
                </div> */}

                {/* Menu bên phải */}
                <div className="flex gap-4">
                    <Link to="/" className="font-medium hover:text-slate-500 text-lg">
                        {t('home_page')}
                    </Link>
                    <Link to="/my-course" className="font-medium hover:text-slate-500 text-lg">
                        {authUser.role === "TEACHER" ? t('manage_courses') : t('my_courses')}
                    </Link>
                    <Link to="/dashboard" className="font-medium hover:text-slate-500 text-lg">
                        {t('dashboard')}
                    </Link>
                    <Link to="/forum" className="font-medium hover:text-slate-500 text-lg">
                        Forum
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
