import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Loader from '../../components/Loader';
import TagCourse from './components/tag/TagCourse';
import { useCourses } from '../../store/useCourses';
import { useForum } from '../../store/useForum';

import { TextField, InputAdornment, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const Sidebar = () => {
  const { courses, loading } = useCourses();
  const { createForum, loading: forumLoading } = useForum();
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
    <div className="h-full flex flex-col gap-4">
      <div className="flex flex-col gap-2 p-2">
        <p className="text-slate-600 font-semibold text-lg ">
          {t('Forum')}
        </p>
        <TextField
          fullWidth
          placeholder={t('forum.search_course_placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </div>

      {(loading ) ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader isLoading />
        </div>
      ) : (
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
            <p className="text-center text-slate-700 py-4">
              {t('forum.no_courses_found')}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
