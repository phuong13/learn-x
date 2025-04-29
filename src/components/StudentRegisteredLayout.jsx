import { useState, useEffect } from 'react';
import StudentRegisteredList from '@components/StudentRegisteredList.jsx';
import { axiosPrivate } from '../axios/axios.js';
import { useParams } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth.js';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { X } from 'lucide-react';
import readXlsxFile from 'read-excel-file';
import { toast } from 'react-toastify';

const StudentRegisteredLayout = () => {
    const [students, setStudents] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({
        totalPages: 0,
        totalElements: 0,
        numberOfElements: 0,
        pageNumber: 0,
        pageSize: 0,
    });

    const [emailList, setEmailList] = useState([]);

    const { authUser } = useAuth();

    const [showModal, setShowModal] = useState(false);
    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const { courseId } = useParams();

    const fetchStudents = async (page) => {
        try {
            const pageable = {
                page: page,
                size: 5,
            };
            const response = await axiosPrivate.get(
                `course-registrations/course/${courseId}?page=${pageable.page}&size=${pageable.size}`,
            );
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

    const handleReadFile = (e) => {
        const file = e.target.files[0];
        const emails = [];

        readXlsxFile(file)
            .then((rows) => {
                const headers = rows[0];
                const emailIndex = headers.indexOf('Email');
                const mssvIndex = headers.indexOf('MSSV');

                if (emailIndex !== -1 && mssvIndex !== -1) {
                    for (let i = 1; i < rows.length; i++) {
                        const columns = rows[i];
                        if (columns[emailIndex]) {
                            emails.push(columns[emailIndex].toString().trim());
                        } else if (columns[mssvIndex]) {
                            emails.push(`${columns[mssvIndex].toString().trim()}@student.hcmute.edu.vn`);
                        }
                    }
                }
                setEmailList((prevEmailList) => [...prevEmailList, ...emails]);
            })
            .catch((error) => {
                console.error('Error reading file:', error);
            });
    };

    const handleTextareaChange = (e) => {
        const value = e.target.value;
        setEmailList(value.split('\n'));
    };

    const handleSumbit = async () => {
        const textArea = document.querySelector('textarea');
        const value = textArea.value;
        const emails = value
            .split('\n')
            .map((email) => email.trim())
            .filter((email) => email);
        setEmailList(emails);
        const uniqueEmails = [...new Set(emailList)];
        setEmailList(uniqueEmails);
        console.log(uniqueEmails);
        const response = await axiosPrivate.post(`/course-registrations/register/${courseId}/list-email`, {
            emails: uniqueEmails,
        });
        console.log(response);
        if (response.status === 200) {
            await fetchStudents(0);
            handleClose();
            toast(response.data.message);
        } else {
            toast(response.data.message, { type: 'error' });
        }
    };

    const handleDeleteStudent = async (students) => {
        console.log(students);
        const response = await axiosPrivate.post(`/course-registrations/remove/${courseId}/list-email`, {
            emails: students,
        });
        console.log(response);
        if (response.status === 200) {
            await fetchStudents(0);
            toast(response.data.message);
        } else {
            toast(response.data.message, { type: 'error' });
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-end items-center mb-4">
            {authUser.role === 'TEACHER' && (
                <button className="mb-4 p-2 bg-primaryDark text-white rounded-lg" onClick={handleOpen}>
                    Thêm sinh viên
                </button>
            )}
            </div>
            <StudentRegisteredList
                totalStudents={paginationInfo.totalElements}
                students={students}
                paginationInfo={paginationInfo}
                onPageChange={handlePageChange}
                onDeleteStudents={handleDeleteStudent}
            />

            
            <Dialog open={showModal} onClose={handleClose} maxWidth="sm" fullWidth hideBackdrop={false}>
                <div className="relative bg-white rounded-lg shadow-xl">
                    <DialogTitle className="text-xl font-bold mb-4">Thêm sinh viên</DialogTitle>
                    <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                        <span className="sr-only">Đóng</span>
                    </button>
                    <DialogContent>
                        <div className="mt-2 space-y-4">
                            <input
                                type="file"
                                onChange={handleReadFile}
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <textarea
                                placeholder="Student Details"
                                className="w-full p-2 border border-gray-300 rounded resize-none h-32"
                                value={emailList.join('\n')}
                                onChange={handleTextareaChange}></textarea>
                            <button
                                onClick={handleSumbit}
                                className="btn btn--primary w-full font-bold py-2 px-4 rounded">
                                Gửi
                            </button>
                        </div>
                    </DialogContent>
                </div>
            </Dialog>
        </div>
    );
};

export default StudentRegisteredLayout;
