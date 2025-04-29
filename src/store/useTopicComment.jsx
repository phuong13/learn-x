import { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

export const useTopicComment = () => {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTopicComment = async ({ content, topicId }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosPrivate.post('/topiccomments', {
        content,
        topicId,
      });
    } catch (err) {
      console.error('Lỗi khi tạo topic:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };


  const getTopicComment = async (topicId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosPrivate.get(`/topics/comments/${topicId}`);
      return response.data; 
    } catch (err) {
      console.error('Lỗi khi lấy danh sách topic:', err);
      setError(err);
      return null; 
    } finally {
      setLoading(false);
    }
  };
  

  return { createTopicComment,getTopicComment };
};
