import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CourseCard from '../components/CourseCard'
import CourseFilter from '../components/CourseFilter'
import Navbar from '../components/NavBar'
const MyCourse = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <Header /> 
      </div>
      <Navbar/>
      <div>
        <h2 className="font-bold text-lg pl-6 pt-6">Khoá học của tôi</h2>
      </div>
      <div className="flex-grow p-6 bg-white shadow-sm mx-4 my-4">
        <CourseFilter/>
        <div className='mt-4'>
          <CourseCard />
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default MyCourse
