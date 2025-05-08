import { useEffect, useRef, useState } from 'react';
import { CalendarIcon, Edit, Trash2 } from 'lucide-react';
import CourseContent from '../components/CourseContent.jsx';
import StudentRegisteredLayout from '../components/StudentRegisteredLayout.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosPrivate } from '@/axios/axios.js';
import { useAuth } from '@hooks/useAuth.js';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CourseGradeChart from '../components/CourseGradeChart.jsx';
import GradeTable from '@components/GradeTable.jsx';
import { useTranslation } from 'react-i18next';
import { use } from 'react';
export default function CoursePageLayout() {
    const [selectedTab, setSelectedTab] = useState(0);
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [teacher, setTeacher] = useState(null);
    const [isOpenEditCourseInfoModal, setIsOpenEditCourseInfoModal] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [categories, setCategories] = useState([]);
    const datePickerRef = useRef(null);
    const { authUser } = useAuth();

    const [startDate, setStartDate] = useState(new Date());
    const [courseName, setCourseName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const navigate = useNavigate();
    const { courseId } = useParams();
    const { t } = useTranslation();
    const tabs = [
        t('tabs.courses'),
        t('tabs.members'),
        t('tabs.scores')
    ];
    const inputClassName =
        'mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';
    const [newCategory, setNewCategory] = useState('');
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setShowNewCategory(e.target.value === 'new');
    };
    const handleDateSelect = (date) => setStartDate(date);
    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosPrivate.get(`courses/${courseId}`);
            if (response.status === 200) {
                setCourse(response.data.data);
                setCourseName(response.data.data.name);
                setDescription(response.data.data.description);
                setCategory(response.data.data.categoryId);
                setStartDate(new Date(response.data.data.startDate));
            }
            const teacherResponse = await axiosPrivate.get(`courses/${courseId}/teacher`);
            if (teacherResponse.status === 200) {
                setTeacher(teacherResponse.data.data);
            }
        };
        fetchData();
    }, [courseId]);

    useEffect(() => {
        setIsLoading(true);
        const fetchModules = async () => {
            setIsLoading(true);
            try {
                const response = await axiosPrivate.get(`courses/${courseId}/modules`);
                setModules(response.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchModules();
    }, [courseId]);

    useEffect(() => {
        axiosPrivate
            .get('/categories')
            .then((res) => {
                setCategories(res.data.data);
                const categoryInCate = categories.find((category) => category.id === course.categoryId);
                setCategory(categoryInCate.name);
            })
            .catch((err) => console.error('Failed to fetch categories:', err));
    }, [isOpenEditCourseInfoModal]);

    const handleDeleteCourse = async () => {
        try {
            const response = await axiosPrivate.delete(`courses/${courseId}`);
            if (response.status === 200) {
                setIsConfirmDialogOpen(false);
                navigate('/my-course');
                toast(response.data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const renderContentForTab = () => {
        switch (selectedTab) {
            case 0:
                return (
                    <div className="p-4">
                        <div className="text-xl font-bold mb-2">{t('course_content')}</div>
                        <CourseContent />
                    </div>
                );
            case 1:
                return (
                    <div className="p-4">
                        <div className="text-xl font-bold mb-2">{t('student_list')}</div>
                        <StudentRegisteredLayout />
                    </div>
                );
            case 2:
                return (
                    <div className="p-4">
                        <div className="text-xl font-bold mb-2">{t('grades')}</div>
                        {authUser.role === 'TEACHER' && <CourseGradeChart courseId={courseId} />}
                        {authUser.role === 'STUDENT' && <GradeTable courseId={courseId} />}
                    </div>
                );
          
            default:
                return null;
        }
    };

    const handleSaveCourseInfo = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const formElements = e.target.elements;

        const params = new URLSearchParams();
        params.append('name', courseName);
        params.append('description', description);
        params.append(
            'categoryName',
            formElements.category.value === 'new' ? formElements.newCategory.value : formElements.category.value,
        );
        params.append('startDate', startDate);
        params.append('state', formElements.state.value);
        const urlParams = params.toString();

        const thumbnail = formElements.thumbnail.files[0];
        if (thumbnail) formData.append('thumbnail', thumbnail);

        try {
            const response = await axiosPrivate.patch(`/courses/${courseId}?${urlParams}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.status === 200) {
                toast(response.data.message);
                navigate(0);
            } else {
                toast(response.data.message, { type: 'error' });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast(error.response.data.message, { type: 'error' });
        } finally {
            setIsOpenEditCourseInfoModal(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-[calc(100vh-193px)]">
            <div className="relative h-48 bg-emerald-200 overflow-hidden">
                <img
                    src={course?.thumbnail}
                    alt="Online learning illustration"
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="bg-primaryDark text-white px-4 py-2 rounded-lg text-sm font-semibold mb-2">
                        <nav aria-label="breadcrumb">
                            <ol className="flex items-center space-x-2 text-sm">
                                <li>
                                    <a href="/" className="text-white hover:underline">
                                        {t('home_page')}
                                    </a>
                                </li>
                                <li>
                                    <span className="mx-2 text-gray-300">/</span>
                                </li>
                                <li>
                                    <a href="/my-course" className="text-white hover:underline">
                                        {t('my_courses')}
                                    </a>
                                </li>
                                <li>
                                    <span className="mx-2 text-gray-300">/</span>
                                </li>
                                <li className="text-gray-200">{course?.name || 'Đang tải...'}</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-2">
                        {authUser?.role === 'TEACHER' && (
                            <button
                                onClick={() => setIsOpenEditCourseInfoModal(true)}
                                className="bg-primaryDark text-white bg-red-500 hover:bg-red-700 p-2 rounded-full">
                                <Edit className="h-4 w-4" />
                            </button>
                        )}

                        {authUser?.role === 'TEACHER' && (
                            <button
                                onClick={() => setIsConfirmDialogOpen(true)}
                                className="bg-primaryDark text-white bg-red-500 hover:bg-red-700 p-2 rounded-full">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
                {teacher && (
                    <div className="absolute bottom-4 left-4 text-white bg-primaryDark px-4 py-2 rounded-lg text-sm font-semibold">
                        {t('teacher')}: {teacher.fullName}
                    </div>
                )}
            </div>

            <nav className="bg-white border-b px-4">
                <ul className="flex">
                    {tabs.map((item, index) => (
                        <li key={index} >
                            <button
                                onClick={() => setSelectedTab(index)}
                                className={`block px-4 py-2 text-sm font-semibold ${selectedTab === index ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
                                    }`}>
                                {item}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="my-4 px-4 mx-4 bg-white rounded-lg shadow-lg overflow-hidden">
                {renderContentForTab()}
            </div>

            {isConfirmDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                    <div className="bg-white p-6 rounded-lg">
                        {/*<h2 className="text-xl font-bold mb-4">Xác nhận</h2>*/}
                        <p className="mb-4">
                            Xác nhận xóa khóa học? <br />
                            (Hành động này không thể quay lại)
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="py-2 px-2 w-full bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors"
                                onClick={() => setIsConfirmDialogOpen(false)}>
                                Không
                            </button>
                            <button
                                className="py-2 px-2 w-full bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors"
                                onClick={handleDeleteCourse}>
                                Có
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isOpenEditCourseInfoModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 ">
                    <form
                        onSubmit={handleSaveCourseInfo}
                        className="bg-white shadow-xl rounded-lg w-full mx-96 max-h-[80vh] overflow-y-auto">
                        <div className="px-6 py-8">
                            <div className="text-2xl font-bold text-center text-gray-800 mb-8">
                                Chỉnh sửa thông tin khóa học
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-1">
                                        Danh mục
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        onChange={handleCategoryChange}
                                        value={category}
                                        className={inputClassName}>
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
                                            className="block text-sm font-bold text-gray-700 mb-1">
                                            Tên danh mục mới
                                        </label>
                                        <input
                                            id="newCategory"
                                            name="newCategory"
                                            type="text"
                                            placeholder="Nhập tên danh mục mới"
                                            className={inputClassName}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label
                                        htmlFor="courseName"
                                        className="block text-sm font-bold text-gray-700 mb-1">
                                        Tên khóa học
                                    </label>
                                    <input
                                        id="courseName"
                                        name="courseName"
                                        type="text"
                                        placeholder="Nhập tên khóa học"
                                        className={inputClassName}
                                        required
                                        value={courseName}
                                        onChange={(e) => setCourseName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-bold text-gray-700 mb-1">
                                        Mô tả
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        placeholder="Nhập mô tả khóa học"
                                        className={inputClassName}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-bold text-gray-700 mb-1">
                                        Ngày bắt đầu
                                    </label>
                                    <div
                                        className="mt-1 relative w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        onClick={() => datePickerRef.current.setOpen(true)}>
                                        <DatePicker
                                            id="startDate"
                                            name="startDate"
                                            selected={startDate}
                                            onChange={handleDateSelect}
                                            dateFormat="yyyy-MM-dd"
                                            required
                                            ref={datePickerRef}
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="state" className="block text-sm font-bold text-gray-700 mb-1">
                                        Trạng thái
                                    </label>
                                    <select id="state" name="state" defaultValue="OPEN" className={inputClassName}>
                                        <option value="OPEN">OPEN</option>
                                        <option value="CLOSED">CLOSED</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="thumbnail" className="block text-sm font-bold text-gray-700 mb-1">
                                        Ảnh nền
                                    </label>
                                    <input
                                        id="thumbnail"
                                        name="thumbnail"
                                        type="file"
                                        accept="image/*"
                                        className={`${inputClassName} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                                        file:text-sm file:font-semibold file:bg-primaryDark file:text-white`}
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
                                    {!selectedImage && (
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
                        </div>
                        <div className="flex justify-end">
                            <div className="m-2 text-right">
                                <button
                                    onClick={() => setIsOpenEditCourseInfoModal(false)}
                                    className="py-2 px-4 w-full bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors">
                                    Hủy
                                </button>
                            </div>

                            <div className="m-2 text-right">
                                <button
                                    type="submit"
                                    className="py-2 px-4 w-full bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors">
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
