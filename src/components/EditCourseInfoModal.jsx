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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CircularProgress from '@mui/material/CircularProgress';

export default function EditCourseInfoModal({
    open,
    onClose,
    onSubmit,
    inputClassName,
    categories,
    category,
    handleCategoryChange,
    showNewCategory,
    newCategory,
    setNewCategory,
    courseName,
    setCourseName,
    description,
    setDescription,
    startDate,
    handleDateSelect,
    selectedImage,
    handleImageChange,
    course,
    isSubmitting
}) {

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
                <DialogContent dividers>
                    <div className="space-y-6">

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