import React, { useEffect, useState, useRef } from "react";

const languages = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
  { code: "zh-CN", label: "中文" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italian" },
  { code: "fr", label: "Français" },
  { code: "hi", label: "हिंदी" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "ru", label: "Русский" },
  { code: "pt", label: "Português" },
  { code: "ms", label: "Melayu" },
  { code: "th", label: "แบบไทย" },
  { code: "de", label: "Deutsch" },
];

const flagMap = {
  'en': 'https://flagcdn.com/w20/us.png',
  'ar': 'https://flagcdn.com/w20/sa.png',
  'zh-CN': 'https://flagcdn.com/w20/cn.png',
  'es': 'https://flagcdn.com/w20/es.png',
  'it': 'https://flagcdn.com/w20/it.png',
  'fr': 'https://flagcdn.com/w20/fr.png',
  'hi': 'https://flagcdn.com/w20/in.png',
  'vi': 'https://flagcdn.com/w20/vn.png',
  'ja': 'https://flagcdn.com/w20/jp.png',
  'ko': 'https://flagcdn.com/w20/kr.png',
  'ru': 'https://flagcdn.com/w20/ru.png',
  'pt': 'https://flagcdn.com/w20/pt.png',
  'ms': 'https://flagcdn.com/w20/my.png',
  'th': 'https://flagcdn.com/w20/th.png',
  'de': 'https://flagcdn.com/w20/de.png',
};

const GoogleTranslate = () => {
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState('top');
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // ✅ Load Google Translate only once globally
  useEffect(() => {
    // if google already loaded, skip
    if (window.googleTranslateScriptAdded) return;

    window.googleTranslateScriptAdded = true;

    window.googleTranslateElementInit = function () {
      // Prevent double initialization
      if (!window.googleTranslateInitialized) {
        window.googleTranslateInitialized = true;
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element"
        );
      }
    };

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // ✅ Always position dropdown below the button
  useEffect(() => {
    setDropdownPosition('bottom');
  }, []);

  // ✅ Language change
  const handleLanguageClick = (lang) => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = lang.code;
      select.dispatchEvent(new Event("change"));
      setCurrentLang(lang);
      setIsOpen(false);
    } else {
      console.warn("Google Translate not yet initialized");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Hidden Google Widget */}
      <div id="google_translate_element" style={{ display: "none" }}></div>

      {/* Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        type="button"
        id="googleTranslateDropdown"
        aria-expanded={isOpen}
      >
        <img src={flagMap[currentLang.code]} alt={currentLang.label} className="mr-2 w-5 h-5" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul
          className={`relative right-0 lg:right-32 md:right-0  w-full sm:w-80 md:w-80 bg-white border border-gray-300 rounded-md shadow-lg z-50 p-2 dark:bg-gray-800 dark:border-gray-600 ${
            dropdownPosition === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'
          }`}
          aria-labelledby="googleTranslateDropdown"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {languages.map((lang) => (
              <div key={lang.code} className="col-span-1">
                <li
                  role="button"
                  tabIndex={0}
                  onClick={() => handleLanguageClick(lang)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleLanguageClick(lang)
                  }
                  className="flex items-center p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <img src={flagMap[lang.code]} alt={lang.label} className="mr-2 w-5 h-5" />
                  <span className="text-sm text-black dark:text-white">{lang.label}</span>
                </li>
              </div>
            ))}
          </div>
        </ul>
      )}
    </div>
  );
};

export default GoogleTranslate;