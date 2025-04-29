import Header from '@layout/Header';
import Footer from '@layout/Footer.jsx';
import CourseFilter from '../components/CourseFilter';
import Navbar from '@layout/NavBar.jsx';
import AssignmentControlPanel from '../components/AssignmentControlPanel';
import DocumentTitle from '../components/DocumentTitle';
import Calendar from '../components/CalendarAssignment';
import { useTranslation } from 'react-i18next';
const DashBoard = () => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col min-h-screen">
            <DocumentTitle title="Bảng điều khiển" />

            <div className="sticky top-0 z-50">
                <Header />
            </div>
            <Navbar />
            <div>
                <h2 className="font-bold text-lg pl-6 pt-4">{t('dashboard')}</h2>
            </div>
            <div className="flex-grow bg-white shadow-sm mx-4 my-4 rounded-lg">
                <AssignmentControlPanel />
            </div>
            <div className="flex-grow bg-white shadow-sm mx-4 my-4 rounded-lg">
                <Calendar />
            </div>
            <Footer />
        </div>
    );
};

export default DashBoard;
