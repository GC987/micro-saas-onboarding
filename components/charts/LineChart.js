import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const LineChart = ({
  data,
  title = '',
  xAxisLabel = '',
  yAxisLabel = '',
  height = 250,
  smooth = true,
  showPoints = true,
  className = ''
}) => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!canvasRef.current || !data || !data.labels || !data.datasets) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Limpar o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Configurações
    const padding = 40;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);
    
    // Encontrar valor máximo para escala
    let maxValue = 0;
    data.datasets.forEach(dataset => {
      const datasetMax = Math.max(...dataset.data);
      if (datasetMax > maxValue) maxValue = datasetMax;
    });
    
    // Adicionar 10% ao máximo para margem
    maxValue *= 1.1;

    // Desenhar fundo
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar título
    if (title) {
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(title, canvas.width / 2, 20);
    }

    // Desenhar eixos
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.strokeStyle = '#dddddd';
    ctx.stroke();

    // Desenhar labels do eixo X
    ctx.fillStyle = '#666666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    data.labels.forEach((label, index) => {
      const x = padding + (chartWidth / (data.labels.length - 1)) * index;
      ctx.fillText(label, x, canvas.height - padding + 20);
    });

    // Desenhar labels do eixo Y
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = canvas.height - padding - (chartHeight / 5) * i;
      const value = Math.round((maxValue / 5) * i);
      ctx.fillText(value, padding - 10, y + 5);

      // Linhas de grade
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.strokeStyle = '#eeeeee';
      ctx.stroke();
    }

    // Desenhar rótulos dos eixos
    if (xAxisLabel) {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#666666';
      ctx.fillText(xAxisLabel, canvas.width / 2, canvas.height - 10);
    }

    if (yAxisLabel) {
      ctx.save();
      ctx.translate(15, canvas.height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#666666';
      ctx.fillText(yAxisLabel, 0, 0);
      ctx.restore();
    }

    // Desenhar linhas e pontos
    data.datasets.forEach((dataset, datasetIndex) => {
      const lineColor = dataset.borderColor || theme.primaryColor;
      const pointColor = dataset.pointBackgroundColor || lineColor;
      const lineWidth = dataset.borderWidth || 2;
      const pointRadius = dataset.pointRadius || 4;

      // Desenhar linha
      ctx.beginPath();
      
      dataset.data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.labels.length - 1)) * index;
        const y = canvas.height - padding - (value / maxValue) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else if (smooth) {
          // Curva suave entre os pontos
          const prevX = padding + (chartWidth / (data.labels.length - 1)) * (index - 1);
          const prevY = canvas.height - padding - (dataset.data[index - 1] / maxValue) * chartHeight;
          
          const cp1x = prevX + (x - prevX) / 3;
          const cp1y = prevY;
          const cp2x = prevX + 2 * (x - prevX) / 3;
          const cp2y = y;
          
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        } else {
          // Linha reta entre os pontos
          ctx.lineTo(x, y);
        }
        
        // Desenhar pontos se necessário
        if (showPoints) {
          ctx.fillStyle = pointColor;
          ctx.beginPath();
          ctx.arc(x, y, pointRadius, 0, Math.PI * 2);
          ctx.fill();
          
          // Efeito de halo
          ctx.beginPath();
          ctx.arc(x, y, pointRadius + 2, 0, Math.PI * 2);
          ctx.fillStyle = `${pointColor}20`; // 20% de opacidade
          ctx.fill();
        }
      });
      
      if (!showPoints) {
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
      
      // Área sob a curva com gradiente
      if (dataset.fill) {
        const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
        gradient.addColorStop(0, `${lineColor}40`); // 40% de opacidade no topo
        gradient.addColorStop(1, `${lineColor}05`); // 5% de opacidade na base
        
        ctx.lineTo(padding + chartWidth, canvas.height - padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    });

  }, [data, theme, title, xAxisLabel, yAxisLabel, smooth, showPoints, height]);

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>}
      <canvas
        ref={canvasRef}
        width="400"
        height={height}
        className="w-full"
      />
    </div>
  );
};

export default LineChart;
