// components/Notification.jsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from '@/axios/axios';
import { useAuth } from '@hooks/useAuth';

function Notification() {
    const { authUser } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const keyPrefix = authUser?.email || 'guest';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axiosPrivate.get('/notifications/user/logged-in');
                const data = res.data || [];
                setNotifications(data);
                setUnreadCount(data.length);
                localStorage.setItem(`notifications_${keyPrefix}`, JSON.stringify(data));
                localStorage.setItem(`unread_count_${keyPrefix}`, data.length);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        fetchNotifications();
    }, [keyPrefix]);

    const toggleNotifications = () => {
        setShowNotifications((prev) => !prev);
        if (!showNotifications) {
            setUnreadCount(0);
            localStorage.setItem(`unread_count_${keyPrefix}`, 0);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await axiosPrivate.delete(`/notifications/${id}`);
            const updated = notifications.filter((n) => n.id !== id);
            setNotifications(updated);
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <i
                className={`fas fa-bell text-slate-400 cursor-pointer relative hover:text-slate-300 ${
                    showNotifications ? 'text-slate-300' : ''
                }`}
                onClick={toggleNotifications}
            ></i>
            {unreadCount > 0 && (
                <span className="absolute inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none text-white bg-[#f66754] rounded-full -bottom-1 -right-3">
                    {unreadCount}
                </span>
            )}
            {showNotifications && (
                <div className="absolute right-[-6px] mt-2 w-64 bg-white rounded-md shadow-lg z-10">
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    deleteNotification(notification.id);
                                    navigate(notification.url);
                                    toggleNotifications();
                                }}
                                className="text-sm p-2 border-b border-slate-200 hover:bg-slate-300 hover:rounded-md last:border-b-0"
                            >
                                {notification.message}
                            </div>
                        ))
                    ) : (
                        <div className="p-2 text-sm text-slate-500">Không có thông báo mới</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Notification;
