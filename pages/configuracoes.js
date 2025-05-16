import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Spinner from '../components/Spinner';

export default function Configuracoes() {
  const router = useRouter();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Estados de configuração
  const [settings, setSettings] = useState({
    emailNotifications: true,
    desktopNotifications: false,
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    twoFactorAuth: false
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
    
    // Simular carregamento de configurações
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  
  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSaveSettings = () => {
    setSaving(true);
    
    // Simular salvamento
    setTimeout(() => {
      setSaving(false);
      showToast('Configurações salvas com sucesso!', 'success');
      
      // Salvar no localStorage para persistência na demo
      localStorage.setItem('userSettings', JSON.stringify(settings));
    }, 800);
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
            <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
            <p className="text-gray-600">Gerencie as configurações do sistema</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Notificações</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Notificações por Email</label>
                  <p className="text-sm text-gray-500">Receba notificações quando clientes responderem checklists</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="emailNotifications"
                    checked={settings.emailNotifications} 
                    onChange={handleSettingChange} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Notificações de Desktop</label>
                  <p className="text-sm text-gray-500">Receba alertas no navegador</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="desktopNotifications"
                    checked={settings.desktopNotifications} 
                    onChange={handleSettingChange} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Preferências Regionais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idioma
                </label>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleSettingChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (United States)</option>
                  <option value="es">Español</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuso Horário
                </label>
                <select
                  name="timezone"
                  value={settings.timezone}
                  onChange={handleSettingChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                  <option value="America/New_York">New York (GMT-5)</option>
                  <option value="Europe/London">London (GMT+0)</option>
                  <option value="Europe/Paris">Paris (GMT+1)</option>
                  <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Segurança</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Autenticação de Dois Fatores</label>
                <p className="text-sm text-gray-500">Adicione uma camada extra de segurança à sua conta</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="twoFactorAuth"
                  checked={settings.twoFactorAuth} 
                  onChange={handleSettingChange} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              style={{ backgroundColor: theme.primaryColor }}
              className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center"
            >
              {saving ? (
                <>
                  <Spinner size="sm" color="white" />
                  <span className="ml-2">Salvando...</span>
                </>
              ) : (
                'Salvar Configurações'
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
