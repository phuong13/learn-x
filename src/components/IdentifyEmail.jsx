import { useState, useEffect } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import AuthService from '../services/auth/auth.service';
import Alert from './Alert';
import Loader from './Loader';

const IdentifyEmail = () => {
    const [email, setEmail] = useState('');
    const [alert, setAlert] = useState({ show: false, title: '', message: '', severity: '' });

    const [countdownResend, setCountdownResend] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (isResendDisabled) {
            const timer = setInterval(() => {
                setCountdownResend((prevCountdown) => {
                    if (prevCountdown === 1) {
                        clearInterval(timer);
                        setIsResendDisabled(false);
                        return 60;
                    }
                    return prevCountdown - 1;
                });
            }, 1000);
        }
    }, [isResendDisabled]);

    const onToggleVisibility = (isVisible) => {
        setAlert({ ...alert, show: isVisible });
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        setIsResendDisabled(true);
        console.log(email);
        try {
            const res = await AuthService.sendForgotPasswordEmail(email);
            console.log(res);

            if (res.code === 200) {
                setAlert({
                    show: true,
                    title: 'Gửi thành công!',
                    severity: 'success',
                    message: 'Vui lòng kiểm tra hòm thư của bạn!',
                });
            } else {
                setAlert({ show: true, title: 'Gửi thất bại', severity: 'error', message: 'Vui lòng thử lại sau!' });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {alert.show && (
                <Alert
                    hideAfter={3000}
                    isVisible={alert.show}
                    onToggleVisibility={onToggleVisibility}
                    variant={alert.severity}
                    title={alert.title}
                    message={alert.message}></Alert>
            )}
            <Loader isLoading={isLoading} />
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Quên mật khẩu</h2>
                <form onSubmit={handleSendCode} className="space-y-4">
                    <div>
                        <label htmlFor="emailInput" className="block text-sm font-medium text-gray-700">
                            Nhập email của bạn:
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaEnvelope className="text-[#00ba9d] mr-2" />
                            </div>
                            <input
                                type="email"
                                id="emailInput"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isResendDisabled}
                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00ba9d] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00ba9d] transition-all duration-300">
                        {isResendDisabled ? `Thử lại ${countdownResend}s` : `Gửi`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default IdentifyEmail;
