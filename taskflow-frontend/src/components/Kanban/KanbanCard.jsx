import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaTrash, FaEdit, FaSave, FaTimes, FaClock, FaComments } from 'react-icons/fa';
import './Kanban.css';

const KanbanCard = ({ task, onUpdate, onDelete, isDark, isDragging }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
    cursor: 'grab'
  };

  const priorityColors = {
    URGENT: '#EF4444',
    HIGH: '#F97316',
    MEDIUM: '#F59E0B',
    LOW: '#10B981'
  };

  const handleSave = () => {
    onUpdate(task.id, { title: editedTitle, description: editedDescription });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="kanban-card edit-mode" style={style} ref={setNodeRef}>
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          placeholder="Título"
        />
        <textarea
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          placeholder="Descrição"
          rows="2"
        />
        <div className="card-actions">
          <button onClick={handleSave} className="save-btn"><FaSave /> Salvar</button>
          <button onClick={() => setIsEditing(false)} className="cancel-btn"><FaTimes /> Cancelar</button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="kanban-card"
      {...attributes}
      {...listeners}
    >
      <div className="card-header">
        <div className="priority-dot" style={{ background: priorityColors[task.priority] }} />
        <div className="card-actions">
          <button onClick={() => setIsEditing(true)} className="icon-btn edit">
            <FaEdit />
          </button>
          <button onClick={() => onDelete(task.id)} className="icon-btn delete">
            <FaTrash />
          </button>
        </div>
      </div>
      <h4>{task.title}</h4>
      {task.description && <p className="card-description">{task.description}</p>}
      <div className="card-footer">
        <FaClock className="footer-icon" />
        <span>{new Date(task.createdAt).toLocaleDateString('pt-BR')}</span>
      </div>
    </div>
  );
};

export default KanbanCard;
