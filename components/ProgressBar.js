import React from 'react';

const ProgressBar = ({ 
  progress = 0, 
  total = 100, 
  showPercentage = true,
  showFraction = false,
  height = "8px",
  color,
  className = "",
  labelClassName = ""
}) => {
  const percentage = Math.round((progress / total) * 100);
  
  // Calcular cor baseada no progresso se não for especificada
  const getDefaultColor = () => {
    if (percentage < 30) return '#ef4444'; // Vermelho
    if (percentage < 70) return '#f59e0b'; // Amarelo
    return '#10b981'; // Verde
  };
  
  const barColor = color || getDefaultColor();
  
  // Calcular tempo estimado (apenas simulação - pode ser implementado de forma mais avançada)
  const getTimeEstimate = () => {
    if (percentage === 100) return 'Concluído!';
    if (percentage === 0) return '~15 min';
    
    const remainingPercentage = 100 - percentage;
    const baseTiming = 15; // Minutos estimados para conclusão completa
    const remainingMinutes = Math.ceil(remainingPercentage * baseTiming / 100);
    
    return `~${remainingMinutes} min`;
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        {showPercentage && (
          <span className={`text-sm font-medium ${labelClassName}`}>
            {percentage}%
          </span>
        )}
        
        {showFraction && (
          <span className={`text-sm font-medium ${labelClassName}`}>
            {progress}/{total}
          </span>
        )}
        
        <span className="text-xs text-gray-500 ml-auto">
          {getTimeEstimate()}
        </span>
      </div>
      
      <div 
        className="w-full bg-gray-200 rounded-full overflow-hidden" 
        style={{ height }}
      >
        <div 
          className="transition-all duration-300 ease-out rounded-full"
          style={{ 
            width: `${percentage}%`, 
            height: '100%',
            backgroundColor: barColor
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
