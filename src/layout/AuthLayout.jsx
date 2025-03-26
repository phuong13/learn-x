// components
import Spring from '@components/Spring';

// hooks
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from 'react-use';

// utils
import classNames from 'classnames';
import { useState } from 'react';

// services
import AuthService from '../services/auth/auth.service';

import { GoogleLogin } from '@react-oauth/google';

import PropTypes from 'prop-types';
import { useAuth } from '@hooks/useAuth.js';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

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
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        mode: 'onChange',
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
                toast(result.response.data.message, { type: 'error' });
            }
        } catch (error) {
            toast(error.response.data.message, { type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async (req) => {
        setIsLoading(true);
        try {
            const result = await AuthService.loginGoogle(req);

            console.log(result);

            if (result.code === 200) {
                const { email, fullName, avatar, role } = result.data;
                setAuthUser({ email, fullName, avatar, role });
                setIsAuthenticated(true);
                navigate('/my-course');
            } else {
                console.log(result);

                toast(result.response.data.message, { type: 'error' });
            }
        } catch (error) {
            toast(error.response, { type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitRegister = async ({ email, password, fullName }) => {
        setIsLoading(true);
        try {
            const result = await AuthService.register(fullName, email, password);
            console.log(result);
            if (result.status === 200) {
                toast(result.message, { type: 'success' });
                navigate(`/register/verify?email=${email}`);
            }
        } catch (error) {
            toast(error.response.data.message, { type: 'error' });
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
                        <div className="w-80 h-80 bg-gradient-to-tr from-emerald-500 to-slate-300  rounded-full animate-bounce" />
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
                                            name="fullName"
                                            placeholder="Nhập tên của bạn"
                                            {...register('fullName', { required: 'Tên đầy đủ là bắt buộc!' })}
                                            onKeyDown={handleKeyDown}
                                        />
                                        {errors.fullName && (
                                            <p className="text-sm text-rose-500 dark:text-red-500">
                                                <span className="font-medium">{errors.fullName.message}</span>
                                            </p>
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
                                        name="email"
                                        placeholder="Nhập địa chỉ email"
                                        {...register('email', {
                                            required: 'Email là bắt buộc!',
                                            validate: (value) =>
                                                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ||
                                                'Email không hợp lệ!',
                                        })}
                                        onKeyDown={handleKeyDown}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-rose-500 dark:text-red-500">
                                            <span className="font-medium">{errors.email.message}</span>
                                        </p>
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
                                        name="password"
                                        placeholder="Nhập mật khẩu"
                                        onKeyDown={handleKeyDown}
                                        {...register('password', {
                                            required: 'Mật khẩu là bắt buộc!',
                                            validate: {
                                                minLength: (value) =>
                                                    value.length >= 6 || 'Mật khẩu phải có ít nhất 6 kí tự!',
                                                hasSpecialChar: (value) =>
                                                    /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                                                    'Mật khẩu phải chứa ít nhất 1 kí tự đặc biệt!',
                                                hasUpperCase: (value) =>
                                                    /[A-Z]/.test(value) ||
                                                    'Mật khẩu phải chứa ít nhất 1 kí tự viết hoa!',
                                            },
                                        })}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-[38px] text-gray-500"
                                        onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                    {errors.password && (
                                        <p className="text-sm text-rose-500 dark:text-red-500">
                                            <span className="font-medium">{errors.password.message}</span>
                                        </p>
                                    )}
                                </div>
                                {form === 'register' && (
                                    <div className="field-wrapper relative">
                                        <label htmlFor="confirmPassword" className="field-label">
                                            Xác nhận mật khẩu
                                        </label>
                                        <input
                                            className={classNames('field-input pr-10', {
                                                'field-input--error': errors.confirmPassword,
                                            })}
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            placeholder="Nhập lại mật khẩu"
                                            {...register('confirmPassword', {
                                                required: true,
                                                validate: (value) =>
                                                    value === watch('password') || 'Mật khẩu không khớp',
                                            })}
                                            onKeyDown={handleKeyDown}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-[38px] text-gray-500"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye siznve={20} />}
                                        </button>
                                        {errors.confirmPassword && (
                                            <p className="text-sm text-rose-500 dark:text-red-500">
                                                <span className="font-medium">{errors.confirmPassword.message}</span>
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col items-center gap-6 mt-4 mb-10">
                                {form === 'login' && (
                                    <button className="text-btn" onClick={handlePasswordReminder}>
                                        Quên mật khẩu?
                                    </button>
                                )}
                            </div>
                            <input
                                type="submit"
                                className="btn btn--primary w-full hover:scale-[1.01] ease-in-out active:scale-[.98] active:duration-75 translate-all"
                                value={form === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                            />
                        </form>
                        <div>
                            <div className="relative">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-border" />
                                <span className="flex mt-2 items-center justify-center relative z-10 w-11 h-[23px] m-auto bg-widget">
                                    {/* or */}
                                </span>
                            </div>
                            <div className=" flex justify-center xs:gap-[30px] mt-[10px] mb-9 rounded-3xl">
                                {/* <LoginSocialGoogle
                                    className="btn btn--social btn--login border-2 hover:scale-[1.01] ease-in-out active:scale-[.98] active:duration-75 translate-all"
                                    client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                                    onReject={onReject}
                                    typeResponse="idToken"
                                    onResolve={(idToken) => console.log(idToken)}>
                                    <img className="icon" src={google} alt="Google" />
                                    Login with Google
                                </LoginSocialGoogle> */}
                                <div
                                    className="btn btn--social btn--login border-2 hover:scale-[1.01] ease-in-out
                                    active:scale-[.98] active:duration-75 translate-all">
                                    {/* <img className="icon" src={google} alt="Google" />
                                    Login with Google V2 */}
                                    hoặc
                                    <GoogleLogin
                                        theme="filled_black"
                                        onSuccess={(res) => handleGoogleLogin(res.credential)}
                                        onError={(err) => console.log(err)}></GoogleLogin>
                                </div>
                            </div>
                            <div className="flex justify-center gap-2.5 leading-none">
                                <p>{form === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}</p>
                                <button
                                    className="text-btn"
                                    onClick={() => setForm(form === 'login' ? 'register' : 'login')}>
                                    {form === 'login' ? 'Đăng ký' : 'Đăng nhập'}
                                </button>
                            </div>
                        </div>
                    </Spring>
                </div>
            </div>
        </div>
    );
};

AuthLayout.propTypes = {
    type: PropTypes.string.isRequired,
};

export default AuthLayout;
