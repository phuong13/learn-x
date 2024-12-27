import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import UserMenuDropdown from '../components/UserMenuDropDown';
import { axiosPrivate } from '@/axios/axios.js';
import { useAuth } from '@hooks/useAuth.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

function Header() {
    const stompClient = useRef(null);
    const { authUser } = useAuth();

    const loadNotifications = () => {
        const key = `notifications_${authUser.email}`;
        const savedNotifications = localStorage.getItem(key);
        return savedNotifications ? JSON.parse(savedNotifications) : [];
    };

    const loadUnreadCount = () => {
        const key = `unread_count_${authUser.email}`;
        const savedCount = localStorage.getItem(key);
        return savedCount ? parseInt(savedCount, 10) : 0;
    };

    const saveNotifications = (notifications) => {
        const key = `notifications_${authUser.email}`;
        localStorage.setItem(key, JSON.stringify(notifications));
    };

    const saveUnreadCount = (count) => {
        const key = `unread_count_${authUser.email}`;
        localStorage.setItem(key, count);
    };

    const [notifications, setNotifications] = useState(() => loadNotifications());
    const [unreadCount, setUnreadCount] = useState(() => loadUnreadCount());
    const [showNotifications, setShowNotifications] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        let ws = new SockJS('http://localhost:9191/ws');
        stompClient.current = Stomp.over(ws);
        stompClient.current.connect({}, () => {
            console.log('WebSocket connected');
            stompClient.current.subscribe(`/user/${authUser.email}/notifications`, (message) => {
                const body = JSON.parse(message.body);
                if (body.message) {
                    setNotifications((prevNotifications) => {
                        const updatedNotifications = [body.message, ...prevNotifications];
                        saveNotifications(updatedNotifications);
                        return updatedNotifications;
                    });
                    setUnreadCount((prevCount) => {
                        const newCount = prevCount + 1;
                        saveUnreadCount(newCount);
                        return newCount;
                    });
                }
                console.log('Received message: ', message);
                toast(body.message, {
                    autoClose: false,
                    type: 'info',
                    onClick: () => {
                        navigate(body.url);
                    },
                    closeButton: (
                        <button onClick={() => toast.dismiss()}>
                            <X size={24} className="mr-2" />
                        </button>
                    ),
                });
            });
        });

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axiosPrivate.get('/notifications/user/logged-in');
                const fetchedNotifications = response.data || [];
                setNotifications((prevNotifications) => {
                    const mergedNotifications = [...fetchedNotifications, ...prevNotifications];
                    saveNotifications(mergedNotifications);
                    return mergedNotifications;
                });
            } catch (error) {
                console.error(error);
            }
        };

        fetchNotifications();
    }, []);

    useEffect(() => {
        saveNotifications(notifications);
    }, [notifications]);

    useEffect(() => {
        saveUnreadCount(unreadCount);
    }, [unreadCount]);

    const toggleNotifications = () => {
        setShowNotifications((prev) => !prev);
        if (!showNotifications) {
            setUnreadCount(0);
            saveUnreadCount(0);
        }
    };

    const resetUserNotifications = () => {
        const notificationsKey = `notifications_${authUser.email}`;
        const unreadCountKey = `unread_count_${authUser.email}`;
        localStorage.removeItem(notificationsKey);
        localStorage.removeItem(unreadCountKey);
        setNotifications([]);
        setUnreadCount(0);
        toast.success('Đã reset thông báo!');
    };

    return (
        <nav>
            <div className="bg-gradient-to-r from-[#45DFB1] to-[#213A57] p-2 px-4 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex space-x-4">
                        <a href="" className="hover:text-slate-300">
                            <i className="fa-solid fa-earth-europe text-2xl"></i>
                        </a>
                    </div>
                    <div className="flex items-center space-x-4 text-xl">
                        {/* <button
                            onClick={resetUserNotifications}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-700"
                        >
                            Reset Notifications
                        </button> */}
                        <div className="relative">
                            <i
                                className="fas fa-bell text-gray cursor-pointer relative hover:text-slate-300"
                                onClick={toggleNotifications}></i>
                            {unreadCount > 0 && (
                                <span className="absolute inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none text-white bg-[#f66754] rounded-full -bottom-1 -right-3">
                                    {unreadCount}
                                </span>
                            )}
                            {showNotifications && (
                                <div className="relative">
                                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                        {notifications.length > 0 ? (
                                            notifications.map((notification, index) => (
                                                <div
                                                    key={index}
                                                    className="text-sm p-2 border-b border-gray-200 hover:bg-slate-300">
                                                    {notification.message}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-2 text-gray-500">Không có thông báo mới</div>
                                        )}
                                    </div>
                                    <div className="absolute right-1.5 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-300 z-0"></div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center">
                            <UserMenuDropdown />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
