import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Login from '../../components/Auth/Login';
import Register from '../../components/Auth/Register';
import './AuthPage.css';

const AuthPage = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-particles"></div>
      </div>
      
      <div className="auth-container">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="auth-hero"
        >
          <h1 className="gradient-text">TaskFlow</h1>
          <p>Gerencie suas tarefas de forma inteligente e produtiva</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isLogin ? (
            <Login onLogin={onLogin} onSwitch={() => setIsLogin(false)} />
          ) : (
            <Register onRegister={onRegister} onSwitch={() => setIsLogin(true)} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
