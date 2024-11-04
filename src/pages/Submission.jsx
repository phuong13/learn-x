import Header from '../layout/Header';
import Footer from '../components/Footer';
import SideBar from '../layout/Sidebar';
import Navbar from '../components/NavBar';
import SubmissionLayout from '../components/SubmissionLayout';
const Submission = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-50">
                <Header />
            </div>
            <Navbar />

            {/* Nội dung chính */}
            <div className="flex-grow pr-6 pl-6">
                <SideBar>
                    <SubmissionLayout />
                </SideBar>
            </div>
            <Footer />
        </div>
    );
};

export default Submission;
