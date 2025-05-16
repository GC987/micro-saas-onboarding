import prisma from '../../prisma';
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { params } = req.query;
  
  if (!params || params.length < 2) {
    return res.status(400).json({ error: 'Parâmetros inválidos' });
  }

  const [checklistId, fieldName] = params;
  
  try {
    // Buscar o checklist no banco de dados
    const checklist = await prisma.checklist.findUnique({
      where: {
        id: parseInt(checklistId)
      }
    });

    if (!checklist) {
      return res.status(404).json({ error: 'Checklist não encontrado' });
    }
    
    // Verificar se o checklist tem resposta
    if (!checklist.responses) {
      return res.status(404).json({ error: 'Nenhuma resposta encontrada para este checklist' });
    }

    // Deserializar as respostas
    const responses = JSON.parse(checklist.responses);
    
    if (!responses.files || !responses.files[fieldName]) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    const fileInfo = responses.files[fieldName];
    const filePath = fileInfo.path;
    
    // Verificar se o arquivo existe
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ error: 'Arquivo não encontrado no servidor' });
    }

    // Definir o cabeçalho para download
    res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(fileInfo.filename)}`);
    if (fileInfo.type) {
      res.setHeader('Content-Type', fileInfo.type);
    }

    // Ler e enviar o arquivo
    const fileBuffer = await fs.readFile(filePath);
    res.send(fileBuffer);
  } catch (error) {
    console.error('Erro ao processar download de arquivo:', error);
    return res.status(500).json({ error: 'Erro ao processar download de arquivo' });
  }
}
