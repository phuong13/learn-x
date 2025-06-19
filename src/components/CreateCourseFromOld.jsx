import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Collapse,
  CircularProgress,
  styled,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCourseById } from '../store/useCourses';

import { axiosPrivate } from '../axios/axios';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const CreateCourseFromOld = ({ oldCourse }) => {
  const { course, loading, error } = useCourseById(oldCourse?.id);
  const [formData, setFormData] = useState({
    category: '',
    newCategory: '',
    courseName: '',
    courseCode: '',
    description: '',
    thumbnail: null
  });
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [outcomes, setOutcomes] = useState([
    { code: '', description: '' }
  ]);

  const handleOutcomeChange = (index, field, value) => {
    const newOutcomes = [...outcomes];
    newOutcomes[index][field] = value;
    setOutcomes(newOutcomes);
  };

  const addOutcome = () => {
    setOutcomes([...outcomes, { code: '', description: '' }]);
  };

  const removeOutcome = (index) => {
    if (outcomes.length > 1) {
      const newOutcomes = outcomes.filter((_, i) => i !== index);
      setOutcomes(newOutcomes);
    }
  };

  // Fill dữ liệu từ course
  useEffect(() => {
    if (course) {
      setFormData({
        category: course.categoryName || 'Danh mục chung',
        newCategory: '',
        courseName: course.name || '',
        courseCode: course.code || '',
        description: course.description || '',
        thumbnail: null
      });
      setStartDate(course.startDate ? new Date(course.startDate) : null);
      const courseOutcomes = course?.outcomes?.map(outcome => ({
        code: outcome.code || '',
        description: outcome.description || ''
      })) || [{ code: '', description: '' }];

      setOutcomes(courseOutcomes);
    }
  }, [course]);

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'category') {
      setShowNewCategory(value === 'new');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData(prev => ({ ...prev, thumbnail: file }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formDataToSend = new FormData();
    const courseInfo = {
      name: formData.courseName,
      code: formData.courseCode,
      description: formData.description,
      startDate: startDate,
      categoryName: formData.category === 'new' ? formData.newCategory : formData.category,
      outcomes: outcomes,
      courseId: course?.id
    };
    console.log("🚀 ~ handleSubmit ~ courseInfo:", courseInfo)

    formDataToSend.append(
      'courseInfo',
      new Blob([JSON.stringify(courseInfo)], {
        type: 'application/json',
      })
    );

    if (formData.thumbnail) {
      formDataToSend.append('thumbnail', formData.thumbnail);
    }

    try {
      const response = await axiosPrivate.post('/courses/clone', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.message || 'Error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Loading Overlay */}
          {isLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress />
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #5BCEC9 0%, #14919B 100%)',
                color: 'white',
                p: 1,
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" component="h1" fontWeight="bold">
                Tạo khóa học mới từ khoá học cũ
              </Typography>
              {course && (
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  Dựa trên: <b>{course.name}</b> ({course.code})
                </Typography>
              )}
            </Box>

            {/* Form Content */}
            <Box sx={{ p: 4 }}>
              <Grid container spacing={3}>
                {/* Category */}


                {/* Course Code */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Mã môn học"
                    value={formData.courseCode}
                    onChange={handleInputChange('courseCode')}
                    inputProps={{
                      style: { textTransform: 'uppercase' }
                    }}
                  />
                </Grid>

                {/* Course Name */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Tên khóa học"
                    value={formData.courseName}
                    onChange={handleInputChange('courseName')}
                    placeholder="Nhập tên khóa học"
                  />
                </Grid>

                {/* Start Date */}
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Ngày bắt đầu"
                    value={startDate}
                    format='dd/MM/yyyy'
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      }
                    }}
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={4}
                    label="Mô tả"
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    placeholder="Nhập mô tả khóa học"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Chuẩn đầu ra
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={addOutcome}
                        sx={{ ml: 'auto' }}
                      >
                        Thêm chuẩn đầu ra
                      </Button>
                    </Typography>
                    {outcomes.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Không có chuẩn đầu ra
                      </Typography>
                    )}
                    {outcomes.map((outcome, index) => (
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
                                    onChange={e => handleOutcomeChange(index, 'code', e.target.value)}
                                    placeholder="Ví dụ: CLO1, PLO2"
                                    size="small"
                                  />
                                </Grid>
                                <Grid item xs={12} md={9}>
                                  <TextField
                                    fullWidth
                                    label="Mô tả chuẩn đầu ra"
                                    value={outcome.description}
                                    onChange={e => handleOutcomeChange(index, 'description', e.target.value)}
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
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Grid>

                {/* Thumbnail Upload */}
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Ảnh nền
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      {(formData.thumbnail || course?.thumbnail) && (
                        <Box
                          sx={{
                            width: 440,
                            height: 140,
                            borderRadius: 2,
                            overflow: 'hidden',
                            border: '2px solid #e0e0e0',
                            mb: 1,
                            background: '#f8fafc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <img
                            src={
                              formData.thumbnail
                                ? URL.createObjectURL(formData.thumbnail)
                                : course?.thumbnail
                            }
                            alt="thumbnail"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block'
                            }}
                          />
                        </Box>
                      )}
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        sx={{
                          width: 240,
                          borderStyle: 'dashed',
                          borderWidth: 2,
                          borderRadius: 2,
                          background: '#fff',
                        }}
                      >
                        {formData.thumbnail ? 'Đổi ảnh khác' : 'Chọn ảnh nền'}
                        <VisuallyHiddenInput
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </Button>
                      {/* {formData.thumbnail && (
                        <Typography variant="caption" color="text.secondary">
                          {formData.thumbnail.name}
                        </Typography>
                      )} */}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                backgroundColor: '#f8fafc',
                p: 3,
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                disabled={isLoading}
                sx={{
                  minWidth: 200,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #5BCEC9 0%, #14919B 100%)',
                  boxShadow: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5BCEC9 0%, #14919B 100%)',
                    boxShadow: 4,
                  },
                  '&:disabled': {
                    background: '#ccc',
                  }
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Tạo khóa học'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

CreateCourseFromOld.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    code: PropTypes.string,
    description: PropTypes.string,
    categoryName: PropTypes.string,
    startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    thumbnail: PropTypes.string,
    outcomes: PropTypes.array,
  }),
};

export default CreateCourseFromOld;