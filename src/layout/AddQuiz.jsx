import React from 'react'
import { Sidebar } from '@modules/Forum/Sidebar'
import Container from '@modules/Quiz/Container'

const AddQuiz = () => {
    return (
        <div className='flex h-full'>
            {/* <div className=' w-1/4 h-full shadow-lg p-2'>
                <Sidebar />
            </div> */}
            <div className='flex-grow overflow-y-auto custom-scrollbar'>
                <Container />
            </div>
        </div>
    )
}

export default AddQuiz