import React from 'react';
import Header from '../layout/Header';
import Footer from '@layout/Footer.jsx';
import IntroBackround from '../components/IntroBackround';
import Navbar from '@layout/NavBar.jsx';
import DocumentTitle from '../components/DocumentTitle';  

const MyCourse = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar Sticky */}
      <DocumentTitle title="Trang chủ" />

      <div className="sticky top-0 z-50">
        <Header /> {/* Header gồm các navbar */}
      </div>
        <Navbar/>

      {/* Các thành phần khác của trang */}
      <div className="flex-1">
        
        <IntroBackround /> {/* Nội dung */}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MyCourse;
