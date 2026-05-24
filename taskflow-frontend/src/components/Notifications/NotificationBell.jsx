import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaTimes, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaShare } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../services/api';
import { getSocket, initializeSocket } from '../../services/socket';
import './NotificationBell.css';

const NotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    if (userId) {
      loadNotifications();
      
      // Inicializar socket
      const socket = initializeSocket(userId);
      
      // Ouvir notificações em tempo real
      if (socket) {
        socket.on(`notification-${userId}`, (notification) => {
          console.log('Nova notificação recebida:', notification);
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);
        });
      }
    }
    
    return () => {
      const socket = getSocket();
      if (socket) {
        socket.off(`notification-${userId}`);
      }
    };
  }, [userId]);

  const loadNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Erro ao carregar notificações', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar como lida', error);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    for (const id of unreadIds) {
      await markAsRead(id);
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'TASK_SHARED':
        return <FaShare style={{ color: '#8B5CF6' }} />;
      case 'TASK_CREATED':
        return <FaCheckCircle style={{ color: '#10B981' }} />;
      case 'TASK_COMPLETED':
        return <FaCheckCircle style={{ color: '#10B981' }} />;
      case 'REMINDER':
        return <FaExclamationTriangle style={{ color: '#F59E0B' }} />;
      default:
        return <FaInfoCircle style={{ color: '#8B5CF6' }} />;
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMinutes = Math.floor((now - past) / 1000 / 60);
    
    if (diffMinutes < 1) return 'agora';
    if (diffMinutes < 60) return `${diffMinutes} min atrás`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h atrás`;
    return `${Math.floor(diffMinutes / 1440)}d atrás`;
  };

  const dropdownStyle = {
    background: isDark ? '#2d2d2d' : '#ffffff',
    border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.5)'
  };

  return (
    <div className="notification-wrapper">
      <button 
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.5)',
          color: isDark ? 'white' : '#1e1e1e'
        }}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="notification-dropdown"
            style={dropdownStyle}
          >
            <div className="notification-header">
              <h3 style={{ color: isDark ? 'white' : '#1e1e1e' }}>Notificações</h3>
              <div className="notification-header-actions">
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="mark-all-read">
                    Marcar todas
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="close-btn">
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="empty-notifications">
                  <span>���</span>
                  <p style={{ color: isDark ? '#a0aec0' : '#718096' }}>Nenhuma notificação</p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`notification-item ${!notif.read ? 'unread' : ''}`}
                    onClick={() => markAsRead(notif.id)}
                    style={{
                      background: !notif.read && isDark ? 'rgba(139, 92, 246, 0.1)' : 
                                 !notif.read && !isDark ? 'rgba(139, 92, 246, 0.05)' : 'transparent'
                    }}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div className="notification-content">
                      <h4 style={{ color: isDark ? 'white' : '#1e1e1e' }}>{notif.title}</h4>
                      <p style={{ color: isDark ? '#a0aec0' : '#718096' }}>{notif.message}</p>
                      <span className="notification-time" style={{ color: isDark ? '#718096' : '#a0aec0' }}>
                        {getTimeAgo(notif.createdAt)}
                      </span>
                    </div>
                    {!notif.read && <div className="notification-unread-dot" />}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
