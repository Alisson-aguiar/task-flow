import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: '', priority: '' });

  const loadTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);

      const response = await api.get(`/tasks?${params.toString()}`);
      setTasks(response.data.tasks || []);
      return response.data.tasks;
    } catch (error) {
      console.error('Erro ao carregar tarefas', error);
      setTasks([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadTasks();
    }
  }, [filters]);

  const createTask = async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      if (response.data && response.data.task) {
        // Recarregar a lista
        await loadTasks();
        // Mostrar toast de sucesso APENAS AQUI
        toast.success('Tarefa criada com sucesso!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao criar tarefa', error);
      // Mostrar toast de erro APENAS AQUI
      toast.error(error.response?.data?.message || 'Erro ao criar tarefa');
      return false;
    }
  };

  const updateTask = async (id, data) => {
    try {
      const response = await api.put(`/tasks/${id}`, data);
      if (response.data) {
        await loadTasks();
        toast.success('Tarefa atualizada!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao atualizar tarefa', error);
      toast.error('Erro ao atualizar tarefa');
      return false;
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      await loadTasks();
      toast.success('Tarefa deletada!');
      return true;
    } catch (error) {
      console.error('Erro ao deletar tarefa', error);
      toast.error('Erro ao deletar tarefa');
      return false;
    }
  };

  return {
    tasks,
    loading,
    filters,
    setFilters,
    createTask,
    updateTask,
    deleteTask,
    loadTasks
  };
};