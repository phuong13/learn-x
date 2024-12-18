import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { axiosPrivate } from '@/axios/axios.js';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { toast } from 'react-toastify';
import { Calendar, Clock, ChevronLeft, ChevronRight, HelpCircle, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GradingInterface({ title, startDate, endDate }) {
  const summaryData = [
    {
      assignmentId: 6,
      studentId: 3,
      studentName: "Phuc Tran Hoang",
      studentEmail: "21110606@student.hcmute.edu.vn",
      score: 7.5,
      textSubmission: "",
      fileSubmissionUrl: "http://res.cloudinary.com/dnarlcqth/raw/upload/v1734078040/Nhom20_TLCN_DaiTra.docx",
    },
    {
      assignmentId: 6,
      studentId: 4,
      studentName: "Nguyen Hoang Phuong",
      studentEmail: "21123456@student.hcmute.edu.vn",
      score: null,
      textSubmission: "This is a sample text submission.",
      fileSubmissionUrl: "",
    },
    {
      assignmentId: 6,
      studentId: 5,
      studentName: "Tran Van Minh",
      studentEmail: "21178901@student.hcmute.edu.vn",
      score: 6.5,
      textSubmission: "",
      fileSubmissionUrl: "http://res.cloudinary.com/dnarlcqth/raw/upload/v1734078042/Nhom22_TLCN_DaiTra.docx",
    },
  ];

  const [course, setCourse] = useState(null);
  const [assignmentSubmission, setAssignmentSubmission] = useState(null);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);

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
      return <td className="py-3 text-blue-500">Nộp sớm {diffInDays > 0 ? `${diffInDays} ngày ` : ''} {diffInHours} giờ {diffInMinutes} phút {diffInSeconds} giây</td>;
    } else {
      return <td className="py-3 text-rose-600">Nộp trễ {diffInHours} giờ {diffInMinutes} phút {diffInSeconds} giây</td>;
    }
  };

  const formattedStartDate = format(new Date(startDate), "EEEE, dd 'tháng' MM yyyy, hh:mm a", { locale: vi });
  const formattedEndDate = format(new Date(endDate), "EEEE, dd 'tháng' MM yyyy, hh:mm a", { locale: vi });

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
          setAssignmentSubmission(res.data.data);
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

  const handlePreviousStudent = () => {
    setCurrentStudentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : summaryData.length - 1));
  };

  const handleNextStudent = () => {
    setCurrentStudentIndex((prevIndex) => (prevIndex < summaryData.length - 1 ? prevIndex + 1 : 0));
  };

  const currentStudent = summaryData[currentStudentIndex];

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-blue-600">Khoá học:</span>
            {course && (
              <>
                <Link
                  to={`/course-detail/${course?.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {course?.name || 'Đang tải...'}
                </Link>
                <span>/</span>
                <Link
                  to={`/submission/${course?.id}/${assignmentId}`}
                  className="text-blue-600 hover:underline">
                  {title}
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="p-1" onClick={handlePreviousStudent}><ChevronLeft className="w-4 h-4" /></button>
            <select className="border rounded px-2 py-1 text-sm" value={currentStudent.studentEmail} onChange={(e) => setCurrentStudentIndex(summaryData.findIndex(student => student.studentEmail === e.target.value))}>
              {summaryData.map((student, index) => (
                <option key={index} value={student.studentEmail}>{student.studentEmail}</option>
              ))}
            </select>
            <button className="p-1" onClick={handleNextStudent}><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="text-sm text-gray-600">{currentStudentIndex + 1} of {summaryData.length}</div>
        </div>
      </div>

      {/* Student Info */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{currentStudent.studentName}</h2>
            <div className="text-sm text-gray-600">{currentStudent.studentEmail}</div>
          </div>
        </div>
        <div className="text-blue-600 mt-4">
          <Calendar className="inline mb-1 mr-2" size={16} /> Due: {formattedEndDate}
          <div className="flex items-center gap-2">
            <Clock className="" size={16} />
            <div className="py-2 font-medium text-gray-700">Thời gian còn lại:</div>
            <td className=" flex items-center">
              {calculateRemainingTime(endDate)}
            </td>
          </div>
        </div>
        
      </div>

      {/* Submission Status */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Bài nộp</h2>
        <div className="space-y-4">
          {currentStudent.fileSubmissionUrl && (
            <div className="flex items-center gap-2 text-blue-600">
              <div>File đã nộp:</div>
              <a href={currentStudent.fileSubmissionUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
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

      {/* Grading Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          Chấm điểm
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Thang điểm 10</label>
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
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}