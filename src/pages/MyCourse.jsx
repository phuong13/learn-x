import { useEffect, useState } from 'react';
import Header from '@layout/Header';
import Footer from '@layout/Footer.jsx';
import CourseCard from '../components/CourseCard';
import CourseFilter from '../components/CourseFilter';
import Navbar from '@layout/NavBar.jsx';
import CourseService from '../services/courses/course.service';
import { useAuth } from '@hooks/useAuth.js';
import DocumentTitle from '@components/DocumentTitle';
import Loader from '../components/Loader';
import { Pagination } from '@mui/material';
import { useTranslation } from 'react-i18next';

const MyCourse = () => {
    const { authUser } = useAuth();

    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const {t}=useTranslation();
    const pageSize = 9;
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

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

    return (
        <>
            <Loader isLoading={isLoading} />
            <DocumentTitle title="Khóa học của tôi" />
            <div className="flex flex-col min-h-screen">
                <div className="sticky top-0 z-50">
                    <Header />
                </div>
                <Navbar />
                <div>
                    <div className="font-bold text-lg pl-6 pt-4">{t('my_courses')}</div>
                </div>
                <div className="flex-grow p-3 rounded-lg bg-white shadow-sm mx-4 my-2">
                    {/* <CourseFilter /> */}
                    {!(courses.length > 0) && <div className="text-center justify-center">Bạn chưa đăng ký khóa học nào!</div>}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {Array.isArray(courses) &&
                            courses.length > 0 &&
                            courses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    id={course.id}
                                    name={course.name}
                                    description={course.description}
                                    thumbnail={course.thumbnail}
                                />
                            ))}
                    </div>
                </div>
                <Pagination
                    count={totalPages}
                    page={page + 1}
                    color="primary"
                    className="flex justify-center mb-2"
                    onChange={handlePageChange}
                />
                <Footer />
            </div>
        </>
    );
};
export default MyCourse;
