import React from 'react';
import DocumentTitle from '../components/DocumentTitle.jsx';

import ForumLayout from '../layout/ForumLayout.jsx';

const Forum = () => {
    return (
        <div className="flex flex-col min-h-[calc(100vh-193px)] ">
            <DocumentTitle title="Forum" />
            <div className="flex-grow h-0 overflow-hidden bg-slate-200">
                <ForumLayout />
            </div>

        </div>
    );
};
export default Forum;
