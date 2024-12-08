import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { List, FileText, Edit2, Trash2, Plus, Check, X, Upload, Calendar } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { axiosPrivate } from '@/axios/axios.js';
import { toast } from 'react-toastify';

export default function EditCourseContent() {
    const { courseId } = useParams();
    const [sections, setSections] = useState([]);
    const [editingSectionId, setEditingSectionId] = useState(null);
    const [editingItemId, setEditingItemId] = useState(null);
    const [tempTitle, setTempTitle] = useState('');
    const [itemContents, setItemContents] = useState({});
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [confirmingSectionId, setConfirmingSectionId] = useState(null);
    const [savedSections, setSavedSections] = useState({});
    const [files, setFiles] = useState({});

    const datePickerRef_startDay = useRef(null);
    const datePickerRef_endDay = useRef(null);

    const [originalData, setOriginalData] = useState({});
    const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false);
    const [deletingSectionId, setDeletingSectionId] = useState(null);

    useEffect(() => {
        const fetchCourseContent = async () => {
            try {
                const response = await axiosPrivate.get(`/courses/${courseId}/modules`);
                const modulesData = response.data.data;
                const formattedSections = await Promise.all(modulesData.map(async (module) => {
                    const lecturesResponse = await axiosPrivate.get(`/modules/${module.id}/lectures`);
                    const resourcesResponse = await axiosPrivate.get(`/modules/${module.id}/resources`);
                    const assignmentsResponse = await axiosPrivate.get(`/modules/${module.id}/assignments`);

                    const items = [
                        ...lecturesResponse.data.data.map(lecture => ({ ...lecture, type: 'lecture' })),
                        ...resourcesResponse.data.data.map(resource => ({ ...resource, type: 'resource' })),
                        ...assignmentsResponse.data.data.map(assignment => ({ ...assignment, type: 'assignment' })),
                    ];

                    return {
                        id: module.id,
                        title: module.name,
                        items: items,
                        isNew: false
                    };
                }));
                setSections(formattedSections);
                setOriginalData(formattedSections);
            } catch (error) {
                console.error('Error fetching course content:', error);
                toast(error.response.data.message, { type: 'error' });
            }
        };

        fetchCourseContent();
    }, [courseId]);

    const confirmAndUpdateModule = async () => {
        setIsConfirmDialogOpen(false);
        const sectionId = confirmingSectionId;
        const section = sections.find(section => section.id === sectionId);

        try {
            let moduleId;
            if (!section.isNew) {
                // Update existing module
                await axiosPrivate.patch(`/modules/${sectionId}`, {
                    name: section.title
                });
                moduleId = sectionId;
            } else {
                // Create new module
                const moduleData = {
                    courseId: courseId,
                    name: section.title
                };
                const response = await axiosPrivate.post(`/modules`, moduleData);
                moduleId = response.data.data.id;
            }

            // Update or create items
            await Promise.all(section.items.map(async item => {
                let formData = new FormData();

                switch (item.type) {
                    case 'lecture': {
                        let lectureData = {
                            moduleId,
                            title: item.title,
                            content: itemContents[item.id] || item.content
                        };
                        if (item.isNew) {
                            let res = await axiosPrivate.post(`/lectures`, lectureData);
                            console.log('Created lecture ' + res);
                        } else {
                            await axiosPrivate.patch(`/lectures/${item.id}`, lectureData);
                        }
                        break;
                    }
                    case 'assignment': {
                        let assignmentData = {
                            title: item.title,
                            content: itemContents[item.id] || item.content,
                            startDate: item.startDate,
                            endDate: item.endDate,
                            state: "OPEN",
                            moduleId: moduleId
                        };
                        formData.append('assignment', new Blob([JSON.stringify(assignmentData)], { type: 'application/json' }));
                        if (files[`${sectionId}-${item.id}`]) {
                            formData.append('document', files[`${sectionId}-${item.id}`]);
                        }
                        if (item.isNew) {
                            await axiosPrivate.post(`/assignments`, formData, {
                                headers: { 'Content-Type': 'multipart/form-data' },
                            });

                        } else {
                            await axiosPrivate.patch(`/assignments/${item.id}`, formData, {
                                headers: { 'Content-Type': 'multipart/form-data' },
                            });
                        }
                        break;
                    }
                    case 'resource': {
                        let resourceData = {
                            title: item.title,
                            moduleId: moduleId
                        };
                        formData.append('resources', new Blob([JSON.stringify(resourceData)], { type: 'application/json' }));
                        if (files[`${sectionId}-${item.id}`]) {
                            formData.append('document', files[`${sectionId}-${item.id}`]);
                        }
                        if (item.isNew) {
                            await axiosPrivate.post(`/resources`, formData, {
                                headers: { 'Content-Type': 'multipart/form-data' },
                            });
                        } else {
                            await axiosPrivate.patch(`/resources/${item.id}`, formData, {
                                headers: { 'Content-Type': 'multipart/form-data' },
                            });
                        }
                        break;
                    }
                }
            }));

            toast('Module updated successfully');
            setSavedSections(prev => ({...prev, [sectionId]: true}));

            // Update originalData after successful save
            setOriginalData(prevOriginal =>
                prevOriginal.map(s => s.id === sectionId ? {...section, isNew: false} : s)
            );

            // Update the sections state to reflect that the section is no longer new
            setSections(prevSections =>
                prevSections.map(s => s.id === sectionId ? {...s, isNew: false, items: s.items.map(item => ({...item, isNew: false}))} : s)
            );

        } catch (error) {
            console.error('Error updating/creating module:', error);
            toast(error.response.data.message, { type: 'error' });
        }
    };

    const handleUpdateModule = async (sectionId) => {
        setIsConfirmDialogOpen(true);
        setConfirmingSectionId(sectionId);
    };

    useEffect(() => {
        localStorage.setItem('sections', JSON.stringify(sections));
    }, [sections]);

    const handleDateChange = (sectionId, itemId, field, date) => {
        setSections(sections.map(section =>
            section.id === sectionId
                ? {
                    ...section,
                    items: section.items.map(item =>
                        item.id === itemId ? { ...item, [field]: date } : item
                    ),
                }
                : section
        ));
    };

    const addSection = () => {
        const newSection = {
            id: Date.now().toString(),
            title: 'New Section',
            items: [],
            isNew: true
        };
        setSections([...sections, newSection]);
    };

    const addItem = (sectionId, type) => {
        const newItem = {
            id: Date.now().toString(),
            type,
            title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            isNew: true
        };
        setSections(sections.map(section =>
            section.id === sectionId
                ? { ...section, items: [...section.items, newItem] }
                : section
        ));
    };

    const deleteItem = (sectionId, itemId) => {
        setSections(sections.map(section =>
            section.id === sectionId
                ? { ...section, items: section.items.filter(item => item.id !== itemId) }
                : section
        ));
    };

    const deleteSection = (sectionId) => {
        setIsDeleteConfirmDialogOpen(true);
        setDeletingSectionId(sectionId);
    };

    const confirmAndDeleteSection = async () => {
        setIsDeleteConfirmDialogOpen(false);
        try {
            const response = await axiosPrivate.delete(`/modules/${deletingSectionId}`);
            if (response.status === 200) {
                setSections(sections.filter(section => section.id !== deletingSectionId));
                toast(response.data.message);
            } else {
                toast(response.data.message, { type: 'error' });
            }
        } catch (error) {
            console.error('Error deleting section:', error);
            toast(error.response.data.message, { type: 'error' });
        }
        setDeletingSectionId(null);
    };

    const startEditingSection = (sectionId, currentTitle) => {
        setEditingSectionId(sectionId);
        setTempTitle(currentTitle);
    };

    const startEditingItem = (itemId, currentTitle, currentContent) => {
        setEditingItemId(itemId);
        setTempTitle(currentTitle);
        setItemContents(prevContents => ({
            ...prevContents,
            [itemId]: currentContent || ''
        }));
    };

    const saveSection = () => {
        setSections(sections.map(section =>
            section.id === editingSectionId
                ? { ...section, title: tempTitle }
                : section
        ));
        setEditingSectionId(null);
        setTempTitle('');
    };

    const saveItem = (sectionId) => {
        setSections(prevSections => {
            const updatedSections = prevSections.map(section =>
                section.id === sectionId
                    ? {
                        ...section,
                        items: section.items.map(item =>
                            item.id === editingItemId
                                ? { ...item, title: tempTitle, content: itemContents[editingItemId]}
                                : item
                        ),
                    }
                    : section
            );
            localStorage.setItem('sections', JSON.stringify(updatedSections));
            return updatedSections;
        });
        setEditingItemId(null);
        setTempTitle('');
    };

    const handleFileUpload = (sectionId, itemId, event) => {
        const file = event.target.files[0];
        if (file) {
            const fileName = file.name;
            setSections(sections.map(section =>
                section.id === sectionId
                    ? {
                        ...section,
                        items: section.items.map(item =>
                            item.id === itemId ? { ...item, title: fileName } : item
                        ),
                    }
                    : section
            ));
            setFiles(prevFiles => ({
                ...prevFiles,
                [`${sectionId}-${itemId}`]: file
            }));
        }
    };

    return (
        <>
            <div className="max-w-4xl my-8 mx-auto p-6 bg-white shadow-md rounded-lg">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold flex items-center mb-6">
                        <List className="mr-2" />Chỉnh sửa nội dung khóa học

                    </h1>
                    <button
                        onClick={addSection}
                        className="bg-[#02a189] text-white px-4 py-2 rounded-lg hover:bg-[#02a189] transition-colors"
                    >
                        Thêm chương mới
                    </button>
                </div>

                {sections.map(section => (
                    <div key={section.id} className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            {editingSectionId === section.id ? (
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={tempTitle}
                                        onChange={(e) => setTempTitle(e.target.value)}
                                        className="border border-gray-300 p-1 rounded"
                                    />
                                    <button onClick={saveSection} className="text-green-500 hover:text-green-700">
                                        <Check size={18} />
                                    </button>
                                    <button
                                        onClick={() => setEditingSectionId(null)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <h2 className="text-xl font-semibold flex items-center">
                                    <List className="mr-2" /> {section.title}
                                </h2>
                            )}

                            {!savedSections[section.id] && (
                                <div>
                                    <button
                                        onClick={() => startEditingSection(section.id, section.title)}
                                        className="p-1 bg-cyan-400 text-green-500 hover:text-green-700 rounded-full mr-2"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => deleteSection(section.id)}
                                        className="p-1 bg-rose-400 text-green-500 hover:text-green-700 rounded-full mr-2"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {section.items.map(item => (
                            <div
                                key={item.id}
                                className="bg-slate-200 p-3 mb-2 rounded flex flex-col group relative"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {item.type === 'lecture' &&
                                            <FileText className="mr-2 text-blue-500" size={18} />}
                                        {item.type === 'quiz' && <List className="mr-2 text-[#25764a]" size={18} />}
                                        {item.type === 'assignment' &&
                                            <FileText className="mr-2 text-[#CD4F2E]" size={18} />}
                                        {item.type === 'resource' ? (
                                            <div className="flex items-center">
                                                <Upload className="mr-2 text-[#CD4F2E]" size={18} />
                                                {editingItemId === item.id ? (
                                                    <input
                                                        type="text"
                                                        value={tempTitle}
                                                        onChange={(e) => setTempTitle(e.target.value)}
                                                        className="ml-0 border border-gray-300 p-1 rounded"
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
                                                        onClick={() => document.getElementById(`upload-${item.id}`).click()}
                                                        className="text-blue-500 hover:text-blue-700 hidden group-hover:flex items-center"
                                                    >
                                                        <Plus size={20} className="absolute right-8 " />
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            editingItemId === item.id ? (
                                                <input
                                                    type="text"
                                                    value={tempTitle}
                                                    onChange={(e) => setTempTitle(e.target.value)}
                                                    className="border border-gray-300 p-1 rounded"
                                                />
                                            ) : (
                                                <span className="ml-0">{item.title}</span>
                                            )
                                        )}
                                    </div>
                                    {!savedSections[section.id] && (

                                        <div className="hidden group-hover:flex space-x-2">
                                            {item.type !== 'resource' && (
                                                <button
                                                    onClick={() => startEditingItem(item.id, item.title)}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteItem(section.id, item.id)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                            {editingItemId === item.id && (
                                                <button onClick={() => saveItem(section.id)}
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
                                            onContentChange={(content) => setItemContents(prevContents => ({
                                                ...prevContents,
                                                [item.id]: content,
                                            }))}
                                        />
                                    </div>
                                )}

                                {item.type === 'assignment' && editingItemId === item.id && (
                                    <div className="mt-4">
                                        <div className="block text-sm font-medium text-gray-700 mb-1">
                                            <p>Ngày bắt đầu</p>
                                            <div className="mt-1 relative w-full px-3 py-2 bg-white rounded-md shadow-sm focus:outline-none
                      focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                 onClick={() => datePickerRef_startDay.current.setOpen(true)}>
                                                <DatePicker
                                                    dateFormat="yyyy-MM-dd"
                                                    selected={item.startDate}
                                                    ref={datePickerRef_startDay}
                                                    onChange={(date) => handleDateChange(section.id, item.id, 'startDate', date)}
                                                    showMonthYearDropdown/>
                                                <div
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <Calendar className="h-5 w-5 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="block text-sm font-medium text-gray-700 mb-1">
                                            <p>Ngày kết thúc</p>
                                            <div className="mt-1 relative w-full px-3 py-2 bg-white rounded-md shadow-sm focus:outline-none
                       focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                 onClick={() => datePickerRef_endDay.current.setOpen(true)}>
                                                <DatePicker
                                                    dateFormat="yyyy-MM-dd"
                                                    selected={item.endDate}
                                                    ref={datePickerRef_endDay}
                                                    onChange={(date) => handleDateChange(section.id, item.id, 'endDate', date)}
                                                />
                                                <div
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <Calendar className="h-5 w-5 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="block text-sm font-medium text-gray-700 mb-1">
                                            <p>Nội dung</p>
                                        </div>
                                        <RichTextEditor
                                            initialContent={itemContents[item.id] || item.content || ''}
                                            onContentChange={(content) => setItemContents(prevContents => ({
                                                ...prevContents,
                                                [item.id]: content,
                                            }))}
                                        />

                                    </div>
                                )}
                            </div>
                        ))}


                        {!savedSections[section.id] && (
                            <div className="bg-[#02a189] p-4 rounded-lg flex justify-around mt-4">
                                <button
                                    onClick={() => addItem(section.id, 'lecture')}
                                    className="text-white flex items-center justify-between"
                                >
                                    Lecture <Plus size={18} className="ml-1" />
                                </button>
                                <button
                                    onClick={() => addItem(section.id, 'quiz')}
                                    className="text-white flex items-center justify-between"
                                >
                                    Quiz <Plus size={18} className="ml-1" />
                                </button>
                                <button
                                    onClick={() => addItem(section.id, 'assignment')}
                                    className="text-white flex items-center justify-between"
                                >
                                    Assignment <Plus size={18} className="ml-1" />
                                </button>
                                <button
                                    onClick={() => addItem(section.id, 'resource')}
                                    className="text-white flex items-center justify-between"
                                >
                                    Resource <Plus size={18} className="ml-1" />
                                </button>
                                <button
                                    onClick={() => handleUpdateModule(section.id)}
                                    className="p-2 bg-[#beede6] text-green-500 hover:text-green-700 rounded-full text-lg"
                                >
                                    <Check size={24} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {isConfirmDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Xác nhận lưu chương</h2>
                        <p className="mb-4">Bạn có muốn lưu chương này? (Nội dung chương có thể thay đổi sau hành động này)</p>
                        <div className="flex justify-end space-x-2">
                            <button className="btn btn--secondary text-btn hover:bg-emerald-400" onClick={() => setIsConfirmDialogOpen(false)}>Không</button>
                            <button className="btn btn--primary hover:bg-emerald-400" onClick={confirmAndUpdateModule}>Có</button>
                        </div>
                    </div>
                </div>
            )}
            {isDeleteConfirmDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Xác nhận xóa chương</h2>
                        <p className="mb-4">Bạn có muốn xóa chương này? (Hành động này không thể undo)</p>
                        <div className="flex justify-end space-x-2">
                            <button className="btn btn--secondary text-btn hover:bg-emerald-400"
                                    onClick={() => setIsDeleteConfirmDialogOpen(false)}>Không
                            </button>
                            <button className="btn btn--primary hover:bg-emerald-400"
                                    onClick={confirmAndDeleteSection}>Có
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

