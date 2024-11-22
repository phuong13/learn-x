import { useState, useEffect } from 'react';
import StudentRegisteredList from '@components/StudentRegisteredList.jsx';
import { axiosPrivate } from '../axios/axios.js';
import { useParams } from 'react-router-dom';
import { useAuth } from '@contexts/auth/useAuth.js';

const StudentRegisteredLayout = () => {
    const [students, setStudents] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({
        totalPages: 0,
        totalElements: 0,
        numberOfElements: 0,
        pageNumber: 0,
        pageSize: 0,
    });

    const { authUser } = useAuth();

    const [ showModal, setShowModal ] = useState(false);

    const { courseId } = useParams();

    const fetchStudents = async (page) => {
        try {

            const pageable ={
                page: page,
                size: 10,
            }
            const response = await axiosPrivate.get(`course-registrations/course/${courseId}?page=${pageable.page}&size=${pageable.size}`);
            const data = response.status === 200 ? response.data : null;
            if (data.success) {
                setStudents(data.data.content);
                setPaginationInfo({
                    totalPages: data.data.totalPages,
                    totalElements: data.data.totalElements,
                    numberOfElements: data.data.numberOfElements,
                    pageNumber: data.data.pageable.pageNumber,
                    pageSize: data.data.pageable.pageSize,
                });
            } else {
                console.error('Failed to fetch students:', data.message);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    useEffect(() => {
        fetchStudents(0);
    }, []);

    const handlePageChange = (newPage) => {
        fetchStudents(newPage);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <StudentRegisteredList
                students={students}
                paginationInfo={paginationInfo}
                onPageChange={handlePageChange}
            />

            {
                authUser.role === 'TEACHER' && (
                    <button
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => setShowModal(true)}
                    >
                        Add Student
                    </button>
                )
            }
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded">
                        <h2 className="text-xl mb-4">Add Student</h2>
                        {/* Add form fields here */}
                        <button
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() => setShowModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
)
    ;
};

export default StudentRegisteredLayout;

