import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import SubmissionHeader from '../components/SubmissionHeader';
import CourseService from '@/services/courses/course.service.js';
import Loader from './Loader';
import { useParams } from 'react-router-dom';
import Lecture from './LectureComponent';
import Resource from './ResourceComponent';

function CourseContent() {
  const [expandedSections, setExpandedSections] = useState(['chung']);
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const convertToSlug = (text) => {
    const slug = text
      .toLowerCase()
      .normalize('NFD') // Normalize to decompose accented characters
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    return slug;
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
  const toggleSection = (section) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

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
                {expandedSections.includes(module) ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </button>
            {expandedSections.includes(module) && (
              <div className="px-4 py-2 bg-gray-50">
                {index === 0 ? (
                  <Lecture /> // Component được hiển thị khi module 'Chung' mở
                ) : (
                  <p className="text-sm text-gray-600">
                    <div>
                    {module.description && <span>{module.description}</span>}
                    <SubmissionHeader /> 
                    <Resource type="ppt" title="ppt" link="https://www.google.com" />
                    <Resource type="word" title="word" link="https://www.google.com" />
                    <Resource type="excel" title="exel" link="https://www.google.com" />
                    </div>
                  </p>
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
