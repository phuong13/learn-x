import React, { useState ,useEffect } from 'react';
import {  useParams } from 'react-router-dom';
import { ChevronDown, FileText } from 'lucide-react';
import { axiosPrivate } from '@/axios/axios.js';

export default function GradeTable() {
    const [isExpanded, setIsExpanded] = useState(true);
    const { courseId } = useParams();

    const [course, setCourse] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosPrivate.get(`courses/${courseId}`);
            if (response.status === 200) {
                setCourse(response.data.data);
            }
        };
        fetchData();
    }, [courseId]);

    const assignments = [
        {
            id: 1,
            content: "<p>Work in registered groups.</p><p><strong>Only ONE submission needed</strong> for each group.</p><p>File name: Nhomxx_A03_TestCase1.XLS/XLSX</p>",
            startDate: "2024-12-11T06:30:00.000+00:00",
            endDate: "2024-12-11T16:30:00.000+00:00",
            state: "OPEN",
            title: "Nộp bài chương 1",
            urlDocument: null,
            moduleId: 10,
        },
        {
            id: 2,
            content: "<p>Work in registered groups.</p><p><strong>Only ONE submission needed</strong> for each group.</p><p>File name: Nhomxx_A03_TestCase1.XLS/XLSX</p>",
            startDate: "2024-12-11T06:30:00.000+00:00",
            endDate: "2024-12-11T16:30:00.000+00:00",
            state: "OPEN",
            title: "Nộp bài chương 2",
            urlDocument: null,
            moduleId: 10,
        },
        {
            id: 3,
            content: "<p>Work in registered groups.</p><p><strong>Only ONE submission needed</strong> for each group.</p><p>File name: Nhomxx_A03_TestCase1.XLS/XLSX</p>",
            startDate: "2024-12-11T06:30:00.000+00:00",
            endDate: "2024-12-11T16:30:00.000+00:00",
            state: "OPEN",
            title: "Nộp bài chương 3",
            urlDocument: null,
            moduleId: 10,
        },
    ];

    const submission = [
        {
            createdAt: "2024-12-19T21:45:55.746807",
            updatedAt: "2024-12-21T17:02:43.554083",
            createdBy: 9,
            updatedBy: 2,
            id: 1,
            score: null,
            textSubmission: "",
            fileSubmissionUrl: "",
        },
        {
            createdAt: "2024-12-19T21:45:55.746807",
            updatedAt: "2024-12-21T17:02:43.554083",
            createdBy: 9,
            updatedBy: 2,
            id: 2,
            score: 7.5,
            textSubmission: "",
            fileSubmissionUrl: "http://res.cloudinary.com/dnarlcqth/raw/upload/v1734619558/Mau-5-TrinhBay-KLTN.pdf",
        },
        {
            createdAt: "2024-12-19T21:45:55.746807",
            updatedAt: "2024-12-21T17:02:43.554083",
            createdBy: 9,
            updatedBy: 2,
            id: 3,
            score: 10,
            textSubmission: "",
            fileSubmissionUrl: "http://res.cloudinary.com/dnarlcqth/raw/upload/v1734619558/Mau-5-TrinhBay-KLTN.pdf",
        },
    ];

    return (
        <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="text-left p-4 font-medium text-gray-600">Mục điểm</th>
                        <th className="text-center p-4 pr-16 font-medium text-gray-600">Điểm</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-t border-b">
                        <td colSpan={7} className="p-0">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center w-full p-4 hover:bg-gray-50 text-left"
                            >
                                <ChevronDown
                                    className={`w-5 h-5 mr-2 transition-transform ${isExpanded ? 'transform rotate-0' : 'transform -rotate-90'
                                        }`}
                                />
                                <span className="font-medium">{course?.name}</span>
                            </button>
                        </td>
                    </tr>
                    {isExpanded &&
                        assignments.map((assignment) => {
                            const relatedSubmission = submission.find(
                                (sub) => sub.id === assignment.id
                            );

                            return (
                                <tr key={assignment.id} className="border-t hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="text-xs text-gray-500">BÀI TẬP</div>
                                            <FileText className="w-4 h-4 text-gray-400" />
                                            <a
                                                href={relatedSubmission?.fileSubmissionUrl || '#'}
                                                className="text-blue-600 hover:underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {assignment.title}
                                            </a>
                                        </div>
                                    </td>
                                    <td className="text-center pr-8 ">
                                        {relatedSubmission
                                            ? relatedSubmission.textSubmission === '' && relatedSubmission.fileSubmissionUrl === ''
                                                ? 'Chưa nộp bài'
                                                : relatedSubmission.score !== null
                                                    ? relatedSubmission.score
                                                    : 'Chưa chấm điểm'
                                            : '-'}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
}
