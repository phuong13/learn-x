import React from "react";

const TagCourse = ({ avatar, nameCourse }) => {
  return (
    <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg w-full hover:bg-slate-300 transition">
      <span className="text-base font-semibold">{nameCourse}</span>
    </div>
  );
};
export default TagCourse;
