import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaEdit, FaSave, FaTimes, FaClock, FaShare, FaUser } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import ShareTaskModal from './ShareTaskModal';
import './TaskCard.css';

const TaskCard = ({ task, onUpdate, onDelete, isOwner = true, sharedBy = null, permission = 'VIEW' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const { isDark } = useTheme();

  const priorityConfig = {
    URGENT: { label: 'Urgente', color: '#EF4444' },
    HIGH: { label: 'Alta', color: '#F97316' },
    MEDIUM: { label: 'Media', color: '#F59E0B' },
    LOW: { label: 'Baixa', color: '#10B981' }
  };

  const statusConfig = {
    PENDING: { label: 'Pendente', color: '#F59E0B' },
    IN_PROGRESS: { label: 'Em andamento', color: '#3B82F6' },
    COMPLETED: { label: 'Concluida', color: '#10B981' },
    CANCELLED: { label: 'Cancelada', color: '#EF4444' }
  };

  const config = priorityConfig[task.priority] || priorityConfig.MEDIUM;
  const status = statusConfig[task.status] || statusConfig.PENDING;

  const cardStyle = {
    background: isDark ? 'rgba(45, 45, 45, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    color: isDark ? 'white' : '#1e1e1e'
  };

  const handleUpdate = () => {
    onUpdate(task.id, editedTask);
    setIsEditing(false);
  };

  const getDate = (date) => {
    const now = new Date();
    const taskDate = new Date(date);
    const diffHours = Math.floor((now - taskDate) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'agora mesmo';
    if (diffHours < 24) return diffHours + ' horas atras';
    return taskDate.toLocaleDateString('pt-BR');
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="task-card edit-mode"
        style={cardStyle}
      >
        <input
          type="text"
          value={editedTask.title}
          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
          placeholder="Titulo"
          style={{
            background: isDark ? '#1e1e1e' : '#f5f5f5',
            color: isDark ? 'white' : '#1e1e1e',
            border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.5)'
          }}
        />
        <textarea
          value={editedTask.description || ''}
          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          placeholder="Descricao"
          style={{
            background: isDark ? '#1e1e1e' : '#f5f5f5',
            color: isDark ? 'white' : '#1e1e1e',
            border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.5)'
          }}
        />
        <select
          value={editedTask.priority}
          onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
          style={{
            background: isDark ? '#1e1e1e' : '#f5f5f5',
            color: isDark ? 'white' : '#1e1e1e',
            border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.5)'
          }}
        >
          <option value="LOW">Baixa</option>
          <option value="MEDIUM">Media</option>
          <option value="HIGH">Alta</option>
          <option value="URGENT">Urgente</option>
        </select>
        <div className="edit-actions">
          <button onClick={handleUpdate} className="save-btn">
            <FaSave /> Salvar
          </button>
          <button onClick={() => setIsEditing(false)} className="cancel-btn">
            <FaTimes /> Cancelar
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="task-card"
        style={{ ...cardStyle, borderLeftColor: config.color }}
      >
        <div className="task-header">
          <div className="task-title-section">
            <span className="priority-badge" style={{ background: `${config.color}20`, color: config.color }}>
              {config.label}
            </span>
            <span className="status-badge" style={{ color: status.color }}>
              {status.label}
            </span>
          </div>
          <div className="task-actions">
            {!isOwner && permission === 'VIEW' && (
              <span className="view-only-badge">Ì¥ç Apenas visualiza√ß√£o</span>
            )}
            {isOwner && (
              <button onClick={() => setIsShareModalOpen(true)} className="icon-btn share">
                <FaShare />
              </button>
            )}
            {(isOwner || permission === 'EDIT') && (
              <button onClick={() => setIsEditing(true)} className="icon-btn edit">
                <FaEdit />
              </button>
            )}
            {isOwner && (
              <button onClick={() => onDelete(task.id)} className="icon-btn delete">
                <FaTrash />
              </button>
            )}
            {!isOwner && (
              <button onClick={() => onDelete(task.id)} className="icon-btn delete">
                <FaTrash />
              </button>
            )}
          </div>
        </div>

        {sharedBy && (
          <div className="shared-by">
            <FaUser size={12} />
            <span>Compartilhado por: {sharedBy}</span>
          </div>
        )}

        <h3 className="task-title" style={{ color: isDark ? 'white' : '#1e1e1e' }}>
          {task.title}
        </h3>
        
        {task.description && (
          <p className="task-description" style={{ color: isDark ? '#a0aec0' : '#718096' }}>
            {task.description}
          </p>
        )}

        <div className="task-status">
          <select
            value={task.status}
            onChange={(e) => onUpdate(task.id, { status: e.target.value })}
            className="status-select"
            disabled={!isOwner && permission === 'VIEW'}
            style={{
              background: isDark ? '#1e1e1e' : '#f5f5f5',
              color: isDark ? 'white' : '#1e1e1e',
              border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.5)',
              opacity: (!isOwner && permission === 'VIEW') ? 0.6 : 1,
              cursor: (!isOwner && permission === 'VIEW') ? 'not-allowed' : 'pointer'
            }}
          >
            <option value="PENDING">Pendente</option>
            <option value="IN_PROGRESS">Em andamento</option>
            <option value="COMPLETED">Concluida</option>
            <option value="CANCELLED">Cancelada</option>
          </select>
        </div>

        <div className="task-footer">
          <FaClock className="footer-icon" style={{ color: isDark ? '#a0aec0' : '#718096' }} />
          <span className="task-date" style={{ color: isDark ? '#a0aec0' : '#718096' }}>
            Criado {getDate(task.createdAt)}
          </span>
        </div>
      </motion.div>

      {isOwner && (
        <ShareTaskModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          task={task}
        />
      )}
    </>
  );
};

export default TaskCard;
