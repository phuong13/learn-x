import { useEffect, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import CourseContent from './CourseContent';
import StudentRegisteredLayout from './StudentRegisteredLayout.jsx';
import { useParams } from 'react-router-dom';
import { axiosPrivate } from '@/axios/axios.js';

export default function CoursePageLayout() {
    const [selectedTab, setSelectedTab] = useState(0);
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const tabs = ['Khóa học', 'Danh sách thành viên', 'Điểm số', 'Năng lực'];

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

    const handleModuleClick = (module) => {
        document.getElementById(module.id).scrollIntoView({ behavior: 'smooth' });
    };

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
        <div className="bg-gray-100 min-h-screen">
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
                    <button className="text-white">
                        <MoreVertical className="h-6 w-6" />
                    </button>
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
        </div>
    );
}
