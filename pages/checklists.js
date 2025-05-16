import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Spinner from '../components/Spinner';

export default function Checklists() {
  const router = useRouter();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  // Filtros
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sortBy: 'newest'
  });
  
  useEffect(() => {
    // Verificar se o usuário está logado via localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setUser(userData);
    fetchChecklists(userData.id);
  }, []);
  
  const fetchChecklists = async (userId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/checklists?userId=${userId}`);
      
      if (res.ok) {
        const data = await res.json();
        setChecklists(data);
      } else {
        throw new Error('Erro ao buscar checklists');
      }
    } catch (err) {
      console.error('Erro ao buscar checklists:', err);
      setError('Não foi possível carregar seus checklists. Tente novamente mais tarde.');
      showToast('Erro ao carregar checklists', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const handleDeleteChecklist = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este checklist?')) {
      return;
    }
    
    setDeleteLoading(id);
    
    try {
      const res = await fetch(`/api/checklists/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });
      
      if (!res.ok) {
        throw new Error('Erro ao excluir checklist');
      }
      
      // Atualizar a lista de checklists
      setChecklists(checklists.filter(item => item.id !== id));
      showToast('Checklist excluído com sucesso', 'success');
    } catch (err) {
      console.error('Erro ao excluir checklist:', err);
      showToast('Erro ao excluir checklist', 'error');
    } finally {
      setDeleteLoading(null);
    }
  };
  
  const formatDate = (dateString) => {
    try {
      // Verificar se é um timestamp do Firestore ou uma data ISO
      if (dateString?.seconds) {
        return new Date(dateString.seconds * 1000).toLocaleString('pt-BR');
      } else {
        return new Date(dateString).toLocaleString('pt-BR');
      }
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Em Análise':
        return 'bg-blue-100 text-blue-800';
      case 'Concluído':
        return 'bg-green-100 text-green-800';
      case 'Respondido':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Filtragem e ordenação dos checklists
  const filteredChecklists = checklists
    .filter(item => {
      // Filtro de status
      if (filters.status !== 'all' && item.status !== filters.status) {
        return false;
      }
      
      // Filtro de busca
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          item.clientName.toLowerCase().includes(searchLower) ||
          item.serviceType.toLowerCase().includes(searchLower) ||
          (item.clientEmail && item.clientEmail.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Ordenação
      if (filters.sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (filters.sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (filters.sortBy === 'name') {
        return a.clientName.localeCompare(b.clientName);
      }
      return 0;
    });
  
  // Estatísticas de checklists
  const stats = {
    total: checklists.length,
    pending: checklists.filter(c => c.status === 'Pendente').length,
    completed: checklists.filter(c => c.status === 'Concluído').length,
    responded: checklists.filter(c => c.status === 'Respondido').length
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
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Checklists</h1>
              <p className="text-gray-600">Gerencie todos os seus checklists</p>
            </div>
            
            <button
              onClick={() => router.push('/checklist/new')}
              style={{ backgroundColor: theme.primaryColor }}
              className="px-4 py-2 text-white rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Criar Novo Checklist
            </button>
          </div>
          
          {/* Cards estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col">
              <span className="text-gray-500 text-sm">Total de Checklists</span>
              <span className="text-2xl font-semibold">{stats.total}</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col">
              <span className="text-gray-500 text-sm">Pendentes</span>
              <span className="text-2xl font-semibold text-yellow-600">{stats.pending}</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col">
              <span className="text-gray-500 text-sm">Respondidos</span>
              <span className="text-2xl font-semibold text-purple-600">{stats.responded}</span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col">
              <span className="text-gray-500 text-sm">Concluídos</span>
              <span className="text-2xl font-semibold text-green-600">{stats.completed}</span>
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
                  placeholder="Buscar por nome, email ou serviço..."
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
                  <option value="Pendente">Pendentes</option>
                  <option value="Respondido">Respondidos</option>
                  <option value="Em Análise">Em Análise</option>
                  <option value="Concluído">Concluídos</option>
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
                </select>
              </div>
            </div>
          </div>
          
          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          {/* Lista de checklists */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Lista de Checklists</h2>
              <span className="text-sm text-gray-500">Mostrando {filteredChecklists.length} de {checklists.length}</span>
            </div>
            
            {filteredChecklists.length === 0 ? (
              <div className="text-center py-12 px-6">
                <div className="text-gray-400 text-5xl mb-4">📋</div>
                {filters.search || filters.status !== 'all' ? (
                  <>
                    <h3 className="text-gray-700 text-lg font-medium mb-2">Nenhum checklist encontrado com esses filtros</h3>
                    <p className="text-gray-500 mb-6">Tente ajustar seus critérios de busca</p>
                    <button
                      onClick={() => setFilters({ status: 'all', search: '', sortBy: 'newest' })}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                    >
                      Limpar filtros
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-gray-700 text-lg font-medium mb-2">Nenhum checklist encontrado</h3>
                    <p className="text-gray-500 mb-6">Você ainda não criou nenhum checklist</p>
                    <button
                      onClick={() => router.push('/checklist/new')}
                      style={{ backgroundColor: theme.primaryColor }}
                      className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Criar seu primeiro checklist
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</th>
                      <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Criado em</th>
                      <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredChecklists.map((checklist) => (
                      <tr key={checklist.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">{checklist.clientName}</div>
                          <div className="text-gray-500 text-sm">{checklist.clientEmail}</div>
                        </td>
                        <td className="py-4 px-6 text-gray-900">{checklist.serviceType}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(checklist.status)}`}>
                            {checklist.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center text-gray-500">
                          {formatDate(checklist.createdAt)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-3">
                            <button 
                              onClick={() => router.push(`/admin/checklists/${checklist.id}`)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                              title="Ver detalhes"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/share/${checklist.publicToken}`);
                                showToast('Link copiado para a área de transferência', 'success');
                              }}
                              className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50 transition-colors"
                              title="Copiar link"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDeleteChecklist(checklist.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
                              title="Excluir"
                              disabled={deleteLoading === checklist.id}
                            >
                              {deleteLoading === checklist.id ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Spinner size="sm" color="red" />
                                </div>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                          </div>
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
