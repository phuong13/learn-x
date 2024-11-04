import { useEffect, useState, useMemo } from 'react';
import { FaUser, FaEnvelope, FaBriefcase, FaEdit, FaLock, FaKey } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/auth/useAuth';
import { ChangePasswordModal } from './ChangePasswordModal';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Toaster, toast } from 'sonner';
import Loader from './Loader';
const ProfileInfo = () => {
    const [avatar, setAvatar] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('');
    const [errors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const axiosPrivate = useAxiosPrivate();

    const { authUser, setAuthUser } = useAuth();

    useEffect(() => {
        if (authUser) {
            setAvatar(authUser.avatar);
            setEmail(authUser.email);
            setFullName(authUser.fullName);
            setRole(authUser.role);
        }
    }, [authUser]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // const handleEmailChange = (e) => {
    //     const newEmail = e.target.value;
    //     setEmail(newEmail);
    //     if (!validateEmail(newEmail)) {
    //         setErrors({ ...errors, email: 'Please enter a valid email address' });
    //     } else {
    //         setErrors({ ...errors, email: null });
    //     }
    // };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append('user', new Blob([JSON.stringify({ email, fullName })], { type: 'application/json' }));
        const avatar = document.getElementById('avatar-upload').files[0];
        if (avatar) {
            formData.append('avatar', avatar);
        }

        setIsLoading(true);

        try {
            const response = await axiosPrivate.patch('/user', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                console.log(response.data);
                setAuthUser(response.data.data);
                toast.success('Profile updated successfully');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred. Please try again later');
        } finally {
            setIsLoading(false);
        }
    };

    const [showChangePassword, setShowChangePassword] = useState(false);

    const handleChangePassword = () => {
        setShowChangePassword(true);
    };

    const handleUpgradeRole = () => {
        console.log('Upgrade role clicked');
    };

    let response = useMemo(() => ({}), []);

    const getReponse = (res) => {
        response = res.data;
    };

    useEffect(() => {
        if (response.code === 200) {
            toast.success('Password changed successfully');
        } else if (response.code === 500) {
            toast.error('Invalid password');
        } else if (response === undefined) {
            toast.error('An error occurred. Please try again later');
        }
    }, [response]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <ChangePasswordModal
                visible={showChangePassword}
                onClose={() => setShowChangePassword(false)}
                getResponse={getReponse}
            />
            <Toaster position="top-right" richColors />
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {isLoading && <Loader />}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="px-4 py-6 sm:px-0">
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-24 w-24 relative">
                                        <motion.img
                                            whileHover={{ scale: 1.05 }}
                                            className="h-24 w-24 rounded-full object-cover"
                                            src={avatar}
                                            alt="User avatar"
                                        />
                                        <label
                                            htmlFor="avatar-upload"
                                            className="absolute bottom-0 right-0 bg-[#00ba9d] rounded-full p-1 cursor-pointer hover:bg-opacity-80 transition-all duration-300">
                                            <FaEdit className="text-white" />
                                            <input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                                aria-label="Upload new avatar"
                                            />
                                        </label>
                                    </div>
                                    <div className="ml-5 flex-1">
                                        <h3 className="text-2xl font-bold leading-6 text-gray-900">
                                            {authUser.fullName}
                                        </h3>
                                        <p className="mt-1 max-w-2xl text-sm text-gray-500">{authUser.role}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-gray-200">
                                <form onSubmit={handleSubmit}>
                                    <dl>
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.3, duration: 0.5 }}
                                            className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                <FaEnvelope className="mr-2 text-[#00ba9d]" />
                                                Email
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <input
                                                    type="email"
                                                    className={`w-full disabled:opacity-60 px-3 py-2 border rounded-md focus:outline-none focus:ring-[#00ba9d] focus:border-[#00ba9d] ${
                                                        errors.email ? 'border-red-500' : ''
                                                    }`}
                                                    value={email}
                                                    disabled
                                                    aria-label="Email address"
                                                />
                                            </dd>
                                        </motion.div>
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.4, duration: 0.5 }}
                                            className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                <FaUser className="mr-2 text-[#00ba9d]" />
                                                Full Name
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-[#00ba9d] focus:border-[#00ba9d]"
                                                    value={fullName}
                                                    onChange={handleInputChange(setFullName)}
                                                    aria-label="Full name"
                                                />
                                            </dd>
                                        </motion.div>
                                        <motion.div
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.5, duration: 0.5 }}
                                            className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                                                <FaBriefcase className="mr-2 text-[#00ba9d]" />
                                                Role
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <input
                                                    type="text"
                                                    disabled
                                                    className="w-full disabled:opacity-60 px-3 py-2 border rounded-md focus:outline-none focus:ring-[#00ba9d] focus:border-[#00ba9d]"
                                                    value={role}
                                                    onChange={handleInputChange(setRole)}
                                                    aria-label="Role or job title"
                                                />
                                            </dd>
                                        </motion.div>
                                    </dl>
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.5 }}
                                        className="px-4 py-3 bg-gray-50 sm:px-6 flex justify-between items-center">
                                        <div>
                                            <button
                                                type="button"
                                                onClick={handleChangePassword}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00ba9d] transition-all duration-300 mr-3">
                                                <FaKey className="mr-2" />
                                                Change Password
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleUpgradeRole}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00ba9d] transition-all duration-300">
                                                <FaLock className="mr-2" />
                                                Change Role
                                            </button>
                                        </div>
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00ba9d] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00ba9d] transition-all duration-300">
                                            Save Changes
                                        </button>
                                    </motion.div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </motion.div>
    );
};

export default ProfileInfo;
