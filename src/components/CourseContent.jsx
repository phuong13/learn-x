import { useEffect, useState, useRef } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import SubmissionHeader from '../components/SubmissionHeader';
import CourseService from '@/services/courses/course.service.js';
import Loader from './Loader';
import { useParams } from 'react-router-dom';
import Lecture from './LectureComponent';
import Resource from './ResourceComponent';
import ModuleService from '@/services/modules/module.service.js';
import CourseSidebar from './CourseSidebar.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth.js';

const CourseContent = () => {
    const [expandedSections, setExpandedSections] = useState([]);
    const { courseId } = useParams();
    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [moduleData, setModuleData] = useState({});
    const moduleRefs = useRef({});
    const navigate = useNavigate();
    const { authUser } = useAuth();

    useEffect(() => {
        setIsLoading(true);
        const fetchModules = async () => {
            try {
                const response = await CourseService.getModulesByCourseId(courseId);
                setModules(response);
                // if (response.length > 0) {
                //   setExpandedSections([modules[0].id]);
                // }
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchModules();
    }, [courseId]);

    const toggleSection = async (module) => {
        if (expandedSections.includes(module.id)) {
            setExpandedSections((prev) => prev.filter((s) => s !== module.id));
        } else {
            setExpandedSections((prev) => [...prev, module.id]);
            if (!moduleData[module.id]) {
                try {
                    const [lectures, resources, assignments] = await Promise.all([
                        fetchLectures(module.id),
                        fetchResources(module.id),
                        fetchAssignments(module.id),
                    ]);
                    setModuleData((prev) => ({
                        ...prev,
                        [module.id]: { lectures, resources, assignments },
                    }));
                } catch (err) {
                    console.log(err);
                }
            }
        }
    };

    const fetchLectures = async (moduleId) => {
        try {
            return await ModuleService.getLecturesByModuleId(moduleId);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchResources = async (moduleId) => {
        try {
            return await ModuleService.getResourcesByModuleId(moduleId);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchAssignments = async (moduleId) => {
        try {
            return await ModuleService.getAssignmentsByModuleId(moduleId);
        } catch (err) {
            console.log(err);
        }
    };

    const scrollToModule = (moduleId) => {
        const element = moduleRefs.current[moduleId];
        if (element) {
            const offset = -120;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition + offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    const expandAll = () => {
        setExpandedSections(modules.map((module) => module.id));
    };

    const collapseAll = () => {
        setExpandedSections([]);
    };

    return (
        <div className="flex">
            <CourseSidebar
                modules={modules}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                scrollToModule={scrollToModule}
                expandAll={expandAll}
                collapseAll={collapseAll}
            />
            <div className="flex-1 p-6">
                {authUser?.role === 'TEACHER' && (
                    <button
                        onClick={() => navigate(`/course-detail/${courseId}/edit`)}
                        className="btn btn--primary mb-4 px-4 py-2 transition-colors">
                        Chỉnh sửa
                    </button>
                )}
                <Loader isLoading={isLoading} />
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {modules.map((module, index) => (
                        <div
                            key={module.id}
                            className={`border-b last:border-b-0 ${index % 2 === 0 ? 'bg-blue-50' : 'bg-green-50'}`}
                            ref={(el) => (moduleRefs.current[module.id] = el)}>
                            <button
                                onClick={() => toggleSection(module)}
                                className="w-full px-4 py-3 flex justify-between items-center hover:bg-opacity-80 focus:outline-none">
                                <span className="text-xl bold font-extrabold text-gray-700">{`${module.name}`}</span>
                                <div className="flex items-center">
                                    {expandedSections.includes(module.id) ? (
                                        <ChevronDown className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                    )}
                                </div>
                            </button>
                            {expandedSections.includes(module.id) && (
                                <div className="px-4 py-2">
                                    {module.description && <span>{module.description}</span>}
                                    {moduleData[module.id] && (
                                        <>
                                            {moduleData[module.id].lectures.map((lecture) => (
                                                <Lecture
                                                    key={lecture.id}
                                                    name={lecture.title}
                                                    content={lecture.content}
                                                />
                                            ))}
                                            {moduleData[module.id].resources.map((resource) => {
                                                const resourceType = resource.urlDocument.endsWith('.pdf')
                                                    ? 'pdf'
                                                    : resource.urlDocument.endsWith('.ppt')
                                                    ? 'ppt'
                                                    : resource.urlDocument.endsWith('.xlsx')
                                                    ? 'excel'
                                                    : 'word';
                                                return (
                                                    <Resource
                                                        key={resource.id}
                                                        type={resourceType}
                                                        title={resource.title}
                                                        link={resource.urlDocument}
                                                    />
                                                );
                                            })}
                                            {moduleData[module.id].assignments.map((assignment) => (
                                                <SubmissionHeader
                                                    courseID={courseId}
                                                    key={assignment.id}
                                                    id={assignment.id}
                                                    title={assignment.title}
                                                    startDate={assignment.startDate}
                                                    endDate={assignment.endDate}
                                                />
                                            ))}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseContent;
