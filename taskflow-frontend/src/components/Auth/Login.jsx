import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight, FaGithub, FaGoogle } from 'react-icons/fa';
import { MdEmail, MdLock } from 'react-icons/md';
import './Auth.css';

const Login = ({ onLogin, onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await onLogin(email, password);
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3333/api/v1/auth/google';
  };

  const handleGithubLogin = () => {
    window.location.href = 'http://localhost:3333/api/v1/auth/github';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="auth-card"
    >
      <div className="auth-header">
        <h2>Bem-vindo de volta</h2>
        <p>Faça login para continuar</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

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
              Entrar <FaArrowRight />
            </>
          )}
        </motion.button>
      </form>

      <div className="auth-divider">
        <span>ou continue com</span>
      </div>

      <div className="social-buttons">
        <button type="button" onClick={handleGoogleLogin} className="social-btn">
          <FaGoogle /> Google
        </button>
        <button type="button" onClick={handleGithubLogin} className="social-btn">
          <FaGithub /> GitHub
        </button>
      </div>

      <div className="auth-footer">
        <p>
          Não tem uma conta?{' '}
          <button type="button" onClick={onSwitch} className="switch-button">
            Criar conta
          </button>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
