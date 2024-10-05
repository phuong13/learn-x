import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CourseCard from '../components/CourseCard'
import CourseFilter from '../components/CourseFilter'
import Navbar from '../components/NavBar'
import DocumentTitle from '../components/DocumentTitle'
const MyCourse = () => {
  return (

    <div className="flex flex-col min-h-screen">
      <DocumentTitle title="Khoá học của tôi" />

      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <Navbar />
      <div>
        <h2 className="text-2xl font-bold text-gray-900 pl-6 pt-6">Khoá học của tôi</h2>
      </div>
      <div className="flex-grow p-6 bg-white shadow-sm mx-4 my-4">
        <CourseFilter />
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {/* Các Card được sắp xếp hàng ngang */}
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyCourse;
