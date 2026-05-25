import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { FaTasks, FaCheckCircle, FaSpinner, FaClock, FaChartLine, FaShareAlt, FaList, FaClipboardList, FaCalendarAlt } from 'react-icons/fa';
import Header from '../../components/Layout/Header';
import TaskCard from '../../components/Task/TaskCard';
import CreateTaskModal from '../../components/Task/CreateTaskModal';
import NotificationBell from '../../components/Notifications/NotificationBell';
import Charts from '../../components/Dashboard/Charts';
import ExportButtons from '../../components/Dashboard/ExportButtons';
import { useTasks } from '../../hooks/useTasks';
import { useTheme } from '../../contexts/ThemeContext';
import api from '../../services/api';
import KanbanBoard from '../../components/Kanban/KanbanBoard';
import TaskCalendar from '../../components/Calendar/TaskCalendar';
import './DashboardPage.css';

const DashboardPage = ({ user: initialUser, onLogout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('mine');
  const [sharedTasks, setSharedTasks] = useState([]);
  const [loadingShared, setLoadingShared] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [user, setUser] = useState(initialUser);
  const { tasks, loading, filters, setFilters, createTask, updateTask, deleteTask } = useTasks();
  const { isDark } = useTheme();

  const refreshUser = async () => {
    try {
      const response = await api.get('/profile');
      const updatedUser = response.data.user;
      const userWithProfile = {
        ...updatedUser,
        profile: updatedUser.profile || { avatar: null, bio: '', phone: '' }
      };
      localStorage.setItem('user', JSON.stringify(userWithProfile));
      setUser(userWithProfile);
    } catch (error) {
      console.error('Erro ao recarregar perfil', error);
    }
  };

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser]);

  const loadSharedTasks = async () => {
    setLoadingShared(true);
    try {
      const response = await api.get('/shared-with-me');
      setSharedTasks(response.data.sharedTasks || []);
    } catch (error) {
      console.error('Erro ao carregar tarefas compartilhadas', error);
    } finally {
      setLoadingShared(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'shared') {
      loadSharedTasks();
    }
  }, [activeTab]);

  const stats = [
    { label: 'Total', value: tasks.length, icon: <FaTasks />, color: '#8B5CF6' },
    { label: 'Concluídas', value: tasks.filter(t => t.status === 'COMPLETED').length, icon: <FaCheckCircle />, color: '#10B981' },
    { label: 'Em andamento', value: tasks.filter(t => t.status === 'IN_PROGRESS').length, icon: <FaSpinner />, color: '#3B82F6' },
    { label: 'Pendentes', value: tasks.filter(t => t.status === 'PENDING').length, icon: <FaClock />, color: '#F59E0B' }
  ];

  const progress = tasks.length > 0 
    ? (tasks.filter(t => t.status === 'COMPLETED').length / tasks.length) * 100 
    : 0;

  const cardStyle = {
    background: isDark ? 'rgba(45, 45, 45, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    border: isDark ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(139, 92, 246, 0.3)'
  };

  const updateSharedTask = async (taskId, data) => {
    try {
      await api.put(`/tasks/${taskId}`, data);
      toast.success('Tarefa atualizada!');
      loadSharedTasks();
    } catch (error) {
      toast.error('Erro ao atualizar tarefa');
    }
  };

  const removeSharedTask = async (taskId, sharedWithEmail) => {
    try {
      await api.delete(`/tasks/${taskId}/share/${sharedWithEmail}`);
      toast.success('Compartilhamento removido');
      loadSharedTasks();
    } catch (error) {
      toast.error('Erro ao remover compartilhamento');
    }
  };

  const handleCreateTask = async (taskData) => {
    return await createTask(taskData);
  };

  // Componente de loading centralizado
  if (loading && tasks.length === 0) {
    return (
      <div className="fullscreen-loading">
        <div className="loading-spinner"></div>
        <p>Carregando tarefas...</p>
      </div>
    );
  }

  return (
    <div className={`dashboard ${isDark ? 'dark' : 'light'}`}>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: { 
            background: isDark ? '#2d2d2d' : '#ffffff',
            color: isDark ? '#fff' : '#1e1e1e',
            borderRadius: '12px'
          },
          success: { duration: 3000 },
          error: { duration: 4000 }
        }} 
      />
      
      <Header
        user={user}
        onLogout={onLogout}
        onOpenModal={() => setIsModalOpen(true)}
        onFilterChange={setFilters}
        currentFilter={filters}
        onProfileUpdate={refreshUser}
      />

      <div className="dashboard-actions">
        <div className="actions-left">
          <ExportButtons tasks={tasks} userName={user?.name} />
        </div>
        <div className="actions-right">
          <NotificationBell userId={user?.id} />
        </div>
      </div>

      <main className="dashboard-main">
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'mine' ? 'active' : ''}`}
            onClick={() => setActiveTab('mine')}
          >
            <FaTasks /> Minhas Tarefas
          </button>
          <button
            className={`tab-btn ${activeTab === 'shared' ? 'active' : ''}`}
            onClick={() => setActiveTab('shared')}
          >
            <FaShareAlt /> Compartilhadas
            {sharedTasks.length > 0 && <span className="tab-badge">{sharedTasks.length}</span>}
          </button>
        </div>

        {activeTab === 'mine' ? (
          <>
            <div className="view-toggle">
              <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                <FaList /> Lista
              </button>
              <button className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`} onClick={() => setViewMode('kanban')}>
                <FaClipboardList /> Kanban
              </button>
              <button className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`} onClick={() => setViewMode('calendar')}>
                <FaCalendarAlt /> Calendário
              </button>
            </div>

            <div className="stats-container">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="stat-card"
                  style={cardStyle}
                >
                  <div className="stat-icon" style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="stat-info">
                    <h3 style={{ color: isDark ? '#a0aec0' : '#718096' }}>{stat.label}</h3>
                    <p style={{ color: isDark ? 'white' : '#1e1e1e' }}>{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="progress-section" style={cardStyle}>
              <div className="progress-header">
                <FaChartLine style={{ color: '#8B5CF6' }} />
                <h3 style={{ color: isDark ? 'white' : '#1e1e1e' }}>Progresso</h3>
                <span style={{ color: '#8B5CF6' }}>{Math.round(progress)}%</span>
              </div>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1 }}
                  style={{ background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)' }}
                />
              </div>
            </div>

            <Charts tasks={tasks} />

            {viewMode === 'list' && (
              <div className="tasks-section">
                <h2 style={{ color: isDark ? 'white' : '#1e1e1e' }}>
                  <FaTasks /> Minhas Tarefas
                  <span className="task-count">{tasks.length}</span>
                </h2>
                
                {tasks.length === 0 ? (
                  <div className="empty-state" style={cardStyle}>
                    <div className="empty-icon">📭</div>
                    <h3>Nenhuma tarefa</h3>
                    <p>Crie sua primeira tarefa!</p>
                  </div>
                ) : (
                  <div className="tasks-grid">
                    {tasks.map((task) => (
                      <TaskCard 
                        key={task.id}
                        task={task} 
                        onUpdate={updateTask} 
                        onDelete={deleteTask}
                        isOwner={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {viewMode === 'kanban' && (
              <KanbanBoard tasks={tasks} onUpdateTask={updateTask} onDeleteTask={deleteTask} />
            )}

            {viewMode === 'calendar' && (
              <TaskCalendar tasks={tasks} />
            )}
          </>
        ) : (
          <div className="tasks-section">
            <h2 style={{ color: isDark ? 'white' : '#1e1e1e' }}>
              <FaShareAlt /> Tarefas Compartilhadas
              <span className="task-count">{sharedTasks.length}</span>
            </h2>
            
            {loadingShared ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Carregando...</p>
              </div>
            ) : sharedTasks.length === 0 ? (
              <div className="empty-state" style={cardStyle}>
                <div className="empty-icon">🔗</div>
                <h3>Nenhuma tarefa compartilhada</h3>
              </div>
            ) : (
              <div className="tasks-grid">
                {sharedTasks.map((share) => (
                  <TaskCard 
                    key={share.id}
                    task={share.task} 
                    onUpdate={updateSharedTask} 
                    onDelete={() => removeSharedTask(share.taskId, share.sharedWith)}
                    isOwner={false}
                    sharedBy={share.task.user.name}
                    permission={share.permission}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTask}
      />
    </div>
  );
};

export default DashboardPage;