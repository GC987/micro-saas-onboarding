// Dados simulados para o dashboard de análises
// Em uma implementação real, estes dados viriam de uma API backend

export const analyticsData = {
  // Distribuição de status dos checklists
  statusDistribution: {
    labels: ['Pendente', 'Em progresso', 'Respondido', 'Concluído', 'Cancelado'],
    datasets: [
      {
        data: [14, 8, 22, 35, 5],
        backgroundColor: ['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EF4444']
      }
    ]
  },
  
  // Taxa de conclusão por categoria de checklist
  completionRateByCategory: {
    labels: ['Site', 'E-commerce', 'Consultoria', 'Jurídico', 'Contabilidade'],
    datasets: [
      {
        data: [78, 92, 64, 85, 70],
        backgroundColor: '#3B82F6'
      }
    ]
  },
  
  // Tempo médio de resposta por semana (em horas)
  responseTimeByWeek: {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    datasets: [
      {
        label: 'Tempo médio (horas)',
        data: [28, 19, 15, 12],
        borderColor: '#3B82F6',
        fill: true
      }
    ]
  },
  
  // Quantidade de checklists criados por mês
  checklistsCreatedByMonth: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Checklists Criados',
        data: [12, 19, 15, 8, 22, 17],
        borderColor: '#10B981',
        backgroundColor: '#10B981'
      }
    ]
  },
  
  // Taxa de conclusão por mês (%)
  completionRateByMonth: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Taxa de Conclusão (%)',
        data: [62, 68, 70, 73, 80, 85],
        borderColor: '#8B5CF6',
        fill: true
      }
    ]
  },
  
  // KPIs para diferentes períodos
  kpis: {
    '7d': {
      totalChecklists: 24,
      completionRate: 82,
      responseTime: 16.2,
      abandonmentRate: 8,
      growth: {
        totalChecklists: 15,
        completionRate: 8,
        responseTime: -10,
        abandonmentRate: -25
      }
    },
    '30d': {
      totalChecklists: 84,
      completionRate: 76,
      responseTime: 18.5,
      abandonmentRate: 12,
      growth: {
        totalChecklists: 12,
        completionRate: 5,
        responseTime: -12,
        abandonmentRate: 2
      }
    },
    '90d': {
      totalChecklists: 210,
      completionRate: 70,
      responseTime: 21.3,
      abandonmentRate: 15,
      growth: {
        totalChecklists: 25,
        completionRate: 4,
        responseTime: -8,
        abandonmentRate: 5
      }
    }
  }
};

// Funções para filtrar os dados por categoria
export const filterDataByCategory = (data, category) => {
  if (category === 'all') return data;
  
  // Em uma implementação real, você filtraria os dados com base na categoria
  // Para esta simulação, vamos retornar dados ligeiramente modificados
  
  const getRandomAdjustment = () => {
    return Math.random() * 0.3 + 0.85; // Fator entre 0.85 e 1.15
  };
  
  // Cria cópias profundas dos dados e aplica ajustes aleatórios
  const result = JSON.parse(JSON.stringify(data));
  
  // Ajusta os valores numéricos
  Object.keys(result).forEach(key => {
    if (key === 'kpis') {
      Object.keys(result.kpis).forEach(period => {
        result.kpis[period].totalChecklists = Math.round(result.kpis[period].totalChecklists * getRandomAdjustment());
        result.kpis[period].completionRate = Math.min(100, Math.round(result.kpis[period].completionRate * getRandomAdjustment()));
        result.kpis[period].responseTime = parseFloat((result.kpis[period].responseTime * getRandomAdjustment()).toFixed(1));
        result.kpis[period].abandonmentRate = Math.min(100, Math.round(result.kpis[period].abandonmentRate * getRandomAdjustment()));
      });
    } else if (result[key].datasets) {
      result[key].datasets.forEach(dataset => {
        if (dataset.data) {
          dataset.data = dataset.data.map(value => {
            if (typeof value === 'number') {
              if (key.includes('Rate') || key.includes('Percentage')) {
                return Math.min(100, Math.round(value * getRandomAdjustment()));
              }
              return Math.round(value * getRandomAdjustment());
            }
            return value;
          });
        }
      });
    }
  });
  
  return result;
};

// Função para exportar os dados em diferentes formatos (simulação)
export const exportAnalyticsData = (format) => {
  return new Promise((resolve) => {
    // Simulação de delay para dar a impressão de processamento
    setTimeout(() => {
      // Aqui você geraria o arquivo real no formato solicitado
      resolve({ success: true, format });
    }, 800);
  });
};
