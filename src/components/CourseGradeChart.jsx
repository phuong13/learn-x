import { useEffect, useState } from 'react';

import CourseService from '../services/courses/course.service.js';
import ModuleService from '../services/modules/module.service.js';
import { PropTypes } from 'prop-types';
import { BarChart } from '@mui/x-charts';

const CourseGradeChart = ({ courseId }) => {
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        if (courseId) {
            const fetchAllAssignments = async () => {
                const allAssignments = [];
                const modules = await fetchModules(courseId);
                for (const module of modules) {
                    const moduleAssignments = await fetchAssignments(module.id);
                    allAssignments.push(...moduleAssignments);
                }
                setAssignments(allAssignments);
                setSelectedAssignment(allAssignments[0].id);
            };
            fetchAllAssignments();
        }
    }, [courseId]);

    const fetchModules = async (courseId) => {
        try {
            return await CourseService.getModulesByCourseId(courseId);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchAssignments = async (moduleId) => {
        try {
            return await ModuleService.getAssignmentsByModuleId(moduleId);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchAssignmentSubmissions = async (assignmentId) => {
        try {
            return await ModuleService.getAssignmentSubmissions(assignmentId);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const submissions = await fetchAssignmentSubmissions(selectedAssignment);

            const filteredSubmissions = submissions.filter((submission) => submission.score !== null);

            const scoreCounts = filteredSubmissions.reduce((acc, submission) => {
                const score = submission.score;
                if (!acc[score]) {
                    acc[score] = 0;
                }
                acc[score] += 1;
                return acc;
            }, {});

            const labels = Object.keys(scoreCounts).sort((a, b) => a - b);
            const data = labels.map((label) => scoreCounts[label]);

            setChartData({
                labels: labels,
                series: [{ data: data }],
            });
        };

        if (selectedAssignment) {
            fetchData();
        }
    }, [selectedAssignment]);

    const handleAssignmentChange = (event) => {
        setSelectedAssignment(event.target.value);
    };

    return (
        <div className="p-4">
            <select
                onChange={handleAssignmentChange}
                value={selectedAssignment}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                {assignments.map((assignment) => (
                    <option key={assignment.id} value={assignment.id}>
                        {assignment.title}
                    </option>
                ))}
            </select>
            {chartData.labels.length > 0 && (
                <BarChart
                    xAxis={[{ scaleType: 'band', data: chartData.labels, label: 'Scores', width: 50 }]}
                    // yAxis={[{ tickFormat: (value) => Math.floor(value) }]}
                    series={chartData.series}
                    width={500}
                    height={300}
                    style={{ marginTop: '20px' }}
                    barLabel="value"
                    yAxisProps={{
                        tickFormat: (value) => (Number.isInteger(value) ? value : ''),
                    }}
                />
            )}
        </div>
    );
};

CourseGradeChart.propTypes = {
    courseId: PropTypes.number.isRequired,
};

export default CourseGradeChart;
