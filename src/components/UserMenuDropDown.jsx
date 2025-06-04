import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '@hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function UserMenuDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [avatar, setAvatar] = useState('');
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { authUser, isAuthenticated } = useAuth();

    useEffect(() => {
        if (authUser) {
            setAvatar(authUser.avatar || '');
        }
    }, [authUser]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const menuItems = [
        { label: t('my_profile'), href: '/profile' },
        { label: t('logout'), href: '/logout' },
    ];

    return (
        <div className="relative text-left" ref={dropdownRef}>
            <button
                type="button"
                className="flex items-center gap-2  text-sm font-medium text-white"
                onClick={
                    isAuthenticated
                        ? toggleDropdown
                        : () => navigate('/login')
                }
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <span className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full ring-1 ring-slate-300 overflow-hidden bg-white flex items-center justify-center">
                        {avatar ? (
                            <img src={avatar} alt="User Avatar" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                            <i className="fa-sharp fa-solid fa-user-tie text-slate-400 text-xl"></i>
                        )}
                    </span>
                    {/* <span className="hidden md:block text-slate-800 font-semibold">
                        {authUser?.fullName || t('account')}
                    </span> */}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-2 bg-white border border-slate-200 rounded-md shadow-lg right-0 min-w-[170px]">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        {menuItems.map((item, idx) => (
                            <Link
                                key={idx}
                                to={item.href}
                                className="block px-4 py-2 text-sm text-slate-700 hover:bg-sky-50"
                                role="menuitem"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}