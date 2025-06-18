import DocumentTitle from '../components/DocumentTitle';
import InteractiveStepProgress from '@components/StepProgress.jsx';
const AddCourse = () => {
    return (
        <>
                <DocumentTitle title="Thêm khóa học" />
                <div className="min-h-[calc(100vh-170px)] bg-white shadow-sm m-4 rounded-lg">
                    <h2 className="text-xl font-bold text-slate-700 pl-6 pt-6">Thêm khóa học</h2>
                    <InteractiveStepProgress />
                </div>
               
        </>
    );
};

export default AddCourse;
