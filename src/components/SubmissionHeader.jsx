import React from 'react'

export default function SubmissionHeader() {
  return (
    <div className="flex items-start gap-4 p-4 border-t">
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
            <span className="font-medium">Due:</span>
            <span>Thứ Tư, 4 tháng 9 2024, 11:00 PM</span>
          </div>
        </div>
      </div>
    </div>
  )
}