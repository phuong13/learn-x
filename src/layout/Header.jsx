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
    const [notifications, setNotifications] = useState([]);
    const { authUser } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        let ws = new SockJS('http://localhost:9191/ws');
        stompClient.current = Stomp.over(ws);
        stompClient.current.connect({}, () => {
            console.log('Connecting to WS...');
            stompClient.current.subscribe(`/user/${authUser.email}/notifications`, (message) => {
                const body = JSON.parse(message.body);
                if (body.message) {
                    setNotifications((prevNotifications = []) => [body.message, ...prevNotifications]);
                }
                console.log('Received message: ', body.message);
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
            await axiosPrivate
                .get('/notifications/user/logged-in')
                .then((response) => {
                    setNotifications(response.data);
                    console.log(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        };

        fetchNotifications();
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
                            {/* {notifications && notifications.length > 0 && (
                                <span
                                    className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                            )}
                            <div
                                className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg">
                                {notifications && notifications.length > 0 && notifications.map((notification, index) => (
                                    <div key={index} className="">
                                        {notification.message}
                                    </div>
                                ))}
                            </div> */}
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
