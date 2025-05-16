import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ 
  data, 
  title = '', 
  xAxisLabel = '', 
  yAxisLabel = '',
  height = 250,
  className = '',
  horizontal = false,
  barThickness = 20,
  showGridLines = true,
  colorScheme = 'blue'
}) => {
  const { theme } = useTheme();
  const [showTable, setShowTable] = useState(false);
  
  if (!data || !data.labels || !data.datasets) {
    return <div>Dados não disponíveis</div>;
  }
    
  // Configuração de cores com base no esquema selecionado
  const getColorScheme = () => {
    const schemes = {
      blue: ['rgba(54, 162, 235, 0.8)'],
      green: ['rgba(75, 192, 92, 0.8)'],
      red: ['rgba(255, 99, 132, 0.8)'],
      orange: ['rgba(255, 159, 64, 0.8)'],
      purple: ['rgba(153, 102, 255, 0.8)'],
      mixed: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(75, 192, 92, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(153, 102, 255, 0.8)'
      ]
    };
    return schemes[colorScheme] || schemes.blue;
  };
  
  // Preparar os dados para o Chart.js
  const chartData = {
    labels: data.labels,
    datasets: [{
      label: title,
      data: data.datasets[0].data,
      backgroundColor: data.datasets[0].backgroundColor || getColorScheme(),
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    scales: {
      x: {
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel,
          font: { size: 12 },
          color: '#666666'
        },
        grid: {
          display: showGridLines && !horizontal,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: { size: 11 }
        }
      },
      y: {
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          font: { size: 12 },
          color: '#666666'
        },
        grid: {
          display: showGridLines && horizontal,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: { size: 11 }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        displayColors: false
      }
    },
    barThickness: barThickness
  };

  // Função para alternar entre gráfico e tabela
  const toggleView = () => setShowTable(!showTable);

  // Tabela com os mesmos dados
  const renderTable = () => (
    <div className="overflow-x-auto border rounded-lg mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {xAxisLabel || 'Item'}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {yAxisLabel || 'Valor'}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.labels.map((label, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {label}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {data.datasets[0].data[index]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={`${className} bg-white p-4 rounded-lg shadow-md`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <button 
          onClick={toggleView} 
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center"
        >
          {showTable ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Ver gráfico
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Ver tabela
            </>
          )}
        </button>
      </div>
      
      <div style={{ height: `${height}px` }} className="w-full">
        {showTable ? (
          renderTable()
        ) : (
          <Bar data={chartData} options={chartOptions} height={height} />
        )}
      </div>
    </div>
  );
};

export default BarChart;
