import { ChevronDown, Search } from 'lucide-react';
import { useAuth } from '@hooks/useAuth.js';
import { Link } from 'react-router-dom';

export default function CourseFilter() {
    const { authUser } = useAuth();

    const handleAddCourse = () => {
    };

    return (
        <>
            {authUser?.role === 'TEACHER' && (
                        <Link to="/add-course">
                            <button
                                onClick={() => handleAddCourse()}
                                className="py-2 px-4 bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors">
                                Thêm khóa học
                                {/* Add more sorting options as needed */}
                            </button>
                        </Link>
            )}
        </>
    );
}


