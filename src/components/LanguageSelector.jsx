import React, { useState } from 'react';

const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'te', label: 'తెలుగు (Telugu)' }
];

export default function LanguageSelector({ onLanguageChange }) {
  const [currentLang, setCurrentLang] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = async (e) => {
    const selectedLangCode = e.target.value;
    setCurrentLang(selectedLangCode);
    
    if (!onLanguageChange) return;

    if (selectedLangCode === 'en') {
      onLanguageChange('en', null);
      return;
    }

    try {
      setIsLoading(true);
      
      const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8000'
        : 'https://climate-twin-backend.onrender.com';

      const response = await fetch(`${BACKEND_URL}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: "Climate Twin Integration Hub. Running Scenario Projection.", 
          targetLanguage: selectedLangCode
        })
      });
      
      const data = await response.json();
      onLanguageChange(selectedLangCode, data.translatedText);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-1.5">
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        {isLoading ? "..." : "Lang:"}
      </span>
      <select 
        value={currentLang} 
        onChange={handleLanguageChange}
        disabled={isLoading}
        className="bg-slate-900/60 text-xs text-slate-300 rounded border border-slate-800 px-2 py-1 focus:outline-none focus:border-cyan-500 disabled:opacity-50 cursor-pointer font-medium"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-[#0b1324] text-slate-200">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}