import PropTypes from 'prop-types';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useAuth } from '../contexts/auth/useAuth';
import { get } from 'react-hook-form';

export const ChangePasswordModal = ({ visible, onClose, getResponse }) => {
    const axiosPrivate = useAxiosPrivate();
    const { authUser } = useAuth();
    if (!visible) return null;

    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('oldPassword', e.target[0].value);
        formData.append('newPassword', e.target[1].value);
        formData.append('email', authUser.email);

        const response = await axiosPrivate.post('/user/change-password', formData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        getResponse(response);
        console.log(response);

        if (response.status === 200) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-20 backdrop-blur-sm flex justify-center items-center"
            onClick={handleOutsideClick}>
            <div className="bg-white px-8 pt-8 pb-4 rounded-md w-1/4">
                <form onSubmit={handleChangePassword}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Mật khẩu cũ</label>
                        <input
                            type="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                        <input
                            type="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="font-medium mr-2 px-4 py-2 bg-gray-300 rounded-md"
                            onClick={onClose}>
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00ba9d] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00ba9d] transition-all duration-300">
                            Đổi mật khẩu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

ChangePasswordModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    getResponse: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
};
