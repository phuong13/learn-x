import { useEffect, useState } from 'react';
import { MoreVertical, Trash2 } from 'lucide-react';
import CourseContent from './CourseContent';
import StudentRegisteredLayout from './StudentRegisteredLayout.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosPrivate } from '@/axios/axios.js';
import { useAuth } from '@hooks/useAuth.js';
import { toast } from 'react-toastify';

export default function CoursePageLayout() {
    const [selectedTab, setSelectedTab] = useState(0);
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const tabs = ['Khóa học', 'Danh sách thành viên', 'Điểm số', 'Năng lực'];

    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    const { authUser } = useAuth();

    const { courseId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosPrivate.get(`courses/${courseId}`);
            if (response.status === 200) {
                setCourse(response.data.data);
            }
        };
        fetchData();
    }, [courseId]);

    useEffect(() => {
        setIsLoading(true);
        const fetchModules = async () => {
            setIsLoading(true);
            try {
                const response = await axiosPrivate.get(`courses/${courseId}/modules`);
                setModules(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchModules();
    }, [courseId]);

    const navigate = useNavigate();

    const handleDeleteCourse = async () => {
        try {
            const response = await axiosPrivate.delete(`courses/${courseId}`);
            if (response.status === 200) {
                setIsConfirmDialogOpen(false);
                navigate('/my-course');
                toast(response.data.message);
            }
        } catch (err) {
            console.error(err);
        }
    }


    const renderContentForTab = () => {
        switch (selectedTab) {
            case 0:
                return (
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-2">Nội dung Khóa học</h2>
                        <CourseContent modules={modules} />
                    </div>
                );
            case 1:
                return (
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-2">Danh sách thành viên</h2>
                        <StudentRegisteredLayout />
                    </div>
                );
            case 2:
                return (
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-2">Điểm số</h2>
                    </div>
                );
            case 3:
                return (
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-2">Năng lực</h2>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen mb-6">
            <div className="relative h-48 bg-emerald-200 overflow-hidden">
                <img
                    src={course?.thumbnail}
                    alt="Online learning illustration"
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="bg-[#14919B] text-white px-4 py-2 rounded-lg text-sm font-semibold mb-2">
                        <nav aria-label="breadcrumb">
                            <ol className="flex items-center space-x-2">
                                <li>
                                    <a
                                        href="/"
                                        className="text-white hover:underline">
                                        Trang chủ
                                    </a>
                                </li>
                                <li>
                                    <span className="mx-2 text-gray-300">/</span>
                                </li>
                                <li>
                                    <a
                                        href="/my-course"
                                        className="text-white hover:underline">
                                        Khóa học
                                    </a>
                                </li>
                                <li>
                                    <span className="mx-2 text-gray-300">/</span>
                                </li>
                                <li className="text-gray-200">
                                    {course?.name || 'Đang tải...'}
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-2">
                        {authUser?.role === 'TEACHER' && (
                            <button
                                onClick={() => setIsConfirmDialogOpen(true)}
                                className="bg-emerald-600 text-white bg-red-500 hover:bg-red-700 p-2 rounded-full"
                            >
                                <Trash2 className="h-6 w-6" />
                            </button>
                        )}

                    {/*    <button className="text-white">*/}
                    {/*        <MoreVertical className="h-6 w-6" />*/}
                    {/*    </button>*/}
                    </div>
                </div>

            </div>

            <nav className="bg-white border-b">
                <ul className="flex">
                {tabs.map((item, index) => (
                        <li key={index}>
                            <button
                                onClick={() => setSelectedTab(index)}
                                className={`block px-4 py-2 text-sm ${selectedTab === index ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
                                }`}>
                                {item}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="container mx-auto mt-6 px-4 bg-white rounded-lg shadow-lg overflow-hidden">
                {renderContentForTab()}
            </div>


            {isConfirmDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        {/*<h2 className="text-xl font-bold mb-4">Xác nhận</h2>*/}
                        <p className="mb-4">Xác nhận xóa khóa học? <br/>(Hành động này không thể quay lại)</p>
                        <div className="flex justify-end space-x-2">
                            <button className="btn btn--secondary text-btn hover:bg-emerald-400" onClick={() => setIsConfirmDialogOpen(false)}>Không</button>
                            <button className="btn btn--primary hover:bg-emerald-400" onClick={handleDeleteCourse}>Có</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
