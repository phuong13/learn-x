import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '@hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function UserMenuDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [avatar, setAvatar] = useState(''); // Avatar URL
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { authUser, isAuthenticated } = useAuth();

    useEffect(() => {
        if (authUser) {
            setAvatar(authUser.avatar || ''); // Lấy URL avatar
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
        { label: t('my_profile') , href: '/profile' },
        { label: t('logout'), href: '/logout' },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={
                    isAuthenticated
                        ? toggleDropdown
                        : () => {
                              navigate('/login');
                          }
                }
                className="flex items-center space-x-0.5 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                aria-expanded={isOpen}
                aria-haspopup="true">
                {/* Kiểm tra avatar có tồn tại không, nếu có thì hiển thị ảnh, nếu không thì hiển thị icon */}
                {avatar ? (
                    <>
                        <img src={avatar} alt="User Avatar" className="h-8 w-8 rounded-full object-cover" />
                        {/* <ChevronDown
                            size={20}
                            className={`transform text-white transition-transform duration-200 ${
                                isOpen ? 'rotate-180' : ''
                            }`}
                        /> */}
                    </>
                ) : (
                    <div className="rounded-full text-gray h-8 w-8 flex items-center justify-center">
                        <i className="fa-sharp fa-solid fa-user-tie"></i>
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {menuItems.map(
                        (item, index) => (
                            (
                                <a
                                    key={index}
                                    href={item.href}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem">
                                    {item.label}
                                </a>
                            )
                        ),
                    )}
                </div>
            )}
        </div>
    );
}
