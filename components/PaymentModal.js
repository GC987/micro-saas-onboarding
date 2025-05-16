import { useState } from 'react';
import Spinner from './Spinner';

export default function PaymentModal({ plan, onClose, onComplete, theme }) {
  const [step, setStep] = useState('details'); // details, card, processing, success
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    cardNumber: '',
    cardHolder: '',
    cardExpiry: '',
    cardCvc: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Formatar preço em Real brasileiro
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Formatação específica para certos campos
    let formattedValue = value;
    
    if (name === 'cardNumber') {
      // Permitir apenas números e limitar a 16 dígitos
      formattedValue = value.replace(/\D/g, '').slice(0, 16);
      // Adicionar espaços a cada 4 dígitos
      formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    }
    
    if (name === 'cardExpiry') {
      // Permitir apenas números e limitar a 4 dígitos
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      // Formato MM/YY
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
      }
    }
    
    if (name === 'cardCvc') {
      // Permitir apenas números e limitar a 3 ou 4 dígitos
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setFormData({
      ...formData,
      [name]: formattedValue
    });
    
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateCardForm = () => {
    const newErrors = {};
    
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Número de cartão inválido';
    }
    
    if (!formData.cardHolder) {
      newErrors.cardHolder = 'Nome no cartão é obrigatório';
    }
    
    if (!formData.cardExpiry || !/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
      newErrors.cardExpiry = 'Data de validade inválida';
    } else {
      // Verificar se a data não está expirada
      const [month, year] = formData.cardExpiry.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const today = new Date();
      
      if (expiryDate < today) {
        newErrors.cardExpiry = 'Cartão expirado';
      }
    }
    
    if (!formData.cardCvc || formData.cardCvc.length < 3) {
      newErrors.cardCvc = 'CVC inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateDetailsForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.address) {
      newErrors.address = 'Endereço é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNextStep = () => {
    if (step === 'details') {
      if (validateDetailsForm()) {
        setStep('card');
      }
    } else if (step === 'card') {
      handleSubmit();
    }
  };
  
  const handleSubmit = () => {
    if (!validateCardForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setStep('processing');
    
    // Simulando processamento de pagamento
    setTimeout(() => {
      setStep('success');
      setIsSubmitting(false);
      
      // Extrair últimos 4 dígitos do cartão
      const cardLast4 = formData.cardNumber.replace(/\s/g, '').slice(-4);
      
      // Determinar a bandeira do cartão (simplificado)
      const firstDigit = formData.cardNumber.charAt(0);
      let cardBrand = 'desconhecida';
      
      if (firstDigit === '4') cardBrand = 'visa';
      else if (firstDigit === '5') cardBrand = 'mastercard';
      else if (firstDigit === '3') cardBrand = 'amex';
      
      // Após um segundo, chamar o callback de conclusão
      setTimeout(() => {
        onComplete({ cardBrand, cardLast4 });
      }, 1000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Cabeçalho */}
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {step === 'success' ? 'Pagamento Confirmado' : `Assinar Plano ${plan.name}`}
          </h3>
          {step !== 'processing' && step !== 'success' && (
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="p-6">
          {/* Etapa de detalhes */}
          {step === 'details' && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Você selecionou o plano <span className="font-semibold">{plan.name}</span> por{' '}
                <span className="font-semibold">{formatCurrency(plan.price)}</span> {plan.interval}
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Seu nome completo"
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="seu@email.com"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço de Cobrança*
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Endereço completo"
                  rows="2"
                  required
                ></textarea>
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Etapa do cartão */}
          {step === 'card' && (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-700">Plano {plan.name}</span>
                  <span className="font-semibold">{formatCurrency(plan.price)}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Cobrado {plan.interval}mente. Cancele a qualquer momento.
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número do Cartão*
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="1234 5678 9012 3456"
                  required
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome no Cartão*
                </label>
                <input
                  type="text"
                  name="cardHolder"
                  value={formData.cardHolder}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cardHolder ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="NOME COMO ESTÁ NO CARTÃO"
                  required
                />
                {errors.cardHolder && (
                  <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Validade*
                  </label>
                  <input
                    type="text"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleChange}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cardExpiry ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="MM/AA"
                    required
                  />
                  {errors.cardExpiry && (
                    <p className="text-red-500 text-xs mt-1">{errors.cardExpiry}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVC/CVV*
                  </label>
                  <input
                    type="text"
                    name="cardCvc"
                    value={formData.cardCvc}
                    onChange={handleChange}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cardCvc ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="123"
                    required
                  />
                  {errors.cardCvc && (
                    <p className="text-red-500 text-xs mt-1">{errors.cardCvc}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-2 flex items-center text-gray-500 text-sm">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Pagamento seguro com criptografia SSL
              </div>
            </div>
          )}
          
          {/* Etapa de processamento */}
          {step === 'processing' && (
            <div className="py-8 text-center">
              <Spinner size="lg" color="blue" />
              <p className="mt-4 text-gray-600">Processando seu pagamento...</p>
              <p className="text-sm text-gray-500 mt-2">Por favor, aguarde</p>
            </div>
          )}
          
          {/* Etapa de sucesso */}
          {step === 'success' && (
            <div className="py-6 text-center">
              <div className="h-16 w-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold">Pagamento Realizado</h3>
              <p className="mt-2 text-gray-600">
                Seu plano {plan.name} foi ativado com sucesso!
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Você receberá um email com a confirmação da sua assinatura
              </p>
            </div>
          )}
          
          {/* Botões de ação */}
          {(step === 'details' || step === 'card') && (
            <div className="mt-6 flex justify-end space-x-3">
              {step === 'card' && (
                <button
                  onClick={() => setStep('details')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Voltar
                </button>
              )}
              
              <button
                onClick={handleNextStep}
                style={{ backgroundColor: theme.primaryColor }}
                className="px-4 py-2 rounded-md text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {step === 'details' ? 'Continuar' : 'Confirmar Pagamento'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
