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
  styled
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';

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

const CreateCourseForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    category: '',
    newCategory: '',
    courseName: '',
    courseCode: '',
    description: '',
    state: 'OPEN',
    thumbnail: null
  });
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axiosPrivate.get('/categories')
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

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
      state: formData.state,
    };

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
      const response = await axiosPrivate.post('/courses', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        const data = response.data.data;
        localStorage.setItem('courseInfo', JSON.stringify(data));
        onSubmitSuccess();
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
                zIndex: 1000
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
                Tạo khóa học mới
              </Typography>
            </Box>

            {/* Form Content */}
            <Box sx={{ p: 4 }}>
              <Grid container spacing={3}>
                {/* Category */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Danh mục</InputLabel>
                    <Select
                      value={formData.category}
                      label="Danh mục"
                      onChange={handleInputChange('category')}
                    >
                      <MenuItem value="">Chọn danh mục</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.name}>
                          {category.name}
                        </MenuItem>
                      ))}
                      <MenuItem value="new">Thêm danh mục mới</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* New Category */}
                <Grid item xs={12}>
                  <Collapse in={showNewCategory}>
                    <TextField
                      fullWidth
                      label="Tên danh mục mới"
                      value={formData.newCategory}
                      onChange={handleInputChange('newCategory')}
                      placeholder="Nhập tên danh mục mới"
                    />
                  </Collapse>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Mã môn học"
                    value={formData.courseCode}
                    onChange={handleInputChange('courseCode')}
                    placeholder="Ví dụ: CS101, MATH201"
                    inputProps={{ 
                      style: { textTransform: 'uppercase' } // Tự động chuyển thành chữ hoa
                    }}
                    helperText="Mã môn học nên ngắn gọn và duy nhất"
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

                {/* Start Date */}
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Ngày bắt đầu"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                      }
                    }}
                  />
                </Grid>

                {/* State */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={formData.state}
                      label="Trạng thái"
                      onChange={handleInputChange('state')}
                    >
                      <MenuItem value="OPEN">OPEN</MenuItem>
                      <MenuItem value="CLOSED">CLOSED</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Thumbnail Upload */}
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Ảnh nền
                    </Typography>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        width: '100%',
                        height: 56,
                        borderStyle: 'dashed',
                        borderWidth: 2
                      }}
                    >
                      {formData.thumbnail ? formData.thumbnail.name : 'Chọn ảnh nền'}
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
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

CreateCourseForm.propTypes = {
  onSubmitSuccess: PropTypes.func.isRequired,
};

export default CreateCourseForm;