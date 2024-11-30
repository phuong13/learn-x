import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import SubmissionHeader from '../components/SubmissionHeader';
import CourseService from '@/services/courses/course.service.js';
import Loader from './Loader';
import { useParams } from 'react-router-dom';
import Lecture from './LectureComponent';
import Resource from './ResourceComponent';
import ModuleService from '@/services/modules/module.service.js';

const CourseContent = () => {
  const [expandedSections, setExpandedSections] = useState(['chung']);
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [moduleData, setModuleData] = useState({});

  useEffect(() => {
    setIsLoading(true);
    const fetchModules = async () => {
      try {
        const response = await CourseService.getModulesByCourseId(courseId);
        setModules(response);
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
      setExpandedSections(prev => prev.filter(s => s !== module.id));
    } else {
      setExpandedSections(prev => [...prev, module.id]);
      if (!moduleData[module.id]) {
        try {
          const [lectures, resources, assignments] = await Promise.all([
            fetchLectures(module.id),
            fetchResources(module.id),
            fetchAssignments(module.id)
          ]);
          setModuleData(prev => ({
            ...prev,
            [module.id]: { lectures, resources, assignments }
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
  }

  return (
      <div className="container mx-auto mt-6 px-4">
        <Loader isLoading={isLoading} />
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {modules.map((module, index) => (
              <div key={module.id} className="border-b last:border-b-0">
                <button
                    onClick={() => toggleSection(module)}
                    className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                >
              <span className="font-medium text-gray-700">
                {index === 0 ? 'Chung' : `${module.name}`}
              </span>
                  <div className="flex items-center">
                    {expandedSections.includes(module.id) ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>
                {expandedSections.includes(module.id) && (
                    <div className="px-4 py-2 bg-gray-50">
                      {index === 0 ? (
                          <div>
                            {module.description && <span>{module.description}</span>}
                            {moduleData[module.id] && (
                                <>
                                  {moduleData[module.id].lectures.map((lecture) => (
                                      <Lecture key={lecture.id} name={lecture.name} content={lecture.content} />
                                  ))}
                                  {moduleData[module.id].resources.map((resource) => {
                                    const resourceType = resource.urlDocument.endsWith('.pdf') ? 'word' :
                                        resource.urlDocument.endsWith('.ppt') ? 'ppt' :
                                            resource.urlDocument.endsWith('.xlsx') ? 'excel' : 'word';
                                    return (
                                        <Resource key={resource.id} type={resourceType} title={resource.title}
                                                  link={resource.urlDocument} />
                                    );
                                  })}
                                  {moduleData[module.id].assignments.map((assignment) => (
                                      <SubmissionHeader key={assignment.id} id={assignment.id} title={assignment.title}
                                                        startDate={assignment.startDate} endDate={assignment.endDate} />
                                  ))}
                                </>
                            )}
                          </div>// Component displayed when module 'Chung' is expanded
                      ) : (
                          <div>
                            {module.description && <span>{module.description}</span>}
                            {moduleData[module.id] && (
                                <>
                                  {moduleData[module.id].lectures.map((lecture) => (
                                      <Lecture key={lecture.id} name={lecture.name} content={lecture.content} />
                                  ))}
                                  {moduleData[module.id].resources.map((resource) => {
                                    const resourceType = resource.urlDocument.endsWith('.pdf') ? 'word' :
                                        resource.urlDocument.endsWith('.ppt') ? 'ppt' :
                                            resource.urlDocument.endsWith('.xlsx') ? 'excel' : 'word';
                                    return (
                                        <Resource key={resource.id} type={resourceType} title={resource.title}
                                                  link={resource.urlDocument} />
                                    );
                                  })}
                                  {moduleData[module.id].assignments.map((assignment) => (
                                      <SubmissionHeader key={assignment.id} id={assignment.id} title={assignment.title}
                                                        startDate={assignment.startDate} endDate={assignment.endDate} />
                                  ))}
                                </>
                            )}
                          </div>
                      )}
                    </div>
                )}
              </div>
          ))}
        </div>
      </div>
  );
}

export default CourseContent;
