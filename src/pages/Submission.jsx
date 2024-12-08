import Header from '../layout/Header'
import Footer from '@layout/Footer.jsx'
import SideBar from '../layout/Sidebar'
import Navbar from '@layout/NavBar.jsx'
import SubmissionLayout from '../components/SubmissionLayout'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { axiosPrivate } from '@/axios/axios.js';
import DocumentTitle from '@components/DocumentTitle.jsx';
const Submission = () => {
      const { courseId} = useParams();
      const { assignmentId } = useParams();
      const [assignment, setAssignment] = useState(null);
      // const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosPrivate.get(`courses/${courseId}`);
            if (response.status === 200) {
                setCourse(response.data.data);
                console.log(course);
            }   
        };
        fetchData();
    }, [courseId]);
    useEffect( () => {
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
        }
        fetchData();
    }, [assignmentId]);

      return (
        <>
          <DocumentTitle title="Nộp bài" />
          <div className="flex flex-col min-h-screen">
                    <div className="sticky top-0 z-50">
                        <Header />
                        <Navbar />
                    </div>

                    {/* Nội dung chính */}
                    <div className="flex-grow pr-6 pl-6">
                        {/*<SideBar>*/}
                        {/*    {assignment && <SubmissionLayout title={assignment.title} content={assignment.content}*/}
                        {/*                                     startDate={assignment.startDate} endDate={assignment.endDate}/>}*/}
                        {/*</SideBar>*/}
                        {assignment && <SubmissionLayout title={assignment.title} content={assignment.content}
                                                         startDate={assignment.startDate} endDate={assignment.endDate}/>}
                    </div>
                    <div className="sticky">
                        <Footer />
                    </div>
                </div>
        </>
      );
};

export default Submission;
