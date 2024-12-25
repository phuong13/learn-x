import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';
import PropTypes from 'prop-types';
import { useAuth } from '@hooks/useAuth.js';

const StudentRegisteredList = ({ totalStudents, students, paginationInfo, onPageChange, onDeleteStudents }) => {
    const [currentPage, setCurrentPage] = useState(paginationInfo.pageNumber);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const { authUser } = useAuth();
    const isTeacher = authUser?.role === 'TEACHER';

    useEffect(() => {
        setSelectedStudents([]);
        console.log('students:', students);
    }, [students]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < paginationInfo.totalPages) {
            setCurrentPage(newPage);
            onPageChange(newPage);
        }
    };

    const toggleStudentSelection = (studentEmail) => {
        setSelectedStudents((prev) =>
            prev.includes(studentEmail) ? prev.filter((id) => id !== studentEmail) : [...prev, studentEmail],
        );
    };

    const handleDeleteSelected = () => {
        onDeleteStudents(selectedStudents);
        setSelectedStudents([]);
    };

    const handleDeleteStudent = (studentEmail) => {
        onDeleteStudents([studentEmail]);
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            {isTeacher && (
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <p>Tổng số {totalStudents} thành viên</p>
                </div>
            )}
            <ul className="divide-y divide-gray-200">
                {students.map((student) => (
                    <li key={student.id} className="px-6 py-4 hover:bg-gray-50 flex items-center">
                        {isTeacher && (
                            <div className="flex items-center mr-4">
                                <input
                                    type="checkbox"
                                    checked={selectedStudents.includes(student.email)}
                                    onChange={() => toggleStudentSelection(student.email)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{student.fullName}</p>
                            <p className="text-sm text-gray-500 truncate">{student.email}</p>
                        </div>
                        <div className="inline-flex items-center text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-2 py-1 mr-2">
                            {student.role}
                        </div>
                        {isTeacher && (
                            <button
                                onClick={() => handleDeleteStudent(student.email)}
                                className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                                <XIcon className="w-4 h-4" />
                            </button>
                        )}
                    </li>
                ))}
            </ul>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeftIcon className="h-4 w-4 mr-2 inline-block" />
                    Trang trước
                </button>
                <span className="text-sm text-gray-700">
                    Trang {currentPage + 1}/{paginationInfo.totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === paginationInfo.totalPages - 1}
                    className="px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Trang kế
                    <ChevronRightIcon className="h-4 w-4 ml-2 inline-block" />
                </button>
            </div>
        </div>
    );
};

StudentRegisteredList.propTypes = {
    students: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            fullName: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            role: PropTypes.string.isRequired,
        }),
    ).isRequired,
    paginationInfo: PropTypes.shape({
        pageNumber: PropTypes.number.isRequired,
        totalPages: PropTypes.number.isRequired,
    }).isRequired,
    onPageChange: PropTypes.func.isRequired,
    onDeleteStudents: PropTypes.func.isRequired,
    totalStudents: PropTypes.number.isRequired,
};

export default StudentRegisteredList;
