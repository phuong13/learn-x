import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, IconButton, TextField, Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

export default function FormAssignment({
    open,
    onClose,
    defaultData = {},
    isEdit = false,
    onSubmit,
    moduleId,
}) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            if (isEdit && defaultData) {
                setTitle(defaultData.title || '');
                setContent(defaultData.content || '');
                setStartDate(defaultData.startDate ? dayjs(defaultData.startDate) : null);
                setEndDate(defaultData.endDate ? dayjs(defaultData.endDate) : null);
            } else {
                setTitle('');
                setContent('');
                setStartDate(null);
                setEndDate(null);
            }
            setErrors({});
        }
    }, [open, isEdit, defaultData]);

    const validate = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = 'Tiêu đề không được để trống';
        if (!content.trim()) newErrors.content = 'Nội dung không được để trống';
        if (!startDate) newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
        if (!endDate) newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
        else if (startDate && endDate.isBefore(startDate)) newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        const assignmentData = {
            ...(isEdit && defaultData.id ? { id: defaultData.id } : {}),
            title: title.trim(),
            content: content.trim(),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            state: 'OPEN',
            moduleId,
        };

        onSubmit?.(assignmentData);
        onClose?.();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {isEdit ? 'Chỉnh sửa bài tập' : 'Tạo bài tập'}
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <TextField
                    label="Tiêu đề"
                    fullWidth
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={!!errors.title}
                    helperText={errors.title}
                />

                <TextField
                    label="Nội dung"
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    error={!!errors.content}
                    helperText={errors.content}
                />

                <DateTimePicker
                    label="Ngày bắt đầu"
                    value={startDate}
                    onChange={(value) => setStartDate(value)}
                    format="DD/MM/YYYY HH:mm"
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            margin: 'normal',
                            error: !!errors.startDate,
                            helperText: errors.startDate,
                        }
                    }}
                    ampms={false}
                />

                <DateTimePicker
                    label="Ngày kết thúc"
                    value={endDate}
                    onChange={(value) => setEndDate(value)}
                    format="DD/MM/YYYY HH:mm"
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            margin: 'normal',
                            error: !!errors.endDate,
                            helperText: errors.endDate,
                        }
                    }}
                    ampms={false}
                />

            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    {isEdit ? 'Cập nhật' : 'Tạo'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
