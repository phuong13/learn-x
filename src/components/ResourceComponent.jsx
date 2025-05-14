import React from 'react';
import PropTypes from 'prop-types';

export default function Resource({ type, title, link }) {
  // Map loại tài liệu với biểu tượng Font Awesome
  const icons = {
    word: 'fa-file-word text-blue-500',
    ppt: 'fa-file-powerpoint text-[#CD4F2E]',
    excel: 'fa-file-excel text-[#25764a]',
    pdf: 'fa-file-pdf text-[#d32f2f]',
  };

  return (
    <div className="flex items-start gap-4 py-1  border-t border-slate-400">
      {/* Icon */}
      <div className="">
        <i className={`fa-solid ${icons[type]} text-2xl`}></i>
      </div>

      {/* Content */}
      <h3 className="text-blue-600 text-sm hover:text-blue-700 hover:underline cursor-pointer mb-1 pt-2">
        <a href={link} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </h3>
    </div>
  );
}

// PropTypes để kiểm tra kiểu dữ liệu
Resource.propTypes = {
  type: PropTypes.oneOf(['word', 'ppt', 'excel']).isRequired,
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};
