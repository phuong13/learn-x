/* eslint-disable no-unused-vars */
// components
import Logo from '@components/Logo';
import { LoginSocialGoogle } from 'reactjs-social-login';
import { toast } from 'react-toastify';
import Spring from '@components/Spring';
import PasswordInput from '@components/PasswordInput';

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
import { useAuth } from '../contexts/auth/useAuth';

const AuthLayout = ({ type = 'login' }) => {
    const { width } = useWindowSize();
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState();
    const [form, setForm] = useState(type);

    const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn } = useAuth();

    const defaultValues = {
        email: '',
        password: '',
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        mode: 'onChange',
        defaultValues,
    });

    const onSubmit = async ({ email, password }) => {
        const abortController = new AbortController();

        const result = await AuthService.login(email, password);
        console.log(result);
        if (result === undefined) {
            toast.error('Invalid email or password!');
            return;
        }
        if (result.code === 200) {
            const { email, fullName, avatar, role } = result.data;
            setAuthUser({ email, fullName, avatar, role });
            setIsLoggedIn(true);
            navigate('/');
        }
    };

    const onReject = (err) => {
        toast.error(err);
    };

    const handlePasswordReminder = (e) => {
        e.preventDefault();
    };

    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: (token) => {
            console.log(token);
        },
        onError: (error) => {
            console.error(error);
        },
    });

    return (
        <div className="flex w-full h-screen">
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 4xl:grid-cols-[minmax(0,_1030px)_minmax(0,_1fr)]">
                {width >= 1024 && (
                    <div className="lg:flex relative hidden justify-center items-center h-full">
                        {/* <Logo imgClass="w-[60px]" textClass="text-[28px]" />
                        <img className="max-w-[512px]" src={media} alt="media" /> */}
                        <div className="w-80 h-80 bg-gradient-to-tr from-emerald-500 to-slate-300  rounded-full animate-bounce" />
                        <div className="w-full absolute bottom-0 h-1/2 bg-white/10 backdrop-blur-lg" />
                    </div>
                )}
                <div className="bg-widget flex items-center justify-center w-full py-10 px-4 lg:p-[60px]">
                    <Spring
                        className="max-h-[650px] max-w-[540px] w-full bg-white px-10 py-20 rounded-3xl border-2 border-gray-red shadow-lg"
                        type="slideUp"
                        duration={400}
                        delay={300}>
                        <div className="flex flex-col gap-2.5 text-center">
                            <h1>{form === 'login' ? 'Welcome Back!' : 'Register'}</h1>
                        </div>
                        <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-5">
                                {form === 'register' && (
                                    <div className="field-wrapper">
                                        <label htmlFor="fullName" className="field-label">
                                            Fullname
                                        </label>
                                        <input
                                            className={classNames('field-input')}
                                            id="fullName"
                                            type="text"
                                            name="fullName"
                                            placeholder="Enter your name"
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
                                        placeholder="Your E-mail address"
                                        {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                                    />
                                </div>
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <PasswordInput
                                            id="password"
                                            placeholder="Your password"
                                            error={errors.password}
                                            innerRef={field.ref}
                                            isInvalid={errors.password}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>
                            <div className="flex flex-col items-center gap-6 mt-4 mb-10">
                                {form === 'login' && (
                                    <button className="text-btn" onClick={handlePasswordReminder}>
                                        Forgot Password?
                                    </button>
                                )}
                            </div>
                            <input
                                type="submit"
                                className="btn btn--primary w-full hover:scale-[1.01] ease-in-out active:scale-[.98] active:duration-75 translate-all"
                                value={form === 'login' ? 'Login' : 'Register'}
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
                                    or
                                    <GoogleLogin
                                        theme="filled_black"
                                        onSuccess={(res) => console.log(res.credential)}
                                        onError={(err) => console.log(err)}></GoogleLogin>
                                </div>
                            </div>
                            <div className="flex justify-center gap-2.5 leading-none">
                                <p>{form === 'login' ? "Don't have an account?" : 'Already have an account?'}</p>
                                <button
                                    className="text-btn"
                                    onClick={() => setForm(form === 'login' ? 'register' : 'login')}>
                                    {form === 'login' ? 'Register' : 'Login'}
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
