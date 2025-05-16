/**
 * Banco de dados simulado para ambiente de demonstração
 * Este arquivo substitui a conexão com o Prisma para facilitar testes sem configurar um banco real
 */

// Armazenamento em memória
let recentlyCreatedTokens = [];

import fs from 'fs/promises';
import path from 'path';

const CHECKLISTS_PATH = path.join(process.cwd(), 'data', 'checklists.json');

let checklists = [];

async function loadChecklists() {
  try {
    const data = await fs.readFile(CHECKLISTS_PATH, 'utf-8');
    checklists = JSON.parse(data);
    console.log('[MockDB] Checklists carregados do arquivo:', checklists.length);
  } catch (err) {
    console.log('[MockDB] Não foi possível carregar checklists do arquivo, usando exemplo.');
    checklists = [
      {
        id: 'cl_exemplo_1',
        userId: '1',
        clientName: 'Exemplo Dashboard',
        clientEmail: 'exemplo@teste.com',
        serviceType: 'Consultoria Web',
        status: 'Pendente',
        fields: '{}',
        publicToken: 'token_exemplo_1',
        createdAt: new Date().toISOString(),
        responses: null
      }
    ];
    await saveChecklists();
  }
}

async function saveChecklists() {
  await fs.writeFile(CHECKLISTS_PATH, JSON.stringify(checklists, null, 2));
}

// Função auxiliar para verificar se precisamos inicializar com dados padrão
const initializeWithDefaultData = () => {
  // Se não há checklists, inicializar com dados de exemplo
  if (checklists.length === 0) {
    console.log('[MockDB] Sem checklists encontrados, inicializando com dados padrão');
    const checklistsData = [
      {
        id: 'cl_auto_wxdjs167ki',
        userId: '1',
        clientName: 'Cliente Auto',
        clientEmail: 'cliente@exemplo.com',
        serviceType: 'Serviço Padrão',
        status: 'Pendente',
        fields: JSON.stringify([
          { label: 'Nome', type: 'text', required: false }
        ]),
        publicToken: 'wxdjs167ki',
        createdAt: new Date().toISOString(),
        responses: null
      },
      {
        id: 'cl_exemplo_editor',
        userId: '2',
        clientName: 'Cliente Editor',
        clientEmail: 'cliente-editor@exemplo.com',
        serviceType: 'Serviço Editor',
        status: 'Pendente',
        fields: JSON.stringify([
          { label: 'Nome', type: 'text', required: false }
        ]),
        publicToken: 'editor123token',
        createdAt: new Date().toISOString(),
        responses: null
      }
    ];
    
    checklists = checklistsData;
    saveChecklists();
    console.log('[MockDB] Dados padrão salvos no arquivo');
  }
};

// Carregar checklists ao iniciar e garantir dados iniciais
await loadChecklists();
initializeWithDefaultData();

// Função auxiliar para adicionar tokens - definida DEPOIS de checklists
const addRecentToken = (token) => {
  // Verificar se já existe um checklist com este token
  const exists = checklists.some(c => c.publicToken === token);
  if (!exists && !recentlyCreatedTokens.includes(token)) {
    recentlyCreatedTokens.push(token);
    // Criar um checklist falso para este token
    checklists.push({
      id: `cl_auto_${Date.now()}`,
      userId: '1',
      clientName: 'Cliente Auto',
      clientEmail: 'cliente@exemplo.com',
      serviceType: 'Serviço Padrão',
      status: 'Pendente',
      fields: JSON.stringify([
        { label: 'Nome', type: 'text', required: false }
      ]),
      publicToken: token,
      createdAt: new Date().toISOString(),
      responses: null
    });
    console.log(`[MockDB] Token adicionado automaticamente: ${token}`);
  }
};

// Eventos para análise
let events = [];

/**
 * Adiciona um evento ao armazenamento
 * @param {object} event O evento para armazenar
 */
export const addEvent = (event) => {
  events.push({
    ...event,
    id: `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`
  });
  return event;
};

// API simulada do Prisma
const mockPrisma = {
  checklist: {
    findFirst: async ({ where }) => {
      console.log('[MockDB] Buscando checklist', where);
      return checklists.find(c => {
        if (where.id) return c.id === where.id;
        if (where.publicToken) return c.publicToken === where.publicToken;
        return false;
      });
    },
    findMany: async ({ where }) => {
      console.log('[MockDB] Listando checklists', where);
      if (!where) return checklists;
      
      return checklists.filter(c => {
        // Filtrar por userId se fornecido - convertendo ambos para string para evitar problemas de tipo
        if (where.userId) {
          const whereUserId = String(where.userId);
          const checlistUserId = String(c.userId);
          console.log(`[MockDB] Comparando userId: ${checlistUserId} === ${whereUserId} (${checlistUserId === whereUserId})`);
          if (checlistUserId !== whereUserId) return false;
        }
        // Filtrar por status se fornecido
        if (where.status && c.status !== where.status) return false;
        return true;
      });
    },
    create: async ({ data }) => {
      console.log('[MockDB] Criando checklist', data);
      
      // Garantir que userId seja sempre string para consistência
      const processedData = {
        ...data,
        userId: String(data.userId)
      };
      
      const newChecklist = {
        id: data.id || `cl_${Date.now()}`,
        ...processedData,
        createdAt: data.createdAt || new Date().toISOString(),
        responses: null
      };
      
      checklists.push(newChecklist);
      await saveChecklists();
      console.log(`[MockDB] Novo checklist criado com userId: ${newChecklist.userId}`);
      console.log(`[MockDB] Total de checklists após criação: ${checklists.length}`);
      console.log(`[MockDB] IDs atuais: ${checklists.map(c => c.id).join(', ')}`);
      return newChecklist;
    },
    update: async ({ where, data }) => {
      console.log('[MockDB] Atualizando checklist', where, data);
      const index = checklists.findIndex(c => {
        if (where.id) return c.id === where.id;
        if (where.publicToken) return c.publicToken === where.publicToken;
        return false;
      });
      
      if (index === -1) throw new Error('Checklist não encontrado');
      
      // Atualizar apenas os campos fornecidos
      checklists[index] = {
        ...checklists[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      return checklists[index];
    },
    delete: async ({ where }) => {
      console.log('[MockDB] Excluindo checklist', where);
      const index = checklists.findIndex(c => c.id === where.id);
      if (index === -1) throw new Error('Checklist não encontrado');
      
      const deleted = checklists[index];
      checklists = checklists.filter(c => c.id !== where.id);
      return deleted;
    }
  }
};

// Função exportada para permitir a importação de novos tokens
export const registerToken = (token) => {
  if (token && typeof token === 'string') {
    addRecentToken(token);
    return true;
  }
  return false;
};

export default mockPrisma;
