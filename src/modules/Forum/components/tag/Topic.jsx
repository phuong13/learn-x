import { Send } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTopicComment } from "../../../../store/useTopicComment";
import profileUser from "../../../../assets/profile-user.png";
import { FaSpinner } from "react-icons/fa";

const Topic = ({ user, content, createAt, topicId }) => {
  const me = JSON.parse(localStorage.getItem("user") || "{}");
  const { createTopicComment, getTopicComment } = useTopicComment();
  const { t } = useTranslation();
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  const [commentContent, setCommentContent] = useState("");
  const [comment, setComment] = useState([]);
  const [showComments, setShowComments] = useState(false);

  const fetchComment = async () => {
    const data = await getTopicComment(topicId);
    setComment(data.data || []);
  };

  useEffect(() => {
    fetchComment();
  }, []);

  const handleCreateComment = async () => {
    if (commentContent.trim() && !isCommentLoading) {
      setIsCommentLoading(true);
      await createTopicComment({ content: commentContent, topicId });
      setCommentContent("");
      await fetchComment();
      setIsCommentLoading(false);
    }
  };
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreateComment();
    }
  }; return (
    <div className="w-full p-4 bg-white rounded-lg shadow-lg border border-slate-200">
      {/* User info and post header */}
      <div className=" flex items-center gap-2">
        <div className="flex-shrink-0 w-[30px] h-[30px] rounded-full overflow-hidden border border-slate-300">
          <img
            src={user.avatarUrl || profileUser}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-sm text-slate-700 truncate">{user.username}</h3>
            <span className="text-sm text-slate-500">{formatDateTime(createAt)}</span>
          </div>
        </div>
      </div>

      {/* Nội dung topic */}
      <div className="flex my-2 mx-4">
        <p className="text-slate-700 text-sm "><p dangerouslySetInnerHTML={{ __html: content }} /></p>
      </div>

      {/* Comment section */}
      <div className="px-4 border-t border-slate-300 mx-2">
        <div
          className="flex items-center gap-2 text-slate-600 cursor-pointer mt-2"
          onClick={() => setShowComments(!showComments)}
        >
          <span className="text-sm text-slate-500 hover:underline hover:text-slate-600 transition">
            {t('topic.comments_count', { count: comment.length })}
          </span>
        </div>

        {showComments && (
          <div className="px-4 my-2 space-y-2">
            {comment.length === 0 ? (
              <p className="text-slate-400 text-sm">{t('topic.no_comments')}</p>
            ) : (
              comment.map((item) => (
                <div key={item.id} className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-[30px] h-[30px] rounded-full overflow-hidden border border-slate-300">
                    <img
                      src={item.account.avatarUrl || profileUser}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 bg-slate-50 p-2 rounded-md">
                    <div className="flex justify-between">
                      <div className="font-semibold text-sm text-slate-700">{item.account.email}</div>
                      <div className="text-sm text-slate-500">{formatDateTime(item.createdAt)}</div>
                    </div>
                    <p className="text-slate-700 text-sm">{item.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Comment input */}
      <div className="px-4 flex items-center gap-3 mt-2">
        <div className="flex-shrink-0 w-[30px] h-[30px] rounded-full overflow-hidden border border-slate-300">
          <img
            src={me.avatar}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 relative">
          <input
            type="text"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            onKeyDown={handleInputKeyDown}

            placeholder={t('topic.comment_input_placeholder')}
            className="w-full py-2 px-3 border-b border-slate-300 focus:outline-none text-slate-600 "
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 contrast-50 hover:contrast-200 transition"
            onClick={handleCreateComment}
            disabled={isCommentLoading}
          >
            {isCommentLoading ? (
              <FaSpinner className="w-5 h-5 animate-spin text-primaryDark" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topic;

const formatDateTime = (dateArray) => {
  const date = new Date(
    dateArray[0], // year
    dateArray[1] - 1, // month
    dateArray[2], // day
    dateArray[3], // hour
    dateArray[4], // minute
    dateArray[5], // second
    Math.floor(dateArray[6] / 1_000_000) // millisecond
  );

  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh", // đảm bảo UTC+7
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};