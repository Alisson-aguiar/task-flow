import React, { useState } from 'react';
import { DndContext, closestCenter, DragOverlay, defaultDropAnimation } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useTheme } from '../../contexts/ThemeContext';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import './Kanban.css';

const KanbanBoard = ({ tasks, onUpdateTask, onDeleteTask }) => {
  const { isDark } = useTheme();
  const [activeId, setActiveId] = useState(null);

  const columns = {
    'PENDING': { title: 'Pendente', color: '#F59E0B', tasks: tasks.filter(t => t.status === 'PENDING') },
    'IN_PROGRESS': { title: 'Em andamento', color: '#3B82F6', tasks: tasks.filter(t => t.status === 'IN_PROGRESS') },
    'COMPLETED': { title: 'Concluída', color: '#10B981', tasks: tasks.filter(t => t.status === 'COMPLETED') },
    'CANCELLED': { title: 'Cancelada', color: '#EF4444', tasks: tasks.filter(t => t.status === 'CANCELLED') }
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

    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      await onUpdateTask(taskId, { status: newStatus });
    }
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
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
                isDark={isDark}
              />
            </SortableContext>
          ))}
        </div>
        <DragOverlay dropAnimation={defaultDropAnimation}>
          {activeId ? (
            <KanbanCard
              task={tasks.find(t => t.id === activeId)}
              isDark={isDark}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
