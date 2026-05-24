import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useTheme } from '../../contexts/ThemeContext';

// Registrar todos os componentes do Chart.js
Chart.register(...registerables);

const Charts = ({ tasks }) => {
  const { isDark } = useTheme();
  const statusChartRef = useRef(null);
  const priorityChartRef = useRef(null);
  const trendChartRef = useRef(null);
  let statusChartInstance = null;
  let priorityChartInstance = null;
  let trendChartInstance = null;

  useEffect(() => {
    if (tasks.length === 0) return;

    // Destruir instâncias anteriores se existirem
    if (statusChartInstance) statusChartInstance.destroy();
    if (priorityChartInstance) priorityChartInstance.destroy();
    if (trendChartInstance) trendChartInstance.destroy();

    // Dados para gráfico de status
    const statusCount = {
      Pendente: tasks.filter(t => t.status === 'PENDING').length,
      'Em andamento': tasks.filter(t => t.status === 'IN_PROGRESS').length,
      Concluída: tasks.filter(t => t.status === 'COMPLETED').length,
      Cancelada: tasks.filter(t => t.status === 'CANCELLED').length
    };

    // Dados para gráfico de prioridade
    const priorityCount = {
      Urgente: tasks.filter(t => t.priority === 'URGENT').length,
      Alta: tasks.filter(t => t.priority === 'HIGH').length,
      Média: tasks.filter(t => t.priority === 'MEDIUM').length,
      Baixa: tasks.filter(t => t.priority === 'LOW').length
    };

    // Dados para tendência semanal
    const getLast7Days = () => {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push({
          date: date,
          day: date.toLocaleDateString('pt-BR', { weekday: 'short' })
        });
      }
      return days;
    };

    const weeklyData = getLast7Days().map(day => {
      const tasksOnDay = tasks.filter(t => {
        const taskDate = new Date(t.createdAt);
        return taskDate.toDateString() === day.date.toDateString();
      });
      return {
        day: day.day,
        criadas: tasksOnDay.length,
        completadas: tasksOnDay.filter(t => t.status === 'COMPLETED').length
      };
    });

    const textColor = isDark ? '#ffffff' : '#1e1e1e';
    const gridColor = isDark ? '#333333' : '#e0e0e0';

    // Gráfico de Status (Pizza)
    const statusCtx = statusChartRef.current?.getContext('2d');
    if (statusCtx) {
      statusChartInstance = new Chart(statusCtx, {
        type: 'pie',
        data: {
          labels: Object.keys(statusCount),
          datasets: [{
            data: Object.values(statusCount),
            backgroundColor: ['#F59E0B', '#3B82F6', '#10B981', '#EF4444'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: textColor, font: { size: 11 } }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = Object.values(statusCount).reduce((a, b) => a + b, 0);
                  const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return `${label}: ${value} (${percent}%)`;
                }
              }
            }
          }
        }
      });
    }

    // Gráfico de Prioridade (Barra)
    const priorityCtx = priorityChartRef.current?.getContext('2d');
    if (priorityCtx) {
      priorityChartInstance = new Chart(priorityCtx, {
        type: 'bar',
        data: {
          labels: Object.keys(priorityCount),
          datasets: [{
            label: 'Quantidade',
            data: Object.values(priorityCount),
            backgroundColor: ['#EF4444', '#F97316', '#F59E0B', '#10B981'],
            borderRadius: 8,
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.raw || 0;
                  const total = Object.values(priorityCount).reduce((a, b) => a + b, 0);
                  const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return `${value} tarefa(s) (${percent}%)`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: textColor, stepSize: 1 },
              grid: { color: gridColor }
            },
            x: {
              ticks: { color: textColor },
              grid: { display: false }
            }
          }
        }
      });
    }

    // Gráfico de Tendência (Linha)
    const trendCtx = trendChartRef.current?.getContext('2d');
    if (trendCtx) {
      trendChartInstance = new Chart(trendCtx, {
        type: 'line',
        data: {
          labels: weeklyData.map(d => d.day),
          datasets: [
            {
              label: 'Tarefas Criadas',
              data: weeklyData.map(d => d.criadas),
              borderColor: '#8B5CF6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#8B5CF6',
              pointBorderColor: '#ffffff',
              pointRadius: 4,
              pointHoverRadius: 6
            },
            {
              label: 'Tarefas Concluídas',
              data: weeklyData.map(d => d.completadas),
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#10B981',
              pointBorderColor: '#ffffff',
              pointRadius: 4,
              pointHoverRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'top',
              labels: { color: textColor, font: { size: 11 } }
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: textColor, stepSize: 1 },
              grid: { color: gridColor }
            },
            x: {
              ticks: { color: textColor },
              grid: { display: false }
            }
          }
        }
      });
    }

    return () => {
      if (statusChartInstance) statusChartInstance.destroy();
      if (priorityChartInstance) priorityChartInstance.destroy();
      if (trendChartInstance) trendChartInstance.destroy();
    };
  }, [tasks, isDark]);

  const cardStyle = {
    background: isDark ? 'rgba(45, 45, 45, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    border: isDark ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(139, 92, 246, 0.3)'
  };

  if (tasks.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '3rem', 
        ...cardStyle,
        borderRadius: '20px',
        marginBottom: '2rem'
      }}>
        
        <h3 style={{ color: isDark ? 'white' : '#1e1e1e' }}>Nenhum dado disponível</h3>
        <p style={{ color: isDark ? '#a0aec0' : '#718096' }}>Crie tarefas para visualizar estatísticas</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
      gap: '1.5rem',
      marginBottom: '2rem'
    }}>
      {/* Gráfico de Status */}
      <div style={{ ...cardStyle, borderRadius: '20px', padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: isDark ? 'white' : '#1e1e1e', fontSize: '1rem' }}>
          Status das Tarefas
        </h3>
        <canvas ref={statusChartRef} style={{ maxHeight: '280px', width: '100%' }} />
      </div>

      {/* Gráfico de Prioridade */}
      <div style={{ ...cardStyle, borderRadius: '20px', padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: isDark ? 'white' : '#1e1e1e', fontSize: '1rem' }}>
          Prioridades
        </h3>
        <canvas ref={priorityChartRef} style={{ maxHeight: '280px', width: '100%' }} />
      </div>

      {/* Gráfico de Tendência Semanal */}
      <div style={{ ...cardStyle, borderRadius: '20px', padding: '1.5rem', gridColumn: 'span 2' }}>
        <h3 style={{ marginBottom: '1rem', color: isDark ? 'white' : '#1e1e1e', fontSize: '1rem' }}>
          Tendência Semanal
        </h3>
        <canvas ref={trendChartRef} style={{ maxHeight: '280px', width: '100%' }} />
      </div>
    </div>
  );
};

export default Charts;
