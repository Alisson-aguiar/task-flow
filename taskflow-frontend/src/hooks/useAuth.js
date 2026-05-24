import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Função para buscar o perfil completo do usuário
  const fetchUserProfile = async (token) => {
    try {
      const response = await api.get('/profile');
      if (response.data.user) {
        const userData = {
          ...response.data.user,
          profile: response.data.user.profile || { avatar: null, bio: '', phone: '' }
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    const initAuth = async () => {
      if (token) {
        try {
          // Buscar dados atualizados do servidor
          const userData = await fetchUserProfile(token);
          if (userData) {
            setIsAuthenticated(true);
          } else if (storedUser) {
            // Fallback para dados do localStorage
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
          }
        } catch (e) {
          console.error('Erro ao autenticar', e);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/register', { name, email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      
      // Buscar perfil completo
      const userWithProfile = await fetchUserProfile(token);
      if (userWithProfile) {
        setUser(userWithProfile);
      } else {
        setUser(user);
      }
      
      setIsAuthenticated(true);
      toast.success('Conta criada com sucesso!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao criar conta');
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      
      // Buscar perfil completo
      const userWithProfile = await fetchUserProfile(token);
      if (userWithProfile) {
        setUser(userWithProfile);
      } else {
        setUser(user);
      }
      
      setIsAuthenticated(true);
      toast.success('Bem-vindo de volta!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao fazer login');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logout realizado');
  };

  return { user, loading, isAuthenticated, register, login, logout };
};
