import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaFilter, FaSignOutAlt, FaUser, FaChevronDown, FaTimes } from 'react-icons/fa';
import ThemeToggle from '../ThemeToggle';
import { useTheme } from '../../contexts/ThemeContext';
import ProfileModal from '../Profile/ProfileModal';
import './Header.css';

const Header = ({ user, onLogout, onOpenModal, onFilterChange, currentFilter, onProfileUpdate }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const { isDark } = useTheme();
  
  const userName = user?.name || 'Usuario';
  const firstName = userName.split(' ')[0];
  
  // Atualizar avatar quando o user mudar
  useEffect(() => {
    const baseUrl = 'http://localhost:3333';
    const userAvatar = user?.profile?.avatar;
    
    if (userAvatar) {
      setAvatarUrl(`${baseUrl}${userAvatar}`);
    } else {
      setAvatarUrl(`https://ui-avatars.com/api/?background=8B5CF6&color=fff&name=${encodeURIComponent(firstName)}&size=32`);
    }
  }, [user, firstName]);

  const headerStyle = {
    background: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    borderBottom: isDark ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(139, 92, 246, 0.3)'
  };

  return (
    <>
      <header className="header" style={headerStyle}>
        <div className="header-container">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="logo"
          >
            
            <span className="logo-text">TaskFlow</span>
          </motion.div>

          <div className="header-actions">
            <ThemeToggle />
            
            <div className="filters-wrapper">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="filter-btn"
                style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.5)',
                  color: isDark ? 'white' : '#1e1e1e'
                }}
              >
                <FaFilter />
                <span>Filtrar</span>
                <FaChevronDown className={`filter-icon ${showFilters ? 'rotated' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="filters-dropdown"
                    style={{
                      background: isDark ? '#2d2d2d' : 'white',
                      border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.5)'
                    }}
                  >
                    <select
                      value={currentFilter.status}
                      onChange={(e) => onFilterChange({ ...currentFilter, status: e.target.value })}
                      style={{
                        background: isDark ? '#1e1e1e' : '#f5f5f5',
                        color: isDark ? 'white' : '#1e1e1e',
                        border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.5)'
                      }}
                    >
                      <option value="">Todos os status</option>
                      <option value="PENDING">Pendente</option>
                      <option value="IN_PROGRESS">Em andamento</option>
                      <option value="COMPLETED">Concluida</option>
                      <option value="CANCELLED">Cancelada</option>
                    </select>

                    <select
                      value={currentFilter.priority}
                      onChange={(e) => onFilterChange({ ...currentFilter, priority: e.target.value })}
                      style={{
                        background: isDark ? '#1e1e1e' : '#f5f5f5',
                        color: isDark ? 'white' : '#1e1e1e',
                        border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.5)'
                      }}
                    >
                      <option value="">Todas prioridades</option>
                      <option value="LOW">Baixa</option>
                      <option value="MEDIUM">Media</option>
                      <option value="HIGH">Alta</option>
                      <option value="URGENT">Urgente</option>
                    </select>

                    <button
                      onClick={() => onFilterChange({ status: '', priority: '' })}
                      className="clear-filters"
                    >
                      <FaTimes /> Limpar filtros
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenModal}
              className="create-task-btn"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                color: 'white'
              }}
            >
              <FaPlus />
              <span>Nova Tarefa</span>
            </motion.button>

            <div className="user-menu" style={{
              background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.5)'
            }}>
              <button onClick={() => setShowProfileModal(true)} className="profile-btn">
                <img 
                  src={avatarUrl}
                  alt="Avatar"
                  className="profile-avatar-header"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?background=8B5CF6&color=fff&name=${encodeURIComponent(firstName)}&size=32`;
                  }}
                />
              </button>
              <span className="user-name" style={{ color: isDark ? 'white' : '#1e1e1e' }}>{firstName}</span>
              <motion.button
                whileHover={{ x: 3 }}
                onClick={onLogout}
                className="logout-btn"
                style={{ color: '#EF4444' }}
              >
                <FaSignOutAlt />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onUpdate={onProfileUpdate}
      />
    </>
  );
};

export default Header;
