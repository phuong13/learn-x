import { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

export const useTopic = () => {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTopic = async ({ content, forumId }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosPrivate.post('/topics', {
        content,
        forumId,
      });
    } catch (err) {
      console.error('Lỗi khi tạo topic:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };


  const getTopics = async (forumId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosPrivate.get(`/forums/forum/${forumId}/topics`);
      return response.data; 
    } catch (err) {
      console.error('Lỗi khi lấy danh sách topic:', err);
      setError(err);
      return null; 
    } finally {
      setLoading(false);
    }
  };
  

  return { createTopic,getTopics };
};
