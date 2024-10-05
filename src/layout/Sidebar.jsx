import React, { useState } from 'react'
import { Menu, X, ChevronRight, ChevronDown } from 'lucide-react'

export default function CollapsibleSidebarMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [sections, setSections] = useState([
    { id: 'chung', title: 'Chung', isExpanded: false },
    { id: 'section1', title: 'New section', isExpanded: false },
    { id: 'section2', title: 'New section', isExpanded: false },
    { id: 'section3', title: 'New section', isExpanded: false },
    { id: 'section4', title: 'New section', isExpanded: false },
  ])

  const toggleSidebar = () => setIsOpen(!isOpen)

  const toggleSection = (id) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, isExpanded: !section.isExpanded } : section
    ))
  }

  return (
    <div className="relative">
      {/* Nút để mở hoặc đóng Sidebar */}
      <button
        onClick={toggleSidebar}
        className="fixed top-32 left-2 z-50 p-2 bg-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Sidebar */}
      <div className={`fixed top-35 left-0 h-screen bg-white shadow-lg transition-all duration-300 ${isOpen ? 'w-48' : 'w-0'} overflow-hidden`}>
        <div className="p-4 h-full">
          <nav className="mt-12">
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    className="flex items-center justify-between w-full p-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                    onClick={() => toggleSection(section.id)}
                  >
                    <span>{section.title}</span>
                    {section.id === 'chung' ? (
                      <ChevronRight size={20} />
                    ) : (
                      section.isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />
                    )}
                  </button>
                  {section.isExpanded && section.id !== 'chung' && (
                    <div className="pl-4 mt-2 space-y-2">
                      <p className="text-sm text-gray-600">Subsection content</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Khi Sidebar mở ra, thêm khoảng cách cho nội dung chính */}
      <div className={`transition-all duration-300 ${isOpen ? 'ml-48' : 'ml-0'}`}>
        {/* Nội dung chính của trang */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
