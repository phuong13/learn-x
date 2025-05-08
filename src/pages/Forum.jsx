import React from 'react'
import Header from '@layout/Header';
import Footer from '@layout/Footer.jsx';
import Navbar from '@layout/NavBar.jsx';

import ForumLayout from '../layout/ForumLayout.jsx';

const Forum = () => {
    return (
        <div className="flex flex-col min-h-[calc(100vh-193px)] ">
    
            <div className="flex-grow h-0 overflow-hidden bg-slate-200">
                <ForumLayout />
            </div>

        </div>
    );
};
export default Forum;
