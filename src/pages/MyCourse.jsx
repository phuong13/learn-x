import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import CourseFilter from '../components/CourseFilter';
import Navbar from '../components/NavBar';
import { axiosPrivate } from '../axios/axios';
import { useAuth } from '../contexts/auth/useAuth';
const MyCourse = () => {
    const { authUser } = useAuth();
    const email = authUser.email;
    const pageable = { page: 1, size: 10 };
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        axiosPrivate
            .post(`/courses/email`, { email, pageable }, { headers: { 'Content-Type': 'application/json' } })
            .then((res) => {
                console.log(res.data);
                setCourses(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50">
                <Header />
            </div>
            <Navbar />
            <div>
                <h2 className="font-bold text-lg pl-6 pt-6">Khoá học của tôi</h2>
            </div>
            <div className="flex-grow p-6 bg-white shadow-sm mx-4 my-4">
                <CourseFilter />
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
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
            <Footer />
        </div>
    );
};
export default MyCourse;
