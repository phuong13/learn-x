import Header from '@layout/Header'
import Footer from '@layout/Footer.jsx'
import Navbar from '@layout/NavBar.jsx'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { axiosPrivate } from '@/axios/axios.js';
import DocumentTitle from '@components/DocumentTitle.jsx';
import GradingInterface from '../components/GradeForStudent';
import Loader from '@components/Loader'; // Nếu bạn đã có component Loader

const Grading = () => {
    const { courseId } = useParams();
    const { assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
                const response = await axiosPrivate.get(`/assignments/${assignmentId}`, {
                    headers: { 'Content-Type': 'application/json' },
                });
                setAssignment(response.data.data);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [assignmentId]);

    return (
        <>
            <DocumentTitle title="Nộp bài" />
            <div className="flex flex-col min-h-[calc(100vh-193px)]">
                {isLoading && <Loader isLoading={isLoading} />}
                {!isLoading && assignment && (
                    <GradingInterface
                        title={assignment.title}
                        startDate={assignment.startDate}
                        endDate={assignment.endDate}
                    />
                )}
            </div>
        </>
    );
};

export default Grading;
