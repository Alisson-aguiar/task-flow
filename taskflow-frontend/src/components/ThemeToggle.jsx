import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      onClick={toggleTheme}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '12px',
        padding: '0.5rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
      }}
    >
      {isDark ? (
        <FaSun style={{ color: '#F59E0B', fontSize: '1.2rem' }} />
      ) : (
        <FaMoon style={{ color: '#8B5CF6', fontSize: '1.2rem' }} />
      )}
    </motion.button>
  );
};

export default ThemeToggle;
