import React from 'react'
import Header from '@layout/Header';
import Footer from '@layout/Footer.jsx';
import Navbar from '@layout/NavBar.jsx';

import ForumLayout  from '../layout/ForumLayout.jsx';

const Forum = () => {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="sticky top-0 z-50">
                <Header />
                <Navbar />
            </div>
            <div className="flex-grow">
                <ForumLayout />
            </div>
            <Footer />
        </div>
    )
}
export default Forum