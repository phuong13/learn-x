
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCourseById } from '../../../store/useCourses';
import { useQuizById } from '../../../store/useQuiz.jsx';
const Breadcrum = ({quizTitle}) => {
    const { courseId } = useParams();
    const { courseName } = useCourseById(courseId);

    return (

        <div className="bg-primaryDark text-white w-fit px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
            <nav aria-label="breadcrumb">
                <ol className="flex items-center space-x-2">
                    <i className="fa-solid fa-file-arrow-up text-white text-xl mr-2"></i>
                    <li>
                        <Link to="/" className="text-white hover:underline">
                            Trang chủ
                        </Link>
                    </li>
                    <li>
                        <span className="mx-2 text-gray-300">/</span>
                    </li>
                    <li>
                        <Link to="/my-course" className="text-white hover:underline">
                            Khóa học
                        </Link>
                    </li>

                    <li>
                        <span className="mx-2 text-gray-300">/</span>
                    </li>
                    <Link to={`/course-detail/${courseId}`} className="text-white hover:underline">
                        {courseName || 'Đang tải...'}
                    </Link>

                    <li>
                        <span className="mx-2 text-gray-300">/</span>
                    </li>
                    
                    <li className="text-gray-200">{quizTitle || 'Đang tải...'}</li>
                </ol>
            </nav>
        </div>

    )
}

export default Breadcrum