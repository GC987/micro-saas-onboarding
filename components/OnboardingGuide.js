import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { useRouter } from 'next/router';

const OnboardingGuide = ({ isFirstLogin = false }) => {
  // Começamos com false para garantir consistência na renderização servidor/cliente
  const [showGuide, setShowGuide] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMounted, setIsMounted] = useState(false); // Para segurança na hidratação
  const { theme } = useTheme();
  const { showToast } = useToast();
  const router = useRouter();

  // Definição dos passos do onboarding
  const steps = [
    {
      title: 'Bem-vindo ao CheckClient!',
      description: 'Vamos fazer um tour rápido pelas principais funcionalidades do sistema.',
      image: '/onboarding/welcome.svg',
      target: null // Nenhum elemento específico
    },
    {
      title: 'Criando seu primeiro checklist',
      description: 'Acesse a página de checklists e clique em "Criar Novo Checklist" para começar.',
      image: '/onboarding/create-checklist.svg',
      target: '[data-tour="create-checklist"]'
    },
    {
      title: 'Personalize sua marca',
      description: 'Na página de customização, você pode alterar cores e logo para refletir sua marca.',
      image: '/onboarding/customize.svg',
      target: '[data-tour="customization"]'
    },
    {
      title: 'Convide sua equipe',
      description: 'Adicione membros da sua equipe na página de usuários para colaborarem com você.',
      image: '/onboarding/team.svg',
      target: '[data-tour="users"]'
    },
    {
      title: 'Acompanhe seus resultados',
      description: 'Veja estatísticas e respostas de clientes no dashboard e na página de respostas.',
      image: '/onboarding/stats.svg',
      target: '[data-tour="dashboard"]'
    }
  ];

  useEffect(() => {
    // Esta montagem marca que estamos no lado do cliente e é seguro acessar localStorage
    setIsMounted(true);
    
    // Verificar se é o primeiro login ou se é uma visualização manual
    if (isFirstLogin) {
      setShowGuide(true);
    }

    // Se tiver um elemento alvo, rola até ele
    const scrollToElement = () => {
      if (!steps[currentStep]?.target) return;
      
      const element = document.querySelector(steps[currentStep].target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Efeito visual para destacar o elemento
        element.classList.add('onboarding-highlight');
        setTimeout(() => {
          element.classList.remove('onboarding-highlight');
        }, 1500);
      }
    };

    if (showGuide) {
      scrollToElement();
    }
  }, [currentStep, showGuide, isFirstLogin]);

  // Salvar progresso do onboarding
  const completeOnboarding = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setShowGuide(false);
    showToast('Tour concluído! Você pode acessá-lo novamente em Ajuda > Tour pelo sistema.', 'success');
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Renderizamos o componente somente após montado para evitar erros de hidratação
  if (!isMounted) {
    return null; // Não renderizar nada durante SSR
  }
  
  if (!showGuide) return (
    <button 
      className="fixed bottom-5 right-5 bg-white p-2 rounded-full shadow-lg z-50 hover:bg-gray-100 transition-colors"
      onClick={() => setShowGuide(true)}
      aria-label="Mostrar guia de ajuda"
      title="Ajuda e dicas"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-4 border-b" style={{ backgroundColor: theme.primaryColor }}>
          <h2 className="text-lg font-bold text-white">Tour pelo Sistema</h2>
          <button 
            onClick={completeOnboarding} 
            className="text-white hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Conteúdo */}
        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className="w-32 h-32 flex items-center justify-center">
              <img 
                src={steps[currentStep].image || '/placeholder.svg'} 
                alt={steps[currentStep].title}
                className="max-w-full max-h-full"
              />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-2 text-center">{steps[currentStep].title}</h3>
          <p className="text-gray-600 text-center mb-6">{steps[currentStep].description}</p>
          
          {/* Indicadores de passos */}
          <div className="flex justify-center space-x-1 mb-6">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`h-2 rounded-full transition-all ${currentStep === index ? 'w-4 bg-blue-600' : 'w-2 bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
        
        {/* Botões */}
        <div className="flex justify-between p-4 border-t bg-gray-50">
          <button 
            onClick={prevStep} 
            className="px-3 py-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentStep === 0}
          >
            Anterior
          </button>
          
          <button 
            onClick={nextStep} 
            style={{ backgroundColor: theme.primaryColor }}
            className="px-3 py-1.5 text-white rounded hover:opacity-90 transition-opacity"
          >
            {currentStep < steps.length - 1 ? 'Próximo' : 'Concluir'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuide;
