
import QuizLayout from '../layout/QuizLayout';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { axiosPrivate } from '@/axios/axios.js';
import DocumentTitle from '@components/DocumentTitle.jsx';
const Quiz = () => {
    const { courseId } = useParams();
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [course, setCourse] = useState(null);
    // const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosPrivate.get(`courses/${courseId}`);
            if (response.status === 200) {
                setCourse(response.data.data);
                console.log(response.data.data);
            }
        };
        fetchData();
    }, [courseId]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosPrivate
                .get(`/quizzes/${quizId}`, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then((res) => {
                    return res.data.data;
                })
                .catch((err) => {
                    console.log(err);
                });
            setQuiz(response);
        };
        fetchData();
    }, [quizId]);

    return (
        <>
            <DocumentTitle title="Nộp bài" />
            <div className="flex flex-col min-h-[calc(100vh-193px)]">
                <div className="flex-1 pr-6 pl-6">
                     
                        <QuizLayout
                            title={quiz?.title}
                            content={quiz?.content}
                            startDate={quiz?.startDate}
                            endDate={quiz?.endDate}
                        />
                    
                </div>

            </div>
        </>
    );
};

export default Quiz;
