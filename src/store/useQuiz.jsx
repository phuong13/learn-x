import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useAuth } from '@hooks/useAuth.js';



export const useQuizById = (quizId) => {
  const axiosPrivate = useAxiosPrivate();
  const [quiz, setQuiz] = useState(null);
  const [quizTitle, setQuizTitle] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      try {
        const response = await axiosPrivate.get(`/quizzes/${quizId}`);
        setQuiz(response.data.data);
        setQuizTitle(response.data.data.title); 
      } catch (err) {
        console.error('Lỗi khi lấy thông tin khóa học:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  return { quizTitle ,quiz, loading, error };
}

export const useQuestionByQuizId = (quizId) => {
  const axiosPrivate = useAxiosPrivate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!quizId) 
      return;

    const fetchQuestions = async () => {
      try {
        const response = await axiosPrivate.get(`/quizzes/${quizId}/questions`);
        setQuestions(response.data.data);
      } catch (err) {
        console.error('Lỗi khi lấy thông tin khóa học:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId]);

  return { questions, loading, error };
}
