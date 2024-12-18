import { useEffect, useState } from 'react';
import { Calendar, Clock, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import PropTypes from 'prop-types';
import { axiosPrivate } from '@/axios/axios.js';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';

import Loader from '@components/Loader.jsx';
import { toast } from 'react-toastify';
import GradingSummary from './GradingSummary';


export default function SubmissionLayout({ title, content, startDate, endDate }) {
  const [isFolderVisible, setIsFolderVisible] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null); // Trạng thái cho tệp đã tải lên
  const [course, setCourse] = useState(null);
  const formattedStartDate = format(new Date(startDate), "EEEE, dd 'tháng' MM yyyy, hh:mm a", { locale: vi });
  const formattedEndDate = format(new Date(endDate), "EEEE, dd 'tháng' MM yyyy, hh:mm a", { locale: vi });

  const toggleFolderVisibility = () => {
    setIsFolderVisible(!isFolderVisible);
  };

  const [isLoading, setIsLoading] = useState(false);

  const [assignmentSubmission, setAssignmentSubmission] = useState(null);

  const { assignmentId } = useParams();

  const { courseId } = useParams();


  const calculateSubmissionTime = (submissionTime) => {
    const date = new Date(endDate);
    const submissionDate = new Date(submissionTime);
    const diffInDays = differenceInDays(date, submissionDate);
    const diffInHours = differenceInHours(date, submissionDate) % 24;
    const diffInMinutes = differenceInMinutes(date, submissionDate) % 60;
    const diffInSeconds = differenceInSeconds(date, submissionDate) % 60;

    if (submissionDate < date) {
      return <td className="py-3 text-blue-500">Nộp sớm {diffInDays > 0 ? `${diffInDays} ngày ` : ''} {diffInHours} giờ {diffInMinutes} phút {diffInSeconds} giây</td>;
    } else {
      return <td className="py-3 text-rose-600">Nộp trễ {Math.abs(diffInHours)} giờ {Math.abs(diffInMinutes)} phút {Math.abs(diffInSeconds)} giây</td>;
    }
  };
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


  useEffect(() => {
    const fetchAssignment = async () => {
      await axiosPrivate.get(`/assignment-submissions/${assignmentId}/logged-in`)
        .then((res) => {
          if (res.data.data.fileSubmissionUrl != null) {
            setAssignmentSubmission(res.data.data);
          } else {
            setAssignmentSubmission(null);
          }
          console.log(res);
        })
        .catch((err) => {
          setAssignmentSubmission(null);
          console.log(err);
        });

    }
    try {
      setIsLoading(true);
      fetchAssignment();
    } finally {
      setIsLoading(false);
    }

    if (assignmentSubmission) {
      // Xử lý dữ liệu khi đã fetch
      console.log(assignmentSubmission);
    }
  }, [assignmentId]);

  const calculateRemainingTime = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return "Đã hết hạn";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `Còn lại ${days} ngày ${hours} giờ`;
  };

  const toggleStatusDropdown = () => {
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
  };

  const handleFileChange = (event) => {
    setUploadedFile(event.target.files[0]);
  };

  const handleFileDelete = () => {
    setUploadedFile(null); // Xoá file

  };

  const handleSubmitAssignmentSubmission = async () => {
    const formData = new FormData();
    formData.append('document', uploadedFile);


    try {
      if (assignmentSubmission) {
        setIsLoading(true);
        const response = await axiosPrivate.patch(`/assignment-submissions/${assignmentId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setIsLoading(false);
        console.log(response);

        if (response.status === 200) {
          toast(response.data.message);
          setAssignmentSubmission(response.data.data);
        } else {
          toast(response.data.message, { type: 'error' });
        }
      } else {
        const submissionData = {
          assignmentId,
          textSubmission: '',
        }

        formData.append('assignment', new Blob([JSON.stringify(submissionData)], { type: 'application/json' }));

        setIsLoading(true);
        const response = await axiosPrivate.post(`/assignment-submissions`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response);
        setIsLoading(false);

        if (response.status === 201 || response.status === 200) {
          toast(response.data.message);
          setAssignmentSubmission(response.data.data);
        } else {
          toast(response.data.message, { type: 'error' });
        }
      }
    } catch (error) {
      toast(error.response.data.message, { type: 'error' });
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Loader isLoading={isLoading} />
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
            <div className="bg-[#14919B] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
              <nav aria-label="breadcrumb">
                <ol className="flex items-center space-x-2">
                  <i className="fa-solid fa-file-arrow-up text-white text-xl mr-2"></i>
                  <li>
                    <a
                      href="/"
                      className="text-white hover:underline">
                      Trang chủ
                    </a>
                  </li>
                  <li>
                    <span className="mx-2 text-gray-300">/</span>
                  </li>
                  <li>
                    <a
                      href="/my-course"
                      className="text-white hover:underline">
                      Khóa học
                    </a>
                  </li>

                  <li>
                    <span className="mx-2 text-gray-300">/</span>
                  </li>
                  <Link
                    to={`/course-detail/${course?.id}`}
                    className="text-white hover:underline"
                  >
                    {course?.name || 'Đang tải...'}
                  </Link>

                  <li>
                    <span className="mx-2 text-gray-300">/</span>
                  </li>
                  <li className="text-gray-200">
                    {title || 'Đang tải...'}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-6 relative hover:shadow-xl">
        <div className="bg-white shadow-lg overflow-hidden">
          {/* Assignment Details */}
          <div className="p-6 border-b border-gray-200">
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
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Hướng dẫn nộp bài</h2>
            <div className="pb-4" dangerouslySetInnerHTML={{ __html: content }} />
            <button
                // className="bg-[#02a189] text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                onClick={toggleFolderVisibility}
                className={"btn btn--primary"}
              >
                {assignmentSubmission ? 'Sửa bài nộp' : 'Thêm bài nộp'}
              </button>
              <button className={"btn btn--primary mt-2"}>
                <Link to={`/grading/${courseId}/${assignmentId}`} className="text-white">
                Chấm điểm
                </Link>
              </button>

              {/* Folder luôn hiển thị khi người dùng nhấn vào nút */}
            {isFolderVisible && (
              <div className="mt-4 p-4 bg-slate-200 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Tải tệp bài nộp của bạn</h3>
                {uploadedFile && (
                  <div>
                    <span className="text-gray-700 mr-4">File đã chọn: </span>
                    <span className="text-blue-700 mr-4">{uploadedFile.name}</span>
                  </div>
                )}
                {!uploadedFile && (
                  <input
                    type="file"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer"
                    onChange={handleFileChange}
                  />
                )}
                {assignmentSubmission && !uploadedFile && assignmentSubmission.fileSubmissionUrl && (
                    <div>
                      <span className="text-gray-700 mr-4">File đã nộp: </span>
                      <span className="text-blue-700 mr-4">{assignmentSubmission.fileSubmissionUrl.split('/').pop()}</span>
                    </div>
                )}
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => handleSubmitAssignmentSubmission()}
                    className="mr-4 bg-blue-400 text-white text-m px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors shadow-md">
                    Nộp bài
                  </button>
                  <button
                    className="mr-4 bg-rose-400 text-white text-m px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                    onClick={handleFileDelete}
                  >
                    Xoá
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submission Status with Dropdown */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={toggleStatusDropdown}>
              <h3 className="text-lg font-semibold text-gray-800">Trạng thái bài nộp</h3>
              {isStatusDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {isStatusDropdownOpen && (
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 font-medium text-gray-700">Trạng thái bài nộp</td>
                    {assignmentSubmission ? (
                      <>
                        {assignmentSubmission.updatedAt
                          ? calculateSubmissionTime(assignmentSubmission.updatedAt)
                          : calculateSubmissionTime(assignmentSubmission.createdAt)}
                      </>
                    ) : (
                      <td className="py-3 text-gray-600">Chưa nộp bài</td>
                    )}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium text-gray-700">File đã nộp</td>
                    {assignmentSubmission && assignmentSubmission.fileSubmissionUrl ? (
                      <td className="py-3 text-gray-600">
                        <div className="flex my-4">
                          <Upload className="mr-2 text-[#CD4F2E]" size={18} />
                          <span
                            className="text-blue-500">{assignmentSubmission.fileSubmissionUrl.split('/').pop()}</span>
                        </div>
                      </td>
                    ) : (
                      <td className="py-3 text-gray-600"></td>
                    )}
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium text-gray-700">Trạng thái chấm điểm</td>
                    <td className="py-3 text-gray-600">Chưa chấm điểm</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium text-gray-700">Thời gian còn lại</td>
                    <td className="py-3 text-gray-600 flex items-center">
                      <Clock className="mr-2" size={16} />
                      {calculateRemainingTime(endDate)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium text-gray-700">Chỉnh sửa lần cuối</td>
                    <td className="py-3 text-gray-600">
                      {assignmentSubmission && assignmentSubmission.updatedAt
                        ? format(new Date(assignmentSubmission.updatedAt), "EEEE, dd 'tháng' MM yyyy, hh:mm a", { locale: vi })
                        : assignmentSubmission && format(new Date(assignmentSubmission.createdAt), "EEEE, dd 'tháng' MM yyyy, hh:mm a", { locale: vi })}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
          <div className="">
          <GradingSummary timeRemaining={calculateRemainingTime(endDate)} />
          </div>
        </div>
      </div>
    </div>
  );
}

SubmissionLayout.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
}
