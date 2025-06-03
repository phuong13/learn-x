import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { vi } from 'date-fns/locale';
import { axiosPrivate } from '@/axios/axios.js';
import { Calendar, ChevronLeft, ChevronRight, Clock, HelpCircle, User } from 'lucide-react';
import { toast } from 'react-toastify';
import DocumentTitle from '../components/DocumentTitle';
import { IconButton, Select, MenuItem, FormControl, InputLabel, Typography, TextField, Chip } from '@mui/material';
import { parseISO, format } from 'date-fns';
import { CircularProgress, Box } from '@mui/material';

export default function GradingInterface({ title, startDate, endDate }) {
    const [summaryData, setSummaryData] = useState([]);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [course, setCourse] = useState(null);
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
    const [document, setDocument] = useState(null);
    const { assignmentId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isGrading, setIsGrading] = useState(false);

    const { courseId } = useParams();

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
    const formattedStartDate = format(new Date(startDate), 'EEEE, dd \'tháng\' MM yyyy, hh:mm a', { locale: vi });
    const formattedEndDate = format(new Date(endDate), 'EEEE, dd \'tháng\' MM yyyy, hh:mm a', { locale: vi });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axiosPrivate.get(`courses/${courseId}`);
                if (response.status === 200) {
                    setCourse(response.data.data);
                }
            } catch (err) {
            } finally {
                setIsLoading(false);
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
            setIsGrading(true);
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
            }).finally(() => {
                setIsGrading(false);
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Bắt đầu loading
            try {
                const res = await axiosPrivate.get(`/assignment-submissions/assignment/${assignmentId}`);
                setSummaryData(res.data.data);
                setCurrentStudent(res.data.data[currentStudentIndex]);
                setDocument([{
                    uri: `http://localhost:8000/proxy?url=${res.data.data[currentStudentIndex].fileSubmissionUrl}`,
                }]);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false); // Kết thúc loading
            }
        };
        fetchData();
    }, [assignmentId]);

    useEffect(() => {
        setCurrentStudent(summaryData[currentStudentIndex]);
    }, [currentStudentIndex]);


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
            <DocumentTitle title="Chấm điểm bài nộp" />

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                    <CircularProgress />
                </Box>
            ) : summaryData.length === 0 ? (
                <div className="text-slate-600 font-bold text-center flex justify-center items-center">
                    Chưa có học sinh nào nộp bài
                </div>
            ) : (
                <>
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

                            <div className='text-xl font-bold text-slate-700 pl-24'>
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
                                                    summaryData.findIndex(student => student.studentEmail === e.target.value)
                                                )
                                            }
                                            sx={{ minWidth: 180 }}
                                        >
                                            {summaryData.map((student, index) => (
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
                                    {currentStudentIndex + 1} of {summaryData.length}
                                </Typography>
                            </div>
                        </div>
                    )}


                    {currentStudent ? (
                        <div className='border border-slate-200 bg-slate-50 text-slate-700 rounded-lg mx-64'>

                            {currentStudent && (
                                <div className="p-4 flex">
                                    <div className="flex items-center gap-3">
                                        <User className="w-6 h-6 text-slate-800" />
                                        <div>
                                            <h2 className="text-xl font-semibold text-slate-700">{currentStudent.studentName}</h2>
                                            <div className="text-sm text-slate-700">{currentStudent.studentEmail}</div>
                                        </div>
                                    </div>

                                    {currentStudent.score !== null ? (
                                        <Chip
                                            label={`Điểm: ${currentStudent.score}`}
                                            color="success"
                                            variant="filled"
                                            className="ml-auto text-lg "
                                            sx={{
                                                fontSize: '1.1rem',
                                                px: 2,
                                                py: 1,
                                                bgcolor: '#8CD77A',
                                                color: 'white',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    ) : (
                                        <Chip
                                            label="Chưa chấm điểm"
                                            color="error"
                                            variant="filled"
                                            className="ml-auto text-lg "
                                            sx={{
                                                fontSize: '1.1rem',
                                                px: 2,
                                                py: 2,
                                                bgcolor: '#E44640',
                                                color: 'white',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                            <div className="px-4">
                                <div className="">
                                    <Calendar className="inline mb-1 mr-2" size={16} />Hạn chót: {formattedEndDate}
                                    <div className="flex items-center gap-2">
                                        <Clock className="" size={16} />
                                        <div className="py-2 text-slate-700">Thời gian còn lại:</div>
                                        <div className=" flex items-center">
                                            {calculateRemainingTime(endDate)}
                                        </div>
                                    </div>
                                </div>

                                <div className="">
                                    <Calendar className="inline mb-1 mr-2" size={16} />Thời gian nộp:{calculateSubmissionTime(currentStudent.createdAt)}

                                </div>
                            </div>
                            {/* Student Info */}


                            {/* Submission Status */}
                            {currentStudent && (
                                <div className=" shadow rounded-lg p-4">
                                    <h2 className="text-xl font-semibold mb-1">Bài nộp</h2>
                                    <div className="space-y-4">
                                        {currentStudent.fileSubmissionUrl && (
                                            <div className="flex items-center gap-2">
                                                <div>File đã nộp:</div>
                                                <a href={`http://docs.google.com/gview?url=${currentStudent.fileSubmissionUrl}&embedded=true`}
                                                    target="_blank" rel="noopener noreferrer"
                                                    className="hover:underline text-blue-500">
                                                    {decodeURIComponent(currentStudent.fileSubmissionUrl.split('/').pop())}

                                                </a>
                                            </div>
                                        )}
                                        {currentStudent.textSubmission && (
                                            <div className="text-sm text-slate-600">
                                                {currentStudent.textSubmission}
                                            </div>
                                        )}

                                    </div>
                                </div>
                            )}

                            {/* Grading Section */}
                            {currentStudent && (
                                <div className=" shadow rounded-lg px-4 mb-4">
                                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
                                        Nhận xét
                                        <HelpCircle className="w-4 h-4 text-slate-400" />
                                    </h2>
                                    <TextField
                                        label="Nhận xét cho học sinh"
                                        multiline
                                        minRows={3}
                                        fullWidth
                                        variant="outlined"
                                        className="mb-4"
                                    // value={comment} // Nếu bạn có state cho nhận xét
                                    // onChange={e => setComment(e.target.value)}
                                    />
                                    <h2 className="text-xl font-semibold  pt-4 flex items-center gap-2">
                                        Chấm điểm
                                        <HelpCircle className="w-4 h-4 text-slate-400" />
                                    </h2>
                                    <div className="space-y-2">
                                        <label htmlFor="grade" className="block text-sm font-medium text-slate-700">Thang điểm
                                            10</label>
                                        <TextField
                                            type="number"
                                            id="grade"
                                            inputProps={{ max: 10, min: 0 }}
                                            value={currentStudent.score ?? ''}
                                            fullWidth
                                            size="small"
                                            className="mt-1"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Chỉ nhận giá trị từ 1 đến 10 hoặc rỗng
                                                if (value === '' || (Number(value) >= 1 && Number(value) <= 10)) {
                                                    const newScore = value ? parseFloat(value) : null;
                                                    const updatedSummaryData = [...summaryData];
                                                    updatedSummaryData[currentStudentIndex].score = newScore;
                                                    setSummaryData(updatedSummaryData);
                                                }
                                            }}
                                        />

                                        <div className="flex justify-end gap-2 ">
                                            <button className="py-2 px-6 bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors">
                                                Hủy
                                            </button>
                                            <button
                                                onClick={handlePostGrade}
                                                className="py-2 px-6 bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors flex items-center gap-2"
                                                disabled={isGrading}
                                            >
                                                {isGrading && <CircularProgress size={20} color="inherit" />}
                                                Chấm điểm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>) : (
                        <div className="text-slate-600 font-bold text-center flex justify-center items-center">Chưa có học sinh nào nộp bài</div>
                    )}
                </>
            )}





        </div>
    );
}
