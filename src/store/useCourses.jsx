import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useAuth } from '@hooks/useAuth.js';

export const useCourses = () => {
  const axiosPrivate = useAxiosPrivate();
  const { authUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authUser) return;

    const fetchCourses = async () => {
      try {
        let endpoint = '/courses/my-courses';
        if (authUser.role === 'TEACHER') {
          endpoint = '/courses/teacher/my-courses';
        }

        const response = await axiosPrivate.get(endpoint);
        setCourses(response.data.data.content);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách khóa học:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading, error };
};


export const useCourseById = (courseId) => {
  const axiosPrivate = useAxiosPrivate();
  const [course, setCourse] = useState(null);
  const [courseName, setCourseName] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        const response = await axiosPrivate.get(`/courses/${courseId}`);
        setCourse(response.data.data);
        setCourseName(response.data.data.name); 
      } catch (err) {
        console.error('Lỗi khi lấy thông tin khóa học:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  return { courseName ,course, loading, error };
}
