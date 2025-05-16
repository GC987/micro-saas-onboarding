import { createContext, useState, useContext, useEffect } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  // Estado para controlar se o componente está montado no cliente ou não
  const [isMounted, setIsMounted] = useState(false);

  // Efeito para marcar componente como montado apenas no lado do cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);
    return id;
  };

  const hideToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {/* Renderizar os toasts apenas quando estiver no cliente */}
      {isMounted && (
        <div className="toast-container">
          {toasts.map(toast => (
            <Toast 
              key={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => hideToast(toast.id)}
            />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
