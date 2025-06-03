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
import { Link } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import Loader from '../components/Loader.jsx';
import EditCourseInfoModal from '../components/EditCourseInfoModal';
import { to } from '@react-spring/web';


export default function CoursePageLayout() {
    const [selectedTab, setSelectedTab] = useState(0);
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [teacher, setTeacher] = useState(null);
    const [isOpenEditCourseInfoModal, setIsOpenEditCourseInfoModal] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [categories, setCategories] = useState([]);
    const datePickerRef = useRef(null);
    const { authUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        'mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';
    const [newCategory, setNewCategory] = useState('');
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setShowNewCategory(e.target.value === 'new');
    };
    const handleDateSelect = (date) => setStartDate(date);
    useEffect(() => {
        const fetchData = async () => {
            try {
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
            } catch (err) {
                console.error(err);
            } finally {
            }
        };
        fetchData();
    }, [courseId]);



    useEffect(() => {
        axiosPrivate
            .get('/categories')
            .then((res) => {
                setCategories(res.data.data);
                const categoryInCate = categories?.find((category) => category.id === course.categoryId);
                setCategory(categoryInCate?.name);
            })
            .catch((err) => console.error('Failed to fetch categories:', err));
    }, [isOpenEditCourseInfoModal]);

    const handleDeleteCourse = async () => {
        setIsLoading(true);
        try {
            const response = await axiosPrivate.delete(`courses/${courseId}`);
            if (response.status === 200) {
                setIsConfirmDialogOpen(false);
                navigate('/my-course');
                toast.success(response.data.message);
            }
        } catch (err) {
            toast.warning('Đã có học sinh làm bài quiz, vì vậy không được xoá môn học' )
            setIsConfirmDialogOpen(false);
        } finally {
            setIsLoading(false);
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
                        <div className="text-xl font-bold mb-2 text-slate-700">{t('course_content')}</div>
                        <CourseContent />
                    </div>
                );
            case 1:
                return (
                    <div className="p-4">
                        <div className="text-xl font-bold mb-2 text-slate-700">{t('student_list')}</div>
                        <StudentRegisteredLayout />
                    </div>
                );
            case 2:
                return (
                    <div className="p-4">
                        <div className="text-xl font-bold mb-2 text-slate-700">{t('grades')}</div>
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
        setIsSubmitting(true);
        const formData = new FormData();
        const formElements = e.target.elements;

        const params = new URLSearchParams();
        params.append('name', courseName);
        params.append('description', description);
    
        params.append('startDate', startDate);
        const urlParams = params.toString();

        const thumbnail = formElements.thumbnail.files[0];
        if (thumbnail) formData.append('thumbnail', thumbnail);

        try {
            const response = await axiosPrivate.patch(`/courses/${courseId}?${urlParams}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.status === 200) {
                toast.success(response.data.message);
                navigate(0);
            } else {
                toast.error(response.data.message, { type: 'error' });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast(error.response.data.message, { type: 'error' });
        } finally {
            setIsSubmitting(false);
            setIsOpenEditCourseInfoModal(false);
        }
    };

    return (
        <div className="bg-slate-100 min-h-[calc(100vh-193px)] flex flex-col">
            {isLoading && (
                <Loader isLoading={isLoading} />
            )}
            {<>
                <div className="relative h-48 bg-slate-200 overflow-hidden">
                    <img
                        src={course?.thumbnail}
                        alt="Online learning illustration"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <div className="bg-primaryDark text-white px-4 py-2 rounded-lg text-sm font-semibold mb-2 ">
                            <nav aria-label="breadcrumb">
                                <ol className="flex items-center space-x-2 text-sm">
                                    <li>
                                        <Link to="/" className="text-white hover:underline tru">
                                            {t('home_page')}
                                        </Link>
                                    </li>
                                    <li>
                                        <span className="mx-2 text-slate-300">/</span>
                                    </li>
                                    <li>
                                        <Link to="/my-course" className="text-white hover:underline">
                                            {t('my_courses')}
                                        </Link>
                                    </li>
                                    <li>
                                        <span className="mx-2 text-slate-300">/</span>
                                    </li>
                                    <li className="text-slate-200">{course?.name || 'Đang tải...'}</li>
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
                     
                        <div className="absolute bottom-4 left-4 text-white bg-primaryDark px-4 py-2 rounded-lg text-sm font-semibold">
                            {t('teacher')}: {teacher?.fullName ? teacher.fullName : 'Đang tải...'}
                        </div>
                    
                </div>

                <nav className="bg-white border-b px-4">
                    <ul className="flex">
                        {tabs.map((item, index) => (
                            <li key={index} >
                                <button
                                    onClick={() => setSelectedTab(index)}
                                    className={`block px-4 py-2 text-sm font-semibold ${selectedTab === index ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-600'
                                        }`}>
                                    {item}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="my-4 px-4 mx-4 bg-white rounded-lg shadow-lg overflow-hidden flex-1">
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
                    <EditCourseInfoModal
                        open={isOpenEditCourseInfoModal}
                        onClose={() => setIsOpenEditCourseInfoModal(false)}
                        onSubmit={handleSaveCourseInfo}
                        inputClassName={inputClassName}
                        categories={categories}
                        category={category}
                        handleCategoryChange={handleCategoryChange}
                        showNewCategory={showNewCategory}
                        newCategory={newCategory}
                        setNewCategory={setNewCategory}
                        courseName={courseName}
                        setCourseName={setCourseName}
                        description={description}
                        setDescription={setDescription}
                        startDate={startDate}
                        handleDateSelect={handleDateSelect}
                        datePickerRef={datePickerRef}
                        selectedImage={selectedImage}
                        handleImageChange={handleImageChange}
                        course={course}
                        isSubmitting={isSubmitting}

                    />
                )}
            </>}
        </div>
    );
}
