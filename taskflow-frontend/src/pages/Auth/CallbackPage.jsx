import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const CallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');
    
    console.log('CallbackPage recebido:', { token: !!token, error });
    
    if (error) {
      toast.error('Falha na autenticação. Tente novamente.');
      navigate('/login');
    } else if (token) {
      // Salvar token
      localStorage.setItem('token', token);
      console.log('Token salvo no localStorage');
      
      // Buscar dados completos do perfil
      fetch('http://localhost:3333/api/v1/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error('Erro ao buscar perfil');
          return res.json();
        })
        .then(data => {
          if (data.user) {
            // Garantir que o profile está completo
            const userData = {
              ...data.user,
              profile: data.user.profile || { avatar: null, bio: '', phone: '' }
            };
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('Usuário salvo:', userData.name);
            console.log('Avatar:', userData.profile?.avatar);
            toast.success(`Bem-vindo, ${userData.name}!`);
          }
          navigate('/dashboard');
        })
        .catch((err) => {
          console.error('Erro ao buscar perfil:', err);
          navigate('/dashboard');
        });
    } else {
      console.log('Nenhum token encontrado');
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '1rem' }}>Autenticando, aguarde...</p>
      </div>
    </div>
  );
};

export default CallbackPage;
