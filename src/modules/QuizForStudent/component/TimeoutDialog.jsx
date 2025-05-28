import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const TimeoutDialog = ({ open }) => {
    const navigate = useNavigate();
    const { courseId, quizId } = useParams();

    const handleOk = () => {
        navigate(`/quiz/${courseId}/${quizId}`);
    };

    return (
        <Dialog
            open={open}
            disableEscapeKeyDown
            BackdropProps={{
                style: {
                    backdropFilter: 'blur(4px)', // 👈 Làm mờ nền
                    backgroundColor: 'rgba(0, 0, 0, 0.3)' // 👈 Tăng độ mờ tối
                }
            }}
        >
            <DialogTitle>⏰ Hết giờ làm bài</DialogTitle>
            <DialogContent>
                <Typography>Bạn đã hết thời gian làm bài. Hệ thống sẽ chuyển bạn về trang quiz.</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleOk} color="primary" autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TimeoutDialog;
