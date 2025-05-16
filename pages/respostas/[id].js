import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import ProgressBar from '../../components/ProgressBar';
import ExportButton from '../../components/ExportButton';

export default function RespostaDetalhes() {
  const router = useRouter();
  const { id } = router.query;
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);
  
  const mockResponses = [
    {
      id: '1',
      clientName: 'Empresa ABC Ltda',
      clientEmail: 'contato@empresaabc.com.br',
      checklistName: 'Onboarding de Cliente - Site Institucional',
      submittedAt: new Date(2025, 4, 10).toISOString(),
      status: 'Não Revisado',
      completionRate: 95,
      questions: [
        {
          question: 'Qual é o endereço do site atual?',
          answer: 'www.empresaabc.com.br',
          required: true,
          completed: true
        },
        {
          question: 'Quais são as cores principais da sua marca?',
          answer: 'Azul (#1a4b8c) e Verde (#2e8b57)',
          required: true,
          completed: true
        },
        {
          question: 'Envie o logotipo da empresa',
          answer: 'logo-abc.png',
          fileUrl: 'https://example.com/uploads/logo-abc.png',
          type: 'file',
          required: true,
          completed: true
        },
        {
          question: 'Você tem alguma preferência de layout?',
          answer: 'Preferimos um design clean e minimalista, com foco em usabilidade para dispositivos móveis.',
          required: false,
          completed: true
        },
        {
          question: 'Quantas páginas você precisa no site?',
          answer: '5 (Home, Sobre, Serviços, Blog, Contato)',
          required: true,
          completed: true
        }
      ],
      notes: [
        {
          author: 'Maria Silva',
          date: new Date(2025, 4, 11).toISOString(),
          content: 'Cliente muito detalhista. Precisamos focar na responsividade do site conforme solicitado.'
        }
      ],
      attachments: [
        {
          name: 'briefing-completo.pdf',
          url: 'https://example.com/uploads/briefing-completo.pdf',
          size: '2.4MB',
          uploadDate: new Date(2025, 4, 10).toISOString()
        }
      ]
    },
    // Outros itens para os demais IDs...
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
    
    // Aguardar até que o router esteja pronto e tenhamos o ID
    if (!id) return;
    
    // Simular carregamento de dados
    setTimeout(() => {
      const foundResponse = mockResponses.find(r => r.id === id) || mockResponses[0];
      setResponse(foundResponse);
      setLoading(false);
    }, 500);
  }, [id]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('pt-BR');
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  const handleStatusChange = (newStatus) => {
    setResponse({
      ...response,
      status: newStatus
    });
    
    showToast(`Status atualizado para ${newStatus}`, 'success');
  };
  
  const handleAddNote = () => {
    // Implementação simplificada - em um caso real, abriria um modal
    const noteContent = prompt('Adicionar nota:');
    if (!noteContent) return;
    
    const newNote = {
      author: user.name,
      date: new Date().toISOString(),
      content: noteContent
    };
    
    setResponse({
      ...response,
      notes: [...response.notes, newNote]
    });
    
    showToast('Nota adicionada com sucesso', 'success');
  };

  if (loading || !response) {
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
          <div className="mb-6 flex justify-between items-center">
            <div>
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-800 mb-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar para Respostas
              </button>
              <h1 className="text-2xl font-bold text-gray-800">{response.checklistName}</h1>
              <p className="text-gray-600">Resposta de {response.clientName}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Enviado em:</p>
                <p className="font-medium">{formatDate(response.submittedAt)}</p>
              </div>
              
              <div>
                <select
                  value={response.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  style={{ borderColor: theme.primaryColor }}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                >
                  <option value="Não Revisado">Não Revisado</option>
                  <option value="Revisado">Revisado</option>
                  <option value="Arquivado">Arquivado</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Informações do cliente */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Informações do Cliente</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nome</p>
                <p className="font-medium">{response.clientName}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{response.clientEmail}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Taxa de Conclusão</p>
                <ProgressBar 
                  progress={response.completionRate} 
                  total={100} 
                  showPercentage={true}
                  color={response.completionRate > 80 ? '#10b981' : response.completionRate > 50 ? '#f59e0b' : '#ef4444'}
                />
              </div>
            </div>
          </div>
          
          {/* Respostas */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Respostas</h2>
            
            <div className="space-y-6">
              {response.questions.map((item, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-gray-800">
                      {item.question}
                      {item.required && <span className="text-red-500 ml-1">*</span>}
                    </p>
                    <span className={`px-2 py-0.5 rounded text-xs ${item.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.completed ? 'Respondida' : 'Incompleta'}
                    </span>
                  </div>
                  
                  {item.type === 'file' ? (
                    <div className="flex items-center mt-2">
                      <div className="bg-gray-100 p-2 rounded flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span className="text-sm">{item.answer}</span>
                      </div>
                      
                      <a 
                        href={item.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: theme.primaryColor }}
                        className="ml-3 text-sm hover:underline"
                      >
                        Visualizar
                      </a>
                    </div>
                  ) : (
                    <p className="text-gray-600 mt-1">{item.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Notas e Comentários */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Notas internas */}
            <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Notas Internas</h2>
                <div className="flex gap-2">
                  <ExportButton 
                    data={response}
                    filename={`resposta-${response.id}-${response.clientName.toLowerCase().replace(/\s+/g, '-')}`}
                    type="pdf"
                    label="Exportar"
                    size="sm"
                  />
                  <button 
                    onClick={handleAddNote}
                    style={{ backgroundColor: theme.primaryColor }}
                    className="px-3 py-1 text-white text-sm rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Adicionar Nota
                  </button>
                </div>
              </div>
              
              {response.notes.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <p>Nenhuma nota adicionada</p>
                  <p className="text-sm">Adicione notas para compartilhar informações com sua equipe</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {response.notes.map((note, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-gray-800">{note.author}</p>
                        <p className="text-xs text-gray-500">{formatDate(note.date)}</p>
                      </div>
                      <p className="text-gray-600">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Anexos */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Anexos</h2>
              
              {response.attachments.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <p>Nenhum anexo disponível</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {response.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium truncate">{attachment.name}</p>
                          <p className="text-xs text-gray-500">{attachment.size}</p>
                        </div>
                      </div>
                      <a 
                        href={attachment.url} 
                        download
                        style={{ color: theme.primaryColor }}
                        className="text-sm hover:underline"
                      >
                        Baixar
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
