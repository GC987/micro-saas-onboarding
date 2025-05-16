import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Spinner from '../components/Spinner';

export default function Respostas() {
  const router = useRouter();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateRange: 'all',
    sortBy: 'newest'
  });
  
  // Dados de exemplo para demonstração
  const mockResponses = [
    {
      id: '1',
      clientName: 'Empresa ABC Ltda',
      checklistName: 'Onboarding de Cliente - Site Institucional',
      submittedAt: new Date(2025, 4, 10).toISOString(),
      status: 'Não Revisado',
      completionRate: 95
    },
    {
      id: '2',
      clientName: 'João Silva Consultoria',
      checklistName: 'Setup Inicial - E-commerce',
      submittedAt: new Date(2025, 4, 8).toISOString(),
      status: 'Revisado',
      completionRate: 100
    },
    {
      id: '3',
      clientName: 'Restaurante Sabor & Arte',
      checklistName: 'Onboarding - Sistema de Pedidos Online',
      submittedAt: new Date(2025, 4, 5).toISOString(),
      status: 'Revisado',
      completionRate: 82
    },
    {
      id: '4',
      clientName: 'Instituto Educacional Futuro',
      checklistName: 'Setup - Plataforma EAD',
      submittedAt: new Date(2025, 4, 1).toISOString(),
      status: 'Arquivado',
      completionRate: 100
    },
    {
      id: '5',
      clientName: 'Dr. Carlos Mendes',
      checklistName: 'Onboarding - Sistema para Clínica',
      submittedAt: new Date(2025, 3, 28).toISOString(),
      status: 'Não Revisado',
      completionRate: 76
    }
  ];

  useEffect(() => {
    // Verificar se o usuário está logado via localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setUser(userData);
    
    // Simular carregamento de dados
    setTimeout(() => {
      setResponses(mockResponses);
      setLoading(false);
    }, 500);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch (e) {
      return 'Data inválida';
    }
  };

  // Filtragem das respostas
  const filteredResponses = responses
    .filter(response => {
      // Filtro por status
      if (filters.status !== 'all' && response.status !== filters.status) {
        return false;
      }
      
      // Filtro por busca
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          response.clientName.toLowerCase().includes(searchLower) ||
          response.checklistName.toLowerCase().includes(searchLower)
        );
      }
      
      // Filtro por data
      if (filters.dateRange !== 'all') {
        const responseDate = new Date(response.submittedAt);
        const today = new Date();
        
        if (filters.dateRange === 'today') {
          return responseDate.toDateString() === today.toDateString();
        } else if (filters.dateRange === 'week') {
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          return responseDate >= weekAgo;
        } else if (filters.dateRange === 'month') {
          const monthAgo = new Date(today);
          monthAgo.setMonth(today.getMonth() - 1);
          return responseDate >= monthAgo;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      // Ordenação
      if (filters.sortBy === 'newest') {
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      } else if (filters.sortBy === 'oldest') {
        return new Date(a.submittedAt) - new Date(b.submittedAt);
      } else if (filters.sortBy === 'name') {
        return a.clientName.localeCompare(b.clientName);
      } else if (filters.sortBy === 'completion') {
        return b.completionRate - a.completionRate;
      }
      return 0;
    });
    
  const getCompletionBadgeColor = (rate) => {
    if (rate >= 90) return 'bg-green-100 text-green-800';
    if (rate >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Não Revisado':
        return 'bg-blue-100 text-blue-800';
      case 'Revisado':
        return 'bg-green-100 text-green-800';
      case 'Arquivado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Respostas</h1>
            <p className="text-gray-600">Visualize e gerencie todas as respostas de checklists</p>
          </div>
          
          {/* Estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col">
              <span className="text-gray-500 text-sm">Total de Respostas</span>
              <span className="text-2xl font-semibold">{responses.length}</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col">
              <span className="text-gray-500 text-sm">Não Revisadas</span>
              <span className="text-2xl font-semibold text-blue-600">{responses.filter(r => r.status === 'Não Revisado').length}</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col">
              <span className="text-gray-500 text-sm">Revisadas</span>
              <span className="text-2xl font-semibold text-green-600">{responses.filter(r => r.status === 'Revisado').length}</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col">
              <span className="text-gray-500 text-sm">Taxa Média de Conclusão</span>
              <span className="text-2xl font-semibold text-purple-600">
                {Math.round(responses.reduce((acc, curr) => acc + curr.completionRate, 0) / responses.length)}%
              </span>
            </div>
          </div>
          
          {/* Filtros */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Buscar por cliente ou checklist..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos</option>
                  <option value="Não Revisado">Não Revisados</option>
                  <option value="Revisado">Revisados</option>
                  <option value="Arquivado">Arquivados</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Período
                </label>
                <select
                  name="dateRange"
                  value={filters.dateRange}
                  onChange={handleFilterChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos os períodos</option>
                  <option value="today">Hoje</option>
                  <option value="week">Últimos 7 dias</option>
                  <option value="month">Últimos 30 dias</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordenar por
                </label>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Mais recentes</option>
                  <option value="oldest">Mais antigos</option>
                  <option value="name">Nome do cliente</option>
                  <option value="completion">Taxa de conclusão</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Lista de respostas */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Respostas dos Clientes</h2>
              <span className="text-sm text-gray-500">Mostrando {filteredResponses.length} de {responses.length}</span>
            </div>
            
            {filteredResponses.length === 0 ? (
              <div className="text-center py-12 px-6">
                <div className="text-gray-400 text-5xl mb-4">📋</div>
                <h3 className="text-gray-700 text-lg font-medium mb-2">Nenhuma resposta encontrada</h3>
                <p className="text-gray-500 mb-6">Tente ajustar seus filtros ou aguarde por novas respostas</p>
                <button
                  onClick={() => setFilters({ status: 'all', search: '', dateRange: 'all', sortBy: 'newest' })}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Checklist</th>
                      <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Taxa de Conclusão</th>
                      <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Envio</th>
                      <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredResponses.map((response) => (
                      <tr key={response.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          {response.clientName}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500">
                          {response.checklistName}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCompletionBadgeColor(response.completionRate)}`}>
                            {response.completionRate}%
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(response.status)}`}>
                            {response.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500 text-center">
                          {formatDate(response.submittedAt)}
                        </td>
                        <td className="py-4 px-6 text-right text-sm font-medium">
                          <button
                            onClick={() => router.push(`/respostas/${response.id}`)}
                            style={{ backgroundColor: theme.primaryColor }}
                            className="px-3 py-1 text-white rounded hover:opacity-90 transition-opacity text-xs"
                          >
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
