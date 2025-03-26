import { useAuth } from '@hooks/useAuth.js';


function Navbar() {

    const {authUser} = useAuth();
    return (
        <nav className='bg-slate-200'>
            <div className="container mx-auto flex justify-between items-center p-2 px-4 ">
                {/* Logo bên trái */}
                <div className="text-white text-xl font-bold">
                    <a href="/" className="hover:text-gray-200">
                        <img src="/src/assets/utez-logo-emblem.svg" alt="Logo" className="w-12 h-12 inline-block mr-2" />
                    </a>
                </div>

                {/* Menu bên phải */}
                <div className="space-x-6">
                    <a href="/" className="font-medium hover:text-slate-500 text-lg">
                        Trang chủ
                    </a>
                    <a href="/my-course" className="font-medium hover:text-slate-500 text-lg">
                        {authUser.role === "TEACHER" ? "Quản lý khóa học" : "Khóa học của tôi"}
                    </a>
                    <a href="/dashboard" className="font-medium hover:text-slate-500 text-lg">
                        Bảng điều khiển
                    </a>
                    <a href="/forum" className="font-medium hover:text-slate-500 text-lg">
                        Forum
                    </a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
