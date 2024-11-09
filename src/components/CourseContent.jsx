import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useParams } from 'react-router-dom';
import CourseService from '../services/courses/course.service';
import Loader from './Loader';

function CourseContent() {
    const { courseId } = useParams();

    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const convertToSlug = (text) => {
        return text
            .toLowerCase()
            .normalize('NFD') // Normalize to decompose accented characters
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    useEffect(() => {
        setIsLoading(true);
        const fetchModules = async () => {
            try {
                const response = await CourseService.getModulesByCourseId(courseId);
                // Reponse return an array of modules Array(n) [ {…}, {…}, {…} ]
                setModules(response);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchModules();
    }, [courseId]);

    const [expandedSections, setExpandedSections] = useState([]); // Trạng thái lưu trữ các phần đang mở

    const toggleSection = (section) => {
        setExpandedSections(
            (prev) =>
                prev.includes(section)
                    ? prev.filter((s) => s !== section) // Nếu section đã được mở, đóng nó
                    : [...prev, section], // Nếu section chưa được mở, thêm nó vào danh sách
        );
    };

    return (
        <div className="container mx-auto mt-6 px-4">
            <Loader isLoading={isLoading} />
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {modules.map((module) => (
                    <div key={module.id} className="border-b last:border-b-0">
                        <button
                            onClick={() => toggleSection(module)}
                            className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 focus:outline-none">
                            <span className="font-medium text-gray-700">{module.name}</span>
                            <div className="flex items-center">
                                {expandedSections.includes(module) ? (
                                    <ChevronDown className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <ChevronRight className="h-5 w-5 text-gray-400" />
                                )}
                            </div>
                        </button>
                        {expandedSections.includes(module) && (
                            <div className="px-4 py-3 bg-gray-50">
                                <p className="text-sm text-gray-600">{`Nội dung cho Section ${module.name}`}</p>
                                {/* TODO: get course lecture, resources, assignment, quiz... */}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CourseContent;
