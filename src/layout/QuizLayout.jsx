import { useEffect, useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Clock, Upload } from 'lucide-react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format } from 'date-fns';
import { vi } from 'date-fns/locale';
import PropTypes from 'prop-types';
import { axiosPrivate } from '@/axios/axios.js';
import { Link, useParams } from 'react-router-dom';

import Loader from '@components/Loader.jsx';
import { toast } from 'react-toastify';
import GradingSummary from '../components/GradingSummary';
import { useAuth } from '@hooks/useAuth.js';
import { useCourseById } from '../store/useCourses';
import { useQuizById } from '../store/useQuiz.jsx';

export default function QuizLayout({ title, content, startDate, endDate }) {
    const [isFolderVisible, setIsFolderVisible] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(true);
    const { quizId } = useParams();
    const { quiz, quizTitle, loading } = useQuizById(quizId);
    console.log("🚀 ~ QuizLayout ~ quiz:", quiz)
    const { courseId } = useParams();
    const { courseName } = useCourseById(courseId);
    const { authUser } = useAuth();

    const formatDateArray = (dateArray) => {
        if (Array.isArray(dateArray) && dateArray.length >= 6) {
            const [year, month, day, hour, minute, second] = dateArray;
            return new Date(year, month - 1, day, hour, minute, second);
        }
        return null;
    };
    const formattedStartDate =
        startDate && !isNaN(new Date(startDate))
            ? format(new Date(startDate), 'EEEE, dd \'tháng\' MM yyyy, hh:mm a', { locale: vi })
            : 'Invalid date';
    const formattedEndDate =
        endDate && !isNaN(new Date(endDate))
            ? format(new Date(endDate), 'EEEE, dd \'tháng\' MM yyyy, hh:mm a', { locale: vi })
            : 'Invalid date';


    const toggleFolderVisibility = () => {
        setIsFolderVisible(!isFolderVisible);
    };

    const calculateSubmissionTime = (submissionTime) => {
        const date = new Date(endDate);
        const submissionDate = new Date(submissionTime);

        const diffInMs = submissionDate - date;
        const absDiffInMs = Math.abs(diffInMs);

        const diffInDays = Math.floor(absDiffInMs / (1000 * 60 * 60 * 24));
        const diffInHours = Math.floor((absDiffInMs / (1000 * 60 * 60)) % 24);
        const diffInMinutes = Math.floor((absDiffInMs / (1000 * 60)) % 60);
        const diffInSeconds = Math.floor((absDiffInMs / 1000) % 60);

        if (submissionDate < date) {
            return (
                <td className="py-3 text-blue-500">
                    Nộp sớm {diffInDays > 0 ? `${diffInDays} ngày ` : ''}
                    {diffInHours} giờ {diffInMinutes} phút {diffInSeconds} giây
                </td>
            );
        } else {
            return (
                <td className="py-3 text-rose-600">
                    Nộp trễ {diffInDays > 0 ? `${diffInDays} ngày ` : ''}
                    {diffInHours} giờ {diffInMinutes} phút {diffInSeconds} giây
                </td>
            );
        }
    };

    const calculateRemainingTime = (endDate) => {
        const now = new Date();
        const end = new Date(endDate);

        if (isNaN(end.getTime())) return 'Ngày hết hạn không hợp lệ';

        const diff = end.getTime() - now.getTime();

        if (diff <= 0) return 'Đã hết hạn';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            return `Còn lại ${days} ngày ${hours} giờ`;
        } else if (hours > 0) {
            return `Còn lại ${hours} giờ ${minutes} phút`;
        } else {
            return `Còn lại ${minutes} phút`;
        }
    };

    const toggleStatusDropdown = () => {
        setIsStatusDropdownOpen(!isStatusDropdownOpen);
    };



    return (
        <div className="">
            <Loader isLoading={loading} />
            {/* Header Banner */}
            <div className="relative h-48 bg-emerald-200 overflow-hidden">
                <img
                    src="/src/assets/backround.jpg"
                    alt="Online learning illustration"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30" />
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="flex items-center">
                        <div className="bg-primaryDark text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
                            <nav aria-label="breadcrumb">
                                <ol className="flex items-center space-x-2">
                                    <i className="fa-solid fa-file-arrow-up text-white text-xl mr-2"></i>
                                    <li>
                                        <a href="/" className="text-white hover:underline">
                                            Trang chủ
                                        </a>
                                    </li>
                                    <li>
                                        <span className="mx-2 text-gray-300">/</span>
                                    </li>
                                    <li>
                                        <a href="/my-course" className="text-white hover:underline">
                                            Khóa học
                                        </a>
                                    </li>

                                    <li>
                                        <span className="mx-2 text-gray-300">/</span>
                                    </li>
                                    <Link to={`/course-detail/${courseId}`} className="text-white hover:underline">
                                        {courseName || 'Đang tải...'}
                                    </Link>

                                    <li>
                                        <span className="mx-2 text-gray-300">/</span>
                                    </li>
                                    <li className="text-gray-200">{title || 'Đang tải...'}</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-4 relative">
                <div className="bg-white shadow-lg overflow-hidden rounded-lg">
                    {/* Quiz Details */}
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold mb-2 text-gray-800">Thời gian</h2>
                        <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-600">
                            <p className="mb-2 sm:mb-0">
                                <Calendar className="inline mr-2" size={16} /> Opened: {formattedStartDate}
                            </p>
                            <p>
                                <Calendar className="inline mr-2" size={16} /> Due: {formattedEndDate}
                            </p>
                        </div>
                    </div>

                    {/* Submission Instructions */}
                    <div className="p-4 border-b border-slate-700">
                        <div className="text-lg font-semibold text-slate-700">Quiz: {quizTitle}</div>
                        <div className="text-sm font-medium mb-2 text-slate-700">{quiz?.description}</div>


                        {authUser.role === 'TEACHER' ? (
                            <button
                                className="py-2 px-4  bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors">
                                <Link to={`/quiz-submission/${courseId}/${quizId}`} className="text-white">
                                    Xem điểm các sinh viên
                                </Link>
                            </button>
                        ) : (
                            <button
                                className="py-2 px-4  bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors">
                                <Link to={`/quiz-submission/${courseId}/${quizId}`} className="text-white">
                                    Bắt đầu làm bài Quiz
                                </Link>
                            </button>
                        )}


                    </div>

                    {/* Submission Status with Dropdown */}
                    {authUser.role === 'STUDENT' && (
                        <div className="p-6">
                            <div
                                className="flex justify-between items-center mb-2 cursor-pointer"
                                onClick={toggleStatusDropdown}>
                                <h3 className="text-lg font-semibold text-slate-700">Trạng thái Quiz</h3>
                                {isStatusDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>

                            {isStatusDropdownOpen && (
                                <table className="w-full">
                                    <tbody>
                                        <tr className="border-b border-slate-300">
                                            <td className="py-3 font-medium text-gray-700">Số lần làm cho phép</td>
                                            <td className="py-3 text-gray-600">
                                                {quiz && quiz.attemptAllowed ? quiz.attemptAllowed : '1'} 
                                            </td>
                                        </tr>

                                         <tr className="border-b border-slate-300">
                                            <td className="py-3 font-medium text-gray-700">Số lần đã thực hiện</td>
                                            <td className="py-3 text-gray-600">
                                                Chưa có 
                                            </td>
                                        </tr>

                                       
                                        <tr className="border-b border-slate-300">
                                            <td className="py-3 font-medium text-gray-700">Điểm lần thứ </td>
                                            <td className="py-3 text-gray-600">
                                                Điểm từng lần
                                            </td>
                                        </tr>
                                        <tr className="border-b border-slate-300">
                                            <td className="py-3 font-medium text-gray-700">Thời gian còn lại</td>
                                            <td className="py-3 text-gray-600 flex items-center">
                                                <Clock className="mr-2" size={16} />
                                                {calculateRemainingTime(endDate)}
                                            </td>
                                        </tr>
                                       
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    <div className="">
                        {authUser.role === 'TEACHER' && (
                            <GradingSummary timeRemaining={calculateRemainingTime(endDate)} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

