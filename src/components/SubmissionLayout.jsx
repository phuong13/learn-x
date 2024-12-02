import { useState } from 'react';
import { Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import PropTypes from 'prop-types';

export default function SubmissionLayout({ title, content, startDate, endDate }) {
  const [isFolderVisible, setIsFolderVisible] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null); // Trạng thái cho tệp đã tải lên
  const formattedStartDate = format(new Date(startDate), "EEEE, dd 'tháng' MM yyyy, hh:mm a", { locale: vi });
  const formattedEndDate = format(new Date(endDate), "EEEE, dd 'tháng' MM yyyy, hh:mm a", { locale: vi });
  const toggleFolderVisibility = () => {
    setIsFolderVisible(!isFolderVisible);
  };

  const calculateRemainingTime = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return "Đã hết hạn";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `Còn lại ${days} ngày ${hours} giờ`;
  };

  const toggleStatusDropdown = () => {
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
  };

  const handleFileChange = (event) => {
    setUploadedFile(event.target.files[0]);
  };

  const handleFileDelete = () => {
    setUploadedFile(null); // Xoá file

  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Banner */}
      <div className="relative h-48 bg-emerald-200 overflow-hidden">
        <img
          src="/src/assets/backround.jpg"
          alt="Online learning illustration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex items-center">
            <div className="bg-[#14919B] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
              <i className="fa-solid fa-file-arrow-up text-white text-xl mr-2"></i>
              {title}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-6 relative hover:shadow-xl">
        <div className="bg-white shadow-lg overflow-hidden">
          {/* Assignment Details */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Thời gian</h2>
            <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-600">
              <p className="mb-2 sm:mb-0">
                <Calendar className="inline mr-2" size={16} /> Opened: {formattedStartDate}
              </p>
              <p>
                <Calendar className="inline mr-2" size={16} /> Due: {formattedEndDate}
              </p>
            </div>
          </div>

          {/* Submission Instructions */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Hướng dẫn nộp bài</h2>
            <div className="pb-4" dangerouslySetInnerHTML={{ __html: content }} />
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
              onClick={toggleFolderVisibility}
            >
              Thêm bài nộp
            </button>

            {/* Folder luôn hiển thị khi người dùng nhấn vào nút */}
            {isFolderVisible && (
              <div className="mt-4 p-4 bg-slate-200 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Tải tệp bài nộp của bạn</h3>
                {uploadedFile && (
                  <div>
                  <span className="text-gray-700 mr-4">File đã chọn: </span>
                  <span className="text-blue-700 mr-4">{uploadedFile.name}</span>
                  </div>
                )}
                {!uploadedFile && (
                  <input
                    type="file"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer"
                    onChange={handleFileChange}
                  />
                )}
                <div className="flex justify-center mt-4">
                  <button className="mr-4 bg-blue-500 text-white text-m px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors shadow-md">
                    Nộp bài
                  </button>
                  <button className="mr-4 bg-blue-500 text-white text-m px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                    onClick={handleFileDelete}
                  >
                    Xoá
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submission Status with Dropdown */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={toggleStatusDropdown}>
              <h3 className="text-lg font-semibold text-gray-800">Trạng thái bài nộp</h3>
              {isStatusDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {isStatusDropdownOpen && (
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 font-medium text-gray-700">Trạng thái bài nộp</td>
                    <td className="py-3 text-gray-600">No submissions have been made yet</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium text-gray-700">Trạng thái chấm điểm</td>
                    <td className="py-3 text-gray-600">Chưa chấm điểm</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium text-gray-700">Thời gian còn lại</td>
                    <td className="py-3 text-gray-600 flex items-center">
                      <Clock className="mr-2" size={16} />
                      {calculateRemainingTime(endDate)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-medium text-gray-700">Chỉnh sửa lần cuối</td>
                    <td className="py-3 text-gray-600">-</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

SubmissionLayout.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
}
