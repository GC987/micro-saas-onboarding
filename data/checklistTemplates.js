// Biblioteca de templates de checklists por indústria
export const checklistTemplates = [
  {
    id: 'onboarding-site',
    category: 'web',
    name: 'Onboarding de Site',
    description: 'Checklist para coleta de informações para criação de site',
    icon: '/icons/template-web.svg',
    fields: [
      {
        label: 'URL do site atual (se houver)',
        type: 'text',
        required: false,
        placeholder: 'www.empresa.com.br'
      },
      {
        label: 'Cores principais da marca',
        type: 'text',
        required: true,
        placeholder: 'Ex: Azul (#1a4b8c) e Verde (#2e8b57)'
      },
      {
        label: 'Logotipo da empresa',
        type: 'file',
        required: true,
        accept: 'image/*'
      },
      {
        label: 'Slogan ou mensagem principal',
        type: 'text',
        required: false,
        placeholder: 'Ex: Transformando ideias em negócios digitais'
      },
      {
        label: 'Número de páginas desejadas',
        type: 'text',
        required: true,
        placeholder: 'Ex: 5 (Home, Sobre, Serviços, Blog, Contato)'
      },
      {
        label: 'Referências de sites que gosta',
        type: 'text',
        required: false,
        placeholder: 'URLs de sites cuja estética ou funcionalidade sejam referências'
      },
      {
        label: 'Descrição do público-alvo',
        type: 'text',
        required: true,
        placeholder: 'Ex: Pequenos empresários entre 30-45 anos buscando presença digital'
      },
      {
        label: 'Principais concorrentes',
        type: 'text',
        required: false,
        placeholder: 'Liste seus principais concorrentes e seus sites'
      },
      {
        label: 'Informações adicionais',
        type: 'text',
        required: false,
        placeholder: 'Outros detalhes importantes que devemos saber'
      }
    ]
  },
  {
    id: 'onboarding-ecommerce',
    category: 'web',
    name: 'Onboarding de E-commerce',
    description: 'Checklist para configuração de loja online',
    icon: '/icons/template-ecommerce.svg',
    fields: [
      {
        label: 'Número estimado de produtos',
        type: 'text',
        required: true,
        placeholder: 'Ex: 50-100 produtos'
      },
      {
        label: 'Categorias de produtos',
        type: 'text',
        required: true,
        placeholder: 'Ex: Roupas, Acessórios, Calçados'
      },
      {
        label: 'Métodos de pagamento desejados',
        type: 'text',
        required: true,
        placeholder: 'Ex: Cartão de crédito, boleto, PIX'
      },
      {
        label: 'Opções de frete',
        type: 'text',
        required: true,
        placeholder: 'Ex: Correios, transportadora, entrega própria'
      },
      {
        label: 'Política de troca (documento)',
        type: 'file',
        required: false,
        accept: '.pdf,.doc,.docx'
      },
      {
        label: 'Termos de uso (documento)',
        type: 'file',
        required: false,
        accept: '.pdf,.doc,.docx'
      },
      {
        label: 'Logotipo da empresa',
        type: 'file',
        required: true,
        accept: 'image/*'
      },
      {
        label: 'Política de cupons e descontos',
        type: 'text',
        required: false,
        placeholder: 'Descreva sua estratégia de cupons e descontos'
      },
      {
        label: 'Integrações desejadas',
        type: 'text',
        required: false,
        placeholder: 'Ex: ERP, sistema de estoque, marketing por email'
      }
    ]
  },
  {
    id: 'onboarding-cliente-consultoria',
    category: 'consultoria',
    name: 'Onboarding de Cliente - Consultoria',
    description: 'Levantamento inicial para projetos de consultoria',
    icon: '/icons/template-consulting.svg',
    fields: [
      {
        label: 'Descrição do negócio',
        type: 'text',
        required: true,
        placeholder: 'Descreva brevemente seu negócio e setor de atuação'
      },
      {
        label: 'Principais desafios atuais',
        type: 'text',
        required: true,
        placeholder: 'Quais problemas você espera resolver com a consultoria?'
      },
      {
        label: 'Tamanho da empresa',
        type: 'text',
        required: true,
        placeholder: 'Número de funcionários, faturamento anual aproximado'
      },
      {
        label: 'Organograma atual',
        type: 'file',
        required: false,
        accept: 'image/*,.pdf'
      },
      {
        label: 'Metas para os próximos 12 meses',
        type: 'text',
        required: true,
        placeholder: 'Quais são seus objetivos de curto prazo?'
      },
      {
        label: 'Tentativas anteriores de solução',
        type: 'text',
        required: false,
        placeholder: 'Você já tentou outras abordagens para resolver estes problemas?'
      },
      {
        label: 'Demonstrações financeiras recentes',
        type: 'file',
        required: false,
        accept: '.pdf,.xls,.xlsx,.csv'
      },
      {
        label: 'Stakeholders principais',
        type: 'text',
        required: true,
        placeholder: 'Quem são as pessoas-chave envolvidas no projeto?'
      }
    ]
  },
  {
    id: 'onboarding-juridico',
    category: 'juridico',
    name: 'Onboarding de Cliente - Jurídico',
    description: 'Coleta de informações para escritórios de advocacia',
    icon: '/icons/template-legal.svg',
    fields: [
      {
        label: 'Tipo de serviço jurídico',
        type: 'text',
        required: true,
        placeholder: 'Ex: Trabalhista, Empresarial, Tributário, Civil'
      },
      {
        label: 'Descrição do caso',
        type: 'text',
        required: true,
        placeholder: 'Descreva brevemente sua situação jurídica'
      },
      {
        label: 'Documentos pessoais',
        type: 'file',
        required: true,
        accept: '.pdf,.jpg,.png'
      },
      {
        label: 'Documentos relacionados ao caso',
        type: 'file',
        required: true,
        accept: '.pdf,.doc,.docx'
      },
      {
        label: 'Existem processos anteriores?',
        type: 'text',
        required: false,
        placeholder: 'Informe números de processos anteriores relacionados'
      },
      {
        label: 'Parte contrária (se aplicável)',
        type: 'text',
        required: false,
        placeholder: 'Nome da parte contrária'
      },
      {
        label: 'Testemunhas (se aplicável)',
        type: 'text',
        required: false,
        placeholder: 'Nome e contato de possíveis testemunhas'
      },
      {
        label: 'Prazo crítico',
        type: 'text',
        required: false,
        placeholder: 'Existe algum prazo legal iminente?'
      }
    ]
  },
  {
    id: 'onboarding-contabilidade',
    category: 'financas',
    name: 'Onboarding de Cliente - Contabilidade',
    description: 'Documentação inicial para escritórios de contabilidade',
    icon: '/icons/template-accounting.svg',
    fields: [
      {
        label: 'Contrato Social / Estatuto',
        type: 'file',
        required: true,
        accept: '.pdf'
      },
      {
        label: 'CNPJ',
        type: 'file',
        required: true,
        accept: '.pdf,.jpg,.png'
      },
      {
        label: 'Regime tributário atual',
        type: 'text',
        required: true,
        placeholder: 'Ex: Simples Nacional, Lucro Presumido, Lucro Real'
      },
      {
        label: 'Faturamento mensal médio',
        type: 'text',
        required: true,
        placeholder: 'Média de faturamento dos últimos 12 meses'
      },
      {
        label: 'Número de funcionários',
        type: 'text',
        required: true,
        placeholder: 'Quantidade atual de colaboradores CLT'
      },
      {
        label: 'Extratos bancários (últimos 3 meses)',
        type: 'file',
        required: true,
        accept: '.pdf,.xls,.xlsx,.csv'
      },
      {
        label: 'Notas fiscais (últimos 3 meses)',
        type: 'file',
        required: true,
        accept: '.pdf,.xml'
      },
      {
        label: 'Certificado Digital',
        type: 'text',
        required: false,
        placeholder: 'Você possui certificado digital? Qual tipo e validade?'
      },
      {
        label: 'Contador anterior',
        type: 'text',
        required: false,
        placeholder: 'Dados do contador anterior, se houver'
      }
    ]
  }
];

// Função para buscar um template pelo ID
export function getTemplateById(templateId) {
  return checklistTemplates.find(template => template.id === templateId);
}

// Função para buscar templates por categoria
export function getTemplatesByCategory(category) {
  return checklistTemplates.filter(template => template.category === category);
}

// Categorias disponíveis
export const templateCategories = [
  { id: 'web', name: 'Web e Digital', icon: '/icons/category-web.svg' },
  { id: 'consultoria', name: 'Consultoria', icon: '/icons/category-consulting.svg' },
  { id: 'juridico', name: 'Jurídico', icon: '/icons/category-legal.svg' },
  { id: 'financas', name: 'Finanças e Contabilidade', icon: '/icons/category-finance.svg' }
];
