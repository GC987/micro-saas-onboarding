import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Spinner from '../components/Spinner';

export default function Customizacao() {
  const router = useRouter();
  const { theme, updateTheme } = useTheme();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    companyName: '',
    primaryColor: '',
    secondaryColor: '',
    logoUrl: ''
  });

  // Preview logo
  const [previewLogo, setPreviewLogo] = useState(null);
  
  useEffect(() => {
    // Verificar se o usuário está logado via localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setUser(userData);
    
    // Inicializar form com valores do tema atual
    setFormData({
      companyName: theme.companyName,
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      logoUrl: theme.logoUrl
    });
    
    setPreviewLogo(theme.logoUrl);
    setLoading(false);
  }, [theme]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Apenas para demonstração - normalmente você faria upload para um servidor
    // e armazenaria a URL. Aqui, vamos usar um URL local temporário.
    const fileUrl = URL.createObjectURL(file);
    setPreviewLogo(fileUrl);
    setFormData({
      ...formData,
      logoUrl: fileUrl
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Simular salvamento
    setTimeout(() => {
      updateTheme(formData);
      setSaving(false);
      showToast('Personalização salva com sucesso!', 'success');
    }, 800);
  };
  
  const handleReset = () => {
    // Redefine para os valores padrão
    const defaultTheme = {
      companyName: 'CheckClient',
      primaryColor: '#3b82f6',
      secondaryColor: '#10b981',
      logoUrl: '/logo.svg'
    };
    
    setFormData(defaultTheme);
    setPreviewLogo(defaultTheme.logoUrl);
    updateTheme(defaultTheme);
    showToast('Configurações redefinidas para o padrão', 'info');
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
      {/* Sidebar fixa à esquerda */}
      <Sidebar />
      
      {/* Conteúdo principal */}
      <div className="flex-1 ml-64">
        {/* Header no topo */}
        <Header user={user} />
        
        {/* Conteúdo da página */}
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Personalização</h1>
            <p className="text-gray-600">Personalize sua marca e aparência do sistema</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Coluna 1: Configurações */}
                <div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Nome da Empresa
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome da sua empresa"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Cor Primária
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        name="primaryColor"
                        value={formData.primaryColor}
                        onChange={handleChange}
                        className="w-12 h-10 border-0 rounded overflow-hidden cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={handleChange}
                        name="primaryColor"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#hex ou nome da cor"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Cor Secundária
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        name="secondaryColor"
                        value={formData.secondaryColor}
                        onChange={handleChange}
                        className="w-12 h-10 border-0 rounded overflow-hidden cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.secondaryColor}
                        onChange={handleChange}
                        name="secondaryColor"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#hex ou nome da cor"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Logo da Empresa
                    </label>
                    <div className="flex flex-col gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500">Recomendado: SVG ou PNG, fundo transparente</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-8">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:bg-blue-400"
                      disabled={saving}
                    >
                      {saving ? (
                        <div className="flex items-center gap-2">
                          <Spinner size="sm" color="white" />
                          <span>Salvando...</span>
                        </div>
                      ) : (
                        'Salvar Configurações'
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                    >
                      Redefinir para Padrão
                    </button>
                  </div>
                </div>
                
                {/* Coluna 2: Preview */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Preview</h3>
                  
                  <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      {previewLogo && (
                        <img 
                          src={previewLogo} 
                          alt="Logo Preview" 
                          className="h-10 w-10"
                        />
                      )}
                      <span 
                        className="font-bold text-xl"
                        style={{ color: formData.primaryColor }}
                      >
                        {formData.companyName}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mb-6">
                      <button
                        style={{ backgroundColor: formData.primaryColor }}
                        className="px-4 py-2 text-white rounded"
                      >
                        Botão Primário
                      </button>
                      <button
                        style={{ backgroundColor: formData.secondaryColor }}
                        className="px-4 py-2 text-white rounded"
                      >
                        Botão Secundário
                      </button>
                    </div>
                    
                    <div>
                      <div className="p-4 rounded mb-2" style={{ backgroundColor: `${formData.primaryColor}20` }}>
                        <span style={{ color: formData.primaryColor }}>Elemento com cor primária</span>
                      </div>
                      <div className="p-4 rounded" style={{ backgroundColor: `${formData.secondaryColor}20` }}>
                        <span style={{ color: formData.secondaryColor }}>Elemento com cor secundária</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Esta é uma visualização aproximada. A aparência real pode variar ligeiramente
                    dependendo do contexto em que os elementos são utilizados.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
