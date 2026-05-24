import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';

// Exportar para Excel
export const exportToExcel = (tasks, filename = 'tarefas') => {
  const data = tasks.map(task => ({
    'Título': task.title,
    'Descrição': task.description || '',
    'Status': task.status === 'COMPLETED' ? 'Concluída' : 
               task.status === 'IN_PROGRESS' ? 'Em andamento' :
               task.status === 'PENDING' ? 'Pendente' : 'Cancelada',
    'Prioridade': task.priority === 'URGENT' ? 'Urgente' :
                  task.priority === 'HIGH' ? 'Alta' :
                  task.priority === 'MEDIUM' ? 'Média' : 'Baixa',
    'Criado em': new Date(task.createdAt).toLocaleDateString('pt-BR'),
    'Atualizado em': new Date(task.updatedAt).toLocaleDateString('pt-BR')
  }));
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Tarefas');
  XLSX.writeFile(wb, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
};

// Exportar para PDF
export const exportToPDF = (tasks, username = 'Usuário') => {
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const pendingCount = tasks.filter(t => t.status === 'PENDING').length;
  const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const cancelledCount = tasks.filter(t => t.status === 'CANCELLED').length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length * 100).toFixed(1) : 0;

  // Calcular tarefas por prioridade
  const urgentCount = tasks.filter(t => t.priority === 'URGENT').length;
  const highCount = tasks.filter(t => t.priority === 'HIGH').length;
  const mediumCount = tasks.filter(t => t.priority === 'MEDIUM').length;
  const lowCount = tasks.filter(t => t.priority === 'LOW').length;

  // Ordenar tarefas por data de criação (mais recentes primeiro)
  const sortedTasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const element = document.createElement('div');
  element.innerHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>TaskFlow - Relatório de Tarefas</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          padding: 30px;
          background: white;
          font-size: 12px;
        }
        .header {
          text-align: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 3px solid #8B5CF6;
        }
        h1 {
          color: #8B5CF6;
          font-size: 24px;
          margin-bottom: 8px;
        }
        .subtitle {
          color: #666;
          font-size: 11px;
          margin-top: 5px;
        }
        .stats-container {
          display: flex;
          justify-content: space-between;
          margin-bottom: 25px;
          gap: 15px;
          flex-wrap: wrap;
        }
        .stat-group {
          flex: 1;
          min-width: 200px;
        }
        .stat-card {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 10px;
          border: 1px solid #e0e0e0;
        }
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #8B5CF6;
        }
        .stat-label {
          font-size: 11px;
          color: #666;
          margin-top: 5px;
        }
        .progress-container {
          margin: 20px 0;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 10px;
        }
        .progress-title {
          font-weight: bold;
          margin-bottom: 8px;
          color: #333;
        }
        .progress-bar-wrapper {
          position: relative;
          width: 100%;
          height: 24px;
          background: #e0e0e0;
          border-radius: 12px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8B5CF6, #EC4899);
          border-radius: 12px;
          transition: width 0.3s ease;
        }
        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 11px;
          font-weight: bold;
          z-index: 1;
          text-shadow: 0 0 2px rgba(0,0,0,0.5);
        }
        h3 {
          margin: 20px 0 10px 0;
          color: #333;
          font-size: 14px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 11px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px 8px;
          text-align: left;
          vertical-align: top;
        }
        th {
          background: #8B5CF6;
          color: white;
          font-weight: bold;
          text-align: center;
        }
        td {
          background: white;
        }
        /* Cores da tabela */
        .task-title {
          color: #1e1e1e;
          font-weight: 600;
          font-size: 12px;
        }
        .task-description {
          color: #1e1e1e;
          font-size: 11px;
          line-height: 1.4;
        }
        .task-date {
          color: #1e1e1e;
          text-align: center;
        }
        .status-completed {
          color: #10B981;
          font-weight: bold;
          text-align: center;
        }
        .status-pending {
          color: #F59E0B;
          font-weight: bold;
          text-align: center;
        }
        .status-progress {
          color: #3B82F6;
          font-weight: bold;
          text-align: center;
        }
        .status-cancelled {
          color: #EF4444;
          font-weight: bold;
          text-align: center;
        }
        .priority-urgent {
          color: #EF4444;
          font-weight: bold;
          text-align: center;
        }
        .priority-high {
          color: #F97316;
          font-weight: bold;
          text-align: center;
        }
        .priority-medium {
          color: #F59E0B;
          font-weight: bold;
          text-align: center;
        }
        .priority-low {
          color: #10B981;
          font-weight: bold;
          text-align: center;
        }
        .footer {
          margin-top: 25px;
          text-align: center;
          font-size: 10px;
          color: #999;
          padding-top: 15px;
          border-top: 1px solid #ddd;
        }
        @media print {
          body {
            padding: 20px;
          }
          .stat-card {
            break-inside: avoid;
          }
          tr {
            break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1> TaskFlow - Relatório de Tarefas</h1>
        <div class="subtitle">Gerado em: ${new Date().toLocaleString('pt-BR')}</div>
        <div class="subtitle">Usuário: ${username}</div>
      </div>

      <div class="stats-container">
        <div class="stat-group">
          <div class="stat-card">
            <div class="stat-value">${tasks.length}</div>
            <div class="stat-label">Total de Tarefas</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${progress}%</div>
            <div class="stat-label">Progresso Geral</div>
          </div>
        </div>
        <div class="stat-group">
          <div class="stat-card">
            <div class="stat-value" style="color: #10B981;">${completedCount}</div>
            <div class="stat-label">✅ Concluídas</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color: #3B82F6;">${inProgressCount}</div>
            <div class="stat-label"> Em andamento</div>
          </div>
        </div>
        <div class="stat-group">
          <div class="stat-card">
            <div class="stat-value" style="color: #F59E0B;">${pendingCount}</div>
            <div class="stat-label">⏳ Pendentes</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color: #EF4444;">${cancelledCount}</div>
            <div class="stat-label">❌ Canceladas</div>
          </div>
        </div>
        <div class="stat-group">
          <div class="stat-card">
            <div class="stat-value" style="color: #EF4444;">${urgentCount}</div>
            <div class="stat-label"> Urgentes</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color: #10B981;">${lowCount}</div>
            <div class="stat-label"> Baixa prioridade</div>
          </div>
        </div>
      </div>

      <div class="progress-container">
        <div class="progress-title">Progresso de Conclusão</div>
        <div class="progress-bar-wrapper">
          <div class="progress-fill" style="width: ${progress}%;"></div>
          <div class="progress-text">${progress}%</div>
        </div>
      </div>

      <h3> Lista de Tarefas</h3>
      
      <table>
        <thead>
          <tr>
            <th style="width: 25%">Título</th>
            <th style="width: 35%">Descrição</th>
            <th style="width: 15%">Status</th>
            <th style="width: 15%">Prioridade</th>
            <th style="width: 10%">Data de Criação</th>
          </tr>
        </thead>
        <tbody>
          ${sortedTasks.map(task => {
            let statusClass = '';
            let statusText = '';
            switch(task.status) {
              case 'COMPLETED':
                statusClass = 'status-completed';
                statusText = 'Concluída';
                break;
              case 'IN_PROGRESS':
                statusClass = 'status-progress';
                statusText = 'Em andamento';
                break;
              case 'PENDING':
                statusClass = 'status-pending';
                statusText = 'Pendente';
                break;
              case 'CANCELLED':
                statusClass = 'status-cancelled';
                statusText = 'Cancelada';
                break;
              default:
                statusText = task.status;
            }
            
            let priorityClass = '';
            let priorityText = '';
            switch(task.priority) {
              case 'URGENT':
                priorityClass = 'priority-urgent';
                priorityText = 'Urgente';
                break;
              case 'HIGH':
                priorityClass = 'priority-high';
                priorityText = 'Alta';
                break;
              case 'MEDIUM':
                priorityClass = 'priority-medium';
                priorityText = 'Média';
                break;
              case 'LOW':
                priorityClass = 'priority-low';
                priorityText = 'Baixa';
                break;
              default:
                priorityText = task.priority;
            }
            
            return `
              <tr>
                <td class="task-title">${task.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
                <td class="task-description">${(task.description || '—').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
                <td class="${statusClass}">${statusText}</td>
                <td class="${priorityClass}">${priorityText}</td>
                <td class="task-date">${new Date(task.createdAt).toLocaleDateString('pt-BR')}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      ${sortedTasks.length === 0 ? `
        <div style="text-align: center; padding: 40px; color: #999;">
          Nenhuma tarefa encontrada
        </div>
      ` : ''}

      <div class="footer">
        <p>Relatório gerado automaticamente pelo TaskFlow</p>
        <p>Total de tarefas: ${tasks.length} | Concluídas: ${completedCount} | Pendentes: ${pendingCount}</p>
        <p>© ${new Date().getFullYear()} TaskFlow - Todos os direitos reservados</p>
      </div>
    </body>
    </html>
  `;

  const opt = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: `taskflow-relatorio-${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, letterRendering: true, useCORS: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
  };
  
  html2pdf().set(opt).from(element).save();
};

// Exportar para CSV
export const exportToCSV = (tasks, filename = 'tarefas') => {
  const headers = ['Título', 'Descrição', 'Status', 'Prioridade', 'Data de Criação'];
  const rows = tasks.map(task => [
    task.title,
    task.description || '',
    task.status === 'COMPLETED' ? 'Concluída' : 
    task.status === 'IN_PROGRESS' ? 'Em andamento' :
    task.status === 'PENDING' ? 'Pendente' : 'Cancelada',
    task.priority === 'URGENT' ? 'Urgente' :
    task.priority === 'HIGH' ? 'Alta' :
    task.priority === 'MEDIUM' ? 'Média' : 'Baixa',
    new Date(task.createdAt).toLocaleDateString('pt-BR')
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
