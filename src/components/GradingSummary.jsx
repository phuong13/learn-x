import { useEffect, useState } from 'react';
import { ClipboardList, Clock, FileCheck } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { axiosPrivate } from '@/axios/axios.js';
import PropTypes from 'prop-types';

export default function GradingSummary({ timeRemaining }) {
    const { assignmentId } = useParams();

    const [summaryData, setSummaryData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await axiosPrivate.get(`/assignment-submissions/assignment/${assignmentId}`)
                .then((res) => {
                    setSummaryData(res.data.data);
                })
                .catch((err) => {
                    console.log(err);
                });

        };
        fetchData();
    }, [assignmentId]);


    // Tính toán thống kê
    const participants = summaryData.length;
    const submitted = summaryData.filter(
        (item) => item.fileSubmissionUrl || item.textSubmission,
    ).length;
    const needsGrading = summaryData.filter((item) => item.score === null || item.score === undefined).length;

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Thống kê điểm số</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="divide-y divide-gray-200">
                    {/*<div className="flex items-center p-4 hover:bg-gray-50 transition-colors">*/}
                    {/*  <Users className="w-5 h-5 mr-4" />*/}
                    {/*  <span className="text-gray-700">Học sinh tham gia</span>*/}
                    {/*  <span className="ml-auto font-semibold text-gray-900">{participants}</span>*/}
                    {/*</div>*/}
                    <div className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                        <FileCheck className="w-5 h-5 text-green-500 mr-4" />
                        <span className="text-gray-700">Đã nộp bài</span>
                        <span className="ml-auto font-semibold text-gray-900">{submitted}</span>
                    </div>
                    <div className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                        <ClipboardList className="w-5 h-5 text-yellow-500 mr-4" />
                        <span className="text-gray-700">Cần chấm điểm</span>
                        <span className="ml-auto font-semibold text-gray-900">{needsGrading}</span>
                    </div>
                    <div className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                        <Clock className="w-5 h-5 text-red-500 mr-4" />
                        <span className="text-gray-700">Thời gian còn lại</span>
                        <span className="ml-auto font-semibold text-gray-900">{timeRemaining}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

GradingSummary.propTypes = {
    timeRemaining: PropTypes.string.isRequired,
};
