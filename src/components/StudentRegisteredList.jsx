import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';
import PropTypes from 'prop-types';
import { useAuth } from '@hooks/useAuth.js';

const StudentRegisteredList = ({
  totalStudents,
  students,
  paginationInfo,
  onPageChange,
  onDeleteStudents,
}) => {
  // **Local copy** của students để xóa + re-render
  const [localStudents, setLocalStudents] = useState(students);
  const [currentPage, setCurrentPage] = useState(paginationInfo.pageNumber);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState([]);
  const { authUser } = useAuth();
  const isTeacher = authUser?.role === 'TEACHER';

  // Khi prop students thay đổi (ví dụ cha load lại), cập nhật localStudents
  useEffect(() => {
    setLocalStudents(students);
    setSelectedStudents([]);
  }, [students]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < paginationInfo.totalPages) {
      setCurrentPage(newPage);
      onPageChange(newPage);
    }
  };

  const toggleStudentSelection = (email) => {
    setSelectedStudents((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  const handleDeleteStudent = (email) => {
    setDeleteTarget([email]);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteSelected = () => {
    if (selectedStudents.length > 0) {
      setDeleteTarget(selectedStudents);
      setIsDeleteConfirmOpen(true);
    }
  };

  const confirmAndDelete = () => {
    // 1. Gọi callback lên cha (nếu cần, ví dụ để xóa DB)
    onDeleteStudents(deleteTarget);

    // 2. Xóa khỏi localStudents để re-render
    setLocalStudents((prev) =>
      prev.filter((s) => !deleteTarget.includes(s.email))
    );

    // 3. Reset selection & dialog
    setSelectedStudents([]);
    setDeleteTarget([]);
    setIsDeleteConfirmOpen(false);
  };

  return (
    <div className="w-full mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      {isTeacher && (
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <p>Tổng số {localStudents.length} thành viên</p>
        </div>
      )}

      <ul className="divide-y divide-slate-200">
        {localStudents.map((student) => (
          <li
            key={student.id}
            className="px-6 py-4 hover:bg-slate-50 flex items-center"
          >
            {isTeacher && (
              <div className="flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.email)}
                  onChange={() => toggleStudentSelection(student.email)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {student.fullName}
              </p>
              <p className="text-sm text-slate-500 truncate">
                {student.email}
              </p>
            </div>
            <div className="inline-flex items-center text-xs font-semibold text-slate-500 bg-slate-100 rounded-full px-2 py-1 mr-2">
              {student.role}
            </div>
            {isTeacher && (
              <button
                onClick={() => handleDeleteStudent(student.email)}
                className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </li>
        ))}
      </ul>

      {isTeacher && selectedStudents.length > 0 && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleDeleteSelected}
            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Xóa tất cả đã chọn
          </button>
        </div>
      )}

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-3 py-1 bg-white text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-2 inline-block" />
          Trang trước
        </button>
        <span className="text-sm text-slate-700">
          Trang {currentPage + 1}/{paginationInfo.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === paginationInfo.totalPages - 1}
          className="px-3 py-1 bg-white text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Trang kế
          <ChevronRightIcon className="h-4 w-4 ml-2 inline-block" />
        </button>
      </div>

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
            <p className="mb-4">
              Bạn có chắc chắn muốn xóa{' '}
              {deleteTarget.length > 1
                ? 'những học sinh này'
                : 'học sinh này'}
              ?<br />
              (Không thể hoàn tác)
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="py-2 px-4 bg-primaryDark text-white rounded-lg hover:bg-secondary transition-colors"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Không
              </button>
              <button
                className="py-2 px-4 bg-primaryDark text-white rounded-lg hover:bg-secondary transition-colors"
                onClick={confirmAndDelete}
              >
                Có
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

StudentRegisteredList.propTypes = {
  totalStudents: PropTypes.number.isRequired,
  students: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
      fullName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    })
  ).isRequired,
  paginationInfo: PropTypes.shape({
    pageNumber: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
  }).isRequired,
  onPageChange: PropTypes.func.isRequired,
  onDeleteStudents: PropTypes.func.isRequired,
};

export default StudentRegisteredList;
