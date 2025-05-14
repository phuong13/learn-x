import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { axiosPrivate } from '@/axios/axios.js';
import { Calendar, ChevronLeft, ChevronRight, Clock, HelpCircle, User } from 'lucide-react';
import { toast } from 'react-toastify';
import DocumentTitle from '../components/DocumentTitle';


export default function GradingInterface({ title, startDate, endDate }) {
    const [summaryData, setSummaryData] = useState([]);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [course, setCourse] = useState(null);
    const [assignmentSubmission, setAssignmentSubmission] = useState(null);
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
    const [document, setDocument] = useState(null);

    const { assignmentId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const { courseId } = useParams();

    const calculateSubmissionTime = (submissionTime) => {
        const date = new Date(endDate);
        const submissionDate = new Date(submissionTime);
        const diffInDays = differenceInDays(date, submissionDate);
        const diffInHours = differenceInHours(date, submissionDate) % 24;
        const diffInMinutes = differenceInMinutes(date, submissionDate) % 60;
        const diffInSeconds = differenceInSeconds(date, submissionDate) % 60;

        if (submissionDate < date) {
            return <div className="py-3 text-blue-500">Nộp
                sớm {diffInDays > 0 ? `${diffInDays} ngày ` : ''} {diffInHours} giờ {diffInMinutes} phút {diffInSeconds} giây</div>;
        } else {
            return <div className="py-3 text-rose-600">Nộp
                trễ {diffInHours} giờ {diffInMinutes} phút {diffInSeconds} giây</div>;
        }
    };

    const formattedStartDate = format(new Date(startDate), 'EEEE, dd \'tháng\' MM yyyy, hh:mm a', { locale: vi });
    const formattedEndDate = format(new Date(endDate), 'EEEE, dd \'tháng\' MM yyyy, hh:mm a', { locale: vi });

    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosPrivate.get(`courses/${courseId}`);
            if (response.status === 200) {
                setCourse(response.data.data);
            }
        };
        fetchData();
    }, [courseId]);

    const handlePostGrade = async () => {
        if (currentStudent.score === null) {
            toast.error('Vui lòng nhập điểm', {
                duration: 1000,
            });
        } else {
            await axiosPrivate.post(`/assignment-submissions/${assignmentId}/${currentStudent.studentId}/score`, {
                score: currentStudent.score,
            }).then((res) => {
                toast.success('Đã cập nhật điểm', {
                    duration: 1000,
                });
                handleNextStudent();
            }).catch((err) => {
                toast.error(err.response.data.message, {
                    duration: 1000,
                });
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await axiosPrivate.get(`/assignment-submissions/assignment/${assignmentId}`)
                .then((res) => {
                    setSummaryData(res.data.data);
                    setCurrentStudent(res.data.data[currentStudentIndex]);
                    setDocument([{
                        uri: `http://localhost:8000/proxy?url=${res.data.data[currentStudentIndex].fileSubmissionUrl}`,
                    }]);
                })
                .catch((err) => {
                    console.log(err);
                });

        };
        fetchData();
    }, [assignmentId]);

    useEffect(() => {
        setCurrentStudent(summaryData[currentStudentIndex]);
    }, [currentStudentIndex]);

    useEffect(() => {
        const fetchAssignment = async () => {
            await axiosPrivate.get(`/assignment-submissions/${assignmentId}/logged-in`)
                .then((res) => {
                    setAssignmentSubmission(res.data.data);
                })
                .catch((err) => {
                    setAssignmentSubmission(null);
                    console.log(err);
                });
        };
        try {
            setIsLoading(true);
            fetchAssignment();
        } finally {
            setIsLoading(false);
        }

        if (assignmentSubmission) {
            console.log(assignmentSubmission);
        }
    }, [assignmentId]);

    const calculateRemainingTime = (endDate) => {
        const now = new Date();
        const end = new Date(endDate);
        const diff = end - now;

        if (diff <= 0) return 'Đã hết hạn';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        return `Còn lại ${days} ngày ${hours} giờ`;
    };

    const handleNextStudent = () => {
        setCurrentStudentIndex((prevIndex) => {
            return prevIndex === summaryData.length - 1 ? 0 : prevIndex + 1;
        });
    };

    const handlePreviousStudent = () => {
        setCurrentStudentIndex((prevIndex) => {
            return prevIndex === 0 ? summaryData.length - 1 : prevIndex - 1;
        });
    };


    return (
        <div className="m-4 p-4 flex-1 rounded-lg bg-white">
            < DocumentTitle title="Chấm điểm bài nộp" />
            {/* Header */}
            {currentStudent && (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div className="bg-primaryDark text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-white">Khoá học:</span>
                                {course && (
                                    <>
                                        <Link
                                            to={`/course-detail/${course?.id}`}
                                            className="text-white hover:underline"
                                        >
                                            {course?.name || 'Đang tải...'}
                                        </Link>
                                        <span>/</span>
                                        <Link
                                            to={`/submission/${course?.id}/${assignmentId}`}
                                            className="text-white hover:underline">
                                            {title}
                                        </Link>
                                    </>
                                )}

                            </div>
                        </div>
                    </div>

                    <div className='text-lg font-semibold text-slate-700'>
                        Chấm điểm
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <button className="p-1" onClick={handlePreviousStudent}><ChevronLeft className="w-4 h-4" />
                            </button>
                            <select className="border rounded px-2 py-1 text-sm" value={currentStudent.studentEmail}
                                onChange={(e) => setCurrentStudentIndex(summaryData.findIndex(student => student.studentEmail === e.target.value))}>
                                {summaryData.map((student, index) => (
                                    <option key={index} value={student.studentEmail}>{student.studentEmail}</option>
                                ))}
                            </select>
                            <button className="p-1" onClick={handleNextStudent}><ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-sm text-gray-600">{currentStudentIndex + 1} of {summaryData.length}</div>
                    </div>
                </div>
            )}


            {currentStudent ? (
                <div className='border border-slate-400 bg-slate-100 rounded-lg mx-64'>
                    <div className="p-4">
                        <div className="mt-4">
                            <Calendar className="inline mb-1 mr-2" size={16} />Hạn chót: {formattedEndDate}
                            <div className="flex items-center gap-2">
                                <Clock className="" size={16} />
                                <div className="py-2 text-gray-700">Thời gian còn lại:</div>
                                <div className=" flex items-center">
                                    {calculateRemainingTime(endDate)}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Student Info */}
                    {currentStudent && (
                        <div className=" shadow rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <User className="w-6 h-6 text-gray-400" />
                                <div>
                                    <h2 className="text-xl font-semibold">{currentStudent.studentName}</h2>
                                    <div className="text-sm text-gray-600">{currentStudent.studentEmail}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submission Status */}
                    {currentStudent && (
                        <div className=" shadow rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-2">Bài nộp</h2>
                            <div className="space-y-4">
                                {currentStudent.fileSubmissionUrl && (
                                    <div className="flex items-center gap-2">
                                        <div>File đã nộp:</div>
                                        <a href={`http://docs.google.com/gview?url=${currentStudent.fileSubmissionUrl}&embedded=true`}
                                            target="_blank" rel="noopener noreferrer"
                                            className="hover:underline text-blue-500">
                                            {currentStudent.fileSubmissionUrl.split('/').pop()}
                                        </a>
                                    </div>
                                )}
                                {currentStudent.textSubmission && (
                                    <div className="text-sm text-gray-600">
                                        {currentStudent.textSubmission}
                                    </div>
                                )}

                            </div>
                        </div>
                    )}

                    {/* Grading Section */}
                    {currentStudent && (
                        <div className=" shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                Chấm điểm
                                <HelpCircle className="w-4 h-4 text-gray-400" />
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Thang điểm
                                        10</label>
                                    <input
                                        type="number"
                                        id="grade"
                                        max="10"
                                        value={currentStudent.score || ''}
                                        className="p-2 mt-1 block w-full rounded-md border focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        onChange={(e) => {
                                            const newScore = e.target.value ? parseFloat(e.target.value) : null;
                                            const updatedSummaryData = [...summaryData];
                                            updatedSummaryData[currentStudentIndex].score = newScore;
                                            setSummaryData(updatedSummaryData);
                                        }}
                                    />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button className="py-2 px-6 bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors">
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handlePostGrade}
                                        className="py-2 px-6 bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors">
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>) : (

                <div className="text-slate-600 font-bold text-center flex justify-center items-center">Chưa có học sinh nào nộp bài</div>
            )}




        </div>
    );
}
