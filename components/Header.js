import { useTheme } from '../contexts/ThemeContext';

export default function Header({ companyName: propCompanyName, user }) {
  const { theme } = useTheme();
  
  // Usa o nome da empresa do tema ou o recebido por props
  const companyName = propCompanyName || theme.companyName;
  
  return (
    <header className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {/* Logo customizável via tema */}
        <img src={theme.logoUrl} alt="Logo" className="h-8 w-8" />
        <span 
          className="font-semibold text-lg" 
          style={{ color: theme.primaryColor }}
        >
          {companyName || 'Nome da Empresa'}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-gray-700">{user?.name || 'Usuário'}</span>
        <img src={user?.avatar || '/avatar.svg'} alt="Avatar" className="h-8 w-8 rounded-full border" />
      </div>
    </header>
  );
}
