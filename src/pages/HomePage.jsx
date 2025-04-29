import Header from '@layout/Header';
import Footer from '@layout/Footer.jsx';
import IntroBackround from '../components/IntroBackround';
import Navbar from '@layout/NavBar.jsx';
import DocumentTitle from '../components/DocumentTitle';
import { useEffect } from 'react';
import { axiosPrivate } from '@/axios/axios.js';

const MyCourse = () => {

    useEffect(() => {
        const fetchDummy = async () => {
            // await axiosPrivate.get()
        }
        fetchDummy().then(() => console.log("Fetch dummy data successfully!"));
    }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar Sticky */}
      <DocumentTitle title="Trang chủ" />

      <div className="sticky top-0 z-50">
        <Header />
      </div>
        <Navbar/>

      <div className="flex-grow">

        <IntroBackround /> 
      </div>

      <Footer />
    </div>
  );
};

export default MyCourse;
