import { useState, useCallback } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

export const useForum = () => {
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);

  const createForum = async (forumId) => {
    setLoading(true);
    try {
      const response = await axiosPrivate.post('/forums', {
        courseId: forumId,
        title: 'New Forum',
        description: 'Description of the new forum',
      });
      // return response.data nếu cần
    } catch (error) {
      // handle error nếu cần
    } finally {
      setLoading(false);
    }
  };

  return { createForum, loading };
};