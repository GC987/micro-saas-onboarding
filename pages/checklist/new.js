import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import TemplateSelector from '../../components/TemplateSelector';
import ProgressBar from '../../components/ProgressBar';
import { trackChecklistCreated, trackTemplateApplied } from '../../utils/analytics';

function randomToken(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export default function NewChecklist() {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [fields, setFields] = useState([{ label: '', type: 'text' }]);
  const [error, setError] = useState('');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const router = useRouter();
  const { showToast } = useToast();

  const handleFieldChange = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const handleSelectTemplate = (template) => {
    if (template) {
      setServiceType(template.name);
      setFields([...template.fields]);
      showToast(`Template "${template.name}" aplicado com sucesso!`, 'success');
      
      // Registrar evento de uso de template para análises
      trackTemplateApplied(template.id || template.name, null, user?.id);
    }
    setShowTemplateSelector(false);
  };

  const addField = () => {
    setFields([...fields, { label: '', type: 'text' }]);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));

    if (router.query.template) {
      setShowTemplateSelector(true);
    }

    calculateFormProgress();
  }, [router.isReady]);

  const calculateFormProgress = () => {
    let filledFields = 0;
    let totalFields = 3;

    if (clientName) filledFields++;
    if (clientEmail) filledFields++;
    if (serviceType) filledFields++;

    totalFields += fields.length;
    filledFields += fields.filter(f => f.label).length;

    const progress = Math.floor((filledFields / totalFields) * 100);
    setFormProgress(progress);
  };

  useEffect(() => {
    calculateFormProgress();
  }, [clientName, clientEmail, serviceType, fields]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Usuário não autenticado.');
      return;
    }
    if (!clientName || !clientEmail || !serviceType || fields.some(f => !f.label || !f.type)) {
      setError('Preencha todos os campos.');
      return;
    }

    // Gerar token público único para o novo checklist
    const publicToken = randomToken();

    try {
      const res = await fetch('/api/checklists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          clientName,
          clientEmail,
          serviceType,
          fields,
          publicToken,
          status: 'Pendente'
        })
      });

      // Manipular erros HTTP
      if (!res.ok) {
        // Tentativa de ler o erro como JSON
        let errorMessage = 'Erro ao salvar checklist';
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          console.error('Erro ao processar resposta de erro:', jsonError);
          // Se não conseguir ler como JSON, usar o status text
          errorMessage = `Erro ${res.status}: ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Tentativa de ler a resposta como JSON
      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error('Erro ao processar resposta de sucesso:', jsonError);
        // Usar o token que enviamos como fallback
        data = { publicToken, id: `cl_${Date.now()}` };
      }

      // Definir o link de compartilhamento
      setShareLink(`${window.location.origin}/share/${data.publicToken || publicToken}`);
      
      // Registrar evento de criação de checklist para análises
      const templateId = fields.length > 1 ? serviceType : null;
      trackChecklistCreated(data.id || publicToken, templateId, user?.id);
      
      // Exibir mensagem de sucesso
      showToast('Checklist criado com sucesso!', 'success');

      // Limpar formulário após sucesso
      setClientName('');
      setClientEmail('');
      setServiceType('');
      setFields([{ label: '', type: 'text' }]);
      setError('');
    } catch (err) {
      console.error('Erro na submissão do formulário:', err);
      setError(err.message || 'Erro ao salvar checklist.');
      showToast(err.message || 'Erro ao salvar checklist', 'error');
    }
  };

  const [shareLink, setShareLink] = useState(null);

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
              <h1 className="text-2xl font-bold text-gray-800">Novo Checklist</h1>
              <p className="text-gray-600">Crie um novo checklist para seu cliente</p>
            </div>

            <button
              onClick={() => setShowTemplateSelector(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"
              data-tour="templates"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Usar Template
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Modal de seleção de templates */}
            {showTemplateSelector && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="max-w-4xl w-full max-h-[90vh] overflow-auto">
                  <TemplateSelector
                    onSelectTemplate={handleSelectTemplate}
                    onCancel={() => setShowTemplateSelector(false)}
                  />
                </div>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Progresso</h2>
              <ProgressBar
                progress={formProgress}
                total={100}
                showPercentage={true}
                showFraction={false}
              />
            </div>
            
            <h2 className="text-xl font-bold mb-4">Dados do Checklist</h2>
            {shareLink ? (
              <div className="bg-green-100 text-green-800 p-4 rounded mb-6">
                <p className="mb-2 font-medium">Checklist criado com sucesso!</p>
                <p className="mb-2">Compartilhe este link com o cliente para ele acessar e enviar a documentação:</p>
                <div className="flex items-center gap-2">
                  <input type="text" className="flex-1 p-2 border rounded" value={shareLink} readOnly onClick={e => e.target.select()} />
                  <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => {navigator.clipboard.writeText(shareLink)}}>Copiar</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>}
                <div>
                  <label className="block font-medium">Nome do Cliente</label>
                  <input
                    type="text"
                    className="mt-1 p-2 border rounded w-full"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium">E-mail do Cliente</label>
                  <input
                    type="email"
                    className="mt-1 p-2 border rounded w-full"
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    required
                    placeholder="cliente@email.com"
                  />
                </div>
                <div>
                  <label className="block font-medium">Tipo de Serviço</label>
                  <input
                    type="text"
                    className="mt-1 p-2 border rounded w-full"
                    value={serviceType}
                    onChange={e => setServiceType(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-2">Campos personalizados</label>
                  {fields.map((field, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        className="flex-1 p-2 border rounded"
                        placeholder="Nome do campo"
                        value={field.label}
                        onChange={e => handleFieldChange(idx, 'label', e.target.value)}
                        required
                      />
                      <select
                        className="p-2 border rounded"
                        value={field.type}
                        onChange={e => handleFieldChange(idx, 'type', e.target.value)}
                      >
                        <option value="text">Texto</option>
                        <option value="file">Arquivo</option>
                      </select>
                      {fields.length > 1 && (
                        <button type="button" onClick={() => removeField(idx)} className="text-red-500">Remover</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addField} className="mt-2 bg-gray-200 px-2 py-1 rounded">Adicionar campo</button>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Salvar checklist</button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
