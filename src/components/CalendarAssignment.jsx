import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 10)) // November 2024
  const [selectedCourse, setSelectedCourse] = useState('all')

  // Sample events data
  const events = [
    { id: 1, date: '2024-11-02', title: 'Nộp bài tập JUnit tới hạn', type: 'submission' },
    { id: 2, date: '2024-11-07', title: 'Nộp bài React+springboot tới hạn', type: 'submission' },
    { id: 3, date: '2024-11-14', title: 'Nộp bài tập React+Express tới hạn', type: 'submission' },
    { id: 4, date: '2024-11-22', title: 'Nộp Project cuối kỳ lần 2 tới hạn', type: 'submission' },
  ]

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDay()

  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

  const getMonthData = () => {
    const days = []
    const totalDays = daysInMonth
    let currentDay = 1

    for (let week = 0; currentDay <= totalDays; week++) {
      const weekDays = []
      for (let day = 0; day < 7; day++) {
        if (week === 0 && day < firstDayOfMonth - 1) {
          weekDays.push(null)
        } else if (currentDay <= totalDays) {
          weekDays.push(currentDay)
          currentDay++
        } else {
          weekDays.push(null)
        }
      }
      days.push(weekDays)
    }
    return days
  }

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.getDate() === date &&
             eventDate.getMonth() === currentMonth.getMonth() &&
             eventDate.getFullYear() === currentMonth.getFullYear()
    })
  }

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction))
  }

return (
    <div className="max-w-6xl mx-auto pt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lịch</h2>
        <div className="bg-white rounded-lg">
            {/* Header */}
            <div className="p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <select 
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="border rounded-md px-3 py-2 text-sm"
                    >
                        <option value="all">Tất cả các khóa học</option>
                        <option value="course1">Khóa học 1</option>
                        <option value="course2">Khóa học 2</option>
                    </select>
                </div>
            </div>

            {/* Calendar Navigation */}
            <div className="p-4 flex justify-between items-center">
                <button onClick={() => navigateMonth(-1)} className="p-2">
                    <ChevronLeft />
                </button>
                <h2 className="text-lg font-semibold">
                    Tháng {currentMonth.getMonth() + 1} {currentMonth.getFullYear()}
                </h2>
                <button onClick={() => navigateMonth(1)} className="p-2">
                    <ChevronRight />
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 mb-2">
                    {weekDays.map(day => (
                        <div key={day} className="text-center font-semibold">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar days */}
                <div className="border-t border-l">
                    {getMonthData().map((week, weekIndex) => (
                        <div key={weekIndex} className="grid grid-cols-7">
                            {week.map((day, dayIndex) => (
                                <div
                                    key={`${weekIndex}-${dayIndex}`}
                                    className="min-h-[120px] border-r border-b p-2"
                                >
                                    {day && (
                                        <>
                                            <div className={`text-sm mb-1`}>
                                                {day}
                                            </div>
                                            <div className="space-y-1">
                                                {getEventsForDate(day).map(event => (
                                                    <div
                                                        key={event.id}
                                                        className="text-xs p-1 bg-orange-100 text-blue-800 rounded truncate"
                                                    >
                                                        <a href={`/event/${event.id}`} className="hover:underline">
                                                            {event.title}
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
)
}