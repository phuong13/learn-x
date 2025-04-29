import { useCallback } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

export const useForum = () => {
  const axiosPrivate = useAxiosPrivate();

  const createForum = async (forumId) => {
    try {
      const response = await axiosPrivate.post('/forums', {
        courseId: forumId,
        title: 'New Forum',
        description: 'Description of the new forum',
      });
    } catch (error) {
    }
  }

  return { createForum };
};
