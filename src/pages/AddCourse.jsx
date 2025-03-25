import DocumentTitle from '../components/DocumentTitle';
import Header from '@layout/Header';
import Footer from '@layout/Footer.jsx';
import Navbar from '@layout/NavBar.jsx';
import InteractiveStepProgress from '@components/StepProgress.jsx';
const AddCourse = () => {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                <DocumentTitle title="Thêm khóa học" />
                <div className="sticky top-0 z-50">
                    <Header />
                </div>
                <Navbar />
                <div className="flex-grow bg-white shadow-sm mx-4 my-4">
                    <h2 className="text-2xl font-bold text-gray-900 pl-6 pt-6">Thêm khóa học</h2>
                    <InteractiveStepProgress />
                </div>
                <Footer />
            </div>
        </>
    );
};

export default AddCourse;
