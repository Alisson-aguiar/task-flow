import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { useTheme } from '../../contexts/ThemeContext';
import 'react-calendar/dist/Calendar.css';
import './TaskCalendar.css';

const TaskCalendar = ({ tasks, onSelectDate }) => {
  const { isDark } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getTasksForDate = (date) => {
    const dateStr = date.toDateString();
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt).toDateString();
      return taskDate === dateStr;
    });
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const tasksOnDate = getTasksForDate(date);
      if (tasksOnDate.length > 0) {
        const completed = tasksOnDate.filter(t => t.status === 'COMPLETED').length;
        const urgent = tasksOnDate.filter(t => t.priority === 'URGENT').length;
        
        return (
          <div className="calendar-tile-badge">
            {urgent > 0 && <span className="urgent-badge">!</span>}
            <span className="task-count-badge">{tasksOnDate.length}</span>
            {completed === tasksOnDate.length && tasksOnDate.length > 0 && (
              <span className="completed-badge">✓</span>
            )}
          </div>
        );
      }
    }
    return null;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (onSelectDate) {
      onSelectDate(date, getTasksForDate(date));
    }
  };

  const tasksOnSelected = getTasksForDate(selectedDate);

  const cardStyle = {
    background: isDark ? 'rgba(45, 45, 45, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    border: isDark ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(139, 92, 246, 0.3)'
  };

  return (
    <div className="task-calendar-container">
      <div className="calendar-wrapper" style={cardStyle}>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileContent={tileContent}
          locale="pt-BR"
          className={isDark ? 'dark-calendar' : 'light-calendar'}
        />
      </div>
      
      {tasksOnSelected.length > 0 && (
        <div className="selected-date-tasks" style={cardStyle}>
          <h3>Tarefas de {selectedDate.toLocaleDateString('pt-BR')}</h3>
          <div className="date-tasks-list">
            {tasksOnSelected.map(task => (
              <div key={task.id} className="date-task-item">
                <span className={`task-priority-dot priority-${task.priority}`} />
                <div className="task-info">
                  <strong>{task.title}</strong>
                  <span className={`task-status status-${task.status}`}>
                    {task.status === 'PENDING' ? 'Pendente' :
                     task.status === 'IN_PROGRESS' ? 'Em andamento' :
                     task.status === 'COMPLETED' ? 'Concluída' : 'Cancelada'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCalendar;
