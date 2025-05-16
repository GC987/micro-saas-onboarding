import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Spinner from '../components/Spinner';
import PaymentModal from '../components/PaymentModal';

// Dados dos planos (em produção viria da API/banco de dados)
const PLANS = [
  {
    id: 'basic',
    name: 'Básico',
    price: 49.90,
    interval: 'mensal',
    features: [
      'Até 3 usuários',
      '50 checklists por mês',
      '250MB de armazenamento',
      'Suporte por email'
    ],
    popular: false,
    cta: 'Começar'
  },
  {
    id: 'pro',
    name: 'Profissional',
    price: 99.90,
    interval: 'mensal',
    features: [
      'Até 10 usuários',
      'Checklists ilimitados',
      '5GB de armazenamento',
      'Suporte prioritário',
      'Customização whitelabel',
      'API de integração'
    ],
    popular: true,
    cta: 'Escolher Plano Pro'
  },
  {
    id: 'business',
    name: 'Empresarial',
    price: 249.90,
    interval: 'mensal',
    features: [
      'Usuários ilimitados',
      'Checklists ilimitados',
      '50GB de armazenamento',
      'Suporte 24/7',
      'Customização completa',
      'API avançada',
      'Gestor de conta dedicado'
    ],
    popular: false,
    cta: 'Contato Empresarial'
  }
];

// Dados fictícios de histórico de fatura
const MOCK_INVOICES = [
  {
    id: 'inv_123456',
    date: '2025-05-01T10:00:00',
    amount: 99.90,
    status: 'paid',
    description: 'Assinatura Pro - Maio 2025'
  },
  {
    id: 'inv_123455',
    date: '2025-04-01T10:00:00',
    amount: 99.90,
    status: 'paid',
    description: 'Assinatura Pro - Abril 2025'
  },
  {
    id: 'inv_123454',
    date: '2025-03-01T10:00:00',
    amount: 49.90,
    status: 'paid',
    description: 'Assinatura Básica - Março 2025'
  }
];

