import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';

const KanbanColumn = ({ title, color, tasks, status, onUpdateTask, onDeleteTask, isDark }) => {
  const { setNodeRef } = useDroppable({ id: status });

  const columnStyle = {
    background: isDark ? 'rgba(45, 45, 45, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    border: isDark ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(139, 92, 246, 0.3)'
  };

  return (
    <div className="kanban-column" style={columnStyle}>
      <div className="kanban-column-header" style={{ borderBottomColor: color }}>
        <h3>{title}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div ref={setNodeRef} className="kanban-tasks">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <KanbanCard
              key={task.id}
              task={task}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
              isDark={isDark}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="empty-column">Arraste tarefas para cá</div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;