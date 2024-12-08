import { useState, useEffect, useRef } from 'react';

import DatePicker from 'react-datepicker';
import { axiosPrivate } from '../axios/axios';
import Loader from './Loader';
import { CalendarIcon } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

const CreateCourseForm = ({onSubmitSuccess}) => {
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const datePickerRef = useRef(null); // Create a ref for the DatePicker

  useEffect(() => {
    axiosPrivate.get('/categories')
        .then((res) => setCategories(res.data.data))
        .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  const handleCategoryChange = (e) => setShowNewCategory(e.target.value === 'new');

  const handleDateSelect = (date) => setStartDate(date);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    const formElements = e.target.elements;
    const courseInfo = {
      name: formElements.courseName.value,
      description: formElements.description.value,
      startDate: startDate,
      categoryName: formElements.category.value === 'new' ? formElements.newCategory.value : formElements.category.value,
      state: formElements.state.value,
    };

    formData.append('courseInfo', new Blob([JSON.stringify(courseInfo)], { type: 'application/json' }));

    const thumbnail = formElements.thumbnail.files[0];
    if (thumbnail) formData.append('thumbnail', thumbnail);

    try {
      const response = await axiosPrivate.post('/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.status === 200) {
        toast(response.data.message);
        const data = response.data.data;
        console.log('Course created:', data);
        localStorage.setItem('courseInfo', JSON.stringify(data));
        onSubmitSuccess();
      } else {
        toast(response.data.message, { type: 'error' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast(error.response.data.message, { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassName = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

  return (
      <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
        <Loader isLoading={isLoading} />
        <div className="max-w-md mx-auto">
          <form onSubmit={handleOnSubmit} className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Tạo khóa học mới</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
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
                      <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bắt đầu
                  </label>
                  <div
                      className="mt-1 relative w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onClick={() => datePickerRef.current.setOpen(true)} // Open DatePicker on click
                  >
                    <DatePicker
                        id="startDate"
                        name="startDate"
                        selected={startDate}
                        onChange={handleDateSelect}
                        dateFormat="yyyy-MM-dd"
                        required
                        ref={datePickerRef} // Attach ref to DatePicker
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                    Ảnh nền
                  </label>
                  <input
                      id="thumbnail"
                      name="thumbnail"
                      type="file"
                      accept="image/*"
                      className={`${inputClassName} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#02a189] file:text-white`}
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 text-right">
              <button
                  type="submit"
                  className={`btn btn--primary w-full hover:scale-[1.01] ease-in-out active:scale-[.98] active:duration-75 translate-all`}
              >
                Thêm khóa học
              </button>
            </div>

          </form>
        </div>
      </div>
  );
};

CreateCourseForm.propTypes = {
  onSubmitSuccess: PropTypes.func.isRequired,
};

export default CreateCourseForm;
