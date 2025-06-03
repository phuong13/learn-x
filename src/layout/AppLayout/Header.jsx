import UserMenuDropdown from '../../components/UserMenuDropDown';
import LogoLearnX from '@assets/learnX.jsx';
import Notification from '../../components/Notification';
import LanguageSelection from '../../components/LanguageSelection';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <nav>
            <div className="bg-gradient-to-r from-primary to-secondary p-2 px-4 sticky top-0 z-50">
                <div className="flex justify-between items-center">
                    <div className="text-white text-xl font-bold">
                        <Link to="/" className="hover:text-gray-200 ">
                            <img src={LogoLearnX} alt="Logo" width={150} height={40} />
                        </Link>
                    </div>
                    <div className="flex items-center space-x-6 text-xl">
                        <LanguageSelection />
                        <Notification />
                        <UserMenuDropdown />
                    </div>
                </div>
            </div>
            
        </nav>
    );
}

export default Header;
