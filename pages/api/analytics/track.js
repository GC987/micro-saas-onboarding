// API para registrar eventos analíticos
// Esta API receberá eventos do front-end e os salvará no banco de dados
import { addEvent } from '../../../data/mockDb';

export default async function handler(req, res) {
  // Apenas aceitar requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const event = req.body;
    
    // Validação básica
    if (!event.eventType || !event.timestamp) {
      return res.status(400).json({ error: 'Dados do evento incompletos' });
    }

    // Utilizando nosso banco de dados simulado para salvar o evento
    const savedEvent = addEvent(event);
    
    // Log para debug durante desenvolvimento
    console.log('Evento analítico registrado:', event);
    
    // Retornar sucesso com o ID do evento gerado
    return res.status(200).json({ success: true, eventId: savedEvent.id });
  } catch (error) {
    console.error('Erro ao registrar evento analítico:', error);
    return res.status(500).json({ error: 'Erro ao processar evento analítico' });
  }
}
