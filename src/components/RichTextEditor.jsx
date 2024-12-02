import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PropTypes from 'prop-types';

const RichTextEditor = ({ onContentChange, initialContent }) => {
    const [editorContent, setEditorContent] = useState(initialContent);

    useEffect(() => {
        setEditorContent(initialContent);
    }, [initialContent]);

    const modules = {
        toolbar: [
            [ { 'font': [] }],
            [{size: []}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
         'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    const handleChange = (content) => {
        setEditorContent(content);
        onContentChange(content);
    };

    return (
        <div className="bg-white">
            <div className="container mx-auto p-4">
                <ReactQuill
                    theme="snow"
                    modules={modules}
                    formats={formats}
                    value={editorContent}
                    onChange={handleChange}
                    className="bg-white mb-28 h-32"
                />
            </div>
        </div>
    );
};

RichTextEditor.propTypes = {
    onContentChange: PropTypes.func.isRequired,
    initialContent: PropTypes.string,
}

export default RichTextEditor;
