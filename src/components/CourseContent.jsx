import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { useAuth } from '@hooks/useAuth';
import { useSubmitModules } from '../store/useModule';
import { parseJavaLocalDateTime } from '@/utils/date.js';

import CourseSidebar from './CourseSidebar.jsx';
import Loader from './Loader';
import Lecture from './LectureComponent';
import Resource from './ResourceComponent';
import SubmissionHeader from './SubmissionHeader';
import QuizzHeader from './QuizzHeader';

const ModuleSection = ({ module }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2 bg-blue-50 flex justify-between items-center hover:bg-opacity-80 focus:outline-none"
      >
        <span className="text-base font-semibold text-slate-600">{module.title}</span>
        {expanded ? (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronRight className="h-5 w-5 text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-2">
          {module.description && <p>{module.description}</p>}
          {module.contents?.map((item) => {
            switch (item.type) {
              case 'lecture':
                return <Lecture key={item.id} name={item.title} content={item.content} />;
              case 'resource': {
                const ext = item.urlDocument?.split('.').pop();
                const type = ['pdf', 'ppt', 'xlsx'].includes(ext) ? ext : 'word';
                return <Resource key={item.id} type={type} title={item.title} link={item.urlDocument} />;
              }
              case 'assignment':
                return (
                  <SubmissionHeader
                    key={item.id}
                    courseID={module.courseId}
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
                    courseID={module.courseId}
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
  );
};

const CourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const { getModules } = useSubmitModules();

  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const moduleRefs = useRef({});

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const result = await getModules(courseId);
      if (result.success) {
        setModules(result.modules);
      }
      setIsLoading(false);
    };

    if (courseId) fetch();
  }, [courseId]);

  return (
    <div className="flex">
      <CourseSidebar
        modules={modules}
        expandedSections={[]} // Nếu cần quản lý toggle sidebar thì có thể mở rộng
        toggleSection={() => {}}
        scrollToModule={(moduleId) => {
          const element = moduleRefs.current[moduleId];
          if (element) {
            const offset = -120;
            const bodyTop = document.body.getBoundingClientRect().top;
            const elemTop = element.getBoundingClientRect().top;
            const position = elemTop - bodyTop + offset;
            window.scrollTo({ top: position, behavior: 'smooth' });
          }
        }}
        expandAll={() => {}}
        collapseAll={() => {}}
      />

      <div className="flex-1 px-4 flex flex-col gap-2">
        {authUser?.role === 'TEACHER' && (
          <div className="flex justify-end">
            <button
              onClick={() => navigate(`/course-detail/${courseId}/edit`)}
              className="py-2 px-4 bg-primaryDark text-white rounded-lg hover:bg-secondary transition-colors"
            >
              Chỉnh sửa
            </button>
          </div>
        )}

        <Loader isLoading={isLoading} />

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {modules.map((module) => (
            <div key={module.id} ref={(el) => (moduleRefs.current[module.id] = el)}>
              <ModuleSection module={{ ...module, courseId }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
