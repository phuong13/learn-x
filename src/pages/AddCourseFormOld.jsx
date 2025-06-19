import { useState, useEffect } from 'react';
import DocumentTitle from '../components/DocumentTitle';
import CreateCourseFromOld from '@components/CreateCourseFromOld.jsx';
import { getCourses } from '../store/useCourses';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Box,
    Button, Radio, RadioGroup, FormControlLabel, List, ListItem, ListItemText,
    CircularProgress, Typography, TextField
} from '@mui/material';

const AddCourseFormOld = () => {
    const { courses, loading, error } = getCourses();
    const [open, setOpen] = useState(true);
    const [selectedId, setSelectedId] = useState(undefined);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!loading && courses && courses.length > 0 && selectedId === undefined) {
            setSelectedId(courses[0].id);
        }
    }, [loading, courses, selectedId]);

    const handleChoose = () => {
        const found = courses?.find(c => c.id === selectedId);
        setSelectedCourse(found);
        setOpen(false);
    };

    const filteredCourses = courses?.filter(course =>
        course.name.toLowerCase().includes(search.toLowerCase()) ||
        course.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <DocumentTitle title="Thêm từ khoá học cũ" />
           {open && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(128, 128, 128, 0.8)',
          zIndex: 1299, // Thấp hơn Dialog một chút
        }}
      />
    )}
            <Dialog
                open={open}
                maxWidth="sm"
                fullWidth
                BackdropProps={{
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.6)' // nền tối phía sau
                    }
                }}
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                        height: 600,
                        maxHeight: '90vh'
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #5BCEC9 0%, #14919B 100%)',
                    color: 'white',
                    p: 1,
                    textAlign: 'center',
                    borderRadius: '16px 16px 0 0',
                }}>Chọn khoá học cũ</DialogTitle>

                <DialogContent>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Typography color="error">Lỗi tải danh sách khoá học</Typography>
                    ) : (courses && courses.length > 0) ? (
                        <>
                            <TextField
                                label="Tìm kiếm khoá học"
                                variant="outlined"
                                fullWidth
                                size="small"
                                sx={{ my: 2 }}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <RadioGroup
                                value={selectedId}
                                onChange={e => setSelectedId(Number(e.target.value))}
                            >
                                <List>
                                    {filteredCourses.map((course, index) => (
                                        <ListItem
                                            key={course.id}
                                            disablePadding
                                            sx={{
                                                backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                                            }}
                                        >
                                            <FormControlLabel
                                                value={course.id}
                                                control={<Radio />}
                                                label={
                                                    <ListItemText
                                                        primary={course.name}
                                                        secondary={course.code}
                                                    />
                                                }
                                                sx={{ width: '100%', m: 0, pl: 1 }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </RadioGroup>
                        </>
                    ) : (
                        <Typography color="text.secondary">Không có khoá học nào để chọn.</Typography>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => window.history.back()}
                        sx={{
                            width: '25%',
                            color: '#555',
                            border: '1px solid #ccc',
                            p: 1,
                            background: '#ccc'
                        }}
                    >
                        Huỷ
                    </Button>
                    <Button
                        onClick={handleChoose}
                        disabled={loading || !selectedId}
                        sx={{
                            width: '25%',
                            background: 'linear-gradient(135deg, #5BCEC9 0%, #14919B 100%)',
                            color: 'white',
                            p: 1
                        }}
                    >
                        Chọn
                    </Button>
                </DialogActions>
            </Dialog>

            <div className="min-h-[calc(100vh-170px)]  shadow-sm m-4 rounded-lg">
                <h2 className="text-xl font-bold text-slate-700 pl-6 py-6">Thêm từ khoá học cũ</h2>
                {selectedCourse && <CreateCourseFromOld oldCourse={selectedCourse} />}
            </div>
        </>
    );
};

export default AddCourseFormOld;
