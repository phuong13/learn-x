/* eslint-disable react/prop-types */

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { axiosPrivate } from '../axios/axios';
import { Toaster, toast } from 'sonner';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import Loader from './Loader';

const Select = ({ children, ...props }) => (
    <select
        {...props}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
        {children}
    </select>
);

const Label = ({ children, ...props }) => (
    <label {...props} className="block text-sm font-medium text-gray-700">
        {children}
    </label>
);

const Input = (props) => (
    <input
        {...props}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
    />
);

const Textarea = (props) => (
    <textarea
        {...props}
        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
    />
);

const Button = ({ children, ...props }) => (
    <button
        {...props}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        {children}
    </button>
);

const StyledOption = styled.option`
    font-family: 'Archivo', sans-serif;
`;

const CreateCourseForm = () => {
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        axiosPrivate
            .get('/categories')
            .then((res) => {
                setCategories(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleCategoryChange = (e) => {
        setShowNewCategory(e.target.value === 'new');
    };

    const handleDateSelect = (date) => {
        setStartDate(date);
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        let formData = new FormData();
        let i = 0;
        const category = e.target[i++].value;
        let newCategory;
        if (category === 'new') {
            newCategory = e.target[i++]?.value;
        }
        const courseName = e.target[i++].value;
        const description = e.target[i++].value;
        const startDate = e.target[i++].value;
        const state = e.target[i++].value;
        const thumbnailInput = document.getElementById('thumbnail');
        const thumbnail = thumbnailInput ? thumbnailInput.files[0] : null;

        formData.append(
            'courseInfo',
            new Blob(
                [
                    JSON.stringify({
                        name: courseName,
                        description: description,
                        startDate: startDate,
                        categoryName: category === 'new' ? newCategory : category,
                        state: state,
                    }),
                ],
                { type: 'application/json' },
            ),
        );
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        try {
            const response = await axiosPrivate.post('/courses', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response);
            if (response.status === 200) {
                console.log(response.data);
                toast.success('Thêm khóa học thành công!');
            } else {
                toast.error('Thêm khóa học thất bại!');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Toaster position="top-right" richColors />
            <Loader isLoading={isLoading} />
            <div className="flex justify-center items-center">
                <form
                    onSubmit={(e) => handleOnSubmit(e)}
                    className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md flex-1">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="category">Danh mục</Label>
                            <Select id="category" onChange={handleCategoryChange} defaultValue="">
                                <StyledOption value="">Chọn danh mục</StyledOption>
                                {categories.map((category) => (
                                    <StyledOption key={category.id} value={category.name}>
                                        {category.name}
                                    </StyledOption>
                                ))}
                                <StyledOption value="new">Thêm danh mục mới</StyledOption>
                            </Select>
                        </div>

                        {showNewCategory && (
                            <div>
                                <Label htmlFor="newCategory">Tên danh mục</Label>
                                <Input id="newCategory" type="text" placeholder="Enter new category name" />
                            </div>
                        )}

                        <div>
                            <Label htmlFor="courseName">Tên khóa học</Label>
                            <Input id="courseName" type="text" placeholder="Enter course name" />
                        </div>

                        <div>
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea id="description" rows={3} placeholder="Enter course description" />
                        </div>

                        <div className="">
                            <Label htmlFor="startDate">Ngày bắt đầu</Label>
                            <div className="flex w-full">
                                <DatePicker
                                    className="flex-1 w-full mt-1 focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    selected={startDate}
                                    onChange={handleDateSelect}
                                    dateFormat="yyyy-MM-dd"
                                />
                                {/* <CalendarIcon className="mx-4" /> */}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="state">Trạng thái</Label>
                            <Select id="state" defaultValue="OPEN">
                                <StyledOption value="OPEN">OPEN</StyledOption>
                                <StyledOption value="CLOSED">CLOSED</StyledOption>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="thumbnail">Ảnh nền</Label>
                            <Input
                                id="thumbnail"
                                type="file"
                                accept="image/*"
                                className="file file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Thêm
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateCourseForm;
