import { ChevronDown, Search } from 'lucide-react';
import { useAuth } from '@hooks/useAuth.js';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

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
                        className=" text-xs sm:text-sm md:text-base  py-2 px-3 bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors flex items-center">
                        <AddIcon className="w-3 h-3 sm:w-5 sm:h-5" />
                        Thêm khóa học
                    </button>
                </Link>
            )}
        </>
    );
}


