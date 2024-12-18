import { ChevronDown, Search } from 'lucide-react';
import { useAuth } from '@hooks/useAuth.js';

export default function Component() {
    const { authUser } = useAuth();

    const handleAddCourse = () => {

    };

    return (
        <div className="flex flex-wrap gap-4 items-center p-4 bg-neutral-100 rounded-lg">
            <div className="relative">
                <select className="bg-neutral-200 appearance-none border rounded-md py-2 px-3 pr-8 leading-tight focus:outline-none focus:shadow-outline hover:bg-[#14919B]">
                    <option>Tất cả</option>
                    {/* Add more options as needed */}
                </select>
                <ChevronDown
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={16}
                />
            </div>

            <div className="relative flex-grow max-w-md">
                <input
                    type="text"
                    placeholder="Tìm kiếm"
                    className="w-full border rounded-md py-2 px-3 leading-tight focus:outline-none focus:shadow-outline pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>


            <div className="relative">
                <select className="bg-neutral-200 appearance-none border rounded-md py-2 px-3 pr-8 leading-tight focus:outline-none focus:shadow-outline hover:bg-[#14919B]">
                    <option>Sắp xếp theo tên</option>
                    {/* Add more sorting options as needed */}
                </select>
                <ChevronDown
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={16}
                />
            </div>

            {authUser?.role === 'TEACHER' && (
                <div className="relative">
                    <a href="/add-course">
                    <button
                        onClick={() => handleAddCourse()}
                        className="bg-neutral-200 appearance-none border rounded-md py-2 px-3 leading-tight focus:outline-none focus:shadow-outline hover:bg-[#14919B]">
                        Thêm khóa học
                        {/* Add more sorting options as needed */}
                    </button>
                    </a>
                </div>
            )}
        </div>
    );
}
