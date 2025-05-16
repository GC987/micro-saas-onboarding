import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '../contexts/ToastContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DashboardCards from '../components/DashboardCards';
import Spinner from '../components/Spinner';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const router = useRouter();
  const { showToast } = useToast();

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
      console.log(`[Dashboard] Buscando checklists para userId: ${userId}`);
      
      // Garantir que userId seja uma string
      const userIdStr = String(userId);
      
      const res = await fetch(`/api/checklists?userId=${userIdStr}`);
      if (res.ok) {
        const data = await res.json();
        console.log(`[Dashboard] Checklists recebidos: ${data.length}`);
        if (data.length > 0) {
          console.log(`[Dashboard] Primeiro checklist: ${JSON.stringify(data[0].id)}`);
        }
        setChecklists(data);
      } else {
        const errorText = await res.text();
        console.error(`[Dashboard] Erro HTTP ${res.status}: ${errorText}`);
        throw new Error(`Erro ao buscar checklists: ${res.status}`);
      }
    } catch (err) {
      console.error('[Dashboard] Erro ao buscar checklists:', err);
      setError('Não foi possível carregar seus checklists. Tente novamente mais tarde.');
      showToast('Erro ao carregar checklists', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    showToast('Logout realizado com sucesso', 'info');
    router.push('/login');
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

  const handleDeleteChecklist = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este checklist?')) {
      return;
    }

    try {
      setDeleteLoading(id);
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
  
  // Calcular estatísticas para os cards
  const dashboardStats = {
    ativos: checklists.length,
    pendentes: checklists.filter(c => c.status === 'Pendente').length,
    concluidos: checklists.filter(c => c.status === 'Concluído').length
  };

  // Nome da empresa fictício (virá do banco de dados no futuro)
  const companyName = "CheckClient";

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar fixa à esquerda */}
      <Sidebar onLogout={handleLogout} />

      {/* Conteúdo principal */}
      <div className="flex-1 ml-64"> {/* ml-64 para compensar largura da sidebar */}
        {/* Header no topo */}
        <Header companyName={companyName} user={user} />
        
        {/* Conteúdo da página com padding */}
        <main className="p-6">
          {/* Título da página e bem-vindo */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            {user && <p className="text-gray-600">Bem-vindo, <span className="font-semibold">{user.name || user.email}</span></p>}
          </div>
          
          {/* Mensagem de erro, se houver */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          {/* Cards de resumo */}
          <DashboardCards stats={dashboardStats} />
          
          {/* Seção de checklists */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Seus Checklists</h2>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
                onClick={() => router.push('/checklist/new')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Criar novo checklist
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 flex flex-col items-center justify-center space-y-4">
                <Spinner size="lg" color="blue" />
                <p className="text-gray-600">Carregando seus checklists...</p>
              </div>
            ) : checklists.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-gray-400 text-5xl mb-4">📋</div>
                <h3 className="text-gray-700 text-lg font-medium mb-2">Nenhum checklist encontrado</h3>
                <p className="text-gray-500 mb-6">Você ainda não criou nenhum checklist</p>
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
                  onClick={() => router.push('/checklist/new')}
                >
                  Criar seu primeiro checklist
                </button>
              </div>
            ) : (
              <div className="overflow-auto rounded-lg border border-gray-200">
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
                    {checklists.map((checklist) => (
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
                        <td className="py-4 px-6 text-center">
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
