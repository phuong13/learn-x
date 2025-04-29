import { X } from "lucide-react"

export default function AnswerItem({ answer, questionType, onChange, onSelect, onDelete }) {
  return (
    <div className="flex items-center mb-3 group ">
      <div
        className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 cursor-pointer ${
          answer.selected ? "bg-blue-500 border-blue-500" : "border-gray"
        }`}
        onClick={() => onSelect(answer.id)}
      >
        {answer.selected && <div className="w-2 h-2 rounded-full bg-white"></div>}
      </div>

      <input
        type="text"
        value={answer.text}
        onChange={(e) => onChange(answer.id, e.target.value)}
        className="flex-grow border-b border-transparent focus:border-gray focus:outline-none py-1 "
      />

      <button
        className="text-gray-400 hover:text-gray ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onDelete(answer.id)}
      >
        <X size={16} />
      </button>
    </div>
  )
}
