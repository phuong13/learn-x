import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { vi } from 'date-fns/locale';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Calendar, ChevronLeft, ChevronRight, Clock, HelpCircle, User } from 'lucide-react';
import { toast } from 'react-toastify';
import DocumentTitle from '../components/DocumentTitle';
import { IconButton, Select, MenuItem, FormControl, InputLabel, Typography, TextField, Chip } from '@mui/material';
import { parseISO, format } from 'date-fns';
import { CircularProgress, Box } from '@mui/material';
import { getAssignment, submitGrade } from '../store/useGrading';
import { useCourseById } from '../store/useCourses';

export default function GradingInterface({ title, startDate, endDate }) {
    const [currentStudent, setCurrentStudent] = useState(null);
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
    const { assignmentId } = useParams();
    const [score, setScore] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { courseId } = useParams();
    const { course } = useCourseById(courseId);
    const { assignment, loading } = getAssignment(assignmentId);
    const axiosPrivate = useAxiosPrivate();



    const calculateSubmissionTime = (submissionTime) => {
        const deadline = new Date(endDate); // endDate là hạn chót
        const submissionDate = parseISO(submissionTime); // parse chuỗi ISO
        const diffInMs = deadline - submissionDate;
        const absDiff = Math.abs(diffInMs);

        const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

        if (submissionDate < deadline) {
            return (
                <div className="py-1 text-blue-500">
                    Nộp sớm {days > 0 ? `${days} ngày ` : ''}{hours} giờ {minutes} phút {seconds} giây
                </div>
            );
        } else {
            return (
                <div className="py-1 text-rose-600">
                    Nộp trễ {days > 0 ? `${days} ngày ` : ''}{hours} giờ {minutes} phút {seconds} giây
                </div>
            );
        }
    };
    const formattedEndDate = format(new Date(endDate), 'EEEE, dd \'tháng\' MM yyyy, hh:mm a', { locale: vi });



    useEffect(() => {
        if (assignment && assignment.length > 0) {
            const student = assignment[currentStudentIndex];
            setCurrentStudent(student);
            setScore(student.score ?? '');
        }
    }, [currentStudentIndex, assignment]);


    const handlePostGrade = async () => {
        if (!currentStudent || !assignmentId) return;

        if (score === '' || score < 0 || score > 10) {
            toast.error('Vui lòng nhập điểm hợp lệ (0-10)');
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await submitGrade(
                axiosPrivate,
                assignmentId,
                currentStudent.studentId,
                parseFloat(score),
                feedback
            );

            if (result.error) {
                toast.error('Có lỗi xảy ra khi chấm điểm');
            } else {
                // Cập nhật assignment trong state
                const updatedStudent = {
                    ...currentStudent,
                    score: parseFloat(score),
                };
                setCurrentStudent(updatedStudent);

                toast.success('Chấm điểm thành công!');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi chấm điểm');
        } finally {
            setIsSubmitting(false);
        }
    };







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
            return prevIndex === assignment.length - 1 ? 0 : prevIndex + 1;
        });
    };

    const handlePreviousStudent = () => {
        setCurrentStudentIndex((prevIndex) => {
            return prevIndex === 0 ? assignment.length - 1 : prevIndex - 1;
        });
    };


    return (
        <div className="m-4 p-4 flex-1 rounded-lg bg-white h-full">
            <DocumentTitle title="Chấm điểm bài nộp" />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                    <CircularProgress />
                </Box>
            ) : assignment?.length === 0 ? (
                <div className="text-slate-600 font-bold text-center flex justify-center items-center">
                    Chưa có học sinh nào nộp bài
                </div>
            ) : (
                <div className='h-full'>
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

                            <div className='text-xl font-bold text-slate-700'>
                                Chấm điểm
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <IconButton size="small" onClick={handlePreviousStudent}>
                                        <ChevronLeft className="w-4 h-4" />
                                    </IconButton>
                                    <FormControl size="small" variant="outlined">
                                        <InputLabel id="student-select-label">Email</InputLabel>
                                        <Select
                                            labelId="student-select-label"
                                            label="Email"
                                            value={currentStudent.studentEmail}
                                            onChange={(e) =>
                                                setCurrentStudentIndex(
                                                    assignment?.findIndex(student => student.studentEmail === e.target.value)
                                                )
                                            }
                                            sx={{ minWidth: 180 }}
                                        >
                                            {assignment?.map((student, index) => (
                                                <MenuItem key={index} value={student.studentEmail}>
                                                    {student.studentEmail}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <IconButton size="small" onClick={handleNextStudent}>
                                        <ChevronRight className="w-4 h-4" />
                                    </IconButton>
                                </div>
                                <Typography variant="body2" color="text.secondary">
                                    {currentStudentIndex + 1} of {assignment?.length}
                                </Typography>
                            </div>
                        </div>
                    )}

                    {/* Grid Layout */}
                    {currentStudent ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Student Info & Submission */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Student Card */}
                                <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
                                    <div className="p-6 border-b border-slate-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <User className="w-8 h-8 text-slate-600" />
                                                <div>
                                                    <h2 className="text-xl font-semibold text-slate-800">{currentStudent.studentName}</h2>
                                                    <div className="text-sm text-slate-600">{currentStudent.studentEmail}</div>
                                                </div>
                                            </div>
                                            {currentStudent.score !== null ? (
                                                <Chip
                                                    label={`Điểm: ${currentStudent.score}/10`}
                                                    color="success"
                                                    variant="filled"
                                                    sx={{
                                                        fontSize: '1rem',
                                                        fontWeight: 'bold',
                                                        px: 2,
                                                        py: 1,
                                                        bgcolor: '#10b981',
                                                        color: 'white',
                                                    }}
                                                />
                                            ) : (
                                                <Chip
                                                    label="Chưa chấm điểm"
                                                    color="error"
                                                    variant="filled"
                                                    sx={{
                                                        fontSize: '1rem',
                                                        fontWeight: 'bold',
                                                        px: 2,
                                                        py: 1,
                                                        bgcolor: '#ef4444',
                                                        color: 'white',
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Submission Info */}
                                    <div className="p-6 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-500" />
                                                <span className="font-medium">Hạn chót:</span>
                                                <span className="text-slate-600">{formattedEndDate}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-slate-500" />
                                                <span className="font-medium">Trạng thái:</span>
                                                <span className="text-slate-600">{calculateRemainingTime(endDate)}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-slate-500" />
                                            <span className="font-medium">Thời gian nộp:</span>
                                            {calculateSubmissionTime(currentStudent.createdAt)}
                                        </div>
                                    </div>
                                </div>

                                {/* Submission Content */}
                                <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Bài nộp</h3>
                                        <div className="space-y-4">
                                            {(
                                                <div className="p-4 bg-slate-50 rounded-lg">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="font-medium text-slate-700">File đã nộp:</span>
                                                        {
                                                            currentStudent?.fileSubmissionUrl ? (
                                                                <a
                                                                    href={`http://docs.google.com/gview?url=${currentStudent.fileSubmissionUrl}&embedded=true`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                                                >
                                                                    {decodeURIComponent(currentStudent.fileSubmissionUrl.split('/').pop())}
                                                                </a>) :
                                                                <span className="text-slate-400">Chưa nộp</span>

                                                        }
                                                    </div>
                                                </div>
                                            )}
                                            {(
                                                <div className="p-4 bg-slate-50 rounded-lg text-sm">
                                                    <h4 className="font-medium text-slate-700 mb-2 text-sm">Nội dung văn bản:</h4>
                                                    {
                                                        currentStudent.textSubmission ? (
                                                            <div className="whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: currentStudent.textSubmission }}></div>

                                                        ) : (
                                                            <span className="text-slate-400">Chưa nộp</span>
                                                        )
                                                    }
                                                </div>

                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Grading */}
                            <div className="space-y-6">
                                {/* Feedback Section */}
                                <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                            Nhận xét
                                            <HelpCircle className="w-4 h-4 text-slate-400" />
                                        </h3>
                                        <TextField
                                            multiline
                                            placeholder="Nhập nhận xét cho học sinh..."
                                            minRows={4}
                                            fullWidth
                                            variant="outlined"
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: '#f8fafc',
                                                },

                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Grading Section */}
                                <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                            Chấm điểm
                                            <HelpCircle className="w-4 h-4 text-slate-400" />
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="grade" className="block text-sm font-medium text-slate-700 mb-2">
                                                    Thang điểm 10
                                                </label>
                                                <TextField
                                                    type="number"
                                                    id="grade"
                                                    inputProps={{ max: 10, min: 0, step: 0.1 }}
                                                    value={score}
                                                    fullWidth
                                                    size="medium"
                                                    placeholder="Nhập điểm (0-10)"
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (value === '' || (Number(value) >= 0 && Number(value) <= 10)) {
                                                            setScore(value);
                                                        }
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            backgroundColor: '#f8fafc',
                                                        }
                                                    }}
                                                />
                                            </div>

                                            <div className="flex gap-3 pt-2">
                                                <button
                                                    onClick={() => {
                                                        setScore(currentStudent.score ?? '');
                                                        setFeedback(currentStudent.feedback ?? '');
                                                    }}
                                                    className="flex-1 py-2 px-3 bg-slate-300 text-white rounded-lg hover:bg-slate-400 transition-colors font-medium"
                                                >
                                                    Hủy
                                                </button>
                                                <button
                                                    onClick={handlePostGrade}
                                                    className="flex-1 py-2 px-3  bg-gradient-to-br from-[#5BCEC9] to-[#14919B]
                                                           shadow-md hover:shadow-lg text-white rounded-lg hover:bg-secondary transition-colors font-medium flex items-center justify-center gap-2"
                                                    disabled={isSubmitting || score === ''}
                                                >
                                                    {isSubmitting && <CircularProgress size={20} color="inherit" />}
                                                    Chấm điểm
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-slate-600 font-bold text-center flex justify-center items-center">
                            Chưa có học sinh nào nộp bài
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
