import { useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaKey } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import AuthService from '../services/auth/auth.service';
import Loader from '../components/Loader';
import classNames from 'classnames';
import DocumentTitle from '@components/DocumentTitle.jsx';
import { toast } from 'react-toastify';
import Header from '@layout/Header';
import Footer from '@layout/Footer.jsx';
import { Eye, EyeOff } from 'lucide-react';
const ResetPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const defaultValues = {
        password: '',
    };

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({ defaultValues });

    const onSubmit = async ({ password }) => {
        setIsLoading(true);
        const token = searchParams.get('token');
        try {
            const result = await AuthService.resetPassword(token, password);

            if (result.code === 200) {
                toast(`${result.message} Chuyển hướng sau ${countdown}s`, { type: 'success' });
                const countdownInterval = setInterval(() => {
                    setCountdown((prevCountdown) => {
                        if (prevCountdown === 1) {
                            clearInterval(countdownInterval);
                            navigate('/login');
                        }
                        return prevCountdown - 1;
                    });
                }, 1000);
            } else {
                toast(result.response.data.message, { type: 'error' });
            }
        } catch (error) {
            console.log(error);

            toast(error.response.data.message, { type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="sticky top-0 z-50">
                <Header />
            </div>
            <DocumentTitle title="Quên mật khẩu" />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader isLoading={isLoading} />
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Quên mật khẩu</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <div className="mt-1 relative rounded-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaKey className="text-[#00ba9d] mr-2" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    placeholder="Mật khẩu mới"
                                    required
                                    className={classNames(
                                        'block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                                        {
                                            'border-red-300': errors.password,
                                        },
                                    )}
                                    {...register('password', {
                                        required: true,
                                        validate: {
                                            minLength: (value) =>
                                                value.length >= 6 || 'Mật khẩu phải có ít nhất 6 kí tự!',
                                            hasSpecialChar: (value) =>
                                                /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                                                'Mật khẩu phải chứa ít nhất 1 kí tự đặc biệt!',
                                            hasUpperCase: (value) =>
                                                /[A-Z]/.test(value) || 'Mật khẩu phải chứa ít nhất 1 kí tự viết hoa!',
                                        },
                                    })}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-[8px] text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                {errors.password && (
                                    <p className="text-sm text-rose-500 dark:text-red-500">
                                        <span className="font-medium">{errors.password.message}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="mt-1 relative rounded-md">
                                <div className="absolute top-[12px] left-0 pl-3 flex items-center pointer-events-none">
                                    <FaKey className="text-[#00ba9d] mr-2" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    placeholder="Xác nhận mật khẩu"
                                    required
                                    className={classNames(
                                        'block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                                        {
                                            'border-red-300': errors.confirmPassword,
                                        },
                                    )}
                                    {...register('confirmPassword', {
                                        required: true,
                                        validate: (value) => value === watch('password') || 'Mật khẩu không khớp',
                                    })}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-[8px] text-gray-500"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-rose-500 dark:text-red-500">
                                        <span className="font-medium">{errors.confirmPassword.message}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00ba9d] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00ba9d] transition-all duration-300">
                            Đổi mật khẩu
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ResetPassword;
