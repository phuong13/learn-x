import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Navbar from '../components/NavBar'
import CourseLayout from '../components/CourseLayout'

const DetailCourse = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50">
                <Header />
            </div>
            <Navbar/>

            {/* Nội dung chính */}
            <div className="flex-grow">
                <CourseLayout />
            </div>

            <Footer />
        </div>
    );
}

export default DetailCourse
