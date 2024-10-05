import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import AuthService from '../services/auth/auth.service';
import Loader from './Loader';

export default function ConfirmOTP() {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const emailFromQuery = query.get('email')?.replace(/\s/g, '+');

    const [otp, setOtp] = useState(new Array(6).fill(''));
    const inputRefs = useRef([]);

    const formRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (element, index) => {
        const newOtp = [...otp];
        newOtp[index] = element.value;

        setOtp(newOtp);

        if (element.value && index < 5) {
            inputRefs.current[index + 1].focus();
        }

        if (otp.every((digit) => digit !== '')) {
            handleSubmitOTP();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const [countdown, setCountdown] = useState(5);

    const [countdownResend, setCountdownResend] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(false);

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

    const handleSubmitOTP = async (e) => {
        if (e) e.preventDefault();
        const otpValue = otp.join('');
        const email = emailFromQuery;
        setIsLoading(true);

        try {
            const res = await AuthService.verifyEmail(otpValue, email);
            console.log(res);
            if (res && res.status === 200) {
                toast.success(<div>Xác thực thành công! Chuyển hướng về trang đăng nhập sau {countdown}s</div>, {
                    duration: 5000,
                });
                const countdownInterval = setInterval(() => {
                    setCountdown((prevCountdown) => {
                        if (prevCountdown === 1) {
                            clearInterval(countdownInterval);
                            navigate('/login');
                        } else {
                            toast.dismiss();
                            toast.success(
                                `Xác thực thành công! Chuyển hướng về trang đăng nhập sau ${prevCountdown - 1}s`,
                                {
                                    duration: 5000,
                                },
                            );
                        }
                        return prevCountdown - 1;
                    });
                }, 1000);
            } else {
                toast.error('Xác thực thất bại. Vui lòng thử lại!', { duration: 5000 });
                setOtp(Array(otp.length).fill(''));
                inputRefs.current[0].focus();
            }
        } catch (error) {
            console.log(error);
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau!', { duration: 5000 });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text');
        if (paste.length === 6 && /^\d+$/.test(paste)) {
            const newOtp = paste.split('');
            setOtp(newOtp);
            newOtp.forEach((value, index) => {
                inputRefs.current[index].value = value;
            });
            inputRefs.current[5].focus();
            // if (newOtp.every((digit) => digit !== '')) {
            //     handleSubmitOTP();
            // }
        }
        e.preventDefault();
    };

    const handleSendOtp = async () => {
        setIsLoading(true);
        try {
            const res = await AuthService.resendOtp(emailFromQuery);
            if (res && res.status === 200) {
                toast.success('Mã OTP đã được gửi lại. Vui lòng kiểm tra hòm thư của bạn!', { duration: 5000 });
                setIsResendDisabled(true);
                setCountdownResend(60);
            } else {
                toast.error('Gửi mã OTP thất bại. Vui lòng thử lại sau!', { duration: 5000 });
            }
        } catch (error) {
            console.log(error);
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau!', { duration: 5000 });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Toaster position="top-right" richColors />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg">
                    {isLoading && <Loader />}
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Xác nhận tài khoản</h2>
                    <form ref={formRef} onSubmit={handleSubmitOTP} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                                Nhập mã OTP 6 số
                            </label>
                            <div className="flex justify-between px-8 pt-2" onPaste={handlePaste}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleChange(e.target, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        ref={(ref) => (inputRefs.current[index] = ref)}
                                        className="w-12 h-12 text-center text-2xl border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button type="submit" className="flex-auto w-1/2 mt-0 btn btn--outline">
                                Xác nhận
                            </button>
                            <button
                                type="button"
                                disabled={isResendDisabled}
                                onClick={handleSendOtp}
                                className="flex-auto w-1/2 ml-4 mt-0 btn btn--outline">
                                {isResendDisabled ? `Gửi lại mã sau ${countdownResend}s` : `Gửi lại mã OTP`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
