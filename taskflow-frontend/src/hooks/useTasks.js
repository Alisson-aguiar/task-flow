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
      setTasks(response.data.tasks);
    } catch (error) {
      toast.error('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const createTask = async (taskData) => {
    setLoading(true);
    try {
      await api.post('/tasks', taskData);
      toast.success('Tarefa criada com sucesso!');
      await loadTasks();
      return true;
    } catch (error) {
      toast.error('Erro ao criar tarefa');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, data) => {
    try {
      await api.put(`/tasks/${id}`, data);
      toast.success('Tarefa atualizada!');
      await loadTasks();
    } catch (error) {
      toast.error('Erro ao atualizar tarefa');
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Tarefa deletada!');
      await loadTasks();
    } catch (error) {
      toast.error('Erro ao deletar tarefa');
    }
  };

  return { tasks, loading, filters, setFilters, createTask, updateTask, deleteTask, loadTasks };
};
