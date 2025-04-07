import React from 'react'
import TagCourse from './components/tag/TagCourse'
import { SearchInput } from './components/input/SearchInput'

const examData = [
    { id: " ", avatar: 'https://cdn.utez.com/courses/5f9b3b3b7b3b3.jpg', nameCourse: 'Công nghệ phần mềm' },
    { id: " ", avatar: 'https://cdn.utez.com/courses/5f9b3b3b7b3b3.jpg', nameCourse: 'Lập trình hướng đối tượng' },
    { id: " ", avatar: 'https://cdn.utez.com/courses/5f9b3b3b7b3b3.jpg', nameCourse: 'Thể chất 3' },
    { id: " ", avatar: 'https://cdn.utez.com/courses/5f9b3b3b7b3b3.jpg', nameCourse: 'Công nghệ phần mềm' },
    { id: " ", avatar: 'https://cdn.utez.com/courses/5f9b3b3b7b3b3.jpg', nameCourse: 'Lập trình hướng đối tượng' },
    { id: " ", avatar: 'https://cdn.utez.com/courses/5f9b3b3b7b3b3.jpg', nameCourse: 'Thể chất 3' },
    { id: " ", avatar: 'https://cdn.utez.com/courses/5f9b3b3b7b3b3.jpg', nameCourse: 'Công nghệ phần mềm' },
    { id: " ", avatar: 'https://cdn.utez.com/courses/5f9b3b3b7b3b3.jpg', nameCourse: 'Lập trình hướng đối tượng' },
    { id: " ", avatar: 'https://cdn.utez.com/courses/5f9b3b3b7b3b3.jpg', nameCourse: 'Thể chất 3' },
    { id: " ", avatar: 'https://cdn.utez.com/courses/5f9b3b3b7b3b3.jpg', nameCourse: 'Thể chất 3' },
    { id: " ", avatar: 'https://cdn.utez.com/courses/5f9b3b3b7b3b3.jpg', nameCourse: 'Công nghệ phần mềm' },
    { id: " ", avatar: 'https://cdn.utez.com/courses/5f9b3b3b7b3b3.jpg', nameCourse: 'Lập trình hướng đối tượng' },
    { id: " ", avatar: 'https://cdn.utez.com/courses/5f9b3b3b7b3b3.jpg', nameCourse: 'Thể chất 3' },
    { id: " ", avatar: 'https://cdn.utez.com/courses/5f9b3b3b7b3b3.jpg', nameCourse: 'Lập trình hướng đối tượng' },
    { id: " ", avatar: 'https://cdn.utez.com/courses/5f9b3b3b7b3b3.jpg', nameCourse: 'Thể chất 3' },
    { id: " ", avatar: 'https://cdn.utez.com/courses/5f9b3b3b7b3b3.jpg', nameCourse: 'Thể chất 3' },
    { id: " ", avatar: 'https://cdn.utez.com/courses/5f9b3b3b7b3b3.jpg', nameCourse: 'Công nghệ phần mềm' },
    { id: " ", avatar: 'https://cdn.utez.com/courses/5f9b3b3b7b3b3.jpg', nameCourse: 'Lập trình hướng đối tượng' },
    { id: " ", avatar: 'https://cdn.utez.com/courses/5f9b3b3b7b3b3.jpg', nameCourse: 'Thể chất 3' },
    
]
export const Sidebar = () => {
    return (
        <div className='h-full gap-4'>
            <div className='p-2'>
                <SearchInput/>
            </div>
            <div className='h-full overflow-y-auto custom-scrollbar shadow-lg'>
                {examData.map((exam, index) => (
                    <TagCourse key={index} nameCourse={exam.nameCourse} />
                ))}
            </div>
        </div>
    )
}
