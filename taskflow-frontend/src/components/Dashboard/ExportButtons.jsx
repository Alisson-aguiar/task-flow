import React from 'react';
import { motion } from 'framer-motion';
import { FaFileExcel, FaFilePdf, FaFileCsv } from 'react-icons/fa';
import { exportToExcel, exportToPDF, exportToCSV } from '../../utils/export';
import { useTheme } from '../../contexts/ThemeContext';

const ExportButtons = ({ tasks, userName }) => {
  const { isDark } = useTheme();

  const buttonStyle = {
    background: isDark ? 'rgba(45, 45, 45, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.5)',
    color: isDark ? 'white' : '#1e1e1e'
  };

  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => exportToExcel(tasks)}
        className="export-btn"
        style={{ ...buttonStyle, padding: '0.5rem 1rem', borderRadius: '12px', cursor: 'pointer' }}
      >
        <FaFileExcel style={{ color: '#10B981' }} /> Excel
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => exportToPDF(tasks, userName)}
        className="export-btn"
        style={{ ...buttonStyle, padding: '0.5rem 1rem', borderRadius: '12px', cursor: 'pointer' }}
      >
        <FaFilePdf style={{ color: '#EF4444' }} /> PDF
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => exportToCSV(tasks)}
        className="export-btn"
        style={{ ...buttonStyle, padding: '0.5rem 1rem', borderRadius: '12px', cursor: 'pointer' }}
      >
        <FaFileCsv style={{ color: '#8B5CF6' }} /> CSV
      </motion.button>
    </div>
  );
};

export default ExportButtons;
