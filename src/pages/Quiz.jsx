import QuizLayout from '../layout/QuizLayout';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { axiosPrivate } from '@/axios/axios.js';
import DocumentTitle from '@components/DocumentTitle.jsx';
import Loader from '@components/Loader.jsx';

const Quiz = () => {
    const { courseId } = useParams();
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    console.log("🚀 ~ Quiz ~ isLoading:", isLoading)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axiosPrivate.get(`courses/${courseId}`);
                if (response.status === 200) {
                    setCourse(response.data.data);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [courseId]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axiosPrivate
                    .get(`/quizzes/${quizId}`, {
                        headers: { 'Content-Type': 'application/json' },
                    })
                    .then((res) => res.data.data)
                    .catch((err) => {
                        console.log(err);
                    });
                setQuiz(response);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [quizId]);

    return (
        <>
            <DocumentTitle title="Quiz" />
            <div className="flex flex-col min-h-[calc(100vh-193px)]">
                <div className="flex-1 pr-6 pl-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader isLoading />
                        </div>
                    ) : (
                        <QuizLayout
                            title={quiz?.title}
                            courseName={course?.name}
                            startDate={quiz?.startDate}
                            endDate={quiz?.endDate}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default Quiz;