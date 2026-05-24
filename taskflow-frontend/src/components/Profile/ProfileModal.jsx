import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaInfoCircle, FaLock, FaCamera, FaSave, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './ProfileModal.css';

const ProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { isDark } = useTheme();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.profile?.bio || '');
      setPhone(user.profile?.phone || '');
      
      const baseUrl = 'http://localhost:3333';
      if (user.profile?.avatar) {
        setAvatarPreview(`${baseUrl}${user.profile.avatar}`);
      } else {
        setAvatarPreview(`https://ui-avatars.com/api/?background=8B5CF6&color=fff&name=${encodeURIComponent(user.name || 'U')}&size=100`);
      }
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Tipo de arquivo não suportado. Use: JPG, PNG, GIF, WEBP');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Arquivo muito grande. Máximo 5MB');
        return;
      }
      
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatar) return null;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', avatar);
    
    try {
      const response = await api.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000
      });
      
      if (response.data.avatar) {
        toast.success('Avatar atualizado!');
        return response.data.avatar;
      }
      return null;
    } catch (error) {
      console.error('Erro no upload:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Erro ao enviar avatar');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarUrl = null;
      if (avatar) {
        avatarUrl = await uploadAvatar();
      }

      await api.put('/profile', { name, bio, phone });
      
      toast.success('Perfil atualizado com sucesso!');
      
      const response = await api.get('/profile');
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      if (onUpdate) onUpdate(updatedUser);
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await api.put('/profile/change-password', { currentPassword, newPassword });
      toast.success('Senha alterada com sucesso!');
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao alterar senha');
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
            className="profile-modal-overlay"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="profile-modal-content"
            style={modalStyle}
          >
            <div className="profile-modal-header">
              <h2>
                <FaUser style={{ color: '#8B5CF6' }} />
                Meu Perfil
              </h2>
              <button onClick={onClose} className="profile-close-btn">
                <FaTimes />
              </button>
            </div>

            <div className="profile-avatar-section">
              <div className="profile-avatar-wrapper">
                <img 
                  src={avatarPreview} 
                  alt="Avatar"
                  className="profile-avatar"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?background=8B5CF6&color=fff&name=${encodeURIComponent(user?.name || 'U')}&size=100`;
                  }}
                />
                <label className={`profile-avatar-upload ${uploading ? 'uploading' : ''}`}>
                  {uploading ? <FaSpinner className="spinner" /> : <FaCamera />}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            {!showPasswordForm ? (
              <form onSubmit={handleUpdateProfile}>
                <div className="profile-form-group">
                  <label>Nome</label>
                  <div className="profile-input-wrapper">
                    <FaUser className="profile-input-icon" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                </div>

                <div className="profile-form-group">
                  <label>Email</label>
                  <div className="profile-input-wrapper">
                    <FaEnvelope className="profile-input-icon" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    />
                  </div>
                </div>

                <div className="profile-form-group">
                  <label>Telefone</label>
                  <div className="profile-input-wrapper">
                    <FaPhone className="profile-input-icon" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div className="profile-form-group">
                  <label>Biografia</label>
                  <div className="profile-input-wrapper">
                    <FaInfoCircle className="profile-input-icon" />
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Conte um pouco sobre você..."
                      rows="3"
                    />
                  </div>
                </div>

                <div className="profile-modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(true)}
                    className="profile-password-btn"
                  >
                    <FaLock /> Alterar Senha
                  </button>
                  <button type="submit" disabled={loading || uploading} className="profile-save-btn">
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                    <FaSave />
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleChangePassword}>
                <div className="profile-form-group">
                  <label>Senha Atual</label>
                  <div className="profile-input-wrapper">
                    <FaLock className="profile-input-icon" />
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Digite sua senha atual"
                      required
                    />
                  </div>
                </div>

                <div className="profile-form-group">
                  <label>Nova Senha</label>
                  <div className="profile-input-wrapper">
                    <FaLock className="profile-input-icon" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      required
                    />
                  </div>
                </div>

                <div className="profile-form-group">
                  <label>Confirmar Nova Senha</label>
                  <div className="profile-input-wrapper">
                    <FaLock className="profile-input-icon" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme a nova senha"
                      required
                    />
                  </div>
                </div>

                <div className="profile-modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="profile-cancel-btn"
                  >
                    <FaArrowLeft /> Voltar
                  </button>
                  <button type="submit" disabled={loading} className="profile-save-btn">
                    {loading ? 'Alterando...' : 'Alterar Senha'}
                    <FaLock />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
