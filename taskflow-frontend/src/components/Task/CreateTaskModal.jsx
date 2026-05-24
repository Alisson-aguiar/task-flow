import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../services/api';
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
    if (!task.title.trim()) {
      toast.error('Digite um título para a tarefa');
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/tasks', task);
      toast.success('Tarefa criada com sucesso!');
      setTask({ title: '', description: '', priority: 'MEDIUM' });
      if (onCreate) onCreate();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao criar tarefa');
    } finally {
      setLoading(false);
    }
  };

  const modalStyle = {
    background: isDark ? '#2d2d2d' : '#ffffff',
    border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.3)'
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
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="create-modal-content"
            style={modalStyle}
          >
            <div className="create-modal-header">
              <h2>
                <FaPlus style={{ color: '#8B5CF6' }} />
                Criar Nova Tarefa
              </h2>
              <motion.button
                whileHover={{ rotate: 90 }}
                onClick={onClose}
                className="create-close-btn"
              >
                <FaTimes />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="create-form-group">
                <label>Título da tarefa *</label>
                <input
                  type="text"
                  placeholder="Ex: Estudar React, Fazer deploy, etc."
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
                  placeholder="Descreva os detalhes da sua tarefa..."
                  value={task.description}
                  onChange={(e) => setTask({ ...task, description: e.target.value })}
                  rows="4"
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
                    <motion.button
                      key={p.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      className={`create-priority-btn ${task.priority === p.value ? 'active' : ''}`}
                      style={{
                        borderColor: task.priority === p.value ? p.color : 'rgba(255,255,255,0.2)',
                        backgroundColor: task.priority === p.value ? `${p.color}20` : 'transparent',
                        color: isDark ? 'white' : '#1e1e1e'
                      }}
                      onClick={() => setTask({ ...task, priority: p.value })}
                    >
                      <span style={{ color: p.color, fontSize: '16px' }}>{p.icon}</span>
                      {p.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="create-modal-actions">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="create-cancel-btn"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: isDark ? 'white' : '#1e1e1e'
                  }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="create-submit-btn"
                >
                  {loading ? 'Criando...' : 'Criar Tarefa'}
                  <FaPlus />
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateTaskModal;
