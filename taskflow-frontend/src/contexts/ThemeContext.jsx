import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Aplicar classe ao body
    if (isDark) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      document.body.style.background = '#1e1e1e';
      document.body.style.color = '#ffffff';
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      document.body.style.background = '#f5f5f5';
      document.body.style.color = '#1e1e1e';
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
