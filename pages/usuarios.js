import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Spinner from '../components/Spinner';
import UserInviteModal from '../components/UserInviteModal';

// Dados de exemplo para demonstração
const MOCK_USERS = [
  { 
    id: 1, 
    name: 'Admin Usuário', 
    email: 'admin@exemplo.com', 
    role: 'admin', 
    status: 'active',
    lastLogin: new Date(2025, 4, 10).toISOString()
  },
  { 
    id: 2, 
    name: 'João Silva', 
    email: 'joao@exemplo.com', 
    role: 'editor', 
    status: 'active',
    lastLogin: new Date(2025, 4, 12).toISOString()
  },
  { 
    id: 3, 
    name: 'Maria Souza', 
    email: 'maria@exemplo.com', 
    role: 'viewer', 
    status: 'inactive',
    lastLogin: new Date(2025, 3, 25).toISOString()
  },
  { 
    id: 4, 
    name: 'Carlos Pereira', 
    email: 'carlos@exemplo.com', 
    role: 'editor', 
    status: 'pending',
    lastLogin: null
  }
];

// Tradução das funções
const ROLE_LABELS = {
  admin: 'Administrador',
  editor: 'Editor',
  viewer: 'Visualizador'
};

// Cores para status
const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800'
};

// Tradução dos status
const STATUS_LABELS = {
  active: 'Ativo',
  inactive: 'Inativo',
  pending: 'Pendente'
};

export default function Usuarios() {
  const router = useRouter();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    // Verificar se o usuário está logado via localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setCurrentUser(userData);
    
    // Simulando carregamento de dados do servidor
    setTimeout(() => {
      setUsers(MOCK_USERS);
      setLoading(false);
    }, 800);
  }, []);
  
  // Formatar data para exibição
  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    
    try {
      return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  // Função para mudar o status do usuário
  const handleStatusChange = (userId, newStatus) => {
    setProcessingId(userId);
    
    // Simulando comunicação com o servidor
    setTimeout(() => {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      setProcessingId(null);
      showToast(`Status do usuário alterado com sucesso`, 'success');
    }, 800);
  };
  
  // Função para alterar a função (role) do usuário
  const handleRoleChange = (userId, newRole) => {
    setProcessingId(userId);
    
    // Simulando comunicação com o servidor
    setTimeout(() => {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      setProcessingId(null);
      showToast(`Função do usuário alterada para ${ROLE_LABELS[newRole]}`, 'success');
    }, 800);
  };
  
  // Função para enviar convite
  const handleSendInvite = (userData) => {
    // Simulando envio de convite
    const newUser = {
      id: users.length + 1,
      name: userData.name || 'Convidado',
      email: userData.email,
      role: userData.role,
      status: 'pending',
      lastLogin: null,
    };
    
    setUsers([...users, newUser]);
    setIsInviteModalOpen(false);
    showToast(`Convite enviado para ${userData.email}`, 'success');
  };
  
  // Contar usuários por status
  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length
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
        <Header user={currentUser} />
        
        {/* Conteúdo da página */}
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Gestão de Usuários</h1>
            <p className="text-gray-600">Gerencie acesso à sua conta e permissões dos usuários</p>
          </div>
          
          {/* Cards estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-gray-500 text-sm mb-1">Total de Usuários</div>
              <div className="text-2xl font-semibold">{userStats.total}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-gray-500 text-sm mb-1">Usuários Ativos</div>
              <div className="text-2xl font-semibold text-green-600">{userStats.active}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-gray-500 text-sm mb-1">Convites Pendentes</div>
              <div className="text-2xl font-semibold text-yellow-600">{userStats.pending}</div>
            </div>
          </div>
          
          {/* Tabela de usuários */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Usuários</h2>
              <button 
                onClick={() => setIsInviteModalOpen(true)}
                style={{ backgroundColor: theme.primaryColor }}
                className="px-4 py-2 text-white rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                Convidar Usuário
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Login</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select 
                          value={user.role} 
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={user.id === currentUser.id || processingId === user.id}
                          className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="admin">{ROLE_LABELS.admin}</option>
                          <option value="editor">{ROLE_LABELS.editor}</option>
                          <option value="viewer">{ROLE_LABELS.viewer}</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${STATUS_COLORS[user.status]}`}>
                          {STATUS_LABELS[user.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.lastLogin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        {user.id !== currentUser.id ? (
                          <div className="flex justify-end space-x-2">
                            {user.status === 'active' ? (
                              <button 
                                className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                                onClick={() => handleStatusChange(user.id, 'inactive')}
                                disabled={processingId === user.id}
                              >
                                {processingId === user.id ? <Spinner size="sm" /> : 'Desativar'}
                              </button>
                            ) : user.status === 'inactive' ? (
                              <button 
                                className="text-green-600 hover:text-green-800 px-2 py-1 rounded hover:bg-green-50"
                                onClick={() => handleStatusChange(user.id, 'active')}
                                disabled={processingId === user.id}
                              >
                                {processingId === user.id ? <Spinner size="sm" /> : 'Ativar'}
                              </button>
                            ) : (
                              <button 
                                className="text-yellow-600 hover:text-yellow-800 px-2 py-1 rounded hover:bg-yellow-50"
                                onClick={() => handleStatusChange(user.id, 'active')}
                                disabled={processingId === user.id}
                              >
                                {processingId === user.id ? <Spinner size="sm" /> : 'Aprovar'}
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Você</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {users.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-gray-500">Nenhum usuário encontrado</p>
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Modal de convite */}
      {isInviteModalOpen && (
        <UserInviteModal 
          onClose={() => setIsInviteModalOpen(false)}
          onSendInvite={handleSendInvite}
          theme={theme}
        />
      )}
    </div>
  );
}
