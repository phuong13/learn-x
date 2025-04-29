import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

export const useCourses = () => {
  const axiosPrivate = useAxiosPrivate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosPrivate.get('/courses/my-courses');
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
