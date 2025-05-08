import { ChevronDown, Search } from 'lucide-react';
import { useAuth } from '@hooks/useAuth.js';

export default function CourseFilter() {
    const { authUser } = useAuth();

    const handleAddCourse = () => {
    };

    return (
        <>
            {authUser?.role === 'TEACHER' && (
                        <a href="/add-course">
                            <button
                                onClick={() => handleAddCourse()}
                                className="py-2 px-4 bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors">
                                Thêm khóa học
                                {/* Add more sorting options as needed */}
                            </button>
                        </a>
            )}
        </>
    );
}


