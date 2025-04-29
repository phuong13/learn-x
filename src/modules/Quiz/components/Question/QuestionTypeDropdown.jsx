import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function QuestionTypeDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        className="border  rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium shadow-sm"
        onClick={() => setOpen(!open)}
      >
        {value}
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1  bg-white border rounded-md shadow-lg z-10">
          {["Single choice", "Multiple choice"].map((type) => (
            <div
              key={type}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(type)
                setOpen(false)
              }}
            >
              {type}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
