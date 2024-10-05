import React from 'react';
import { Calendar, Clock, MessageSquare } from 'lucide-react'

export default function SubmissionLayout() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Banner */}
      <div className="relative h-48 bg-emerald-200 overflow-hidden">
        <img
          src="/src/assets/backround.jpg"
          alt="Online learning illustration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" /> {/* Overlay for better text visibility */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex items-center">
            <div className="bg-[#14919B] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
              <i className="fa-solid fa-file-arrow-up text-white text-xl mr-2"></i>
              Title Assignment
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
              <p className="mb-2 sm:mb-0"><Calendar className="inline mr-2" size={16} /> Opened: Thứ Năm, 15 tháng 8 2024, 5:54 AM</p>
              <p><Calendar className="inline mr-2" size={16} /> Due: Thứ Sáu, 11 tháng 10 2024, 12:30 PM</p>
            </div>
          </div>  

          {/* Submission Instructions */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Hướng dẫn nộp bài</h2>
            <p className="text-gray-600 mb-4">
              Nộp file nén chứa mã nguồn chương trình Calculator đã sửa lỗi + File EXE chương trình + File word chứa các nội dung ghi chú như trong BT nhóm 04b.
            </p>
            <p className="text-gray-600 mb-4">
              Tên file: Nhomxx_A04b_FixBugs.RAR/ZIP
            </p>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-md">
              Thêm bài nộp
            </button>
          </div>

          {/* Submission Status */}
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Trạng thái bài nộp</h3>
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
                    Còn lại 5 Các ngày 23 giờ
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium text-gray-700">Chỉnh sửa lần cuối</td>
                  <td className="py-3 text-gray-600">-</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-gray-700">Đăng tải các bình luận</td>
                  <td className="py-3">
                    <button className="flex items-center text-blue-500 hover:text-blue-600">
                      <MessageSquare className="mr-2" size={16} />
                      Các bình luận (0)
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}