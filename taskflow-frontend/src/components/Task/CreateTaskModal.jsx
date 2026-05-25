import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';
import './CreateTaskModal.css';

const CreateTaskModal = ({ isOpen, onClose, onCreate }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM'
  });
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();

  const priorities = [
    { value: 'LOW', label: 'Baixa', color: '#10B981', icon: '●' },
    { value: 'MEDIUM', label: 'Média', color: '#F59E0B', icon: '●' },
    { value: 'HIGH', label: 'Alta', color: '#F97316', icon: '●' },
    { value: 'URGENT', label: 'Urgente', color: '#EF4444', icon: '●' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const titleTrimmed = task.title.trim();

    if (!titleTrimmed) {
      toast.error('Digite um título para a tarefa');
      return;
    }

    const taskData = {
      title: titleTrimmed,
      description: task.description || '',
      priority: task.priority
    };

    setLoading(true);

    try {
      const result = await onCreate(taskData);
      if (result !== false) {
        setTask({ title: '', description: '', priority: 'MEDIUM' });
        onClose();
      }
    } catch (err) {
      console.error('Erro no modal:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="create-modal-overlay"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="create-modal-content"
            style={{
              background: isDark ? '#2d2d2d' : '#ffffff',
              border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.3)'
            }}
          >
            <div className="create-modal-header">
              <h2>
                <FaPlus style={{ color: '#8B5CF6' }} />
                Criar Nova Tarefa
              </h2>
              <button onClick={onClose} className="create-close-btn">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="create-form-group">
                <label>Título da tarefa *</label>
                <input
                  type="text"
                  placeholder="Ex: Estudar React"
                  value={task.title}
                  onChange={(e) => setTask({ ...task, title: e.target.value })}
                  required
                  autoFocus
                  style={{
                    background: isDark ? '#1e1e1e' : '#f5f5f5',
                    color: isDark ? 'white' : '#1e1e1e',
                    border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.5)'
                  }}
                />
              </div>

              <div className="create-form-group">
                <label>Descrição</label>
                <textarea
                  placeholder="Descreva sua tarefa..."
                  value={task.description}
                  onChange={(e) => setTask({ ...task, description: e.target.value })}
                  rows="3"
                  style={{
                    background: isDark ? '#1e1e1e' : '#f5f5f5',
                    color: isDark ? 'white' : '#1e1e1e',
                    border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.5)'
                  }}
                />
              </div>

              <div className="create-form-group">
                <label>Prioridade</label>
                <div className="create-priority-buttons">
                  {priorities.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      className={`create-priority-btn ${task.priority === p.value ? 'active' : ''}`}
                      style={{
                        borderColor: task.priority === p.value ? p.color : 'rgba(255,255,255,0.2)',
                        backgroundColor: task.priority === p.value ? `${p.color}20` : 'transparent',
                        color: isDark ? 'white' : '#1e1e1e'
                      }}
                      onClick={() => setTask({ ...task, priority: p.value })}
                    >
                      <span style={{ color: p.color }}>{p.icon}</span>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="create-modal-actions">
                <button type="button" onClick={onClose} className="create-cancel-btn">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="create-submit-btn">
                  {loading ? 'Criando...' : 'Criar Tarefa'}
                  <FaPlus />
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateTaskModal;