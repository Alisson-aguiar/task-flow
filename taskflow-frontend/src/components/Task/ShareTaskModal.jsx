import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaShare, FaEnvelope, FaUserPlus, FaLock } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './ShareTaskModal.css';

const ShareTaskModal = ({ isOpen, onClose, task, onShared }) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('VIEW');
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();

  const handleShare = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Digite um email');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/tasks/${task.id}/share`, { email, permission });
      toast.success(`Tarefa compartilhada com ${email}`);
      setEmail('');
      if (onShared) onShared();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao compartilhar');
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
            className="share-modal-overlay"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className={`share-modal-content ${isDark ? 'dark' : ''}`}
          >
            <div className="share-modal-header">
              <h2>
                <FaShare style={{ color: '#8B5CF6' }} />
                Compartilhar Tarefa
              </h2>
              <button onClick={onClose} className="share-close-btn">
                <FaTimes />
              </button>
            </div>

            <div className="share-task-info">
              <h3>{task.title}</h3>
              <p>{task.description || 'Sem descrição'}</p>
            </div>

            <form onSubmit={handleShare}>
              <div className="share-form-group">
                <label>Email do usuário</label>
                <div className="share-input-wrapper">
                  <FaEnvelope className="share-input-icon" />
                  <input
                    type="email"
                    placeholder="usuario@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="share-form-group">
                <label>Permissão</label>
                <div className="share-permission-buttons">
                  <button
                    type="button"
                    className={`share-permission-btn ${permission === 'VIEW' ? 'active' : ''}`}
                    onClick={() => setPermission('VIEW')}
                  >
                    <FaLock /> Apenas visualizar
                  </button>
                  <button
                    type="button"
                    className={`share-permission-btn ${permission === 'EDIT' ? 'active' : ''}`}
                    onClick={() => setPermission('EDIT')}
                  >
                    <FaUserPlus /> Pode editar
                  </button>
                </div>
              </div>

              <div className="share-modal-actions">
                <button type="button" onClick={onClose} className="share-cancel-btn">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="share-submit-btn">
                  {loading ? 'Compartilhando...' : 'Compartilhar'}
                  <FaShare />
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareTaskModal;
