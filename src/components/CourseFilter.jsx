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
                        className="py-2 px-4 bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors flex items-center">
                        <AddIcon />
                        Thêm khóa học
                    </button>
                </Link>
            )}
        </>
    );
}


