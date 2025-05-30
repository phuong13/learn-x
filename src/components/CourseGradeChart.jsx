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
    const [chartData, setChartData] = useState({ labels: [], series: [] });

    // Lấy danh sách module + bài tập + quiz
    useEffect(() => {
        if (courseId) {
            const fetchAllAssignmentsAndQuizzes = async () => {
                const allAssignments = [];
                const modules = await fetchModules(courseId);
                for (const module of modules) {
                    const moduleAssignments = await fetchAssignments(module.id);
                    allAssignments.push(
                        ...moduleAssignments.map(a => ({ ...a, type: 'assignment' }))
                    );
                    const moduleQuizzes = await fetchQuizzes(module.id);
                    allAssignments.push(
                        ...moduleQuizzes.map(q => ({ ...q, type: 'quiz' }))
                    );
                }
                setAssignments(allAssignments);
                if (allAssignments.length > 0) {
                    setSelectedAssignment(`${allAssignments[0].type}-${allAssignments[0].id}`);
                }
            };
            fetchAllAssignmentsAndQuizzes();
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

    const fetchQuizzes = async (moduleId) => {
        try {
            return await ModuleService.getQuizzesByModuleId(moduleId);
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    // Lấy submissions cho assignment hoặc quiz
    const fetchSubmissions = async (selected) => {
        if (!selected) return [];
        const [type, id] = selected.split('-');
        try {
            if (type === 'assignment') {
                return await ModuleService.getAssignmentSubmissions(Number(id));
            } else if (type === 'quiz') {
                return await ModuleService.getQuizSubmissions(Number(id));
            }
        } catch (err) {
            console.error(err);
            return [];
        }
        return [];
    };

    // Lấy dữ liệu submissions để hiển thị biểu đồ
    useEffect(() => {
        const fetchData = async () => {
            const submissions = await fetchSubmissions(selectedAssignment);
            const filtered = submissions.filter((s) => s.score !== null && s.score !== undefined);

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
                        maxWidth: 256,
                        mb: 3,
                    }}
                    size="small"
                >
                    <InputLabel id="assignmentSelect-label">Chọn bài tập/quiz</InputLabel>
                    <Select
                        labelId="assignmentSelect-label"
                        id="assignmentSelect"
                        value={selectedAssignment || ''}
                        label="Chọn bài tập/quiz"
                        onChange={handleAssignmentChange}
                    >
                        {assignments.map((item) => (
                            <MenuItem key={`${item.type}-${item.id}`} value={`${item.type}-${item.id}`}>
                                {item.type === 'assignment' ? 'Bài tập: ' : 'Quiz: '}
                                {item.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : (
                <p className="text-slate-500 text-center">Chưa có bài tập hoặc quiz nào trong khóa học này.</p>
            )}

            {chartData.labels.length > 0 ? (
                <>

                    <div className="relative flex flex-col items-center">

                        <div className="flex justify-center  ml-20">
                            <PieChart
                                series={[
                                    {
                                        data: chartData.labels.map((label, index) => ({
                                            id: label,
                                            value: chartData.series[0].data[index],
                                            label: `Điểm ${label} (${chartData.series[0].data[index]})`,
                                        })),
                                        innerRadius: 20,
                                        outerRadius: 150,
                                        paddingAngle: 1,
                                    },
                                ]}
                                width={500}
                                height={300}
                            />
                        </div>
                        <div className="text-lg font-bold text-slate-700 mt-4 text-center">
                            Thống kê điểm số
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-slate-600 text-center">Chưa có học sinh nào nộp ở mục này</p>
            )}
        </div>
    );
};

CourseGradeChart.propTypes = {
    courseId: PropTypes.number.isRequired,
};

export default CourseGradeChart;