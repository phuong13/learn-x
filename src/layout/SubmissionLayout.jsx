import { useEffect, useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Clock, Upload } from 'lucide-react';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, format } from 'date-fns';
import { vi } from 'date-fns/locale';
import PropTypes from 'prop-types';
import { axiosPrivate } from '@/axios/axios.js';
import { Link, useParams } from 'react-router-dom';
import Backround from '../assets/backround.jpg';
import Loader from '@components/Loader.jsx';
import { toast } from 'react-toastify';
import GradingSummary from '../components/GradingSummary';
import { useAuth } from '@hooks/useAuth.js';
import Chip from '@mui/material/Chip';
import CancelIcon from '@mui/icons-material/Cancel';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
export default function SubmissionLayout({ title, content, startDate, endDate }) {
    const [isFolderVisible, setIsFolderVisible] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(true);
    const [uploadedFile, setUploadedFile] = useState(null); // Trạng thái cho tệp đã tải lên
    console.log("🚀 ~ SubmissionLayout ~ uploadedFile:", uploadedFile)
    const [course, setCourse] = useState(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [textSubmission, setTextSubmission] = useState('');

    const formattedStartDate =
        startDate && !isNaN(new Date(startDate))
            ? format(new Date(startDate), 'EEEE, dd \'tháng\' MM yyyy, hh:mm a', { locale: vi })
            : 'Invalid date';
    const formattedEndDate =
        endDate && !isNaN(new Date(endDate))
            ? format(new Date(endDate), 'EEEE, dd \'tháng\' MM yyyy, hh:mm a', { locale: vi })
            : 'Invalid date';

    const { authUser } = useAuth();

    const toggleFolderVisibility = () => {
        setIsFolderVisible(!isFolderVisible);
    };

    const [isLoading, setIsLoading] = useState(true);

    const [assignmentSubmission, setAssignmentSubmission] = useState(null);

    const { assignmentId } = useParams();

    const { courseId } = useParams();

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

    const formatDateArray = (dateArray) => {
        if (Array.isArray(dateArray) && dateArray.length >= 6) {
            const [year, month, day, hour, minute, second] = dateArray;
            return new Date(year, month - 1, day, hour, minute, second);
        }
        return null;
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            const response = await axiosPrivate.get(`courses/${courseId}`);
            if (response.status === 200) {
                setCourse(response.data.data);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [courseId]);

    useEffect(() => {
        const fetchAssignment = async () => {
            setIsLoading(true);
            try {
                const res = await axiosPrivate.get(`/assignment-submissions/${assignmentId}/logged-in`);

                setAssignmentSubmission(res.data.data);
                setTextSubmission(res.data.data.textSubmission || '');

            } catch {
                setAssignmentSubmission(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAssignment();
    }, [assignmentId]);

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

    const handleFileChange = (event) => {
        setUploadedFile(event.target.files[0]);
    };



    const handleSubmitAssignmentSubmission = async () => {
        try {
            console.log("🚀 ~ handleSubmitAssignmentSubmission ~ assignmentSubmission:", assignmentSubmission)
            if (assignmentSubmission) {
                // Cập nhật bài nộp đã có

                // Tạo FormData riêng biệt
                const formData = new FormData();
                formData.append('textSubmission', textSubmission);

                if (uploadedFile) {
                    // Nếu có file mới, thêm vào FormData
                    formData.append('document', uploadedFile);
                }

                setIsLoading(true);
                const response = await axiosPrivate.patch(`/assignment-submissions/${assignmentId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setIsLoading(false);

                if (response.status === 200) {
                    toast.success('Chỉnh sửa bài thành công');
                    setAssignmentSubmission(response.data.data);
                    setIsFolderVisible(false); // Đóng form sau khi submit thành công
                } else {
                    toast.error(response.data.message || 'Có lỗi xảy ra');
                }
            } else {
                // Tạo bài nộp mới
                const assignmentData = {
                    assignmentId: parseInt(assignmentId),
                    textSubmission: textSubmission,
                };

                // Tạo FormData riêng biệt
                const formData = new FormData();
                formData.append('assignment', new Blob([JSON.stringify(assignmentData)], { type: 'application/json' }));

                // Thêm file nếu có

                formData.append('document', uploadedFile);


                setIsLoading(true);
                const response = await axiosPrivate.post(`/assignment-submissions`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setIsLoading(false);

                if (response.status === 201 || response.status === 200) {
                    toast.success('Nộp bài thành công');
                    setAssignmentSubmission(response.data.data);
                    // setIsFolderVisible(false); // Đóng form sau khi submit thành công
                } else {
                    toast.error(response.data.message || 'Có lỗi xảy ra');
                }
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error submitting assignment:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi nộp bài');
        }
    };

    return (
        <div className="">
            {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <Loader isLoading />
                </div>
            ) : (
                <>
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
                                                    Trang chủ
                                                </Link>
                                            </li>
                                            <li>
                                                <span className="mx-2 text-gray-300">/</span>
                                            </li>
                                            <li>
                                                <Link to="/my-course" className="text-white hover:underline">
                                                    Khóa học
                                                </Link>
                                            </li>

                                            <li>
                                                <span className="mx-2 text-gray-300">/</span>
                                            </li>
                                            <Link to={`/course-detail/${course?.id}`} className="text-white hover:underline">
                                                {course?.name || 'Đang tải...'}
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
                            {/* Assignment Details */}
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold mb-2 text-slate-700">Thời gian</h2>
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
                            <div className="p-4 border-b border-slate-700 flex flex-col ">
                                <h2 className="text-lg font-semibold mb-2 text-slate-700">Hướng dẫn nộp bài</h2>
                                <div className="pb-2" dangerouslySetInnerHTML={{ __html: content }} />

                                {authUser.role === 'TEACHER' ? (
                                    <Link to={`/grading/${courseId}/${assignmentId}`} className="text-white flex justify-center">
                                        <button
                                            className="py-2 px-6   bg-gradient-to-br from-[#5BCEC9] to-[#14919B]
    shadow-md hover:shadow-lg text-white rounded-lg  hover:bg-secondary transition-colors">
                                            Chấm điểm
                                        </button>
                                    </Link>
                                ) : (
                                    <div className="flex justify-center">
                                        <button
                                            onClick={toggleFolderVisibility}
                                            className="py-2 px-6  bg-gradient-to-br from-[#5BCEC9] to-[#14919B]
    shadow-md hover:shadow-lg text-white rounded-lg hover:bg-secondary transition-colors flex items-center w-fit gap-2"
                                        >
                                            <i className="fa-solid fa-folder-plus"></i>
                                            {assignmentSubmission ? 'Sửa bài nộp' : 'Thêm bài nộp'}
                                        </button>
                                    </div>
                                )}

                                {/* Folder luôn hiển thị khi người dùng nhấn vào nút */}
                                {isFolderVisible && (
                                    <div className="mt-4 space-y-4">
                                        {/* Rich Text Editor */}
                                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                                            <h3 className="text-lg font-semibold mb-3 text-slate-700">Nội dung bài làm</h3>
                                            <ReactQuill
                                                theme="snow"
                                                value={textSubmission}
                                                onChange={setTextSubmission}

                                                placeholder="Nhập nội dung bài làm của bạn..."
                                                style={{
                                                    height: '200px',
                                                    marginBottom: '50px'
                                                }}
                                            />
                                        </div>
                                        <h3 className="pl-4 text-lg font-semibold  text-slate-700">File đính kèm (không bắt buộc)</h3>
                                        {/* File Upload */}
                                        <div
                                            className={`p-4 pt-6 bg-slate-50 rounded-lg shadow-md border-2 border-dashed transition-colors duration-200 ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-slate-300'}`}
                                            onDragOver={e => {
                                                e.preventDefault();
                                                setIsDragActive(true);
                                            }}
                                            onDragLeave={e => {
                                                e.preventDefault();
                                                setIsDragActive(false);
                                            }}
                                            onDrop={e => {
                                                e.preventDefault();
                                                setIsDragActive(false);
                                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                                    setUploadedFile(e.dataTransfer.files[0]);
                                                }
                                            }}
                                            onClick={() => {
                                                document.getElementById('hidden-upload-input')?.click();
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >

                                            {!uploadedFile && (
                                                <div className="text-base font-semibold mb-6 text-center text-slate-500">
                                                    Kéo & thả file vào đây hoặc click để chọn file
                                                </div>
                                            )}

                                            {uploadedFile && (
                                                <div className="mt-2 flex justify-center">
                                                    <Chip
                                                        label={uploadedFile.name}
                                                        color="primary"
                                                        onDelete={() => setUploadedFile(null)}
                                                        deleteIcon={<CancelIcon />}
                                                        variant="outlined"
                                                        sx={{ fontWeight: 500, fontSize: 15, px: 1.5 }}
                                                    />
                                                </div>
                                            )}

                                            <input
                                                id="hidden-upload-input"
                                                type="file"
                                                accept=".pdf,.doc,.docx,.xlsx,.xls"
                                                style={{ display: 'none' }}
                                                onChange={handleFileChange}
                                            />

                                            {assignmentSubmission && !uploadedFile && assignmentSubmission.fileSubmissionUrl && (
                                                <div className="mt-2 flex justify-center">

                                                    <Chip
                                                        label={decodeURIComponent(assignmentSubmission.fileSubmissionUrl.split('/').pop())}
                                                        color="success"
                                                        
                                                        variant="outlined"
                                                        sx={{ fontWeight: 500, fontSize: 15, px: 1.5 }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Submit Buttons */}
                                        <div className="flex justify-center gap-4">
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    // setIsFolderVisible(false);
                                                    setTextSubmission(assignmentSubmission?.textSubmission || '');
                                                    setUploadedFile(null);
                                                }}
                                                className="bg-slate-500 text-white text-m px-6 py-2 rounded-lg hover:bg-slate-600 transition-colors shadow-md"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    handleSubmitAssignmentSubmission();
                                                }}
                                                disabled={!textSubmission.trim() && !uploadedFile}
                                                className={`text-white text-m px-6 py-2 rounded-lg transition-colors shadow-md ${textSubmission.trim() || uploadedFile
                                                    ? 'bg-blue-500 hover:bg-blue-600'
                                                    : 'bg-slate-300 cursor-not-allowed'
                                                    }`}
                                            >
                                                {assignmentSubmission ? 'Cập nhật bài nộp' : 'Nộp bài'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Submission Status with Dropdown */}
                            {authUser.role === 'STUDENT' && (
                                <div className="p-6">
                                    <div
                                        className="flex justify-between items-center mb-2 cursor-pointer"
                                        onClick={toggleStatusDropdown}>
                                        <h3 className="text-lg font-semibold text-slate-700">Trạng thái bài nộp</h3>
                                        {isStatusDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>

                                    {isStatusDropdownOpen && (
                                        <table className="w-full">
                                            <tbody>
                                                <tr className="border-b border-slate-300">
                                                    <td className="py-3 font-medium text-gray-700">Thời gian nộp</td>
                                                    {assignmentSubmission ? (
                                                        <>
                                                            {assignmentSubmission.updatedAt
                                                                ? calculateSubmissionTime(
                                                                    formatDateArray(assignmentSubmission.updatedAt),
                                                                )
                                                                : calculateSubmissionTime(
                                                                    formatDateArray(assignmentSubmission.createdAt),
                                                                )}
                                                        </>
                                                    ) : (
                                                        <td className="py-3 text-rose-600">Chưa nộp bài</td>
                                                    )}
                                                </tr>
                                                <tr className="border-b border-slate-300">
                                                    <td className="py-3 font-medium text-gray-700">File đã nộp</td>
                                                    {assignmentSubmission && assignmentSubmission.fileSubmissionUrl ? (
                                                        <td className=" text-gray-600">
                                                            <div className="flex">
                                                                <Upload className="mr-2 text-blue-600" size={18} />

                                                                <a className="text-blue-500 hover:underline" href={`http://docs.google.com/gview?url=${assignmentSubmission.fileSubmissionUrl}&embedded=true`}>
                                                                    {decodeURIComponent(assignmentSubmission.fileSubmissionUrl.split('/').pop())}

                                                                </a>


                                                            </div>
                                                        </td>
                                                    ) : (
                                                        <td className="py-3 text-gray-600"></td>
                                                    )}
                                                </tr>
                                                <tr className="border-b border-slate-300">
                                                    <td className="py-3 font-medium text-gray-700">Điểm</td>
                                                    <td className="py-3 text-gray-600">
                                                        {assignmentSubmission
                                                            ? assignmentSubmission.score
                                                                ? assignmentSubmission.score
                                                                : 'Chưa chấm điểm'
                                                            : '...'}
                                                    </td>
                                                </tr>
                                                <tr className="border-b border-slate-300">
                                                    <td className="py-3 font-medium text-gray-700">Thời gian còn lại</td>
                                                    <td className="py-3 text-gray-600 flex items-center">
                                                        <Clock className="mr-2" size={16} />
                                                        {calculateRemainingTime(endDate)}
                                                    </td>
                                                </tr>
                                                <tr className="border-b border-slate-300">
                                                    <td className="py-3 font-medium text-gray-700">Chỉnh sửa lần cuối</td>
                                                    <td className="py-3 text-gray-600">
                                                        {assignmentSubmission &&
                                                            assignmentSubmission.updatedAt
                                                            ? format(
                                                                formatDateArray(assignmentSubmission.updatedAt),
                                                                'EEEE, dd \'tháng\' MM yyyy, hh:mm a',
                                                                { locale: vi },
                                                            )
                                                            : assignmentSubmission &&
                                                            format(
                                                                formatDateArray(assignmentSubmission.createdAt),
                                                                'EEEE, dd \'tháng\' MM yyyy, hh:mm a',
                                                                { locale: vi },
                                                            )}
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

                </>
            )}

        </div>
    );
}

