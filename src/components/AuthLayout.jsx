/* eslint-disable no-unused-vars */
// components
import Logo from '@components/Logo';
import { LoginSocialGoogle } from 'reactjs-social-login';
import Spring from '@components/Spring';
import PasswordInput from '@components/PasswordInput';
import { Toaster, toast } from 'sonner';

// hooks
import { useForm, Controller, set } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from 'react-use';

// utils
import classNames from 'classnames';

// assets
import media from '@assets/login.webp';
import google from '@assets/icons/google.png';
import { useState } from 'react';

// services
import AuthService from '../services/auth/auth.service';

import { Button } from '@mui/material';
import { GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

import PropTypes from 'prop-types';
import { useAuth } from '@hooks/useAuth.js';
import Loader from './Loader';

const AuthLayout = ({ type = 'login' }) => {
    const { width } = useWindowSize();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState();
    const [form, setForm] = useState(type);

    const { authUser, setAuthUser, isAuthenticated, setIsAuthenticated } = useAuth();

    const defaultValues = {
        email: '',
        password: '',
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch,
    } = useForm({
        mode: 'onChange',
        defaultValues,
    });

    const onSubmitLogin = async ({ email, password }) => {
        setIsLoading(true);
        try {
            const result = await AuthService.login(email, password);
            if (result === undefined) {
                toast.error('Error from server, please try again later!');
                return;
            }
            if (result.code === 200) {
                const { email, fullName, avatar, role } = result.data;
                setAuthUser({ email, fullName, avatar, role });
                setIsAuthenticated(true);
                navigate('/my-course');
            } else {
                toast.error('Invalid email or password!');
            }
        } catch (error) {
            console.error(error);
            toast.error('Invalid email or password!');
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
            } else if (result.error === true) {
                toast.error(result.response.data.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitRegister = async ({ email, password, fullName }) => {
        setIsLoading(true);
        try {
            const result = await AuthService.register(fullName, email, password);
            console.log(result);
            if (result === undefined) {
                toast.error('Có lỗi xảy ra, vui lòng thử lại sau!');
                return;
            }
            if (result.status === 200) {
                navigate(`/register/verify?email=${email}`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const onReject = (err) => {
        toast.error(err);
    };

    const handlePasswordReminder = (e) => {
        e.preventDefault();
        navigate('/identify');
    };

    return (
        <div className="flex w-full h-screen">
            <Toaster duration={5000} richColors position={'top-right'}/>
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
                                            {...register('fullName', { required: true })}
                                        />
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
                                        {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                                    />
                                </div>
                                <div className="field-wrapper">
                                    <label htmlFor="password" className="field-label">
                                        Mật khẩu
                                    </label>
                                    <input
                                        className={classNames('field-input', { 'field-input--error': errors.password })}
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="Nhập mật khẩu"
                                        {...register('password', { required: true })}
                                    />
                                </div>
                                {form === 'register' && (
                                    <div className="field-wrapper">
                                        <label htmlFor="confirmPassword" className="field-label">
                                            Xác nhận mật khẩu
                                        </label>
                                        <input
                                            className={classNames('field-input', {
                                                'field-input--error': errors.confirmPassword,
                                            })}
                                            id="confirmPassword"
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Nhập lại mật khẩu"
                                            {...register('confirmPassword', {
                                                required: true,
                                                validate: (value) =>
                                                    value === watch('password') || 'Mật khẩu không khớp',
                                            })}
                                        />
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
