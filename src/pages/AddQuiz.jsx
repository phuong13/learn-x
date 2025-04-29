import DocumentTitle from '../components/DocumentTitle';
import Header from '@layout/Header';
import Footer from '@layout/Footer.jsx';
import Navbar from '@layout/NavBar.jsx';
import AddQuiz from '../layout/AddQuiz.jsx';
const AddQuizPage = () => {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                <div className="sticky top-0">
                    <Header />
                    <Navbar />
                </div>

                <div className="flex-grow h-0 overflow-hidden">
                    <AddQuiz />
                </div>
                <Footer />
            </div>
        </>
    );
};

export default AddQuizPage;
