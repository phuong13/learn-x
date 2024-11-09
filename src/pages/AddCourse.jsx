import CreateCourseForm from '../components/CreateCourseForm';
import DocumentTitle from '../components/DocumentTitle';
import Header from '../layout/Header';
import Footer from '@layout/Footer.jsx';
import Navbar from '@layout/NavBar.jsx';

const AddCourse = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <DocumentTitle title="Add Course" />
            <div className="sticky top-0 z-50">
                <Header />
            </div>
            <Navbar />
            <div>
                <h2 className="text-2xl font-bold text-gray-900 pl-6 pt-6">Thêm khóa học</h2>
            </div>
            <div className="flex-grow p-6 bg-white shadow-sm mx-4 my-4 round-">
                <CreateCourseForm />
            </div>
            <Footer />
        </div>
    );
};

export default AddCourse;
