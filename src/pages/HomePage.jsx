import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import IntroBackround from '../components/IntroBackround';
import Navbar from '../components/NavBar';
import DocumentTitle from '../components/DocumentTitle';  

const MyCourse = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar Sticky */}
      <DocumentTitle title="Trang chủ" />

      <div className="sticky top-0 z-50">
        <Header /> {/* Header gồm các navbar */}
      </div>

      {/* Các thành phần khác của trang */}
      <div className="flex-1">
        <Navbar/>
        <IntroBackround /> {/* Nội dung */}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MyCourse;
