
import SubmissionLayout from '../layout/SubmissionLayout';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { axiosPrivate } from '@/axios/axios.js';
import DocumentTitle from '@components/DocumentTitle.jsx';
const Submission = () => {
    const { courseId } = useParams();
    const { assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);
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
                .get(`/assignments/${assignmentId}`, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then((res) => {
                    return res.data.data;
                })
                .catch((err) => {
                    console.log(err);
                });
            setAssignment(response);
        };
        fetchData();
    }, [assignmentId]);

    return (
        <>
            <DocumentTitle title="Nộp bài" />
            <div className="flex flex-col min-h-[calc(100vh-193px)]">
                <div className="flex-1 pr-6 pl-6">
                    {assignment && (
                        <SubmissionLayout
                            title={assignment.title}
                            content={assignment.content}
                            startDate={assignment.startDate}
                            endDate={assignment.endDate}
                        />
                    )}
                </div>

            </div>
        </>
    );
};

export default Submission;