export default function Assinatura() {
  const router = useRouter();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Verificar se o usuário está logado via localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setCurrentUser(userData);
    
    // Simulando carregamento da assinatura atual e histórico de faturas
    setTimeout(() => {
      // Assinatura fictícia para demo
      setSubscription({
        id: 'sub_12345',
        planId: 'pro',
        status: 'active',
        currentPeriodEnd: new Date(2025, 5, 1).toISOString(), // 1 de junho de 2025
        cancelAtPeriodEnd: false,
        paymentMethod: {
          brand: 'visa',
          last4: '4242'
        }
      });
      
      setInvoices(MOCK_INVOICES);
      setLoading(false);
    }, 800);
  }, []);
  
  // Formatar preço em Real brasileiro
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Formatar data
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  // Encontrar o plano atual do usuário
  const currentPlan = subscription ? PLANS.find(plan => plan.id === subscription.planId) : null;
  
  // Iniciar upgrade/downgrade de plano
  const handleChangePlan = (plan) => {
    if (!subscription) {
      setSelectedPlan(plan);
      setIsPaymentModalOpen(true);
      return;
    }
    
    // Se já tem o plano selecionado, não faz nada
    if (plan.id === subscription.planId) {
      showToast('Você já está inscrito neste plano', 'info');
      return;
    }
    
    // Se está trocando de plano
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };
  
  // Cancelar assinatura
  const handleCancelSubscription = () => {
    if (!confirm('Tem certeza que deseja cancelar sua assinatura? Você perderá acesso ao final do período atual.')) {
      return;
    }
    
    setIsProcessing(true);
    
    // Simulando comunicação com API
    setTimeout(() => {
      setSubscription({
        ...subscription,
        cancelAtPeriodEnd: true
      });
      
      setIsProcessing(false);
      showToast('Sua assinatura será cancelada ao final do período atual', 'warning');
    }, 800);
  };
  
  // Reativar assinatura cancelada
  const handleReactivateSubscription = () => {
    setIsProcessing(true);
    
    // Simulando comunicação com API
    setTimeout(() => {
      setSubscription({
        ...subscription,
        cancelAtPeriodEnd: false
      });
      
      setIsProcessing(false);
      showToast('Sua assinatura foi reativada com sucesso!', 'success');
    }, 800);
  };
  
  // Processar pagamento (simulado)
  const handlePaymentComplete = (paymentDetails) => {
    setIsPaymentModalOpen(false);
    setIsProcessing(true);
    
    // Simular processar pagamento e atualizar assinatura
    setTimeout(() => {
      // Novo plano selecionado
      setSubscription({
        id: 'sub_' + Math.random().toString(36).substring(2, 7),
        planId: selectedPlan.id,
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 dias
        cancelAtPeriodEnd: false,
        paymentMethod: {
          brand: paymentDetails.cardBrand || 'visa',
          last4: paymentDetails.cardLast4 || '4242'
        }
      });
      
      setIsProcessing(false);
      showToast(`Assinatura ${selectedPlan.name} ativada com sucesso!`, 'success');
    }, 1500);
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
            <h1 className="text-2xl font-bold text-gray-800">Gerenciar Assinatura</h1>
            <p className="text-gray-600">Visualize, atualize ou altere seu plano de assinatura</p>
          </div>
          
          {/* Status da assinatura atual */}
          {subscription && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Status da Assinatura</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Plano atual</p>
                  <p className="font-semibold">{currentPlan ? currentPlan.name : 'Não definido'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor</p>
                  <p className="font-semibold">{currentPlan ? formatCurrency(currentPlan.price) : '-'} /{currentPlan?.interval}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`font-semibold ${subscription.cancelAtPeriodEnd ? 'text-orange-500' : 'text-green-600'}`}>
                    {subscription.cancelAtPeriodEnd ? 'Cancelamento agendado' : 'Ativa'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Próximo pagamento</p>
                  <p className="font-semibold">{formatDate(subscription.currentPeriodEnd)}</p>
                </div>
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Método de pagamento</p>
                  <p className="font-semibold capitalize">
                    {subscription.paymentMethod?.brand} •••• {subscription.paymentMethod?.last4}
                  </p>
                </div>
                
                {subscription.cancelAtPeriodEnd ? (
                  <button 
                    onClick={handleReactivateSubscription}
                    disabled={isProcessing}
                    style={{ backgroundColor: theme.primaryColor }}
                    className="px-4 py-2 text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-70"
                  >
                    {isProcessing ? <Spinner size="sm" color="white" /> : 'Reativar Assinatura'}
                  </button>
                ) : (
                  <button 
                    onClick={handleCancelSubscription}
                    disabled={isProcessing}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-70"
                  >
                    {isProcessing ? <Spinner size="sm" color="red" /> : 'Cancelar Assinatura'}
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Planos disponíveis */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-6">Planos Disponíveis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS.map((plan) => {
                const isCurrentPlan = subscription?.planId === plan.id;
                
                return (
                  <div 
                    key={plan.id} 
                    className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${isCurrentPlan ? 'border-green-500' : plan.popular ? 'border-blue-500' : 'border-transparent'}`}
                  >
                    {/* Tag de popular */}
                    {plan.popular && (
                      <div 
                        style={{ backgroundColor: theme.primaryColor }}
                        className="text-white text-xs font-bold uppercase tracking-wider py-1 px-2 text-center"
                      >
                        Mais Popular
                      </div>
                    )}
                    
                    {/* Conteúdo do plano */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                      
                      <div className="mb-4">
                        <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                        <span className="text-gray-500">/{plan.interval}</span>
                      </div>
                      
                      <ul className="mb-8 space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <button
                        onClick={() => handleChangePlan(plan)}
                        disabled={isCurrentPlan || isProcessing}
                        style={{ backgroundColor: isCurrentPlan ? '#10B981' : theme.primaryColor }}
                        className={`w-full py-2 px-4 rounded-md text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-70 ${isCurrentPlan ? 'cursor-default' : ''}`}
                      >
                        {isCurrentPlan ? 'Plano Atual' : plan.cta}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Histórico de faturas */}
          {invoices.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Histórico de Faturas</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Recibo</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(invoice.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {invoice.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {invoice.status === 'paid' ? 'Pago' : 'Pendente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a 
                            href="#" 
                            className="text-blue-600 hover:text-blue-900"
                            onClick={(e) => {
                              e.preventDefault();
                              showToast('Recibo baixado com sucesso', 'success');
                            }}
                          >
                            Baixar
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Modal de pagamento */}
      {isPaymentModalOpen && selectedPlan && (
        <PaymentModal 
          plan={selectedPlan}
          onClose={() => setIsPaymentModalOpen(false)}
          onComplete={handlePaymentComplete}
          theme={theme}
        />
      )}
    </div>
  );
}
