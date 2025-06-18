import { useState, useEffect } from 'react';
import { useAuth } from '@hooks/useAuth.js';
import { Link, useSearchParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function CourseFilter({ onSearch }) {
    const { authUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const { t } = useTranslation();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        if (onSearch) onSearch(searchTerm);
    }, [searchTerm]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setSearchParams(value ? { search: value } : {});
    };

    const handleAddClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className='flex-col flex w-full gap-y-2'>
            <div className='text-slate-600 font-semibold text-xl py-2'>
                {authUser.role === "TEACHER" ? t('manage_courses') : t('my_courses')}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 items-center mb-2 w-full">
                <TextField
                    fullWidth
                    placeholder="Tìm kiếm khoá học..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    variant="outlined"
                    size="small"
                    sx={{ maxWidth: '100%' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
                {authUser?.role === 'TEACHER' && (
                    <>
                        <button
                            className="ml-2 h-10 px-2 text-base bg-gradient-to-br from-[#5BCEC9] to-[#14919B] shadow-md hover:shadow-lgtext-center text-white rounded-lg  transition-colors flex items-center justify-center gap-1 min-w-44"
                            style={{ lineHeight: 1 }}
                            onClick={handleAddClick}
                        >
                            <AddIcon className="w-4 h-4" fontSize="small" />
                            Thêm khóa học
                        </button>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem
                                component={Link}
                                to="/add-course"
                                onClick={handleClose}
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#64748b', // Tailwind slate-500
                                    '&:hover': {
                                        backgroundColor: '#eff6ff', // Tailwind blue-50
                                        color: '#64748b',
                                    },
                                }}
                            >
                                Thêm mới
                            </MenuItem>
                            <MenuItem
                                component={Link}
                                to="/add-course-from-old"
                                onClick={handleClose}
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#64748b',
                                    '&:hover': {
                                        backgroundColor: '#eff6ff',
                                        color: '#64748b',
                                    },
                                }}
                            >
                                Thêm từ khoá học cũ
                            </MenuItem>
                        </Menu>
                    </>
                )}
            </div>
        </div>
    );
}