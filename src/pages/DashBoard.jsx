import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CourseFilter from '../components/CourseFilter'
import Navbar from '../components/NavBar'
import AssignmentControlPanel from '../components/AssignmentControlPanel'
import DocumentTitle from '../components/DocumentTitle'
const DashBoard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <DocumentTitle title="Bảng điều khiển" />

      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <Navbar />
      <div>
        <h2 className="text-2xl font-bold text-gray-900 pl-6 pt-6">Bảng điều khiển</h2>
      </div>
      <div className="flex-grow p-6 bg-white shadow-sm mx-4 my-4 round-"><AssignmentControlPanel />
      </div>
      <Footer />
    </div>
  );
};

export default DashBoard;
