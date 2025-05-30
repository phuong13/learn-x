import { useParams } from 'react-router-dom';
import { ChevronDown, FileText, HelpCircle } from 'lucide-react';
import { axiosPrivate } from '@/axios/axios.js';
import ModuleService from '../services/modules/module.service';
import CourseService from '../services/courses/course.service';
import QuizIcon from '@mui/icons-material/Quiz';
import AssignmentIcon from '@mui/icons-material/Assignment';
import React, { useState, useEffect } from 'react';

export default function GradeTable() {
    const [expandedModules, setExpandedModules] = useState({});
    const { courseId } = useParams();
    const [modules, setModules] = useState([]);
    const [assignmentsWithSubmissions, setAssignmentsWithSubmissions] = useState({});
    const [quizzesWithSubmissions, setQuizzesWithSubmissions] = useState({});

    useEffect(() => {
        const fetchModulesAndAssignmentsAndQuizzes = async () => {
            const response = await CourseService.getModulesByCourseId(courseId);

            if (response) {
                const modulesData = response;
                setModules(modulesData);

                // Fetch assignments
                const assignmentsPromises = modulesData.map(async (module) => {
                    const assignmentsResponse = await ModuleService.getAllAssignmentsByModuleId(module.id);

                    if (assignmentsResponse.length > 0) {
                        const assignmentsWithSubmissionsPromises = assignmentsResponse.map(async (assignment) => {
                            const submissionResponse = await axiosPrivate.get(
                                `/assignment-submissions/${assignment.id}/logged-in`,
                            );

                            if (submissionResponse.status === 200) {
                                const submissionData = submissionResponse.data.data;
                                return { assignment, submission: submissionData };
                            }
                            return { assignment, submission: null };
                        });
                        const assignmentsWithSubmissions = await Promise.all(assignmentsWithSubmissionsPromises);
                        return { moduleId: module.id, assignmentsWithSubmissions };
                    }
                    return { moduleId: module.id, assignmentsWithSubmissions: [] };
                });

                // Fetch quizzes
                const quizzesPromises = modulesData.map(async (module) => {
                    const quizzesResponse = await ModuleService.getQuizzesByModuleId(module.id);

                    if (quizzesResponse.length > 0) {
                        const quizzesWithSubmissionsPromises = quizzesResponse.map(async (quiz) => {
                            const submissionResponse = await axiosPrivate.get(
                                `/quiz-submissions/student/quiz/${quiz.id}`,)
                            console.log("🚀 ~ quizzesWithSubmissionsPromises ~ submissionResponse:", submissionResponse)

                            if (submissionResponse.status === 200) {
                                const submissionData = submissionResponse.data.data;
                                return { quiz, submission: submissionData };
                            }
                            return { quiz, submission: null };
                        });
                        const quizzesWithSubmissions = await Promise.all(quizzesWithSubmissionsPromises);
                        return { moduleId: module.id, quizzesWithSubmissions };
                    }
                    return { moduleId: module.id, quizzesWithSubmissions: [] };
                });

                // Wait for all
                const allAssignmentsWithSubmissions = await Promise.all(assignmentsPromises);
                const assignmentsMap = {};
                allAssignmentsWithSubmissions.forEach(({ moduleId, assignmentsWithSubmissions }) => {
                    assignmentsMap[moduleId] = assignmentsWithSubmissions;
                });
                setAssignmentsWithSubmissions(assignmentsMap);

                const allQuizzesWithSubmissions = await Promise.all(quizzesPromises);
                const quizzesMap = {};
                allQuizzesWithSubmissions.forEach(({ moduleId, quizzesWithSubmissions }) => {
                    quizzesMap[moduleId] = quizzesWithSubmissions;
                });
                setQuizzesWithSubmissions(quizzesMap);
            }
        };
        fetchModulesAndAssignmentsAndQuizzes();
    }, [courseId]);

    const toggleModuleExpansion = (moduleId) => {
        setExpandedModules((prev) => ({
            ...prev,
            [moduleId]: !prev[moduleId],
        }));
    };

    return (
        <div className="max-w-full overflow-x-auto">
            <div className="min-w-[800px]">
                {/* Header */}
                <div className="flex bg-slate-100  font-semibold text-slate-600 rounded-lg mb-3 px-4 ">
                    <div className="flex-1 p-2 text-left">Mục điểm</div>
                    <div className="w-40 p-2 text-center">Điểm</div>
                </div>

                {modules.map((module) => (
                    <div key={module.id} className="shadow-md mb-4 bg-white rounded-lg">
                        {/* Module title row */}
                        <button
                            onClick={() => toggleModuleExpansion(module.id)}
                            className="flex items-center w-full p-2  text-left border-slate-400 bg-blue-50 rounded-lg">
                            <ChevronDown
                                className={`w-5 h-5 mr-2 transition-transform ${expandedModules[module.id]
                                    ? 'transform rotate-0'
                                    : 'transform -rotate-90'
                                    }`}
                            />
                            <span className="text-base font-semibold text-slate-600">{module.name}</span>
                        </button>

                        {/* Assignment rows */}
                        {expandedModules[module.id] &&
                            assignmentsWithSubmissions[module.id]?.map(({ assignment, submission }) => (
                                <div key={assignment.id} className="flex items-start border-t border-slate-400  px-6">
                                    <div className="flex-1 p-2">
                                        <div className="flex items-center gap-2">
                                            <AssignmentIcon className="text-pink-500" fontSize="medium" />
                                            <a
                                                className="text-blue-500 text-sm font-bold cursor-pointer"
                                                target="_blank"
                                                rel="noopener noreferrer">
                                                {assignment.title}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="w-40 p-2 text-center text-sm text-slate-600 font-semibold">
                                        {submission
                                            ? submission.textSubmission === '' && submission.fileSubmissionUrl === ''
                                                ? 'Chưa nộp bài'
                                                : submission.score !== null
                                                    ? submission.score
                                                    : 'Chưa chấm điểm'
                                            : '-'}

                                    </div>
                                </div>
                            ))}

                        {/* Quiz rows */}
                        {expandedModules[module.id] &&
                            quizzesWithSubmissions[module.id]?.map(({ quiz, submission }) => (
                                <div key={quiz.id} className="flex items-start border-t border-slate-400  px-6">
                                    <div className="flex-1 p-2">
                                        <div className="flex items-center gap-2">
                                            <QuizIcon className="text-primary" fontSize="medium" />
                                            <a
                                                className="text-blue-500 text-sm font-bold cursor-pointer"
                                                target="_blank"
                                                rel="noopener noreferrer">
                                                {quiz.title}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="w-40 p-2 text-sm text-slate-600 font-semibold pl-12">
                                        {submission && Array.isArray(submission) && submission.length > 0 ? (
                                            <div className="flex flex-col gap-1">
                                                {submission.map((s, idx) => (
                                                    <div key={s.id || idx}>
                                                        <span className='font-medium'>Lần {idx + 1}:</span> {typeof s.score === 'number' ? s.score : 'Chưa có điểm'}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : submission && typeof submission.score === 'number' ? (
                                            submission.score
                                        ) : submission && submission.length === 0 ? (
                                            'Chưa làm'
                                        ) : (
                                            '-'
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
}