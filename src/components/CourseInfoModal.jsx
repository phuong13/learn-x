import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function CourseInfoModal({
  open,
  onClose,
  course
}) {
  if (!course) return null;



  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
        },
      }}
    >
      <DialogTitle className="text-2xl font-bold text-center text-slate-800">
        Thông tin khóa học
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          size="large"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Mã khóa học */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Mã khóa học
                </Typography>
                <Typography variant="h6" fontWeight="">
                  {course.code || 'Chưa có'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Tên khóa học */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Tên khóa học
                </Typography>
                <Typography variant="" fontWeight="">
                  {course.name || 'Chưa có'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Ngày bắt đầu */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Ngày bắt đầu
                </Typography>
                <Typography variant="body1">
                  {course.startDate ? format(new Date(course.startDate), 'dd/MM/yyyy', { locale: vi }) : 'Chưa có'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Mô tả */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Mô tả
                </Typography>
                <Typography variant="body1">
                  {course.description || 'Chưa có mô tả'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Chuẩn đầu ra */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom sx={{ mb: 2 }}>
                  Chuẩn đầu ra
                </Typography>
                {course.outcomes && course.outcomes.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {course.outcomes.map((outcome, index) => (
                      <Chip
                        key={outcome.id || index}
                        label={`${outcome.code}: ${outcome.description}`}
                        color="primary"
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Chưa có chuẩn đầu ra nào
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}