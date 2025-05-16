import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Spinner from '../components/Spinner';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import PieChart from '../components/charts/PieChart';
import { trackEvent, trackExport } from '../utils/analytics';

// Os dados vêm do módulo analyticsData.js

export default function Analises() {
  const router = useRouter();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Estado inicial para KPIs e dados de gráficos (serão preenchidos após a chamada à API)
  const [kpis, setKpis] = useState(null);
  const [chartData, setChartData] = useState(null);
  
  // Função para buscar os dados analíticos da API
  const fetchAnalyticsData = async (range, category) => {
    try {
      setLoading(true);
      
      // Chamada à API real para buscar dados analíticos
      const response = await fetch(`/api/analytics/data?dateRange=${range}&category=${category}`);
      
      if (!response.ok) {
        throw new Error('Falha ao buscar dados analíticos');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // Atualizar os estados com os dados reais
        setKpis(result.data.kpis);
        setChartData(result.data);
        showToast('Dados atualizados com sucesso', 'success');
      } else {
        throw new Error('Formato de dados inválido');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados analíticos:', error);
      showToast('Erro ao carregar dados analíticos', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Verificar se o usuário está logado via localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    
    // Verificar se o usuário tem permissão (admin ou editor)
    if (userData.role && userData.role === 'viewer') {
      showToast('Você não tem permissão para acessar esta página', 'error');
      router.push('/dashboard');
      return;
    }
    
    setUser(userData);
    
    // Carregar dados iniciais com os filtros padrão
    fetchAnalyticsData(dateRange, filterCategory);
  }, []);
  
  // Buscar novos dados sempre que os filtros mudarem
  useEffect(() => {
    if (!loading && user) {
      fetchAnalyticsData(dateRange, filterCategory);
    }
  }, [dateRange, filterCategory]);
  
  const handleExportData = (format) => {
    setLoading(true);
    
    // Registrar o evento de exportação para análises futuras
    trackExport('dashboard', 'analytics', format, user?.id);
    
    // Simulação de preparação do arquivo para exportação
    setTimeout(() => {
      setLoading(false);
      showToast(`Relatório exportado em formato ${format.toUpperCase()} com sucesso!`, 'success');
    }, 800);
  };;
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Spinner size="lg" color="blue" />
      </div>
    );
  }
  
  // Verificar se os dados foram carregados
  if (!chartData || !kpis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="text-xl font-medium text-gray-800 mb-4">Carregando dados analíticos...</div>
        <Spinner size="lg" color="blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Conteúdo principal */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <Header user={user} />
        
        {/* Conteúdo da página */}
        <main className="p-6">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Análises</h1>
              <p className="text-gray-600">Métricas e insights sobre os checklists</p>
            </div>
            
            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              <div>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7d">Últimos 7 dias</option>
                  <option value="30d">Últimos 30 dias</option>
                  <option value="90d">Últimos 90 dias</option>
                </select>
              </div>
              
              <div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas categorias</option>
                  <option value="web">Web e Digital</option>
                  <option value="consultoria">Consultoria</option>
                  <option value="juridico">Jurídico</option>
                  <option value="financas">Finanças</option>
                </select>
              </div>
              
              <div className="relative">
                <button 
                  className="bg-gray-200 hover:bg-gray-300 rounded px-3 py-1.5 text-sm flex items-center gap-1"
                  onClick={() => document.getElementById('exportDropdown').classList.toggle('hidden')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exportar
                </button>
                
                <div id="exportDropdown" className="absolute right-0 mt-1 bg-white shadow-md rounded-lg py-1 hidden z-10 w-32">
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                    onClick={() => handleExportData('pdf')}
                  >
                    PDF
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                    onClick={() => handleExportData('csv')}
                  >
                    CSV
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                    onClick={() => handleExportData('excel')}
                  >
                    Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col">
              <span className="text-gray-500 text-sm">Total de Checklists</span>
              <span className="text-2xl font-semibold">{kpis.totalChecklists}</span>
              <div className={`mt-1 text-xs ${kpis.growth.totalChecklists >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={kpis.growth.totalChecklists >= 0 ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                </svg>
                {kpis.growth.totalChecklists >= 0 ? '+' : ''}{kpis.growth.totalChecklists}% vs. período anterior
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col">
              <span className="text-gray-500 text-sm">Taxa de Conclusão</span>
              <span className="text-2xl font-semibold">{kpis.completionRate}%</span>
              <div className={`mt-1 text-xs ${kpis.growth.completionRate >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={kpis.growth.completionRate >= 0 ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                </svg>
                {kpis.growth.completionRate >= 0 ? '+' : ''}{kpis.growth.completionRate}% vs. período anterior
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col">
              <span className="text-gray-500 text-sm">Tempo Médio de Resposta</span>
              <span className="text-2xl font-semibold">{kpis.responseTime}h</span>
              <div className={`mt-1 text-xs ${kpis.growth.responseTime <= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={kpis.growth.responseTime <= 0 ? "M19 14l-7 7m0 0l-7-7m7 7V3" : "M5 10l7-7m0 0l7 7m-7-7v18"} />
                </svg>
                {kpis.growth.responseTime <= 0 ? '' : '+'}{kpis.growth.responseTime}h vs. período anterior
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col">
              <span className="text-gray-500 text-sm">Taxa de Abandono</span>
              <span className="text-2xl font-semibold">{kpis.abandonmentRate}%</span>
              <div className={`mt-1 text-xs ${kpis.growth.abandonmentRate <= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={kpis.growth.abandonmentRate <= 0 ? "M19 14l-7 7m0 0l-7-7m7 7V3" : "M5 10l7-7m0 0l7 7m-7-7v18"} />
                </svg>
                {kpis.growth.abandonmentRate <= 0 ? '' : '+'}{kpis.growth.abandonmentRate}% vs. período anterior
              </div>
            </div>
          </div>
          
          {/* Gráficos principais em layout otimizado */}
          <div className="grid grid-cols-1 gap-8 mb-8">
            {/* 1. Distribuição por Status - Gráfico de pizza maior e com melhor resolução */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Distribuição por Status</h3>
              <div className="h-96">
                <PieChart 
                  data={chartData.statusDistribution}
                  donut={true}
                  height={380}
                  legendPosition="right"
                  showLegend={true}
                  showPercentage={true}
                />
              </div>
            </div>
            
            {/* 2. Taxa de Conclusão por Categoria (%) - Gráfico de barras horizontal para melhor visualização */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Taxa de Conclusão por Categoria (%)</h3>
              <div className="h-80">
                <BarChart 
                  data={chartData.completionRateByCategory}
                  xAxisLabel="Categoria"
                  yAxisLabel="%"
                  height={350}
                  horizontal={true}
                  barThickness={30}
                  showGridLines={true}
                />
              </div>
            </div>
            
            {/* 3. Checklists Criados por Mês - Gráfico de barras com cores mais vivas */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Checklists Criados por Mês</h3>
              <div className="h-80">
                <BarChart 
                  data={chartData.checklistsCreatedByMonth}
                  xAxisLabel="Mês"
                  yAxisLabel="Quantidade"
                  height={350}
                  showGridLines={true}
                  barThickness={40}
                  colorScheme="green"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
