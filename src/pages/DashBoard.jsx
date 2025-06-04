
import AssignmentControlPanel from '../components/AssignmentControlPanel';
import DocumentTitle from '../components/DocumentTitle';
import Calendar from '../components/CalendarAssignment';
import { useTranslation } from 'react-i18next';
const DashBoard = () => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col min-h-[calc(100vh-170px)]">
            <DocumentTitle title="Bảng điều khiển" />
                <AssignmentControlPanel />
                <Calendar />
           
        </div>
    );
};

export default DashBoard;
