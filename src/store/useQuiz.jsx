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

export const getSession =(quizId) => {
    const axiosPrivate = useAxiosPrivate();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!quizId) return;

        const fetchSession = async () => {
            try {
                const response = await axiosPrivate.get(`/quizzes/${quizId}/session`);
                setSession(response.data.data);
            } catch (err) {
                console.error('Lỗi khi lấy thông tin phiên làm bài:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, [quizId]);
    return { session, loading, error };
}

export const useSubmissionQuiz = () => {
  const axiosPrivate = useAxiosPrivate();

  const submit = async (quizId, totalTimeTakenInSeconds, answers) => {
    try {
      const payload = {
        quizId,
        totalTimeTakenInSeconds,
        answers,
      };

      const response = await axiosPrivate.post("/quiz-submissions", payload);
      return response.data;
    } catch (error) {
      console.error(" Lỗi khi nộp bài:", error);
      throw error;
    }
  };

  return submit;
};
