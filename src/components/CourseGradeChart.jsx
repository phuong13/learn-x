import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CourseService from '../services/courses/course.service.js';
import ModuleService from '../services/modules/module.service.js';
import { PieChart } from '@mui/x-charts';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

const CourseGradeChart = ({ courseId }) => {
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    // Lấy danh sách module + bài tập
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
                if (allAssignments.length > 0) {
                    setSelectedAssignment(allAssignments[0].id);
                }
            };
            fetchAllAssignments();
        }
    }, [courseId]);

    const fetchModules = async (courseId) => {
        try {
            return await CourseService.getModulesByCourseId(courseId);
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    const fetchAssignments = async (moduleId) => {
        try {
            return await ModuleService.getAssignmentsByModuleId(moduleId);
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    const fetchAssignmentSubmissions = async (assignmentId) => {
        try {
            return await ModuleService.getAssignmentSubmissions(assignmentId);
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    // Lấy dữ liệu submissions để hiển thị biểu đồ
    useEffect(() => {
        const fetchData = async () => {
            const submissions = await fetchAssignmentSubmissions(selectedAssignment);
            const filtered = submissions.filter((s) => s.score !== null);

            const scoreCounts = filtered.reduce((acc, s) => {
                acc[s.score] = (acc[s.score] || 0) + 1;
                return acc;
            }, {});

            const labels = Object.keys(scoreCounts).sort((a, b) => a - b);
            const data = labels.map((label) => scoreCounts[label]);

            setChartData({
                labels,
                series: [{ data }],
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
        <div className="p-4 w-full">

            {assignments.length > 0 ? (
                <FormControl
                    fullWidth
                    sx={{
                        maxWidth: 256, // tương đương sm:w-64
                        mb: 3,
                    }}
                    size="small"
                >
                    <InputLabel id="assignmentSelect-label">Chọn bài tập</InputLabel>
                    <Select
                        labelId="assignmentSelect-label"
                        id="assignmentSelect"
                        value={selectedAssignment || ''}
                        label="Chọn bài tập"
                        onChange={handleAssignmentChange}
                    >
                        {assignments.map((assignment) => (
                            <MenuItem key={assignment.id} value={assignment.id}>
                                {assignment.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : (
                <p className="text-slate-500 text-center">Chưa có bài tập nào trong khóa học này.</p>
            )}

            {chartData.labels.length > 0 ? (
                <div className="flex justify-center">
                    <PieChart
                        series={[
                            {
                                data: chartData.labels.map((label, index) => ({
                                    id: label,
                                    value: chartData.series[0].data[index],
                                    label: `Điểm ${label}`,
                                })),
                                innerRadius: 20,
                                outerRadius: 150,
                                paddingAngle: 10,
                            },
                        ]}
                        width={450}
                        height={300}
                    />
                </div>
            ) : (<p className="text-slate-600  text-center">Chưa có học sinh nào nộp ở bài tập này</p>
            )}
        </div>
    );
};

CourseGradeChart.propTypes = {
    courseId: PropTypes.number.isRequired,
};

export default CourseGradeChart;
