import React from 'react';
import Header from '@layout/Header';
import Footer from '@layout/Footer.jsx';
import Navbar from '@layout/NavBar.jsx';
import CourseLayout from '../layout/CourseLayout';
import SideBar from '@layout/Sidebar';
const DetailCourse = () => {
    return (
        <div className="flex h-screen flex-col">
        {/* Header luôn ở trên cùng */}
        <div className="sticky top-0 z-50">
          <Header />
        </div>
      
        {/* Navbar nằm dưới Header */}
        <Navbar />
      
        {/* Nội dung chính chiếm phần còn lại */}
        <div className="flex-1 pr-6 pl-6">
          <CourseLayout />
        </div>
      
        {/* Footer luôn nằm dưới cùng */}
        <Footer />
      </div>
      
    );
};

export default DetailCourse;
