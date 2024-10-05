import { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaBriefcase, FaEdit, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/auth/useAuth';

const ProfileInfo = () => {
    const [avatar, setAvatar] = useState(''); // Avatar URL
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('');
    const [errors, setErrors] = useState({});

    const { authUser } = useAuth(); // Lấy dữ liệu người dùng từ context

    useEffect(() => {
        if (authUser) {
            console.log('AuthUser Data:', authUser); // Kiểm tra dữ liệu trả về
            setAvatar(authUser.avatar || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAMAAzAMBIgACEQEDEQH/xAAbAAEBAAMBAQEAAAAAAAAAAAAAAQIFBgQDB//EAC0QAQABAwIFAgUEAwAAAAAAAAABAgMRBCEFEjFBURNhFSJTgZEjMjSxQkNS/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFhEBAQEAAAAAAAAAAAAAAAAAABEB/9oADAMBAAIRAxEAPwD9EAaZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJkAInmq5aYmZ9nrtcN1FzeqOSPcHkMtnHB6u96PwlXB6/8btMlGtmR6L+hv2M5pzHs89O8TmYyAAAAAAAAAAAAAAAAAAAytW6r12m3RG892Ld8J0/p2vUq/dJqvtpNHb01MYjNc9ZevCQyZVjyUrywoDHENZxDh8VxNyxERV4bVMKjk52nExMT3Hv4tp4t3fUpj5aurwLgACAAAAAAAAAAAABISBRTNd2inzLqrdOKKY8Oc4dETrbcT0dLT0RcUBFAAE8qA8XFLXqaOr23c/1iPZ1F+nns10z3hy+MTMRPdcTQBUAAAAAAAAAAAAABXo4f/Ntulhy1i5Fq/brntLp6aomEGQQIoAAAD53NrdUz4ly0dap8y6LiNyLelrnOJnZzkZjee64mqAqAAAAAAAAAAAAAAJMZmW/4VqPW08U1fuoaF9dNfq09+m5TM47wauOnicxlXx0+ot37cV0Tt/TPm3ZVmIoDGei53eHiGsp09M00z+pPT2B4eMajmuU2aJzEdWu37kzVVXNVU7z1VpNABAAAAAAAAAAAAAAAkzBmPIrOxfuaa5FduZ947Nvp+K2bkfq/JLS9e8ExHkMdLTq7FUZi7TP3Y16zT0RmbtP2lzfLHiCIxGMpFbXUcXjE0WKd/8Apq65rrqmq5XmRJE0hUjouYa0AEQAAAAAAAAAADKxFU1RTTEzVO0QCVTh9dPpb+o/ZR8vmWz0fDKKOWu9vV4bKKcRimIiPYqtVb4PHW7c+0PTTwrSxG9My9vLOFjozVeT4ZpPowfDNJ9GPy9gDx/DNJ9GPyfDNJ9GPy9gDx/DNJ9GPyxnheln/VH5e4KNbXwjTT0iqPu817g9dOZtV59pbrCcs+Vo5a9auWKsXKZhi6i7aouRiuIlptdw+bGblrM0T1hamvAETkEAAAAAACegdQKd5iIjMz2b3huiptUc9cfPPns8PCNN6l2btcbUzs3kSmquCCZTMorIY5kyDITKZBkJkyCjHK5BRjmTMgssao2x1jwuZAaXiWh9P9a1GInrDXdcTHSXU10xXTNMxmJc5rLPoaiqiI+Wd4XE18RUVAAAAFSYmcRHWZH000c2ptR75Fb/AElr0dPTTjtmX1idyZ3RItZZkzKZMkSrmTMpkyRauZMymTJEq5kzKZMkKuZMymTJCrmTMpkyRauZMpkyRKrW8aozZi5EbxLY5fDW0xc01yPYg5+ZyiQqoAAAAr78P/l0fd8H20H8y39wb6Z3MpO35MgsyrHJkGQwAZplMmQXO6scnMC5MpkyC5MpkyC5MpkyC5Sve3VHtJlKt6Kt+0g5zAqAAA//2Q=='); // Dùng ảnh mặc định nếu không có avatar
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
                setAvatar(reader.result); // Đọc file mới và set avatar
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Profile updated:', { avatar, email, fullName, role });
        // Thực hiện cập nhật thông tin user ở đây
    };

    const handleChangePassword = () => {
        console.log('Change password clicked');
    };

    const handleUpgradeRole = () => {
        console.log('Upgrade role clicked');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
                                            src={avatar} // Hiển thị avatar
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
                                        <h3 className="text-2xl font-bold leading-6 text-gray-900">{fullName}</h3>
                                        <p className="mt-1 max-w-2xl text-sm text-gray-500">{role}</p>
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
                                                    className="w-full disabled:opacity-60 px-3 py-2 border rounded-md focus:outline-none focus:ring-[#00ba9d] focus:border-[#00ba9d]"
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
                                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-[#00ba9d] focus:border-[#00ba9d]"
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
                                                <FaLock className="mr-2" />
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
