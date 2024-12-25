import { useParams } from 'react-router-dom';
import { ChevronDown, FileText } from 'lucide-react';
import { axiosPrivate } from '@/axios/axios.js';
import ModuleService from '../services/modules/module.service';
import CourseService from '../services/courses/course.service';
import React, { useState, useEffect } from 'react';

export default function GradeTable() {
    const [expandedModules, setExpandedModules] = useState({});
    const { courseId } = useParams();
    const [modules, setModules] = useState([]);
    const [assignmentsWithSubmissions, setAssignmentsWithSubmissions] = useState({});

    useEffect(() => {
        const fetchModulesAndAssignments = async () => {
            const response = await CourseService.getModulesByCourseId(courseId);

            if (response) {
                const modulesData = response;
                setModules(modulesData);

                const assignmentsPromises = modulesData.map(async (module) => {
                    const assignmentsResponse = await ModuleService.getAllAssignmentsByModuleId(module.id);
                    console.log(assignmentsResponse);

                    if (assignmentsResponse.length > 0) {
                        const assignmentsWithSubmissionsPromises = assignmentsResponse.map(async (assignment) => {
                            const submissionResponse = await axiosPrivate.get(
                                `/assignment-submissions/${assignment.id}/logged-in`,
                            );
                            console.log(submissionResponse);

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

                const allAssignmentsWithSubmissions = await Promise.all(assignmentsPromises);
                const assignmentsMap = {};
                allAssignmentsWithSubmissions.forEach(({ moduleId, assignmentsWithSubmissions }) => {
                    assignmentsMap[moduleId] = assignmentsWithSubmissions;
                });
                setAssignmentsWithSubmissions(assignmentsMap);
            }
        };
        fetchModulesAndAssignments();
    }, [courseId]);

    const toggleModuleExpansion = (moduleId) => {
        setExpandedModules((prev) => ({
            ...prev,
            [moduleId]: !prev[moduleId],
        }));
    };

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
                    {modules.map((module) => (
                        <React.Fragment key={module.id}>
                            <tr className="border-t border-b">
                                <td colSpan={7} className="p-0">
                                    <button
                                        onClick={() => toggleModuleExpansion(module.id)}
                                        className="flex items-center w-full p-4 hover:bg-gray-50 text-left">
                                        <ChevronDown
                                            className={`w-5 h-5 mr-2 transition-transform ${
                                                expandedModules[module.id]
                                                    ? 'transform rotate-0'
                                                    : 'transform -rotate-90'
                                            }`}
                                        />
                                        <span className="font-medium">{module.name}</span>
                                    </button>
                                </td>
                            </tr>
                            {expandedModules[module.id] &&
                                assignmentsWithSubmissions[module.id]?.map(({ assignment, submission }) => (
                                    <tr key={assignment.id} className="border-t hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="text-xs text-gray-500">BÀI TẬP</div>
                                                <FileText className="w-4 h-4 text-gray-400" />
                                                <a
                                                    href={submission?.fileSubmissionUrl || '#'}
                                                    className="text-blue-600 hover:underline"
                                                    target="_blank"
                                                    rel="noopener noreferrer">
                                                    {assignment.title}
                                                </a>
                                            </div>
                                        </td>
                                        <td className="text-center pr-8 ">
                                            {submission
                                                ? submission.textSubmission === '' &&
                                                  submission.fileSubmissionUrl === ''
                                                    ? 'Chưa nộp bài'
                                                    : submission.score !== null
                                                    ? submission.score
                                                    : 'Chưa chấm điểm'
                                                : '-'}
                                        </td>
                                    </tr>
                                ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
