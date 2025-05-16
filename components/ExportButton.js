import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Spinner from './Spinner';

const ExportButton = ({ 
  data, 
  filename = 'export', 
  type = 'pdf',
  label = 'Exportar',
  iconOnly = false,
  size = 'md',
  className = ''
}) => {
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  
  const getButtonSize = () => {
    switch(size) {
      case 'sm': return 'px-2 py-1 text-xs';
      case 'lg': return 'px-5 py-2.5 text-base';
      default: return 'px-3 py-1.5 text-sm';
    }
  };
  
  const handleExport = async () => {
    setLoading(true);
    
    try {
      // Simulação de exportação - em produção, usaríamos uma biblioteca como jsPDF
      // ou faríamos uma chamada à API para gerar o PDF/CSV no servidor
      setTimeout(() => {
        console.log('Exportando dados:', data);
        
        // Exemplo simples: para CSV podemos fazer algo assim
        if (type === 'csv') {
          exportToCSV(data, filename);
        } else {
          // Para PDF, normalmente usaríamos jsPDF ou uma API do servidor
          alert(`Em um ambiente de produção, isso geraria um arquivo ${type.toUpperCase()} para download.`);
        }
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      setLoading(false);
      alert('Erro ao exportar os dados.');
    }
  };
  
  // Função para exportar para CSV
  const exportToCSV = (data, filename) => {
    // Converte o objeto para CSV
    let csv;
    
    if (Array.isArray(data)) {
      // Pegar cabeçalhos do primeiro item
      const headers = Object.keys(data[0] || {}).join(',');
      
      // Mapear os valores
      const values = data.map(item => 
        Object.values(item).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',')
      ).join('\n');
      
      csv = `${headers}\n${values}`;
    } else {
      // Para objeto único
      const headers = Object.keys(data).join(',');
      const values = Object.values(data).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',');
      
      csv = `${headers}\n${values}`;
    }
    
    // Cria um Blob e link para download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <button
      onClick={handleExport}
      disabled={loading}
      style={{ backgroundColor: theme.primaryColor }}
      className={`rounded text-white flex items-center justify-center transition-opacity hover:opacity-90 ${getButtonSize()} ${className}`}
    >
      {loading ? (
        <Spinner size="sm" color="white" />
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${!iconOnly ? 'mr-1.5' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {!iconOnly && `${label} ${type.toUpperCase()}`}
        </>
      )}
    </button>
  );
};

export default ExportButton;
