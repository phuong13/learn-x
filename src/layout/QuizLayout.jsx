import { useEffect, useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Clock, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Link, useParams } from 'react-router-dom';
import Loader from '@components/Loader.jsx';
import { useAuth } from '@hooks/useAuth.js';
import { useCourseById } from '../store/useCourses';
import { t } from 'i18next';
import { useQuizById, getQuizSubmissionByQuizId, getStudentSubmissionsByQuizId } from '../store/useQuiz.jsx';
import Backround from '../assets/backround.jpg';

export default function QuizLayout({ title, content, startDate, endDate }) {
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(true);
    const { quizId } = useParams();
    const { quiz, quizTitle, loading } = useQuizById(quizId);
    const { submission } = getQuizSubmissionByQuizId(quizId);
    const { studentsubmit } = getStudentSubmissionsByQuizId(quizId);
    const { courseId } = useParams();
    const { courseName } = useCourseById(courseId);
    const { authUser } = useAuth();

    const formattedStartDate =
        startDate && !isNaN(new Date(startDate))
            ? format(new Date(startDate), 'EEEE, dd \'tháng\' MM yyyy, hh:mm a', { locale: vi })
            : 'Invalid date';
    const formattedEndDate =
        endDate && !isNaN(new Date(endDate))
            ? format(new Date(endDate), 'EEEE, dd \'tháng\' MM yyyy, hh:mm a', { locale: vi })
            : 'Invalid date';


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
                    src={Backround}
                    alt="Online learning illustration"
                    className="w-full h-fit object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30" />
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="flex items-center">
                        <div className="bg-primaryDark text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
                            <nav aria-label="breadcrumb">
                                <ol className="flex items-center space-x-2">
                                    <i className="fa-solid fa-file-arrow-up text-white text-xl mr-2"></i>
                                    <li>
                                        <Link to="/" className="text-white hover:underline">
                                            {t('home_page')}
                                        </Link>
                                    </li>
                                    <li>
                                        <span className="mx-2 text-slate-300">/</span>
                                    </li>
                                    <li>
                                        <Link to="/my-course" className="text-white hover:underline">
                                            {t('my_courses')}
                                        </Link>
                                    </li>

                                    <li>
                                        <span className="mx-2 text-slate-300">/</span>
                                    </li>
                                    <Link to={`/course-detail/${courseId}`} className="text-white hover:underline">
                                        {courseName || 'Đang tải...'}
                                    </Link>

                                    <li>
                                        <span className="mx-2 text-slate-300">/</span>
                                    </li>
                                    <li className="text-slate-200">{title || 'Đang tải...'}</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="my-4">
                <div className="bg-white shadow-lg overflow-hidden rounded-lg">
                    {/* Quiz Details */}
                    <div className="p-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold mb-2 text-slate-700">Thời gian</h2>
                        <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-slate-600">
                            <p className="mb-2 sm:mb-0">
                                <Calendar className="inline mr-1" size={16} /> {t('opened')}: {formattedStartDate}
                            </p> 
                            <p>
                                <Calendar className="inline mr-1" size={16} /> {t('due')}: {formattedEndDate}
                            </p>
                        </div>
                    </div>

                    {/* Submission Instructions */}
                    <div className="flex flex-col gap-2 p-4 border-b border-slate-700">
                        <div className="text-lg font-semibold text-slate-700">Quiz: {quizTitle}</div>
                        <div className="text-base font-medium mb-2 text-slate-700">{quiz?.description}</div>


                        {authUser.role === 'TEACHER' ? (
                            <button
                                className="mx-auto py-2 px-4  bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors">
                                Xem điểm các sinh viên

                            </button>
                        ) : (
                            (() => {
                                const now = new Date();
                                const start = new Date(startDate);
                                const end = new Date(endDate);

                                if (now < start) {
                                    return <p className="text-center text-rose-500 font-semibold">Chưa đến giờ làm bài.</p>;
                                }
                                if (now > end) {
                                    return <p className="text-center text-rose-500 font-semibold">Đã hết thời gian làm bài.</p>;
                                }

                                if (submission?.length >= (quiz?.attemptAllowed || 1)) {
                                    return <p className="text-center text-rose-500 font-semibold">Bạn đã làm đủ số lần cho phép.</p>;
                                }
                                return (
                                    <button
                                        className="mx-auto py-2 px-4 bg-primaryDark text-white rounded-lg hover:bg-secondary transition-colors">
                                        <Link to={`/quiz-submission/${courseId}/${quizId}`} className="text-white">
                                            Bắt đầu làm bài Quiz
                                        </Link>
                                    </button>
                                );
                            })()
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
                                            <td className="py-3 font-medium text-slate-700">Số lần làm cho phép</td>
                                            <td className="py-3 text-slate-600">
                                                {quiz && quiz.attemptAllowed ? quiz.attemptAllowed : '1'}
                                            </td>
                                        </tr>

                                        <tr className="border-b border-slate-300">
                                            <td className="py-3 font-medium text-slate-700">Số lần đã thực hiện</td>
                                            <td className="py-3 text-slate-600">
                                                {submission?.length}
                                            </td>
                                        </tr>


                                        <tr className="border-b border-slate-300">
                                            <td className="py-3 font-medium text-slate-700">Điểm từng lần</td>
                                            <td className="py-3 text-slate-600">
                                                {submission && submission.length > 0 ? (
                                                    <div className="flex flex-col gap-1">
                                                        {submission.map((s, idx) => (
                                                            <div key={s.id || idx}>
                                                                Lần thứ {idx + 1}: {typeof s.score === 'number' ? s.score / 10 : ''} đ
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <>Bạn chưa làm</>
                                                )}
                                            </td>
                                        </tr>
                                        <tr className="border-b border-slate-300">
                                            <td className="py-3 font-medium text-slate-700">Thời gian còn lại</td>
                                            <td className="py-3 text-slate-600 flex items-center">
                                                <Clock className="mr-2" size={16} />
                                                {calculateRemainingTime(endDate)}
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* Grading Summary for Teacher */}
                    {authUser.role === 'TEACHER' && (
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
                                            <td className="py-3 font-medium text-slate-700">Số lần làm cho phép</td>
                                            <td className="py-3 text-slate-600">
                                                {quiz && quiz.attemptAllowed ? quiz.attemptAllowed : '1'}
                                            </td>
                                        </tr>

                                        <tr className="border-b border-slate-300">
                                            <td className="py-3 font-medium text-slate-700">Số học sinh đã thực hiện</td>
                                            <td className="py-3 text-slate-600">
                                                {studentsubmit?.length}
                                            </td>
                                        </tr>


                                        <tr className="border-b border-slate-300">
                                            <td className="py-3 font-medium text-slate-700">Thời gian còn lại</td>
                                            <td className="py-3 text-slate-600 flex items-center">
                                                <Clock className="mr-2" size={16} />
                                                {calculateRemainingTime(endDate)}
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

