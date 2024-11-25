import { useEffect, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import CourseContent from './CourseContent';
import StudentRegisteredLayout from './StudentRegisteredLayout.jsx';
import { useParams } from 'react-router-dom';
import { axiosPrivate} from '@/axios/axios.js';

export default function CoursePageLayout() {
    const [selectedTab, setSelectedTab] = useState(0); // Quản lý trạng thái tab được chọn
    const [course, setCourse] = useState(null);
    const tabs = ['Khóa học', 'Danh sách thành viên', 'Điểm số', 'Năng lực'];



    const { courseId } = useParams();

    useEffect( () => {
        const fetchData = async () => {
            const response = await axiosPrivate.get(`courses/${courseId}`);
            const data = response.status === 200 ? response.data : null;
            if (data.success) {
                setCourse(data.data);
                console.log(course);
            } else {
                console.error('Failed to fetch course:', data.message);
            }
        }
        fetchData();
    }, [courseId]);

    // Nội dung cho mỗi tab
    const renderContentForTab = () => {
        switch (selectedTab) {
            case 0:
                return (
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-2">Nội dung Khóa học</h2>
                        <span><CourseContent /></span>
                    </div>
                );
            case 1:
                return (
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-2">Danh sách thành viên</h2>
                        <p>Đây là danh sách các thành viên trong khóa học.</p>
                        <StudentRegisteredLayout />
                    </div>
                );
            case 2:
                return (
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-2">Điểm số</h2>
                        <p>Điểm số của các thành viên trong khóa học sẽ được hiển thị ở đây.</p>
                    </div>
                );
            case 3:
                return (
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-2">Năng lực</h2>
                        <p>Đánh giá năng lực của các thành viên trong khóa học.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Header Banner */}
            <div className="relative h-48 bg-emerald-200 overflow-hidden">
                <img
                    src={course?.thumbnail}
                    alt="Online learning illustration"
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div>
                        <div className="bg-[#14919B] text-white px-4 py-2 rounded-lg text-sm font-semibold mb-2">
                            {course?.name}
                        </div>
                    </div>
                    <button className="text-white">
                        <MoreVertical className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white border-b">
                <ul className="flex">
                    {tabs.map((item, index) => (
                        <li key={index}>
                            <button
                                onClick={() => setSelectedTab(index)} // Cập nhật trạng thái tab khi nhấn
                                className={`block px-4 py-2 text-sm ${
                                    selectedTab === index ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
                                }`}>
                                {item}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Course Content - Nội dung thay đổi theo tab */}
            <div className="container mx-auto mt-6 px-4 bg-white rounded-lg shadow-lg overflow-hidden">
                {renderContentForTab()} {/* Hiển thị nội dung tương ứng với tab */}
            </div>
        </div>
    );
}
