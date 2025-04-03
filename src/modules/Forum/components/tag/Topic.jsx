import { Send } from "lucide-react";

const Topic = ({ user, content, comments }) => {
    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-lg">
            {/* User info and post header */}
            <div className="px-4 flex items-start gap-3">
                <div className="flex-shrink-0 border rounded-full">
                    <img
                        src={user.avatar || "/placeholder.svg"}
                        alt=""
                        width={30}
                        height={30}
                        className="rounded-full"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-sm text-gray-800">{user.name}</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">{user.timestamp}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nội dung topic */}
            <div className="flex my-2 mx-4">
                <p className="text-gray-800 text-base   ">{content}</p>
            </div>

            {/* Comment section */}
            <div className="px-4 border-t border-slate-400 mx-2">
                <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-sm text-slate-500">{comments.length} Comments about topic</span>
                </div>
            </div>

            {/* Comment input */}
            <div className="px-4 flex items-center gap-3">
                <div className="flex-shrink-0 border rounded-full">
                    <img
                        src={user.avatar || "/placeholder.svg"}
                        alt=""
                        width={30}
                        height={30}
                        className="rounded-full"
                    />
                </div>
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Comment to topic..."
                        className="w-full py-2 px-3 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 contrast-50 hover:contrast-200 transition">
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Topic;
