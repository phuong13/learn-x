import { useEffect, useState, useRef } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import SubmissionHeader from '../components/SubmissionHeader';
import { School } from '@mui/icons-material';
import QuizzHeader from '../components/QuizzHeader';
import CourseSidebar from './CourseSidebar.jsx';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth.js';
import { useSubmitModules } from '../store/useModule';
import EditIcon from '@mui/icons-material/Edit';
import { Box, CircularProgress } from '@mui/material'; // Thêm import
import Lecture from './LectureComponent';
import Resource from './ResourceComponent';

const CourseContent = () => {
    const [expandedSections, setExpandedSections] = useState([])
    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const moduleRefs = useRef({});
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { authUser } = useAuth();
    const { getModules } = useSubmitModules();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const { success, modules: fetchedModules } = await getModules(courseId);
            if (success) {
                setModules(fetchedModules);
                setExpandedSections(fetchedModules.map(m => m.id)); // Mở mặc định tất cả modules

            }
            setIsLoading(false);
        };

        fetchData();
    }, [courseId]);

    const toggleSection = (module) => {
        if (expandedSections.includes(module.id)) {
            setExpandedSections((prev) => prev.filter((id) => id !== module.id));
        } else {
            setExpandedSections((prev) => [...prev, module.id]);
        }
    };

    const scrollToModule = (moduleId) => {
        const element = moduleRefs.current[moduleId];
        if (element) {
            const offset = -120;
            const bodyTop = document.body.getBoundingClientRect().top;
            const elemTop = element.getBoundingClientRect().top;
            const position = elemTop - bodyTop + offset;

            window.scrollTo({ top: position, behavior: 'smooth' });
        }
    };

    const expandAll = () => setExpandedSections(modules.map((m) => m.id));
    const collapseAll = () => setExpandedSections([]);

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

            <div className="flex-1 px-4 flex flex-col gap-2">
                {authUser?.role === 'TEACHER' && (
                    <div className="flex justify-end">
                        <button
                            onClick={() => navigate(`/course-detail/${courseId}/edit`)}
                            className="py-2 px-3 bg-primaryDark text-white rounded-lg hover:bg-secondary hover:shadow-lg transition-colors flex items-center">
                            <EditIcon fontSize='small' />
                            Chỉnh sửa
                        </button>
                    </div>
                )}
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                        <CircularProgress />
                    </Box>
                ) : (<>
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {modules.map((module) => (
                            <div
                                key={module.id}
                                ref={(el) => (moduleRefs.current[module.id] = el)}
                                className="border-b last:border-b-0"
                            >
                                <button
                                    onClick={() => toggleSection(module)}
                                    className="w-full px-4 py-2 bg-blue-50 flex justify-between items-center hover:bg-opacity-80 focus:outline-none"
                                >
                                    <span className="flex  gap-2 text-base font-semibold text-slate-600 items-center">
                                        <School /> {module.title}

                                    </span>
                                    {expandedSections.includes(module.id) ? (
                                        <ChevronDown className="h-5 w-5 text-slate-400" />
                                    ) : (
                                        <ChevronRight className="h-5 w-5 text-slate-400" />
                                    )}
                                </button>

                                {expandedSections.includes(module.id) && (
                                    <div className="px-4 pb-2">
                                        {module.contents.map((item) => {
                                            switch (item.type) {
                                                case 'lecture':
                                                    return (
                                                        <Lecture
                                                            key={item.id}
                                                            name={item.title}
                                                            content={item.content}
                                                        />
                                                    );
                                                case 'resource': {
                                                    const ext = item.urlDocument?.split('.').pop();
                                                    const type = ['pdf', 'ppt', 'xlsx'].includes(ext) ? ext : 'word';
                                                    return (
                                                        <Resource
                                                            key={item.id}
                                                            type={type}
                                                            title={item.title}
                                                            link={item.urlDocument}
                                                        />
                                                    );
                                                }
                                                case 'assignment':
                                                    return (
                                                        <SubmissionHeader
                                                            key={item.id}
                                                            courseID={courseId}
                                                            id={item.id}
                                                            title={item.title}
                                                            startDate={item.startDate}
                                                            endDate={item.endDate}
                                                        />
                                                    );
                                                case 'quiz':
                                                    return (
                                                        <QuizzHeader
                                                            key={item.id}
                                                            courseID={courseId}
                                                            id={item.id}
                                                            title={item.title}
                                                            startDate={item.startDate}
                                                            endDate={item.endDate}
                                                        />
                                                    );
                                                default:
                                                    return null;
                                            }
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>)}
            </div>
        </div>
    );
};

export default CourseContent;
