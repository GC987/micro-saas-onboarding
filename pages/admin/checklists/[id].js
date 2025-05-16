import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '../../../contexts/ToastContext';
import Spinner from '../../../components/Spinner';

export default function ChecklistDetails() {
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [publicUrl, setPublicUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { showToast } = useToast();

  useEffect(() => {
    // Verificar se o usuário está logado via localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (!id || !user) return;
    
    const fetchChecklist = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/checklists/${id}?userId=${user.id}`);
        
        if (!res.ok) {
          throw new Error('Checklist não encontrado ou acesso negado');
        }
        
        const data = await res.json();
        setChecklist(data);
        
        // Gerar URL pública
        const baseUrl = window.location.origin;
        setPublicUrl(`${baseUrl}/share/${data.publicToken}`);
      } catch (err) {
        setError(err.message || 'Erro ao carregar checklist');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChecklist();
  }, [id, user]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl)
      .then(() => {
        setCopySuccess(true);
        showToast('Link copiado para a área de transferência!', 'success');
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(() => {
        showToast('Erro ao copiar link', 'error');
      });
  };

  const updateStatus = async (newStatus) => {
    try {
      setStatusUpdating(true);
      const res = await fetch(`/api/checklists/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          status: newStatus
        }),
      });

      if (!res.ok) {
        throw new Error('Erro ao atualizar status');
      }

      setChecklist(prev => ({ ...prev, status: newStatus }));
      showToast(`Status atualizado para ${newStatus}`, 'success');
    } catch (err) {
      showToast(err.message || 'Erro ao atualizar status', 'error');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="blue" />
          <p className="mt-4 text-gray-600">Carregando detalhes do checklist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 bg-gray-100">
        <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Erro</h2>
          <p>{error}</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!checklist) return null;

  const fields = JSON.parse(checklist.fields);
  const responses = checklist.responses ? JSON.parse(checklist.responses) : null;

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-4xl mx-auto mt-8">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-gray-200 px-4 py-1 rounded mr-2 hover:bg-gray-300"
          >
            &larr; Voltar
          </button>
          <h1 className="text-2xl font-bold flex-grow">Detalhes do Checklist</h1>
        </div>

        <div className="bg-white p-6 rounded shadow mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">{checklist.clientName}</h2>
              <p className="text-gray-600">{checklist.serviceType}</p>
              <p className="mt-2">
                <span className="font-medium">Status: </span>
                <span className={`px-2 py-1 rounded text-sm ${
                  checklist.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                  checklist.status === 'Em Análise' ? 'bg-blue-100 text-blue-800' : 
                  checklist.status === 'Concluído' ? 'bg-green-100 text-green-800' : 
                  'bg-gray-100'
                }`}>
                  {checklist.status}
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Criado em: {new Date(checklist.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>
            
            <div className="flex gap-2">
              {checklist.status !== 'Concluído' && (
                <button 
                  onClick={() => updateStatus('Concluído')}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center transition-all duration-200 ease-in-out"
                  disabled={statusUpdating}
                >
                  {statusUpdating ? (
                    <>
                      <Spinner size="sm" color="white" />
                      <span className="ml-2">Atualizando...</span>
                    </>
                  ) : (
                    'Marcar como Concluído'
                  )}
                </button>
              )}
              {checklist.status === 'Concluído' && (
                <button 
                  onClick={() => updateStatus('Pendente')}
                  className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 flex items-center transition-all duration-200 ease-in-out"
                  disabled={statusUpdating}
                >
                  {statusUpdating ? (
                    <>
                      <Spinner size="sm" color="white" />
                      <span className="ml-2">Atualizando...</span>
                    </>
                  ) : (
                    'Reabrir'
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium mb-2">Link público para o cliente:</h3>
            <div className="flex items-center">
              <input 
                type="text" 
                value={publicUrl} 
                readOnly 
                className="flex-grow p-2 border rounded-l bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                onClick={(e) => e.target.select()}
              />
              <button 
                onClick={handleCopyLink}
                className={`${copySuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-3 py-2 rounded-r transition-colors duration-200 ease-in-out flex items-center`}
              >
                {copySuccess ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    <span>Copiar Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow mb-6">
          <h3 className="font-medium mb-4">Campos do Checklist:</h3>
          <ul className="space-y-2">
            {fields.map((field, idx) => (
              <li key={idx} className="border-b pb-2">
                <span className="font-medium">{field.label}</span>
                <span className="text-gray-500 text-sm ml-2">({field.type === 'file' ? 'Arquivo' : 'Texto'})</span>
              </li>
            ))}
          </ul>
        </div>

        {responses && (
          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-medium mb-4">Respostas do Cliente:</h3>
            <p className="text-sm text-gray-500 mb-4">
              Enviado em: {new Date(responses.submittedAt).toLocaleString('pt-BR')}
            </p>
            
            <div className="space-y-4">
              <h4 className="font-medium">Respostas de texto:</h4>
              <ul className="space-y-2">
                {Object.entries(responses.textResponses).map(([field, value]) => (
                  <li key={field} className="border-b pb-2">
                    <span className="font-medium">{field}:</span>
                    <span className="ml-2">{value}</span>
                  </li>
                ))}
              </ul>
              
              {responses.files && Object.keys(responses.files).length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Arquivos enviados:</h4>
                  <ul className="space-y-2">
                    {Object.entries(responses.files).map(([field, fileInfo]) => (
                      <li key={field} className="border-b pb-2">
                        <span className="font-medium">{field}:</span>
                        <span className="ml-2">{fileInfo.filename}</span>
                        <a 
                          href={`/api/checklists/file/${checklist.id}/${encodeURIComponent(field)}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-3 text-blue-600 hover:underline text-sm"
                        >
                          Baixar arquivo
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
