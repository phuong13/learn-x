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

   // ...existing code...
return (
    <div className=" p-4">
        <h2 className="text-lg font-semibold text-slate-700 mb-2">Thống kê điểm số</h2>
        <div className="rounded-lg overflow-hidden bg-white shadow">
            <table className="w-full">
                <tbody>
                    <tr className="border-b border-slate-300">
                        <td className="py-3 flex items-center font-medium text-slate-700">
                            <FileCheck className="w-5 h-5 text-green-500 mr-3" />
                            Đã nộp bài
                        </td>
                        <td className="py-3 font-semibold text-slate-700">{submitted}</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                        <td className="py-3 flex items-center font-medium text-slate-700">
                            <ClipboardList className="w-5 h-5 text-yellow-500 mr-3" />
                            Cần chấm điểm
                        </td>
                        <td className="py-3 font-semibold text-slate-700">{needsGrading}</td>
                    </tr>
                    <tr>
                        <td className="py-3 flex items-center font-medium text-slate-700">
                            <Clock className="w-5 h-5 text-red-500 mr-3" />
                            Thời gian còn lại
                        </td>
                        <td className="py-3 font-semibold text-slate-700">{timeRemaining}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);
// ...existing code...
}

GradingSummary.propTypes = {
    timeRemaining: PropTypes.string.isRequired,
};
