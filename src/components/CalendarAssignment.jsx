import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Grid,
    Paper,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { axiosPrivate } from '@/axios/axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export default function MUICalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const params = new URLSearchParams();
                params.append('month', (currentDate.getMonth() + 1).toString());
                params.append('year', currentDate.getFullYear().toString());
                const res = await axiosPrivate.get(`/assignments/get-by-month-year?${params.toString()}`);
                setEvents(res.data.data);
            } catch (error) {
                toast(error.response?.data?.message || 'Lỗi khi tải sự kiện');
            }
        };

        fetchEvents();
    }, [currentDate]);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const getMonthData = () => {
        const days = [];
        let currentDay = 1;

        for (let week = 0; currentDay <= daysInMonth; week++) {
            const weekDays = [];
            for (let day = 0; day < 7; day++) {
                if (week === 0 && day < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1)) {
                    weekDays.push(null);
                } else if (currentDay <= daysInMonth) {
                    weekDays.push(currentDay++);
                } else {
                    weekDays.push(null);
                }
            }
            days.push(weekDays);
        }
        return days;
    };

    const getEventsForDate = (day) => {
        return events.filter(event => {
            const eventDate = new Date(event.endDate);
            return (
                eventDate.getDate() === day &&
                eventDate.getMonth() === currentDate.getMonth() &&
                eventDate.getFullYear() === currentDate.getFullYear()
            );
        });
    };

    const navigateMonth = (direction) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction));
    };

    return (
        <div className='bg-white mx-4 rounded-md'>


            <Box sx={{ p: 2, fontFamily: `'Inter', sans-serif` }}>
                <Box mb={1}>
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">Lịch</h2>
                    <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                        <IconButton size="small" onClick={() => navigateMonth(-1)}>
                            <ChevronLeft fontSize="small" />
                        </IconButton>
                        <Typography variant="subtitle1" fontWeight="bold">
                            Tháng {currentDate.getMonth() + 1} / {currentDate.getFullYear()}
                        </Typography>
                        <IconButton size="small" onClick={() => navigateMonth(1)}>
                            <ChevronRight fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
             

                <Grid container spacing={1} mb={1}>
                    {weekDays.map(day => (
                        <Grid item xs={1.7} key={day}>
                            <div className="text-center text-sm font-semibold text-slate-600">
                                {day}
                            </div>
                        </Grid>
                    ))}
                </Grid>

                {getMonthData().map((week, weekIdx) => (
                    <Grid container spacing={1} key={weekIdx}>
                        {week.map((day, dayIdx) => {
                            const today = new Date();
                            const isToday =
                                day === today.getDate() &&
                                currentDate.getMonth() === today.getMonth() &&
                                currentDate.getFullYear() === today.getFullYear();

                            return (
                                <Grid item xs={1.7} sx={{ py: 1 }} key={dayIdx}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            minHeight: 90,
                                            p: 0.5,
                                            bgcolor: isToday ? '#e3f2fd' : 'transparent',
                                            borderColor: isToday ? 'primary.light' : 'divider',
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            fontWeight={isToday ? 'bold' : 'light'}
                                            color={isToday ? 'primary.main' : 'text.secondary'}
                                            sx={{
                                                display: 'block',
                                                fontSize: '0.8rem',
                                            }}
                                        >
                                            {day}
                                        </Typography>

                                        {day &&
                                            getEventsForDate(day).map(event => (
                                                <Typography
                                                    key={event.id}
                                                    variant="caption"
                                                    sx={{
                                                        display: 'block',
                                                        color: 'primary.main',
                                                        fontSize: '0.75rem',
                                                        mt: 0.3,
                                                        lineHeight: 1.2,
                                                    }}
                                                    noWrap
                                                >
                                                    <Link to={`/submission/${event.courseId}/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        • {event.courseName} - {event.title}
                                                    </Link>
                                                </Typography>
                                            ))}
                                    </Paper>
                                </Grid>
                            );
                        })}
                    </Grid>
                ))}
            </Box>
        </div>
    );
}
