

import { useState, useRef, useEffect } from "react"
import { format, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"

export default function DateTimePicker({ label = "Start time", value, onChange, className = "" }) {
  const [date, setDate] = useState(value || new Date())
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef(null)

  // Format time in 12-hour format with AM/PM
  const formattedDate = date ? format(date, "MM/dd/yyyy hh:mm a") : ""

  const handleDateChange = (newDate) => {
    setDate(newDate)
    if (onChange) onChange(newDate)
  }

  const handleInputChange = (e) => {
    const inputValue = e.target.value
    try {
      // Try to parse the input value
      const parsedDate = parse(inputValue, "MM/dd/yyyy hh:mm a", new Date())
      if (!isNaN(parsedDate.getTime())) {
        handleDateChange(parsedDate)
      }
    } catch (error) {
      // Invalid date format, do nothing
    }
  }

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-sm font-bold text-gray-700">{label}</label>}
      <div className="relative">
        <input
          type="text"
          value={formattedDate}
          onChange={handleInputChange}
          placeholder="MM/DD/YYYY HH:MM AM/PM"
          className="w-full rounded-md border border-gray px-3 py-2 pr-10 shadow-sm focus:border-gray-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-500"
        >
          <CalendarIcon className="h-4 w-4" />
          <span className="sr-only">Open calendar</span>
        </button>

        {isOpen && (
          <div
            ref={popoverRef}
            className="absolute right-0 z-10 mt-2 w-64 rounded-md border border-gray-200 bg-white p-4 shadow-lg"
          >
            <div className="mb-4">
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500">
                <div>Su</div>
                <div>Mo</div>
                <div>Tu</div>
                <div>We</div>
                <div>Th</div>
                <div>Fr</div>
                <div>Sa</div>
              </div>
              <div className="mt-2 grid grid-cols-7 gap-1">
                {/* This is a simplified calendar view - in a real app you'd generate days dynamically */}
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1
                  const isSelected = date && day === date.getDate()
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const newDate = new Date(date || new Date())
                        newDate.setDate(day)
                        handleDateChange(newDate)
                      }}
                      className={`rounded-full p-1 text-sm ${
                        isSelected ? "bg-slate-400 text-white" : "hover:bg-gray-100"
                      }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  id="time"
                  type="time"
                  className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                  value={date ? format(date, "HH:mm") : ""}
                  onChange={(e) => {
                    if (!date) return
                    const [hours, minutes] = e.target.value.split(":").map(Number)
                    const newDate = new Date(date)
                    newDate.setHours(hours)
                    newDate.setMinutes(minutes)
                    handleDateChange(newDate)
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
