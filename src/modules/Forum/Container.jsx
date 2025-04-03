import React, { useState } from "react";
import Topic from "./components/tag/Topic";
import RichTextEditor from "../../components/RichTextEditor";

const topicsData = [
  {
    user: { name: "Duy Thanh Nguyen", avatar: "/placeholder.svg", timestamp: "22/12/2023 01:46" },
    content: "Làm sao để giải bài tập 1?",
    comments: [],
  },
  {
    user: { name: "Lê Hồng Phúc", avatar: "/placeholder.svg", timestamp: "23/12/2023 10:15" },
    content: "Cách tối ưu React Component?",
    comments: [],
  },
  {
    user: { name: "Trần Thị B", avatar: "/placeholder.svg", timestamp: "24/12/2023 08:30" },
    content: "Học Redux như thế nào?",
    comments: [],
  },
  {
    user: { name: "Võ Minh Khoa", avatar: "/placeholder.svg", timestamp: "25/12/2023 14:00" },
    content: "Cấu trúc thư mục chuẩn trong dự án React?",
    comments: [],
  },
];

const Container = () => {
  const [topics, setTopics] = useState(topicsData);
  const [showPopup, setShowPopup] = useState(false);
  const [newTopic, setNewTopic] = useState("");

  const handleCreateTopic = () => {
    if (newTopic.trim() === "") return;
    const newEntry = {
      user: { name: "Người dùng mới", avatar: "/placeholder.svg", timestamp: new Date().toLocaleString() },
      content: newTopic,
      comments: [],
    };
    setTopics([newEntry, ...topics]);
    setNewTopic("");
    setShowPopup(false);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <button
        className="border border-primaryDark font-semibold bg-white rounded-lg p-1 hover:bg-slate-300 transition"
        onClick={() => setShowPopup(true)}
      >
        Create Topic
      </button>

      <div className="flex flex-col gap-4 h-[400px] overflow-y-auto custom-scrollbar">
        {topics.map((topic, index) => (
          <Topic key={index} user={topic.user} content={topic.content} comments={topic.comments} />
        ))}
      </div>

      {/* Popup Create Topic */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg h-[200px] w-[400px]">
            <h2 className="text-lg font-semibold mb-2">Tạo Topic Mới</h2>
            <textarea
              className="w-full border p-2 rounded-md"
              rows="3"
              placeholder="Nhập nội dung topic..."
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-3">
              <button className="px-3 py-1 bg-gray-300 rounded-md" onClick={() => setShowPopup(false)}>
                Hủy
              </button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded-md" onClick={handleCreateTopic}>
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Container;
