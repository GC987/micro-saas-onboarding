import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Valores padrão do tema
  const defaultTheme = {
    companyName: 'CheckClient',
    primaryColor: '#3b82f6', // azul
    secondaryColor: '#10b981', // verde
    logoUrl: '/logo.svg',
  };

  const [theme, setTheme] = useState(defaultTheme);
  
  // Carrega tema do localStorage na inicialização
  useEffect(() => {
    const savedTheme = localStorage.getItem('userTheme');
    
    if (savedTheme) {
      try {
        setTheme({
          ...defaultTheme,
          ...JSON.parse(savedTheme)
        });
      } catch (e) {
        console.error('Erro ao carregar tema:', e);
      }
    }
  }, []);
  
  // Salva alterações no tema no localStorage
  const updateTheme = (newTheme) => {
    const updatedTheme = { ...theme, ...newTheme };
    setTheme(updatedTheme);
    localStorage.setItem('userTheme', JSON.stringify(updatedTheme));
    
    // Aplicar cores no :root para CSS variables
    if (newTheme.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', newTheme.primaryColor);
    }
    if (newTheme.secondaryColor) {
      document.documentElement.style.setProperty('--secondary-color', newTheme.secondaryColor);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
