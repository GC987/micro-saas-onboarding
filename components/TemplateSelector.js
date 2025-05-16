import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { checklistTemplates, templateCategories } from '../data/checklistTemplates';

const TemplateSelector = ({ onSelectTemplate, onCancel }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();
  
  // Filtra os templates com base na categoria e busca
  const filteredTemplates = checklistTemplates.filter(template => {
    // Filtro por categoria
    if (selectedCategory !== 'all' && template.category !== selectedCategory) {
      return false;
    }
    
    // Filtro por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Manipula a seleção de um template
  const handleSelectTemplate = (template) => {
    onSelectTemplate(template);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Escolha um Template</h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Busca e filtros */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Buscar templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas categorias</option>
            {templateCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Lista de templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Template em branco */}
        <div 
          className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col items-center text-center"
          onClick={() => handleSelectTemplate(null)}
        >
          <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="font-medium mb-1">Checklist em Branco</h3>
          <p className="text-sm text-gray-500">Comece do zero com campos personalizados</p>
        </div>
        
        {/* Templates disponíveis */}
        {filteredTemplates.map(template => (
          <div 
            key={template.id}
            className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col"
            onClick={() => handleSelectTemplate(template)}
          >
            <div className="flex items-start mb-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: `${theme.primaryColor}20` }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={theme.primaryColor}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">{template.name}</h3>
                <p className="text-sm text-gray-500">{template.description}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-auto">
              {template.fields.length} campos pré-configurados
            </div>
          </div>
        ))}
      </div>
      
      {filteredTemplates.length === 0 && searchQuery && (
        <div className="text-center py-6 text-gray-500">
          <p>Nenhum template encontrado para "{searchQuery}"</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="text-blue-500 hover:underline mt-2"
          >
            Limpar busca
          </button>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
