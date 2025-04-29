import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { axiosPrivate } from '@/axios/axios.js';
import { toast } from 'react-toastify';
import { t } from 'i18next';

export default function Calendar() {
    const date = new Date();
    const [currentDate, setCurrentDate] = useState(new Date(date.getFullYear(), date.getMonth()));
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const params = new URLSearchParams();
                params.append('month', (currentDate.getMonth() + 1).toString());
                params.append('year', currentDate.getFullYear().toString());
                const urlParams = params.toString();
                await axiosPrivate.get(`/assignments/get-by-month-year?${urlParams}`)
                    .then((res) => {
                        setEvents(res.data.data);
                    });

            } catch (error) {
                console.error('Error fetching events:', error);
                toast(error.response.data.message);
            }
        };
        fetchEvents();
    }, [currentDate]);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDay();

    const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    const getMonthData = () => {
        const days = [];
        const totalDays = daysInMonth;
        let currentDay = 1;

        for (let week = 0; currentDay <= totalDays; week++) {
            const weekDays = [];
            for (let day = 0; day < 7; day++) {
                if (week === 0 && day < firstDayOfMonth - 1) {
                    weekDays.push(null);
                } else if (currentDay <= totalDays) {
                    weekDays.push(currentDay);
                    currentDay++;
                } else {
                    weekDays.push(null);
                }
            }
            days.push(weekDays);
        }
        return days;
    };

    const getEventsForDate = (date) => {
        return events.filter(event => {
            const eventDate = new Date(event.endDate);
            return eventDate.getDate() === date &&
                eventDate.getMonth() === currentDate.getMonth() &&
                eventDate.getFullYear() === currentDate.getFullYear();
        });
    };

    const navigateMonth = (direction) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction));
    };

    return (
        <div className="max-w-6xl mx-auto pt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('calendar')}</h2>
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
                        Tháng {currentDate.getMonth() + 1} {currentDate.getFullYear()}
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
                                {week.map((day, dayIndex) => {
                                    const isToday = day === new Date().getDate() &&
                                        currentDate.getMonth() === new Date().getMonth() &&
                                        currentDate.getFullYear() === new Date().getFullYear();
                                    return (
                                        <div
                                            key={`${weekIndex}-${dayIndex}`}
                                            className={`min-h-[120px] border-r border-b p-2 ${isToday ? 'bg-emerald-100' : ''}`}
                                        >
                                            {day && (
                                                <>
                                                    <div className={`text-sm mb-1 `}>
                                                        <span className={`${isToday ? 'px-2 py-1 bg-rose-400 rounded-3xl' : ''}`}>{day}</span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        {getEventsForDate(day).map(event => (
                                                            <div
                                                                key={event.id}
                                                                className="text-xs p-1 bg-orange-100 text-blue-800 rounded truncate"
                                                            >
                                                                <a href={`/submission/${event.courseId}/${event.id}`}
                                                                   title={`${event.courseName} - ${event.title}`}
                                                                   className="hover:underline text-blue-600 font-semibold hover:text-blue-800 transition duration-300 ease-in-out">
                                                                    ● {event.courseName} - {event.title}
                                                                </a>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
