import prisma from '../prisma';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';

// Desativar o bodyParser padrão do Next.js para processar o FormData
export const config = {
  api: {
    bodyParser: false,
  },
};

// Função para processar o form multipart
const parseForm = async (req) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ 
      uploadDir: path.join(process.cwd(), 'uploads'),
      keepExtensions: true,
      multiples: true
    });
    
    // Certifique-se de que o diretório de uploads existe
    try {
      if (!fs.access(form.uploadDir)) {
        fs.mkdir(form.uploadDir, { recursive: true });
      }
    } catch (error) {
      fs.mkdir(form.uploadDir, { recursive: true });
    }
    
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Processar o form
    const { fields, files } = await parseForm(req);
    const token = fields.token[0];
    const responses = JSON.parse(fields.responses[0]);
    
    if (!token) {
      return res.status(400).json({ error: 'Token não fornecido' });
    }

    // Buscar o checklist pelo token
    const checklist = await prisma.checklist.findFirst({
      where: {
        publicToken: token
      }
    });

    if (!checklist) {
      return res.status(404).json({ error: 'Checklist não encontrado' });
    }

    // Processar arquivos
    const fileData = {};
    if (files) {
      for (const [fieldName, fileInfo] of Object.entries(files)) {
        const file = Array.isArray(fileInfo) ? fileInfo[0] : fileInfo;
        // Salvar informações do arquivo
        fileData[fieldName] = {
          filename: file.originalFilename,
          path: file.filepath,
          size: file.size,
          type: file.mimetype
        };
      }
    }

    // Atualizar o status do checklist para "Em Análise"
    await prisma.checklist.update({
      where: {
        id: checklist.id
      },
      data: {
        status: 'Em Análise',
        // Armazenar as respostas e os metadados dos arquivos
        responses: JSON.stringify({
          textResponses: responses,
          files: fileData,
          submittedAt: new Date().toISOString()
        })
      }
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro ao processar envio:', error);
    return res.status(500).json({ error: 'Erro ao processar envio' });
  }
}
