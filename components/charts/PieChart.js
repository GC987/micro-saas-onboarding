import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale
} from 'chart.js';

// Registrar componentes do Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale
);

const PieChart = ({
  data,
  title = '',
  height = 250,
  donut = false,
  className = '',
  showLegend = true,
  showPercentage = false,
  legendPosition = 'top'
}) => {
  const { theme } = useTheme();
  const [showTable, setShowTable] = useState(false);
  
  if (!data || !data.labels || !data.datasets) {
    return <div>Dados não disponíveis</div>;
  }

  // Preparar os dados para o Chart.js
  const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
  const percentages = data.datasets[0].data.map(value => ((value / total) * 100).toFixed(1));
  
  const chartData = {
    labels: showPercentage 
      ? data.labels.map((label, i) => `${label} (${percentages[i]}%)`) 
      : data.labels,
    datasets: [{
      data: data.datasets[0].data,
      backgroundColor: data.datasets[0].backgroundColor || [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)'
      ],
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 2
    }]
  };
  
  // Opções para configuração do gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: legendPosition,
        labels: {
          font: { size: 13 },
          usePointStyle: true,
          padding: 20,
          color: '#4B5563'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
      title: {
        display: false // O título está fora do gráfico agora
      }
    },
    cutout: donut ? '60%' : undefined
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
              Item
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Percentual
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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {percentages[index]}%
              </td>
            </tr>
          ))}
          <tr className="bg-gray-100">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Total</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{total}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">100%</td>
          </tr>
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
          donut ? (
            <Doughnut data={chartData} options={chartOptions} height={height} />
          ) : (
            <Pie data={chartData} options={chartOptions} height={height} />
          )
        )}
      </div>
    </div>
  );
};

export default PieChart;
