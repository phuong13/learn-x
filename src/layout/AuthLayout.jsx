// components
import Spring from '@components/Spring';
import Loader from '../components/Loader';

// hooks
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import { useAuth } from '@hooks/useAuth.js';

// utils
import classNames from 'classnames';
import { useState } from 'react';

// services
import AuthService from '../services/auth/auth.service';

// others
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import PropTypes from 'prop-types';

const AuthLayout = ({ type = 'login' }) => {
    const { width } = useWindowSize();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState(type);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { setAuthUser, setIsAuthenticated } = useAuth();

    const defaultValues = {
        email: '',
        password: '',
        fullName: '',
        confirmPassword: '',
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        mode: 'onSubmit', // chỉ validate sau khi submit
        defaultValues,
    });

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (form === 'login') {
                handleSubmit(onSubmitLogin)();
            } else {
                handleSubmit(onSubmitRegister)();
            }
        }
    };

    const onSubmitLogin = async ({ email, password }) => {
        setIsLoading(true);
        try {
            const result = await AuthService.login(email, password);
            if (result.code === 200) {
                const { email, fullName, avatar, role } = result.data;
                setAuthUser({ email, fullName, avatar, role });
                setIsAuthenticated(true);
                navigate('/my-course');
            } else {
                toast(result.response?.data?.message || 'Đăng nhập thất bại', { type: 'error' });
            }
        } catch (error) {
            toast(error.response?.data?.message || 'Đã xảy ra lỗi', { type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitRegister = async ({ email, password, fullName }) => {
        setIsLoading(true);
        try {
            const result = await AuthService.register(fullName, email, password);
            if (result.status === 200) {
                toast(result.message || 'Đăng ký thành công', { type: 'success' });
                navigate(`/register/verify?email=${email}`);
            }
        } catch (error) {
            toast(error.response?.data?.message || 'Đăng ký thất bại', { type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async (credential) => {
        setIsLoading(true);
        try {
            const result = await AuthService.loginGoogle(credential);
            if (result.code === 200) {
                const { email, fullName, avatar, role } = result.data;
                setAuthUser({ email, fullName, avatar, role });
                setIsAuthenticated(true);
                navigate('/my-course');
            } else {
                toast(result.response?.data?.message || 'Google login thất bại', { type: 'error' });
            }
        } catch (error) {
            toast(error.response || 'Lỗi đăng nhập Google', { type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReminder = (e) => {
        e.preventDefault();
        navigate('/identify');
    };

    return (
        <div className="flex w-full h-screen">
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 4xl:grid-cols-[minmax(0,_1030px)_minmax(0,_1fr)]">
                {width >= 1024 && (
                    <div className="lg:flex relative hidden justify-center items-center h-full">
                        <div className="w-80 h-80 bg-gradient-to-tr from-emerald-500 to-slate-300 rounded-full animate-bounce" />
                        <div className="w-full absolute bottom-0 h-1/2 bg-white/10 backdrop-blur-lg" />
                    </div>
                )}
                <div className="bg-widget flex items-center justify-center w-full py-10 px-4 lg:p-[60px]">
                    <Spring
                        className="max-w-[540px] w-full bg-white px-10 py-20 rounded-3xl border-2 border-gray-red shadow-lg"
                        type="slideUp"
                        duration={400}
                        delay={300}>
                        <div className="flex flex-col gap-2.5 text-center">
                            <h1>{form === 'login' ? 'Đăng nhập' : 'Đăng ký'}</h1>
                        </div>

                        <form
                            className="mt-5"
                            onSubmit={handleSubmit(form === 'login' ? onSubmitLogin : onSubmitRegister)}>
                            <Loader isLoading={isLoading} />
                            <div className="flex flex-col gap-5">
                                {form === 'register' && (
                                    <div className="field-wrapper">
                                        <label htmlFor="fullName" className="field-label">
                                            Tên đầy đủ
                                        </label>
                                        <input
                                            className={classNames('field-input')}
                                            id="fullName"
                                            type="text"
                                            {...register('fullName', {
                                                required: 'Tên đầy đủ là bắt buộc!',
                                            })}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Nhập tên của bạn"
                                        />
                                        {errors.fullName && (
                                            <p className="text-sm text-rose-500">{errors.fullName.message}</p>
                                        )}
                                    </div>
                                )}

                                <div className="field-wrapper">
                                    <label htmlFor="email" className="field-label">
                                        E-mail
                                    </label>
                                    <input
                                        className={classNames('field-input', { 'field-input--error': errors.email })}
                                        id="email"
                                        type="email"
                                        {...register('email', {
                                            required: 'Email là bắt buộc!',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Email không hợp lệ!',
                                            },
                                        })}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Nhập địa chỉ email"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-rose-500">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="field-wrapper relative">
                                    <label htmlFor="password" className="field-label">
                                        Mật khẩu
                                    </label>
                                    <input
                                        className={classNames('field-input', { 'field-input--error': errors.password })}
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password', {
                                            required: 'Mật khẩu là bắt buộc!',
                                            minLength: {
                                                value: 6,
                                                message: 'Mật khẩu phải có ít nhất 6 kí tự!',
                                            },
                                            validate: {
                                                hasUpperCase: (v) =>
                                                    /[A-Z]/.test(v) || 'Mật khẩu phải có ít nhất 1 kí tự in hoa!',
                                                hasSpecialChar: (v) =>
                                                    /[!@#$%^&*(),.?":{}|<>]/.test(v) ||
                                                    'Mật khẩu phải có kí tự đặc biệt!',
                                            },
                                        })}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Nhập mật khẩu"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-[38px] text-gray-500"
                                        onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                    {errors.password && (
                                        <p className="text-sm text-rose-500">{errors.password.message}</p>
                                    )}
                                </div>

                                {form === 'register' && (
                                    <div className="field-wrapper relative">
                                        <label htmlFor="confirmPassword" className="field-label">
                                            Xác nhận mật khẩu
                                        </label>
                                        <input
                                            className={classNames('field-input', {
                                                'field-input--error': errors.confirmPassword,
                                            })}
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            {...register('confirmPassword', {
                                                required: 'Bạn cần xác nhận mật khẩu!',
                                                validate: (value) =>
                                                    value === watch('password') || 'Mật khẩu không khớp',
                                            })}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Nhập lại mật khẩu"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-[38px] text-gray-500"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                        {errors.confirmPassword && (
                                            <p className="text-sm text-rose-500">
                                                {errors.confirmPassword.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {form === 'login' && (
                                <div className="flex justify-center mt-4 mb-6">
                                    <button className="text-btn" onClick={handlePasswordReminder}>
                                        Quên mật khẩu?
                                    </button>
                                </div>
                            )}

                            <input
                                type="submit"
                                className="btn btn--primary w-full hover:scale-[1.01] ease-in-out active:scale-[.98] active:duration-75 translate-all"
                                value={form === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                            />
                        </form>

                        <div className="relative my-6 flex items-center justify-center">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-border" />
                            <span className="relative z-10 bg-widget px-2 text-sm">hoặc</span>
                        </div>

                        <div className="flex justify-center mb-6">
                            <div className="btn btn--social btn--login border-2">
                                <GoogleLogin
                                    theme="filled_black"
                                    onSuccess={(res) => handleGoogleLogin(res.credential)}
                                    onError={(err) => console.log(err)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-center gap-2.5">
                            <p>{form === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}</p>
                            <button
                                className="text-btn"
                                onClick={() => setForm(form === 'login' ? 'register' : 'login')}>
                                {form === 'login' ? 'Đăng ký' : 'Đăng nhập'}
                            </button>
                        </div>
                    </Spring>
                </div>
            </div>
        </div>
    );
};

AuthLayout.propTypes = {
    type: PropTypes.string,
};

export default AuthLayout;
