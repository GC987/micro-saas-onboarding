import { useRouter } from 'next/router';
import { useTheme } from '../contexts/ThemeContext';

const menu = [
  { label: 'Dashboard', icon: '🏠', path: '/dashboard' },
  { label: 'Análises', icon: '📊', path: '/analises' },
  { label: 'Checklists', icon: '📋', path: '/checklists' },
  { label: 'Respostas', icon: '✅', path: '/respostas' },
  { label: 'Usuários', icon: '👥', path: '/usuarios' },
  { label: 'Assinatura', icon: '💳', path: '/assinatura' },
  { label: 'Customização', icon: '🎨', path: '/customizacao' },
  { label: 'Configurações', icon: '⚙️', path: '/configuracoes' },
  { label: 'Suporte', icon: '🆘', path: '/suporte' },
];

export default function Sidebar({ onLogout }) {
  const router = useRouter();
  const { theme } = useTheme();
  
  // Função para criar classes CSS para os itens de menu
  const getMenuItemClasses = (path) => {
    const baseClasses = "flex items-center w-full px-6 py-3 gap-3 text-left transition-all";
    const isActive = router.pathname === path;
    
    if (isActive) {
      return `${baseClasses} font-semibold`;
    }
    
    return `${baseClasses} text-gray-700 hover:bg-gray-50`;
  };
  
  // Função para determinar cor ou estilo de um item de menu
  const getMenuItemStyle = (path) => {
    const isActive = router.pathname === path;
    return isActive ? { color: theme.primaryColor, backgroundColor: `${theme.primaryColor}15` } : {};
  };
  
  const handleLogout = () => {
    if (onLogout) onLogout();
    else {
      localStorage.removeItem('user');
      router.push('/login');
    }
  };
  
  return (
    <aside className="h-screen bg-white border-r w-64 flex flex-col justify-between fixed left-0 top-0 z-10 shadow-sm">
      <div>
        <div 
          className="flex items-center gap-2 px-6 py-6 border-b"
          style={{ borderColor: `${theme.primaryColor}30` }}
        >
          <img src={theme.logoUrl} alt="Logo" className="h-8 w-8" />
          <span 
            className="font-bold text-xl"
            style={{ color: theme.primaryColor }}
          >
            {theme.companyName}
          </span>
        </div>
        <nav className="mt-6">
          {menu.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className={getMenuItemClasses(item.path)}
              style={getMenuItemStyle(item.path)}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <button 
        onClick={handleLogout} 
        className="m-6 px-4 py-2 rounded transition-colors" 
        style={{ backgroundColor: `${theme.primaryColor}15`, color: theme.primaryColor }}
      >
        Sair
      </button>
    </aside>
  );
}
