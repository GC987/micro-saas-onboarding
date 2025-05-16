import mockPrisma from '../../../data/mockDb';
import { trackChecklistViewed, trackChecklistUpdated, trackChecklistDeleted } from '../../../utils/analytics';

export default async function handler(req, res) {
  const { id } = req.query;
  const userId = req.query.userId || (req.body && req.body.userId);

  if (!id || !userId) {
    return res.status(400).json({ error: 'ID do checklist e ID do usuário são obrigatórios' });
  }

  try {
    // Não precisamos converter para int já que estamos usando strings como IDs no mockDb
    const checklistId = id;

    // Verificação de método
    if (req.method === 'GET') {
      // Buscar um checklist específico usando o mockDb
      const checklist = await mockPrisma.checklist.findFirst({
        where: {
          id: checklistId,
          userId: userId
        }
      });

      if (!checklist) {
        return res.status(404).json({ error: 'Checklist não encontrado ou acesso negado' });
      }
      
      // Registrar visualização para análises
      trackChecklistViewed(checklist.id, userId);

      return res.status(200).json(checklist);
    } 
    else if (req.method === 'PATCH') {
      // Atualizar o status do checklist
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: 'Status é obrigatório' });
      }

      // Verificar se o status é válido
      const validStatuses = ['Pendente', 'Em Análise', 'Concluído'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }

      // Verificar se o checklist pertence ao usuário usando mockDb
      const existingChecklist = await mockPrisma.checklist.findFirst({
        where: {
          id: checklistId,
          userId
        }
      });

      if (!existingChecklist) {
        return res.status(404).json({ error: 'Checklist não encontrado ou acesso negado' });
      }

      // Atualizar o status usando mockDb
      const updatedChecklist = await mockPrisma.checklist.update({
        where: {
          id: checklistId
        },
        data: {
          status
        }
      });
      
      // Registrar atualização para análises
      trackChecklistUpdated(checklistId, userId);

      return res.status(200).json(updatedChecklist);
    }
    else if (req.method === 'DELETE') {
      // Verificar se o checklist pertence ao usuário usando mockDb
      const existingChecklist = await mockPrisma.checklist.findFirst({
        where: {
          id: checklistId,
          userId
        }
      });

      if (!existingChecklist) {
        return res.status(404).json({ error: 'Checklist não encontrado ou acesso negado' });
      }

      // Excluir o checklist usando mockDb
      await mockPrisma.checklist.delete({
        where: {
          id: checklistId
        }
      });
      
      // Registrar exclusão para análises
      trackChecklistDeleted(checklistId, userId);

      return res.status(200).json({ success: true });
    }
    
    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
}
