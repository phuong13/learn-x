import { useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaKey } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import AuthService from '../services/auth/auth.service';
import Loader from '../components/Loader';
import classNames from 'classnames';
import DocumentTitle from '@components/DocumentTitle.jsx';
import { toast } from 'react-toastify';
import Header from '../layout/Header';
import Navbar from '@layout/NavBar.jsx';
import Footer from '@layout/Footer.jsx';

const ResetPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const defaultValues = {
        password: '',
    };

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
            console.log(result);

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
                toast(result.message, { type: 'error' });
            }
        } catch (error) {
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
            <Navbar />
            <DocumentTitle title="Quên mật khẩu" />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader isLoading={isLoading} />
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Quên mật khẩu</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            {/* <label htmlFor="emailInput" className="block text-sm font-medium text-gray-700">
                            Mật khẩu mới
                        </label> */}
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaKey className="text-[#00ba9d] mr-2" />
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Mật khẩu mới"
                                    required
                                    className={classNames(
                                        'block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                                        {
                                            'block w-full pl-10 pr-3 py-2 border border-red-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none sm:text-sm':
                                                errors.password,
                                        },
                                    )}
                                    {...register('password', { required: true, minLength: 6 })}
                                />
                            </div>
                        </div>
                        <div>
                            {/* <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Xác nhận mật khẩu
                        </label> */}
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaKey className="text-[#00ba9d] mr-2" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Xác nhận mật khẩu"
                                    required
                                    className={classNames(
                                        'block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                                        {
                                            'block w-full pl-10 pr-3 py-2 border border-red-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none sm:text-sm':
                                                errors.password,
                                        },
                                    )}
                                    {...register('confirmPassword', {
                                        required: true,
                                        validate: (value) => value === watch('password') || 'Mật khẩu không khớp',
                                    })}
                                />
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
