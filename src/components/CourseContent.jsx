import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

function CourseContent() {
  const [expandedSections, setExpandedSections] = useState(['chung']); // Trạng thái lưu trữ các phần đang mở

  const toggleSection = (section) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section) // Nếu section đã được mở, đóng nó
        : [...prev, section] // Nếu section chưa được mở, thêm nó vào danh sách
    );
  };

  return (
    <div className="container mx-auto mt-6 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {['chung', 'section1', 'section2'].map((section, index) => (
          <div key={section} className="border-b last:border-b-0">
            <button
              onClick={() => toggleSection(section)}
              className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 focus:outline-none"
            >
              <span className="font-medium text-gray-700">
                {index === 0 ? 'Chung' : `Section ${index + 1}`}
              </span>
              <div className="flex items-center">
                {expandedSections.includes(section) ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </button>
            {expandedSections.includes(section) && (
              <div className="px-4 py-3 bg-gray-50">
                <p className="text-sm text-gray-600">
                  {index === 0 ? 'Nội dung phần Chung' : `Nội dung cho Section ${index + 1}`}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseContent;
