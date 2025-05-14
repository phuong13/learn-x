import React from "react";

const TagCourse = ({ nameCourse, onClick , isActive}) => {

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 text-slate-600 hover:rounded-lg  w-full transition mb-2 cursor-pointer border-b ${
        isActive ? "bg-slate-300 rounded-lg" : "bg-gray-100 hover:bg-slate-300"
      }`}
    >
      <span className="text-base font-semibold">{nameCourse}</span>
    </div>
  );
};

export default TagCourse;
