import mockPrisma from '../../../data/mockDb';
import { trackChecklistCreated } from '../../../utils/analytics';

export default async function handler(req, res) {
  // GET: Listar checklists do usuário
  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId obrigatório' });
    
    console.log(`[API][GET] Listando checklists para userId: ${userId}`);

    try {
      // Usar mockPrisma ao invés de prisma - garantir que userId seja sempre string
      const checklists = await mockPrisma.checklist.findMany({
        where: { userId: String(userId) }
      });
      
      console.log(`[API][GET] Encontrados ${checklists.length} checklists para o usuário ${userId}`);
      console.log(`[API][GET] IDs dos checklists: ${checklists.map(c => c.id).join(', ')}`);

      // Deserializa o campo fields de cada checklist
      const result = checklists.map(checklist => ({
        ...checklist,
        fields: JSON.parse(checklist.fields)
      }));
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao listar checklists:', error);
      return res.status(500).json({ error: 'Erro ao listar checklists' });
    }
  }
  // POST: Criar novo checklist
  if (req.method === 'POST') {
    const { userId, clientName, clientEmail, serviceType, fields } = req.body;
    if (!userId || !clientName || !clientEmail || !serviceType || !fields) {
      return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
    }
    
    // Converter userId para string para garantir consistência
    const userIdStr = String(userId);
    
    // Gerar token público único
    const publicToken = Math.random().toString(36).slice(2, 12);
    const checklistId = `cl_${Date.now()}`;
    
    console.log(`[API][POST] Criando novo checklist: ${checklistId} para userId: ${userIdStr}`);
    console.log(`[API][POST] Dados: ${clientName}, ${clientEmail}, ${serviceType}, campos: ${fields.length}`);
    
    try {
      // Criar checklist usando mockPrisma
      const checklist = await mockPrisma.checklist.create({
        data: {
          id: checklistId,
          userId: userIdStr,
          clientName,
          clientEmail,
          serviceType,
          fields: JSON.stringify(fields), // Serializa o array de campos para string
          publicToken,
          status: 'Pendente',
          createdAt: new Date().toISOString()
        },
      });
      
      // Registrar evento para análises
      trackChecklistCreated(checklist.id, null, userIdStr);

      // Log para debug
      console.log(`[API][POST] Checklist ${checklistId} criado com sucesso. Link público: /share/${publicToken}`);
      
      // Simulação de envio de e-mail (sem tentar realmente enviar para não causar erros)
      console.log(`[API][POST] Simulando envio de e-mail para: ${clientEmail}`);
      console.log(`[API][POST] Assunto: Você tem uma pendência para responder - ${serviceType}`);
      console.log(`[API][POST] Link no e-mail: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/share/${publicToken}`);
      
      // Deserializa fields novamente para a resposta
      const result = {
        ...checklist,
        fields: JSON.parse(checklist.fields)
      };
      
      return res.status(201).json(result);
    } catch (error) {
      console.error('Erro ao criar checklist:', error);
      return res.status(500).json({ error: 'Erro ao criar checklist' });
    }
  }
  return res.status(405).json({ error: 'Método não permitido' });
}
