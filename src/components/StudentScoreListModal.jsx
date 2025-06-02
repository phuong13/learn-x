import React from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from '@mui/material';
import * as XLSX from 'xlsx';

const StudentScoreListModal = ({ open, onClose, submissions, isQuiz, title }) => {
    const handleExportExcel = () => {
        const data = submissions.map((s) => {

            const score = isQuiz
                ? s.quizSubmission && s.quizSubmission.score !== null
                    ? Math.round((s.quizSubmission.score / 10) * 10) / 10
                    : ''
                : s.score !== null && s.score !== undefined
                    ? Math.round(s.score * 10) / 10
                    : '';
            const email = isQuiz
                ? s.email
                : s.studentEmail;
            return {
                Email: email,
                Điểm: score !== '' ? score : '—'
            };
        });
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Scores');
        XLSX.writeFile(workbook, `DanhSachDiem_${title}.xlsx`);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            sx={{
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(0,0,0,0.4) !important',
                },
            }}
        >
            <DialogTitle>Danh sách điểm {title}</DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Email</TableCell>
                                <TableCell align="right">Điểm</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {submissions.map((s, idx) => {
                                const score = isQuiz
                                    ? s.quizSubmission && s.quizSubmission.score !== null
                                        ? Math.round((s.quizSubmission.score / 10) * 10) / 10
                                        : ''
                                    : s.score !== null && s.score !== undefined
                                        ? Math.round(s.score * 10) / 10
                                        : '';
                                const email = isQuiz
                                    ? s.email
                                    : s.studentEmail;
                                return (
                                    <TableRow key={idx}>
                                        <TableCell>{email}</TableCell>
                                        <TableCell align="right">{score !== '' ? score : '—'}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {submissions.length === 0 && (
                    <Typography className="text-center mt-4 text-slate-500">Không có dữ liệu</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleExportExcel} variant="contained" color="primary">
                    Xuất Excel
                </Button>
                <Button onClick={onClose} variant="outlined" color="secondary">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default StudentScoreListModal;