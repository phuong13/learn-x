import React from 'react';

export default function SubmissionHeader() {
  return (
    <div className="flex items-start gap-4 mt-2 pt-2 border-t border-slate-400">
      {/* Icon */}
      <div className="text-pink-500 mt-1">
        <i className="fa-solid fa-file-arrow-up text-2xl"></i>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h2 className="text-blue-600 text-sm font-medium hover:text-blue-700 cursor-pointer mb-1">
          <a href="/submission">Nộp bài Buổi 1</a>
        </h2>
        <div className="text-sm text-gray-600">
          <div className="flex gap-1">
            <span className="font-medium">Opened:</span>
            <span>Thứ Năm, 29 tháng 8 2024, 12:00 AM</span>
          </div>
          <div className="flex gap-1">
            <span className="font-medium">Due:</span>
            <span>Thứ Sáu, 30 tháng 8 2024, 11:59 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
}