import { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { List, FileText, Edit2, Edit3, Trash2, Plus, Check, X, Upload, Calendar } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { axiosPrivate } from '@/axios/axios.js';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function Curriculum({ onSubmitSuccess }) {
    const [sections, setSections] = useState([]);
    const inputRef = useRef(null);

    const handlePostModule = async (sectionId) => {
        setIsConfirmDialogOpen(true);
        setConfirmingSectionId(sectionId);
    };


    const confirmAndPostModule = async () => {
        setIsConfirmDialogOpen(false);
        const sectionId = confirmingSectionId;
        const section = sections.find((section) => section.id === sectionId);

        const courseInfo = localStorage.getItem('courseInfo');
        const { id: courseId } = JSON.parse(courseInfo);

        const moduleData = {
            courseId: courseId,
            name: section.title,
        };
        const response = await axiosPrivate.post(`/modules`, moduleData);
        let moduleId;
        if (response.status === 200) {
            toast(response.data.message, {});
            moduleId = response.data.data.id;
            console.log(response);
            await Promise.all(
                section.items.map(async (item) => {
                    switch (item.type) {
                        case 'lecture': {
                            let lectureData = {
                                moduleId,
                                title: item.title,
                                content: item.content,
                            };
                            console.log(lectureData);
                            await axiosPrivate
                                .post(`/lectures`, lectureData)
                                .then((r) => {
                                    console.log(r);
                                    // toast(r.data.message);
                                })
                                .catch((e) => {
                                    console.error(e.response.message);
                                    toast(e.response.data.message);
                                });
                            break;
                        }
                        case 'quiz':
                            break;
                        case 'assignment': {
                            let utcStartDate = convertUTCToLocal(item.startDate);
                            let utcEndDate = convertUTCToLocal(item.endDate);
                            let assignmentData = {
                                title: item.title,
                                content: itemContents[item.id] || item.content,
                                startDate: utcStartDate.toISOString(),
                                endDate: utcEndDate.toISOString(),
                                state: 'OPEN',
                                moduleId: moduleId,
                            };
                            let formData = new FormData();
                            formData.append(
                                'assignment',
                                new Blob([JSON.stringify(assignmentData)], { type: 'application/json' }),
                            );
                            if (files[`${sectionId}-${item.id}`]) {
                                formData.append('document', files[`${sectionId}-${item.id}`]);
                            }
                            console.log(formData);
                            await axiosPrivate
                                .post(`/assignments`, formData, {
                                    headers: { 'Content-Type': 'multipart/form-data' },
                                })
                                .then((r) => {
                                    console.log(r);
                                    // toast(r.data.message);
                                })
                                .catch((e) => {
                                    console.error(e.response.message);
                                    toast(e.response.data.message);
                                });

                            break;
                        }
                        case 'resource': {
                            let resources = {
                                title: item.title,
                                moduleId: moduleId,
                            };
                            let formData = new FormData();
                            formData.append(
                                'resources',
                                new Blob([JSON.stringify(resources)], { type: 'application/json' }),
                            );
                            if (files[`${sectionId}-${item.id}`]) {
                                formData.append('document', files[`${sectionId}-${item.id}`]);
                            }
                            console.log(formData);
                            await axiosPrivate
                                .post(`/resources`, formData, {
                                    headers: { 'Content-Type': 'multipart/form-data' },
                                })
                                .then((r) => {
                                    console.log(r);
                                    // toast(r.data.message);
                                })
                                .catch((e) => {
                                    console.error(e.response.data.message);
                                    toast(e.response.data.message);
                                });

                            break;
                        }
                    }
                }),
            );
            // Mark this section as saved
            setSavedSections((prev) => ({ ...prev, [sectionId]: true }));
        }
    };

    const [editingSectionId, setEditingSectionId] = useState(null);
    const [editingItemId, setEditingItemId] = useState(null);
    const [tempTitle, setTempTitle] = useState('');

    const [itemContents, setItemContents] = useState({});
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [confirmingSectionId, setConfirmingSectionId] = useState(null);
    const [savedSections, setSavedSections] = useState({});

    // useEffect(() => {
    //     localStorage.setItem('sections', JSON.stringify(sections));
    // }, [sections]);

    const handleDateChange = (sectionId, itemId, field, date) => {
        console.log("🚀 ~ handleDateChange ~ field:", field)
        const now = new Date();

        const section = sections.find((section) => section.id === sectionId);
        const item = section.items.find((item) => item.id === itemId);

        // Kiểm tra điều kiện validate
        if (field === 'startDate') {
            if (date <= now) {
              toast('Ngày giờ bắt đầu phải sau giờ hiện tại!', { type: 'error' });
              return false;
            }
          }
        
          if (field === 'endDate') {
            if (!item.startDate) {
              toast('Vui lòng chọn ngày bắt đầu trước!', { type: 'error' });
              return false;
            }
        
            if (date <= new Date(item.startDate)) {
              toast('Ngày giờ kết thúc phải sau ngày bắt đầu!', { type: 'error' });
              return false;
            }
        }

        // Cập nhật state nếu các điều kiện hợp lệ
        const utcDate = new Date(date.getTime());
        setSections(
            sections.map((section) =>
                section.id === sectionId
                    ? {
                        ...section,
                        items: section.items.map((item) =>
                            item.id === itemId ? { ...item, [field]: utcDate.toISOString() } : item,
                        ),
                    }
                    : section,
            ),
        );
    };

    const handleKeyDown = (event, saveFunction) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveFunction();
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingItemId, editingSectionId]);

    const convertUTCToLocal = (dateString) => {
        const date = new Date(dateString);
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    };

    const addSection = () => {
        const newSection = {
            id: Date.now().toString(),
            title: 'New Section',
            items: [],
        };
        setSections([...sections, newSection]);
    };

    const addItem = (sectionId, type) => {
        const newItem = {
            id: Date.now().toString(),
            type,
            title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        };
        setSections(
            sections.map((section) =>
                section.id === sectionId ? { ...section, items: [...section.items, newItem] } : section,
            ),
        );
    };

    const deleteItem = (sectionId, itemId) => {
        setSections(
            sections.map((section) =>
                section.id === sectionId
                    ? { ...section, items: section.items.filter((item) => item.id !== itemId) }
                    : section,
            ),
        );
    };

    const deleteSection = (sectionId) => {
        setSections(sections.filter((section) => section.id !== sectionId));
    };

    const startEditingSection = (sectionId, currentTitle) => {
        setEditingSectionId(sectionId);
        setTempTitle(currentTitle);
    };

    const startEditingItem = (itemId, currentTitle, currentContent) => {
        setEditingItemId(itemId);
        setTempTitle(currentTitle);
        setItemContents((prevContents) => ({
            ...prevContents,
            [itemId]: currentContent || '',
        }));
    };

    const saveSection = () => {
        setSections(
            sections.map((section) => (section.id === editingSectionId ? { ...section, title: tempTitle } : section)),
        );
        setEditingSectionId(null);
        setTempTitle('');
    };

    const saveItem = (sectionId) => {
        setSections((prevSections) => {
            const updatedSections = prevSections.map((section) =>
                section.id === sectionId
                    ? {
                        ...section,
                        items: section.items.map((item) =>
                            item.id === editingItemId
                                ? { ...item, title: tempTitle, content: itemContents[editingItemId] }
                                : item,
                        ),
                    }
                    : section,
            );
            localStorage.setItem('sections', JSON.stringify(updatedSections));
            return updatedSections;
        });
        setEditingItemId(null);
        setTempTitle('');
    };

    const [files, setFiles] = useState({});
    const handleFileUpload = (sectionId, itemId, event) => {
        const file = event.target.files[0];
        if (file) {
            const fileName = file.name;
            setSections(
                sections.map((section) =>
                    section.id === sectionId
                        ? {
                            ...section,
                            items: section.items.map((item) =>
                                item.id === itemId ? { ...item, title: fileName } : item,
                            ),
                        }
                        : section,
                ),
            );
            setFiles((prevFiles) => ({
                ...prevFiles,
                [`${sectionId}-${itemId}`]: file,
            }));
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="mx-64 border rounded-lg p-6 bg-white shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <div className="text-xl font-bold flex items-center ">
                        <List className="mr-2" />
                        Thêm nội dung khóa học
                    </div>
                    <button
                        onClick={addSection}
                        className="py-2 px-4 bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors">
                        Thêm chương mới
                    </button>
                </div>

                {sections.map((section) => (
                    <div key={section.id}
                        className="mb-4 border border-slate-400 p-4 rounded-lg bg-slate-50">
                        <div className="flex justify-between items-center mb-2">
                            {editingSectionId === section.id ? (
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={tempTitle || ''}
                                        onChange={(e) => setTempTitle(e.target.value)}
                                        className="border border-slate-300 p-1 rounded-md"
                                        onKeyDown={(e) => handleKeyDown(e, saveSection)}
                                        ref={inputRef}
                                    />
                                    <button onClick={saveSection}
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        onClick={() => setEditingSectionId(null)}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <h2 className="text-lg font-semibold flex items-center">
                                    <List className="mr-2" /> {section.title}
                                </h2>
                            )}

                            {!savedSections[section.id] && (
                                <div>
                                    <button
                                        onClick={() => startEditingSection(section.id, section.title)}
                                        className="p-1 text-green-500 hover:text-green-700 rounded-full mr-2"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                        onClick={() => deleteSection(section.id)}
                                        className="p-1  text-green-500 hover:text-green-700 rounded-full mr-2"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {section.items.map((item) => (
                            <div key={item.id}
                                className="bg-slate-200 p-3 mb-2 rounded flex flex-col group relative">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {item.type === 'lecture' && (
                                            <FileText className="mr-2 text-blue-500" size={18} />
                                        )}
                                        {item.type === 'quiz' && <List className="mr-2 text-[#25764a]" size={18} />}
                                        {item.type === 'assignment' && (
                                            <FileText className="mr-2 text-[#CD4F2E]" size={18} />
                                        )}
                                        {item.type === 'resource' ? (
                                            <div className="flex items-center">
                                                <Upload className="mr-2 text-[#CD4F2E]" size={18} />
                                                {editingItemId === item.id ? (
                                                    <input
                                                        type="text"
                                                        value={tempTitle}
                                                        onChange={(e) => setTempTitle(e.target.value)}
                                                        className="ml-0 border border-gray-300 p-1 rounded"
                                                        ref={inputRef}
                                                    />
                                                ) : (
                                                    <span className={'p-0 ml-0'}>{item.title}</span>
                                                )}
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleFileUpload(section.id, item.id, e)}
                                                    className="hidden"
                                                    id={`upload-${item.id}`}
                                                />
                                                {!savedSections[section.id] && (
                                                    <button
                                                        onClick={() =>
                                                            document.getElementById(`upload-${item.id}`).click()
                                                        }
                                                        className="text-blue-500 hover:text-blue-700 hidden group-hover:flex items-center">
                                                        <Plus size={20} className="absolute right-8 " />
                                                    </button>
                                                )}
                                            </div>
                                        ) : editingItemId === item.id ? (
                                            <input
                                                type="text"
                                                value={tempTitle}
                                                onChange={(e) => setTempTitle(e.target.value)}
                                                className="border border-gray-300 p-1 rounded"
                                                onKeyDown={(e) => handleKeyDown(e, () => saveItem(section.id))}
                                                ref={inputRef}
                                            />
                                        ) : (
                                            <span className="ml-0">{item.title}</span>
                                        )}
                                    </div>
                                    {!savedSections[section.id] && (
                                        <div className="hidden group-hover:flex space-x-2">
                                            {item.type !== 'resource' && (
                                                <button
                                                    onClick={() => startEditingItem(item.id, item.title)}
                                                    className="text-gray-500 hover:text-gray-700">
                                                    <Edit2 size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteItem(section.id, item.id)}
                                                className="text-gray-500 hover:text-gray-700">
                                                <Trash2 size={16} />
                                            </button>

                                            {editingItemId === item.id && (
                                                <button
                                                    onClick={() => saveItem(section.id)}
                                                    className="text-green-500 hover:text-green-700">
                                                    <Check size={18} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {item.type === 'lecture' && editingItemId === item.id && (
                                    <div className="mt-4">
                                        <RichTextEditor
                                            initialContent={itemContents[item.id] || item.content || ''}
                                            onContentChange={(content) =>
                                                setItemContents((prevContents) => ({
                                                    ...prevContents,
                                                    [item.id]: content,
                                                }))
                                            }
                                        />
                                    </div>
                                )}

                                {item.type === 'assignment' && editingItemId === item.id && (
                                    <div className="mt-4">
                                        <div className="block text-sm font-medium text-gray-700 mb-1">
                                            <p>Ngày và giờ bắt đầu</p>
                                            <DateTimePicker
                                                className="w-full rounded-xl bg-white"
                                                value={item.startDate ? new Date(item.startDate) : null}
                                                onChange={(date) => handleDateChange(section.id, item.id, 'startDate', date)}
                                                ampm={false} 
                                            />

                                        </div>

                                        <div className="block text-sm font-medium text-gray-700 mb-1">
                                            <p>Ngày và giờ kết thúc</p>
                                            <DateTimePicker
                                                className="w-full rounded-xl bg-white"
                                                value={item.endDate ? new Date(item.endDate) : null}
                                                onChange={(date) => handleDateChange(section.id, item.id, 'endDate', date)}
                                                ampm={false} 
                                            />
                                        </div>

                                        <div className="block text-sm font-medium text-gray-700 mb-1">
                                            <p>Nội dung</p>
                                        </div>
                                        <RichTextEditor
                                            initialContent={itemContents[item.id] || item.content || ''}
                                            onContentChange={(content) =>
                                                setItemContents((prevContents) => ({
                                                    ...prevContents,
                                                    [item.id]: content,
                                                }))
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        ))}

                        {!savedSections[section.id] && (
                            <div className="bg-primaryDark p-2 rounded-lg flex justify-between mt-2 mx-64">
                                <button
                                    onClick={() => addItem(section.id, 'lecture')}
                                    className="text-white flex items-center justify-between">
                                    Lecture <Plus size={18} className="ml-1" />
                                </button>
                                {/*<button*/}
                                {/*  onClick={() => addItem(section.id, 'quiz')}*/}
                                {/*  className="text-white flex items-center justify-between"*/}
                                {/*>*/}
                                {/*  Quiz <Plus size={18} className="ml-1" />*/}
                                {/*</button>*/}
                                <button
                                    onClick={() => addItem(section.id, 'assignment')}
                                    className="text-white flex items-center justify-between">
                                    Assignment <Plus size={18} className="ml-1" />
                                </button>
                                <button
                                    onClick={() => addItem(section.id, 'resource')}
                                    className="text-white flex items-center justify-between">
                                    Resource <Plus size={18} className="ml-1" />
                                </button>
                                <button
                                    onClick={() => handlePostModule(section.id)}
                                    className="p-1 bg-[#beede6] text-green-500 hover:text-green-700 rounded-full text-lg">
                                    <Check size={24} />
                                </button>
                            </div>
                        )}

                    </div>

                ))}
                <div className="flex justify-end">
                    <button
                        className="py-2 px-6 bg-primaryDark text-white rounded-lg hover:bg-secondary transition-colors"
                        onClick={onSubmitSuccess}
                    >
                        Xong
                    </button>
                </div>


            </div>
            {isConfirmDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Xác nhận lưu chương</h2>
                        <p className="mb-4">
                            Bạn có muốn lưu chương này? (Nội dung chương có thể thay đổi sau hành động này)
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="btn btn--secondary text-btn hover:bg-emerald-400"
                                onClick={() => setIsConfirmDialogOpen(false)}>
                                Không
                            </button>
                            <button className="btn btn--primary hover:bg-emerald-400" onClick={confirmAndPostModule}>
                                Có
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </LocalizationProvider>
    );
}

Curriculum.propTypes = {
    onPostAllModules: PropTypes.func.isRequired,
};
