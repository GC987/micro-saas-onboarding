import '../styles/globals.css';
import { ToastProvider } from '../contexts/ToastContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Carregamento dinâmico do OnboardingGuide com SSR desativado
const OnboardingGuide = dynamic(
  () => import('../components/OnboardingGuide'),
  { ssr: false } // Importante: desativa SSR para este componente
);

export default function App({ Component, pageProps }) {
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false); // Estado para controlar a exibição
  
  useEffect(() => {
    // Verificar se é o primeiro login do usuário
    try {
      const onboardingComplete = localStorage.getItem('onboardingComplete');
      const user = localStorage.getItem('user');
      
      if (user) {
        // Mostrar o componente de onboarding apenas quando no cliente
        setShowOnboarding(true);
        
        // Verificar se é o primeiro login
        if (!onboardingComplete) {
          setIsFirstLogin(true);
          // Marcar como visualizado para não mostrar em cada carregamento
          localStorage.setItem('onboardingComplete', 'in-progress');
        }
      }
    } catch (error) {
      // Tratamento seguro para erros de localStorage
      console.error('Erro ao acessar localStorage:', error);
    }
  }, []);
  
  return (
    <ThemeProvider>
      <ToastProvider>
        <Component {...pageProps} />
        {/* Mostra o guia de onboarding apenas após a verificação do useEffect */}
        {showOnboarding && (
          <OnboardingGuide isFirstLogin={isFirstLogin} />
        )}
      </ToastProvider>
    </ThemeProvider>
  );
}
