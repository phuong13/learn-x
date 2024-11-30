import React, { useState , useRef} from 'react';
import DatePicker from 'react-datepicker'
import { List, FileText, Edit2, Trash2, Plus, Check, X, Upload, CalendarIcon } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

export default function Curriculum() {
  const [sections, setSections] = useState([
    {
      id: '1',
      title: 'Introduction',
      items: [
        { id: '1', type: 'lecture', title: 'Lecture Title' },
        { id: '2', type: 'quiz', title: 'Quiz Title' },
        { id: '3', type: 'assignment', title: 'Assignment Title', startDate: null, endDate: null },
        { id: '4', type: 'resource', title: 'Resource Title' },
      ],
    },
  ]);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [tempTitle, setTempTitle] = useState('');
  const datePickerRef_starDay = useRef(null); // Create a ref for the DatePicker
  const datePickerRef_endDay = useRef(null); // Create a ref for the DatePicker

  // Xử lý thay đổi ngày
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


  // Thêm section mới
  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: 'New Section',
      items: [],
    };
    setSections([...sections, newSection]);
  };

  // Thêm item mới vào section
  const addItem = (sectionId, type) => {
    const newItem = {
      id: Date.now().toString(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
    };
    setSections(sections.map(section =>
      section.id === sectionId
        ? { ...section, items: [...section.items, newItem] }
        : section
    ));
  };

  // Xóa item khỏi section
  const deleteItem = (sectionId, itemId) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? { ...section, items: section.items.filter(item => item.id !== itemId) }
        : section
    ));
  };

  // Xóa section
  const deleteSection = (sectionId) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  // Bắt đầu chỉnh sửa section
  const startEditingSection = (sectionId, currentTitle) => {
    setEditingSectionId(sectionId);
    setTempTitle(currentTitle);
  };

  // Bắt đầu chỉnh sửa item
  const startEditingItem = (itemId, currentTitle) => {
    setEditingItemId(itemId);
    setTempTitle(currentTitle);
  };

  // Lưu thay đổi section
  const saveSection = () => {
    setSections(sections.map(section =>
      section.id === editingSectionId
        ? { ...section, title: tempTitle }
        : section
    ));
    setEditingSectionId(null);
    setTempTitle('');
  };

  // Lưu thay đổi item
  const saveItem = (sectionId) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
          ...section,
          items: section.items.map(item =>
            item.id === editingItemId ? { ...item, title: tempTitle } : item
          ),
        }
        : section
    ));
    setEditingItemId(null);
    setTempTitle('');
  };

  // Xử lý thêm file cho resource
  const handleFileUpload = (sectionId, itemId, event) => {
    const fileName = event.target.files[0]?.name || 'Unnamed File';
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
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <List className="mr-2" /> Curriculum
        </h1>
        <button
          onClick={addSection}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          New Section
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

            <div>
              <button
                onClick={() => startEditingSection(section.id, section.title)}
                className="text-gray-500 hover:text-gray-700 mr-2"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => deleteSection(section.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {section.items.map(item => (
            <div
              key={item.id}
              className="bg-slate-200 p-3 mb-2 rounded flex flex-col group relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {item.type === 'lecture' && <FileText className="mr-2 text-blue-500" size={18} />}
                  {item.type === 'quiz' && <List className="mr-2 text-[#25764a]" size={18} />}
                  {item.type === 'assignment' && <FileText className="mr-2 text-[#CD4F2E]" size={18} />}
                  {item.type === 'resource' ? (
                    <div className="flex items-center space-x-2">
                      <Upload className="mr-2 text-[#CD4F2E]" size={18} />
                      <span>{item.title}</span>
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(section.id, item.id, e)}
                        className="hidden"
                        id={`upload-${item.id}`}
                      />
                      <button
                        onClick={() => document.getElementById(`upload-${item.id}`).click()}
                        className="text-blue-500 hover:text-blue-700 hidden group-hover:flex items-center"
                      >
                        <Plus size={20} className="absolute right-8 " />
                      </button>
                    </div>
                  ) : (
                    <span>{item.title}</span>
                  )}
                </div>

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
                </div>
              </div>

              {/* Hiển thị RichTextEditor ngay dưới Lecture */}
              {item.type === 'lecture' && editingItemId === item.id && (
                <div className="mt-4">
                  <RichTextEditor />
                </div>
              )}

              {/* Hiển thị RichTextEditor ngay dưới Assigmnet */}
              {item.type === 'assignment' && editingItemId === item.id && (
                <div className="mt-4">
                  {/* Ngày bắt đầu */}
                  <div className="block text-sm font-medium text-gray-700 mb-1">
                    <p>Ngày bắt đầu</p>
                    <div className="mt-1 relative w-full px-3 py-2 bg-white rounded-md shadow-sm focus:outline-none 
                    focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onClick={() => datePickerRef_starDay.current.setOpen(true)}>
                      <DatePicker
                        dateFormat="yyyy-MM-dd"
                        selected={item.startDate}
                        ref={datePickerRef_starDay}
                        onChange={(date) => handleDateChange(section.id, item.id, 'startDate', date)}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                  </div>

                  {/* Ngày kết thúc */}
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
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="block text-sm font-medium text-gray-700 mb-1">
                    <p>Nội dung</p>
                  </div>
                  <RichTextEditor />
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="bg-blue-500 p-4 rounded-lg flex justify-around">
        <button
          onClick={() => addItem(sections[sections.length - 1].id, 'lecture')}
          className="text-white flex items-center justify-between"
        >
          Lecture <Plus size={18} className="ml-1" />
        </button>
        <button
          onClick={() => addItem(sections[sections.length - 1].id, 'quiz')}
          className="text-white flex items-center justify-between"
        >
          Quiz <Plus size={18} className="ml-1" />
        </button>
        <button
          onClick={() => addItem(sections[sections.length - 1].id, 'assignment')}
          className="text-white flex items-center justify-between"
        >
          Assignment <Plus size={18} className="ml-1" />
        </button>
        <button
          onClick={() => addItem(sections[sections.length - 1].id, 'resource')}
          className="text-white flex items-center justify-between"
        >
          Resource <Plus size={18} className="ml-1" />
        </button>
      </div>
    </div>
  );
}