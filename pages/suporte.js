import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Spinner from '../components/Spinner';

// Perguntas frequentes para a seção de FAQ
const FAQ_ITEMS = [
  {
    question: 'Como criar um novo checklist?',
    answer: 'Para criar um novo checklist, vá para Dashboard e clique no botão "Criar novo checklist". Preencha o formulário com os dados do cliente, tipo de serviço e campos personalizados que você deseja incluir.'
  },
  {
    question: 'Como enviar um checklist para um cliente?',
    answer: 'Após criar o checklist, será gerado automaticamente um link único que você pode compartilhar com seu cliente via email ou mensagem. Este link permite que o cliente acesse o checklist e envie as respostas e documentos solicitados.'
  },
  {
    question: 'Como adicionar mais usuários ao sistema?',
    answer: 'Na seção "Usuários", clique no botão "Convidar Usuário". Você pode definir o nível de permissão para cada usuário (Administrador, Editor ou Visualizador).'
  },
  {
    question: 'Como alterar meu plano de assinatura?',
    answer: 'Vá para a página "Assinatura" e escolha o plano que melhor atende às suas necessidades. Você pode fazer upgrade ou downgrade a qualquer momento e será cobrado proporcionalmente pelo tempo restante do ciclo.'
  },
  {
    question: 'Como personalizar a aparência do sistema?',
    answer: 'Acesse a página "Customização" para alterar as cores, logo e nome da empresa que aparece para seus clientes. Todas as alterações são salvas automaticamente.'
  }
];

export default function Suporte() {
  const router = useRouter();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  
  // Form de contato
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'media'
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
    setLoading(false);
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.subject.trim() || !formData.message.trim()) {
      showToast('Por favor, preencha todos os campos obrigatórios', 'warning');
      return;
    }
    
    setSending(true);
    
    // Simulação de envio
    setTimeout(() => {
      setSending(false);
      showToast('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
      
      // Limpar o formulário
      setFormData({
        subject: '',
        message: '',
        priority: 'media'
      });
    }, 1500);
  };
  
  const toggleFaqItem = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
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
            <h1 className="text-2xl font-bold text-gray-800">Suporte</h1>
            <p className="text-gray-600">Precisa de ajuda? Tire suas dúvidas ou entre em contato conosco</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coluna 1: FAQ */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Perguntas Frequentes</h2>
              
              <div className="space-y-4">
                {FAQ_ITEMS.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFaqItem(index)}
                      className="w-full px-4 py-3 text-left flex justify-between items-center focus:outline-none"
                    >
                      <span className="font-medium">{item.question}</span>
                      <svg
                        className={`h-5 w-5 transform ${expandedItem === index ? 'rotate-180' : ''} transition-transform`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {expandedItem === index && (
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Não encontrou o que procurava? Entre em contato conosco usando o formulário ao lado.
                </p>
              </div>
            </div>
            
            {/* Coluna 2: Formulário de contato */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Entre em Contato</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assunto*
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Problema com envio de checklist"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridade
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem*
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descreva sua dúvida ou problema detalhadamente..."
                    rows="6"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={sending}
                  style={{ backgroundColor: theme.primaryColor }}
                  className="w-full px-4 py-2 text-white rounded-md hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-70"
                >
                  {sending ? (
                    <>
                      <Spinner size="sm" color="white" />
                      <span className="ml-2">Enviando...</span>
                    </>
                  ) : (
                    'Enviar Mensagem'
                  )}
                </button>
              </form>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Outros canais de atendimento:
                </h3>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center text-sm">
                    <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">suporte@checkclient.com</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-700">(11) 4000-5000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Horário de atendimento */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Horários de Atendimento</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-2">Suporte por Chat</h3>
                <p className="text-gray-700">Segunda a Sexta</p>
                <p className="text-gray-700">08:00 às 20:00</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-2">Suporte por Email</h3>
                <p className="text-gray-700">Todos os dias</p>
                <p className="text-gray-700">24 horas</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-2">Suporte por Telefone</h3>
                <p className="text-gray-700">Segunda a Sexta</p>
                <p className="text-gray-700">09:00 às 18:00</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              * O tempo de resposta varia de acordo com o plano contratado e a prioridade do chamado.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
