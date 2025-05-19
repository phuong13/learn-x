import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';

import { axiosPrivate } from '../axios/axios';
import Loader from './Loader';

const CreateCourseForm = ({ onSubmitSuccess }) => {
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axiosPrivate.get('/categories')
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  const handleCategoryChange = (e) => {
    setShowNewCategory(e.target.value === 'new');
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    const formElements = e.target.elements;
    const courseInfo = {
      name: formElements.courseName.value,
      description: formElements.description.value,
      startDate: startDate,
      categoryName:
        formElements.category.value === 'new'
          ? formElements.newCategory.value
          : formElements.category.value,
      state: formElements.state.value,
    };

    formData.append(
      'courseInfo',
      new Blob([JSON.stringify(courseInfo)], {
        type: 'application/json',
      })
    );

    const thumbnail = formElements.thumbnail.files[0];
    if (thumbnail) formData.append('thumbnail', thumbnail);

    try {
      const response = await axiosPrivate.post('/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        toast(response.data.message);
        const data = response.data.data;
        localStorage.setItem('courseInfo', JSON.stringify(data));
        onSubmitSuccess();
      } else {
        toast(response.data.message, { type: 'error' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast(error.response?.data?.message || 'Error occurred', {
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassName =
    'mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}
   >
      <div className="px-4 sm:px-6 lg:px-8">
        <Loader isLoading={isLoading} />
        <div className="mx-4 border border-slate-300 rounded-lg ">
          <form
            onSubmit={handleOnSubmit}
            className="bg-white shadow-xl rounded-lg overflow-hidden"
          >
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold text-center text-slate-8 00 mb-8">
                Tạo khóa học mới
              </h2>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Danh mục
                  </label>
                  <select
                    id="category"
                    name="category"
                    onChange={handleCategoryChange}
                    defaultValue=""
                    className={inputClassName}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                    <option value="new">Thêm danh mục mới</option>
                  </select>
                </div>

                {showNewCategory && (
                  <div>
                    <label
                      htmlFor="newCategory"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Tên danh mục mới
                    </label>
                    <input
                      id="newCategory"
                      name="newCategory"
                      type="text"
                      placeholder="Nhập tên danh mục mới"
                      className={inputClassName}
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="courseName"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Tên khóa học
                  </label>
                  <input
                    id="courseName"
                    name="courseName"
                    type="text"
                    placeholder="Nhập tên khóa học"
                    className={inputClassName}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Mô tả
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    placeholder="Nhập mô tả khóa học"
                    className={inputClassName}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Ngày bắt đầu
                  </label>
                  <DatePicker
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    inputFormat="dd-MM-yyyy"
                    className='w-full rounded-xl'
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        fullWidth
                        size="medium"
                        className="bg-slate-100 rounded-md shadow-sm"
                      />
                    )}
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Trạng thái
                  </label>
                  <select
                    id="state"
                    name="state"
                    defaultValue="OPEN"
                    className={inputClassName}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="thumbnail"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Ảnh nền
                  </label>
                  <input
                    id="thumbnail"
                    name="thumbnail"
                    type="file"
                    accept="image/*"
                    className={`${inputClassName} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primaryDark file:text-white`}
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 text-right">
              <button
                type="submit"
                className="py-3 w-full px-6 bg-primaryDark text-white rounded-lg hover:bg-secondary transition-colors"
              >
                Tạo khóa học
              </button>
            </div>
          </form>
        </div>
      </div>
    </LocalizationProvider>
  );
};

CreateCourseForm.propTypes = {
  onSubmitSuccess: PropTypes.func.isRequired,
};

export default CreateCourseForm;
