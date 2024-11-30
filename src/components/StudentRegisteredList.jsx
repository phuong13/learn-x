import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import PropTypes from 'prop-types';
import { Button } from '@mui/material';

const StudentRegisteredList = ({ students, paginationInfo, onPageChange }) => {
    const [currentPage, setCurrentPage] = useState(paginationInfo.pageNumber);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < paginationInfo.totalPages) {
            setCurrentPage(newPage);
            onPageChange(newPage);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
                {students.map((student) => (
                    <li key={student.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{student.fullName}</p>
                                <p className="text-sm text-gray-500 truncate">{student.email}</p>
                            </div>
                            <div className="inline-flex items-center text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-2 py-1">
                                {student.role}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    variant="outline"
                    size="sm"
                >
                    <ChevronLeftIcon className="h-4 w-4 mr-2" />
                    Previous
                </Button>
                <span className="text-sm text-gray-700">
          Page {currentPage + 1} of {paginationInfo.totalPages}
        </span>
                <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === paginationInfo.totalPages - 1}
                    variant="outline"
                    size="sm"
                >
                    Next
                    <ChevronRightIcon className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    );
};

StudentRegisteredList.propTypes = {
    students: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        fullName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
    })).isRequired,
    paginationInfo: PropTypes.shape({
        pageNumber: PropTypes.number.isRequired,
        totalPages: PropTypes.number.isRequired,
    }).isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default StudentRegisteredList;

