import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragOverlay, defaultDropAnimation } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useTheme } from '../../contexts/ThemeContext';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './Kanban.css';

const KanbanBoard = ({ tasks: initialTasks, onUpdateTask, onDeleteTask }) => {
  const { isDark } = useTheme();
  const [activeId, setActiveId] = useState(null);
  const [localTasks, setLocalTasks] = useState(initialTasks);

  // Atualizar tarefas locais quando as props mudarem
  useEffect(() => {
    setLocalTasks(initialTasks);
  }, [initialTasks]);

  const columns = {
    'PENDING': { title: '📋 Pendente', color: '#F59E0B', tasks: localTasks.filter(t => t.status === 'PENDING') },
    'IN_PROGRESS': { title: '🚧 Em andamento', color: '#3B82F6', tasks: localTasks.filter(t => t.status === 'IN_PROGRESS') },
    'COMPLETED': { title: '✅ Concluída', color: '#10B981', tasks: localTasks.filter(t => t.status === 'COMPLETED') },
    'CANCELLED': { title: '❌ Cancelada', color: '#EF4444', tasks: localTasks.filter(t => t.status === 'CANCELLED') }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    const task = localTasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      // Atualizar localmente primeiro
      setLocalTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ));
      // Depois enviar para o servidor
      await onUpdateTask(taskId, { status: newStatus });
    }
  };

  // Função para atualizar tarefa localmente
  const handleUpdateTask = async (taskId, updates) => {
    // Atualizar localmente primeiro para UI responsiva
    setLocalTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, ...updates } : t
    ));
    // Depois enviar para o servidor
    await onUpdateTask(taskId, updates);
  };

  // Função para deletar tarefa
  const handleDeleteTask = async (taskId) => {
    // Remover localmente primeiro
    setLocalTasks(prev => prev.filter(t => t.id !== taskId));
    // Depois enviar para o servidor
    await onDeleteTask(taskId);
  };

  return (
    <div className="kanban-board">
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-columns">
          {Object.entries(columns).map(([status, column]) => (
            <SortableContext
              key={status}
              items={column.tasks.map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                title={column.title}
                color={column.color}
                tasks={column.tasks}
                status={status}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                isDark={isDark}
              />
            </SortableContext>
          ))}
        </div>
        <DragOverlay dropAnimation={defaultDropAnimation}>
          {activeId ? (
            <KanbanCard
              task={localTasks.find(t => t.id === activeId)}
              isDark={isDark}
              isDragging
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;