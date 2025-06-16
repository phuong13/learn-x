import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

export default function EditCourseInfoModal({
    open,
    onClose,
    onSubmit,
    courseName,
    setCourseName,
    code,
    setCode,
    description,
    setDescription,
    startDate,
    handleDateSelect,
    selectedImage,
    handleImageChange,
    course,
    isSubmitting,
    outcomes,
    setOutcomes
}) {


    // Hàm xử lý outcomes
    const handleOutcomeChange = (index, field, value) => {
        const newOutcomes = [...outcomes];
        newOutcomes[index][field] = value;
        setOutcomes(newOutcomes);
    };

   
    const removeOutcome = (index) => {
        if (outcomes.length > 1) {
            const newOutcomes = outcomes.filter((_, i) => i !== index);
            setOutcomes(newOutcomes);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth sx={{'& .MuiDialog-paper': { padding: 2, borderRadius: 4 }}}>
            <DialogTitle className="text-2xl font-bold text-center text-slate-800">
                Chỉnh sửa thông tin khóa học
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
            <form onSubmit={onSubmit}>
                <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <div className="space-y-6">
                        {/* Course Code - Disabled */}
                        <TextField
                            fullWidth
                            label="Mã khóa học"
                            id="code"
                            name="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            disabled={true}
                            helperText="Mã khóa học không thể thay đổi"
                            sx={{
                                '& .MuiInputBase-input.Mui-disabled': {
                                    backgroundColor: '#f5f5f5',
                                    color: '#666',
                                }
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Tên khóa học"
                            id="courseName"
                            name="courseName"
                            required
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                        />
                        
                        <TextField
                            fullWidth
                            label="Mô tả"
                            id="description"
                            name="description"
                            multiline
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Ngày bắt đầu"
                                value={startDate}
                                onChange={handleDateSelect}
                                renderInput={(params) => (
                                    <TextField fullWidth required {...params} />
                                )}
                            />
                        </LocalizationProvider>

                        {/* Outcomes Section */}
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                Chuẩn đầu ra (Learning Outcomes)
                               
                            </Typography>
                            
                            {outcomes?.map((outcome, index) => (
                                <Card key={index} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={3}>
                                                        <TextField
                                                            fullWidth
                                                            label={`Mã chuẩn đầu ra ${index + 1}`}
                                                            value={outcome.code}
                                                            onChange={(e) => handleOutcomeChange(index, 'code', e.target.value)}
                                                            placeholder="Ví dụ: CLO1, PLO2"
                                                            size="small"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={9}>
                                                        <TextField
                                                            fullWidth
                                                            label="Mô tả chuẩn đầu ra"
                                                            value={outcome.description}
                                                            onChange={(e) => handleOutcomeChange(index, 'description', e.target.value)}
                                                            placeholder="Mô tả chi tiết về chuẩn đầu ra này"
                                                            multiline
                                                            rows={2}
                                                            size="small"
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                            {outcomes.length > 1 && (
                                                <IconButton
                                                    onClick={() => removeOutcome(index)}
                                                    color="error"
                                                    size="small"
                                                    type="button"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>

                        <div>
                            <InputLabel htmlFor="thumbnail">Ảnh nền</InputLabel>
                            <input
                                id="thumbnail"
                                name="thumbnail"
                                type="file"
                                accept="image/*"
                                style={{ marginTop: 8 }}
                                onChange={handleImageChange}
                            />
                            {selectedImage && (
                                <div className="w-max img-wrapper block mx-auto mt-4">
                                    <img
                                        src={selectedImage}
                                        alt="Selected"
                                        className="max-w-xs h-auto rounded-lg"
                                    />
                                </div>
                            )}
                            {!selectedImage && course?.thumbnail && (
                                <div className="w-max img-wrapper block mx-auto mt-4">
                                    <img
                                        src={course?.thumbnail}
                                        alt="Selected"
                                        className="max-w-xs h-auto rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="inherit" variant="contained">
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isSubmitting ? 'Đang lưu...' : 'Chỉnh sửa'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}