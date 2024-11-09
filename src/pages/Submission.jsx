import Header from '../layout/Header'
import Footer from '@layout/Footer.jsx'
import SideBar from '../layout/Sidebar'
import Navbar from '@layout/NavBar.jsx'
import SubmissionLayout from '../components/SubmissionLayout'
const Submission = () => {
  return (
    <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50">
                <Header />
                <Navbar />
            </div>

            {/* Nội dung chính */}
            <div className="flex-grow pr-6 pl-6">
                <SideBar>
                    <SubmissionLayout/>
                </SideBar>               
            </div>
            <div className="sticky">
                <Footer />
            </div>
        </div>
  );
};

export default Submission;
