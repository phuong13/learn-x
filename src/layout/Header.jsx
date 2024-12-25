import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import UserMenuDropdown from '../components/UserMenuDropDown';
import { axiosPrivate } from '@/axios/axios.js';
import { useAuth } from '@hooks/useAuth.js';
import { toast } from 'react-toastify';

function Header() {
    const stompClient = useRef(null);
    const [notifications, setNotifications] = useState([]);
    const { authUser } = useAuth();
    const token = localStorage.getItem('access_token');
    useEffect(() => {
        let ws = new SockJS('http://localhost:9191/ws');
        stompClient.current = Stomp.over(ws);
        stompClient.current.connect({}, () => {
            console.log('Connecting to WS...');
            stompClient.current.subscribe(`/user/${authUser.email}/notifications`, (message) => {
                if (message.body) {
                    setNotifications((prevNotifications) => [JSON.parse(message.body), ...prevNotifications]);
                }
                console.log('Received message: ', message);
                toast.info(message.body.message, {
                    closeOnClick: true,
                });
            });
        });

        const fetchNotifications = async () => {
            await axiosPrivate.get('/notifications/user/logged-in')
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });
        };

        fetchNotifications();

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect();
            }
        };
    }, []);

    return (
        <nav>
            <div className="bg-gradient-to-r from-[#45DFB1] to-[#213A57] p-2 px-4 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center ">
                    <div className="flex space-x-4">
                        <a href="" className="hover:text-gray-300">
                            <i className="fa-solid fa-earth-europe text-2xl"></i>
                        </a>
                    </div>
                    <div className="flex items-center space-x-4 text-xl">
                        <div className="relative hover:text-gray-300">
                            <i className="fas fa-bell text-gray"></i>
                            {notifications.length > 0 && (
                                <span
                                    className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                            )}
                            <div
                                className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg">
                                {notifications.map((notification, index) => (
                                    <div key={index} className="">
                                        {notification.message}
                                    </div>
                                ))}
                            </div>
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
