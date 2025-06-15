import { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard';
import CourseCardSkeleton from '../components/ui/CourseCardSkeleton';
import { GraduationCap } from 'lucide-react';
import CourseFilter from '../components/CourseFilter';
import CourseService from '../services/courses/course.service';
import { useAuth } from '@hooks/useAuth.js';
import DocumentTitle from '@components/DocumentTitle';
import Loader from '../components/Loader';
import { Pagination } from '@mui/material';
const MyCourse = () => {
    const { authUser } = useAuth();
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const pageSize = 8;
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setIsLoading(true);
        const pageable = {
            page,
            size: pageSize,
        };

        const fetchCourses = async () => {
            try {
                const res = await CourseService.getMyCourses(authUser.role, pageable);

                setCourses(res.content);
                setPage(res.number);
                setTotalPages(res.totalPages);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [authUser.role, page, pageSize]);

    const handlePageChange = (event, value) => {
        setPage(value - 1);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-190px)] mt-4 mx-4">
            <DocumentTitle title="Khóa học của tôi" />
            <div className="flex-grow p-3 rounded-lg bg-white shadow-sm">

                <div className='flex justify-end'>
                    <CourseFilter onSearch={handleSearch} />
                </div>
                {isLoading ? (
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <CourseCardSkeleton key={index} />
                        ))}
                    </div>
                ) : (
                    <>
                        {!(courses?.length > 0) && (
                            <div className="flex flex-col items-center justify-center my-20 text-slate-600 font-semibold">
                                <GraduationCap className='h-16 w-16 animate-bounce' />
                                Bạn chưa đăng ký khóa học nào!
                            </div>
                        )}
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            {Array.isArray(courses) &&
                                courses
                                    .filter(course =>
                                        course.name.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((course) => (
                                        <CourseCard
                                            key={course.id}
                                            id={course.id}
                                            name={course.name}
                                            description={course.description}
                                            thumbnail={course.thumbnail}
                                        />

                                    ))}
                        </div>
                    </>
                )}
            </div>
            <Pagination
                count={totalPages}
                page={page + 1}
                color="primaryDark"
                className="flex justify-center my-2"
                onChange={handlePageChange}
            />
        </div>
    );
};
export default MyCourse;
