import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import TagCourse from './components/tag/TagCourse';
import { SearchInput } from './components/input/SearchInput';
import { useCourses } from '../../store/useCourses';
import { useForum } from '../../store/useForum';

export const Sidebar = () => {
  const { courses } = useCourses();
  const { createForum } = useForum();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [activeCourseId, setActiveCourseId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCourseClick = (courseId) => {
    setActiveCourseId(courseId);
    createForum(courseId);
    navigate(`/forum/${courseId}`);
  };

  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) return courses;
    return courses.filter((course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  return (
    <div className="h-full flex flex-col gap-4 ">
      <div className="p-2">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('forum.search_course_placeholder')}
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <TagCourse
              key={course.id}
              nameCourse={course.name}
              onClick={() => handleCourseClick(course.id)}
              isActive={activeCourseId === course.id}
            />
          ))
        ) : (
          <p className="text-center text-gray-400 py-4">
            {t('forum.no_courses_found')}
          </p>
        )}
      </div>
    </div>
  );
};
