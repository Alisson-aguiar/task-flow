import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
import { MdPerson, MdEmail, MdLock } from 'react-icons/md';
import './Auth.css';

const Register = ({ onRegister, onSwitch }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Senhas não coincidem';
    if (!name.trim()) newErrors.name = 'Nome é obrigatório';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    const success = await onRegister(name, email, password);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="auth-card"
    >
      <div className="auth-header">
        <h2>Criar conta</h2>
        <p>Comece sua jornada com TaskFlow</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <MdPerson className="input-icon" />
          <input
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {errors.name && <span className="error-message">{errors.name}</span>}

        <div className="input-group">
          <MdEmail className="input-icon" />
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <MdLock className="input-icon" />
          <input
            type="password"
            placeholder="Senha (mínimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errors.password && <span className="error-message">{errors.password}</span>}

        <div className="input-group">
          <MdLock className="input-icon" />
          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="auth-button"
        >
          {loading ? (
            <span className="loading-spinner-small" />
          ) : (
            <>
              Criar conta <FaArrowRight />
            </>
          )}
        </motion.button>
      </form>

      <div className="auth-footer">
        <p>
          Já tem uma conta?{' '}
          <button type="button" onClick={onSwitch} className="switch-button">
            Fazer login
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
