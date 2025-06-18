import { useState, useEffect } from 'react';
import StudentRegisteredList from '@components/StudentRegisteredList.jsx';
import { axiosPrivate } from '../axios/axios.js';
import { useParams } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth.js';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { X } from 'lucide-react';
import readXlsxFile from 'read-excel-file';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import { Box, CircularProgress } from '@mui/material'; // Thêm import

const StudentRegisteredLayout = () => {
    const [students, setStudents] = useState([]);
    const [pending, setPending] = useState(false);
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
        setPending(true);
        try {
            const pageable = {
                page: page,
                size: 10,
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
        finally {
            setPending(false);
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
    const validateEmails = (emails) => {
        if (!emails.length) {
            toast.error('Danh sách email không được để trống!');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        for (let email of emails) {
            if (!emailRegex.test(email)) {
                toast.error(`Email không hợp lệ: ${email}`);
                return false;
            }
        }
        return true;
    };


    const handleSumbit = async () => {
        setPending(true);
        handleClose();
        try {
            const textArea = document.querySelector('textarea');
            const value = textArea.value;
            const emails = value
                .split('\n')
                .map((email) => email.trim())
                .filter((email) => email);
            setEmailList(emails);
            const uniqueEmails = [...new Set(emails)];
            if (!validateEmails(uniqueEmails)) {
                setPending(false);
                return;
            }

            setEmailList(uniqueEmails);
            const response = await axiosPrivate.post(`/course-registrations/register/${courseId}/list-email`, {
                emails: uniqueEmails,
            });
            if (response.status === 200) {
                toast.success(response.data.message);
                await fetchStudents(0);
            } else {
                toast.error(response.data.message, { type: 'error' });
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi gửi!', { type: 'error' });
        } finally {
            setPending(false); // Kết thúc loading

        }
    };

    const handleDeleteStudent = async (students) => {
        setPending(true); // Bắt đầu loading khi xóa
        try {
            const response = await axiosPrivate.post(`/course-registrations/remove/${courseId}/list-email`, {
                emails: students,
            });
            if (response.status === 200) {
                await fetchStudents(0);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message, { type: 'error' });
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa!', { type: 'error' });
        } finally {
            setPending(false); // Kết thúc loading
        }
    };

    return (
        <div className="w-full h-full">
            <div className="flex justify-end items-center mb-2">
                {authUser.role === 'TEACHER' && (
                    <button
                        className="py-1.5 px-2  bg-gradient-to-br from-[#5BCEC9] to-[#14919B]
    shadow-md hover:shadow-lg text-white rounded-lg  hover:bg-secondary transition-colors flex items-center"
                        onClick={handleOpen}>
                        <AddIcon />
                        Thêm sinh viên
                    </button>
                )}
            </div>
            {pending ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <StudentRegisteredList
                    totalStudents={paginationInfo.totalElements}
                    students={students}
                    paginationInfo={paginationInfo}
                    onPageChange={handlePageChange}
                    onDeleteStudents={handleDeleteStudent}
                />
            )}


            <Dialog
                open={showModal}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                hideBackdrop={false}
                sx={{ '& .MuiDialog-paper': { borderRadius: '16px' } }}
                BackdropProps={{
                    style: {
                        backdropFilter: 'blur(4px)', // Làm mờ nền
                        backgroundColor: 'rgba(128, 128, 128, 0.8)', // Có thể chỉnh độ tối nền nếu muốn
                    }
                }}
            >
                <div className="relative bg-white rounded-lg shadow-xl">
                    <DialogTitle className="text-xl font-extrabold mb-4 text-slate-700">Thêm sinh viên</DialogTitle>
                    <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                    <DialogContent>
                        <div className="mt-2 space-y-4">
                            <input
                                type="file"
                                onChange={handleReadFile}
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                className="w-full p-2 border border-slate-400 rounded"
                            />
                            <textarea
                                placeholder="Thêm email hoặc MSSV của sinh viên (mỗi email hoặc MSSV trên một dòng)"
                                className="w-full p-2 border border-slate-400 rounded resize-none h-32 focus:outline-none"
                                value={emailList.join('\n')}
                                onChange={handleTextareaChange}></textarea>
                            <button
                                onClick={handleSumbit}
                                className="w-full py-2 px-4  bg-gradient-to-br from-[#5BCEC9] to-[#14919B]
                                        shadow-md hover:shadow-lg text-white rounded-lg  hover:bg-secondary transition-colors"
                            >
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
