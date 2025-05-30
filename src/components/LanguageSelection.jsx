import { useEffect, useState, useRef } from "react"
import { ChevronDown } from "lucide-react"
import i18n from 'i18next'

// SVG Flags
const gbFlag = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 rounded-full">
    <path fill="#012169" d="M0 0h512v512H0z" />
    <path fill="#FFF" d="M512 0v64L322 256l190 187v69h-67L254 324 68 512H0v-68l186-187L0 74V0h62l192 188L440 0z" />
    <path fill="#C8102E" d="m184 324 11 34L42 512H0v-3zm124-12 54 8 150 147v45zM512 0 320 196l-4-44L466 0zM0 1l193 189-59-8L0 49z" />
    <path fill="#FFF" d="M176 0v512h160V0zM0 176v160h512V176z" />
    <path fill="#C8102E" d="M0 208v96h512v-96zM208 0v512h96V0z" />
  </svg>
)

const vnFlag = (
  <svg xmlns="http://www.w3.org/2000/svg"
    id="flag-icons-vn" viewBox="0 0 512 512">
    <defs>
      <clipPath id="vn-a">
        <path fillOpacity=".7"
          d="M177.2 0h708.6v708.7H177.2z">
        </path>
      </clipPath>
    </defs>
    <g fillRule="evenodd" clipPath="url(#vn-a)" transform="translate(-128)scale(.72249)">
      <path fill="#da251d" d="M0 0h1063v708.7H0z"></path>
      <path fill="#ff0" d="m661 527.5-124-92.6-123.3 93.5 45.9-152-123.2-93.8 152.4-1.3L536 129.8 584.3 281l152.4.2-122.5 94.7z"></path>
    </g>
  </svg>
)


const languages = [
  { code: "vi", name: "Vietnamese", flag: vnFlag },
  { code: "en", name: "English", flag: gbFlag },
]

export default function LanguageSelection() {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])


  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const savedLangCode = localStorage.getItem("lang")
    if (savedLangCode) {
      const lang = languages.find((l) => l.code === savedLangCode)
      if (lang) setSelectedLanguage(lang)
    }
  }, [])

  const toggleDropdown = () => setIsOpen(!isOpen)

  const selectLanguage = (language) => {
    setSelectedLanguage(language)
    setIsOpen(false)
    localStorage.setItem("lang", language.code)
    i18n.changeLanguage(language.code)
  }

  return (
    <div className="text-left" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center gap-2 py-2 text-sm font-medium text-white "
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full ring-1 ring-slate-300 overflow-hidden">
            {selectedLanguage.flag}
          </span>
          <span>{selectedLanguage.name}</span>
        </span>
        <ChevronDown className="w-4 h-4 text-slate-500" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white border border-slate-200 rounded-md shadow-lg">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {languages.map((language) => (
              <button
                key={language.code}
                className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-sky-50 ${selectedLanguage.code === language.code ? "bg-green-100 font-semibold" : ""
                  }`}
                role="menuitem"
                onClick={() => selectLanguage(language)}
              >
                <span className="w-5 h-5 rounded-full ring-1 ring-slate-300 overflow-hidden">
                  {language.flag}
                </span>
                <span>{language.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
