import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CourseService from '../services/courses/course.service.js';
import ModuleService from '../services/modules/module.service.js';
import StudentScoreListModal from './StudentScoreListModal.jsx';
import Button from '@mui/material/Button';
import { PieChart } from '@mui/x-charts';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    CircularProgress,
} from '@mui/material';

const CourseGradeChart = ({ courseId }) => {
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [chartData, setChartData] = useState({ labels: [], series: [] });
    const [pending, setPending] = useState(false); // Thêm pending
    const [scoreModalOpen, setScoreModalOpen] = useState(false);
    const [currentSubmissions, setCurrentSubmissions] = useState([]);
    const [currentIsQuiz, setCurrentIsQuiz] = useState(false);
    const [currentTitle, setCurrentTitle] = useState('');
    const [filtered, setFiltered] = useState([]);
    const handleOpenScoreModal = () => {
        setCurrentSubmissions(filtered); // filtered là submissions đã lọc
        setCurrentIsQuiz(selectedAssignment.startsWith('quiz'));
        setCurrentTitle(assignments.find(a => `${a.type}-${a.id}` === selectedAssignment)?.title || '');
        setScoreModalOpen(true);
    };
    const handleCloseScoreModal = () => setScoreModalOpen(false);




    // Lấy danh sách module + bài tập + quiz
    useEffect(() => {
        if (courseId) {
            const fetchAllAssignmentsAndQuizzes = async () => {
                setPending(true); // Bắt đầu loading
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
                setPending(false);
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

    useEffect(() => {
        const fetchData = async () => {
            setPending(true);
            const submissions = await fetchSubmissions(selectedAssignment);
            console.log("🚀 ~ fetchData ~ submissions:", submissions)
            const filtered = submissions.filter((s) =>
                selectedAssignment.startsWith('quiz')
                    ? s.quizSubmission && s.quizSubmission.score !== null && s.quizSubmission.score !== undefined
                    : s.score !== null && s.score !== undefined
            );
            setFiltered(filtered);

            const scoreCounts = filtered.reduce((acc, s) => {
                let rawScore = selectedAssignment.startsWith('quiz')
                    ? s.quizSubmission.score
                    : s.score;
                const score = selectedAssignment.startsWith('quiz')
                    ? Math.round((rawScore / 10) * 10) / 10
                    : Math.round(rawScore * 10) / 10;
                acc[score] = (acc[score] || 0) + 1;
                return acc;
            }, {});
            const labels = Object.keys(scoreCounts).sort((a, b) => a - b);
            const data = labels.map((label) => scoreCounts[label]);

            setChartData({
                labels,
                series: [{ data }],
            });
            setPending(false);
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
            <FormControl
                fullWidth
                size="small"
                sx={{ mb: 3 }}
            >
                <InputLabel id="assignmentSelect-label">Chọn bài tập/quiz</InputLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Select
                        labelId="assignmentSelect-label"
                        id="assignmentSelect"
                        value={selectedAssignment || ''}
                        label="Chọn bài tập/quiz"
                        onChange={handleAssignmentChange}
                        sx={{ minWidth: 180, maxWidth: 320 }}
                    >
                        {assignments.map((item) => (
                            <MenuItem key={`${item.type}-${item.id}`} value={`${item.type}-${item.id}`}>
                                {item.type === 'assignment' ? 'Bài tập: ' : 'Quiz: '}
                                {item.title}
                            </MenuItem>
                        ))}
                    </Select>

                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleOpenScoreModal}
                        sx={{ whiteSpace: 'nowrap', ml: 2 }}
                    >
                        Xem danh sách điểm & Xuất Excel
                    </Button>
                </Box>
            </FormControl>
            {pending ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                    <CircularProgress />
                </Box>
            ) : assignments.length > 0 ? (
                <>


                    {chartData.labels.length > 0 ? (
                        <div className="relative flex flex-col items-center">
                            <div className="text-lg font-bold text-slate-700 mb-4 mr-20 text-center">
                                Thống kê điểm số
                            </div>
                            <div className="flex justify-center">
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
                        </div>
                    ) : (
                        <p className="text-slate-600 text-center">Chưa có học sinh nào nộp ở mục này</p>
                    )}
                </>
            ) : (
                <p className="text-slate-500 text-center">Chưa có bài tập hoặc quiz nào trong khóa học này.</p>
            )}

            <StudentScoreListModal
                open={scoreModalOpen}
                onClose={handleCloseScoreModal}
                submissions={currentSubmissions}
                isQuiz={currentIsQuiz}
                title={currentTitle}
            />
        </div>
    );
};

CourseGradeChart.propTypes = {
    courseId: PropTypes.number.isRequired,
};

export default CourseGradeChart;