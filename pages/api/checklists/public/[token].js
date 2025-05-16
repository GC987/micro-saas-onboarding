import mockPrisma, { registerToken } from '../../../../data/mockDb';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { trackResponseCompleted } from '../../../../utils/analytics';

export const config = {
  api: {
    bodyParser: false, // necessário para uploads com formidable
  },
};

export default async function handler(req, res) {
  try {
    console.log('[API] Nova requisição recebida:', req.method, req.url);
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Token não fornecido' });
    }
    
    // Registrar o token atual no nosso sistema
    registerToken(token);
    console.log(`[API] Processando solicitação para token: ${token}`);

    // GET: Buscar dados do checklist
    if (req.method === 'GET') {
      try {
        // Buscar o checklist pelo token público
        const checklist = await mockPrisma.checklist.findFirst({
          where: {
            publicToken: token
          },
          select: {
            id: true,
            clientName: true,
            serviceType: true,
            fields: true,
            status: true
          }
        });

        if (!checklist) {
          return res.status(404).json({ error: 'Checklist não encontrado' });
        }

        return res.status(200).json(checklist);
      } catch (error) {
        console.error('Erro ao buscar checklist:', error);
        return res.status(500).json({ error: 'Erro ao buscar checklist' });
      }
    }

    // POST: Enviar respostas para o checklist
    if (req.method === 'POST') {
      console.log('[API][POST] Iniciando processamento de envio de respostas e arquivos');
      
      // Cria pasta uploads se não existir
      const uploadDir = path.join(process.cwd(), 'uploads');
      try {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
          console.log('[API][POST] Pasta uploads criada:', uploadDir);
        }
      } catch (dirError) {
        console.error('[API][POST] Erro ao criar diretório de uploads:', dirError);
        // Continuar mesmo com erro, usando um diretório temporário como fallback
      }

      // Configuração do formidable com mais opções e melhor tratamento de erros
      let form;
      try {
        form = formidable({
          keepExtensions: true,
          multiples: true,
          uploadDir: uploadDir,
          maxFileSize: 10 * 1024 * 1024, // 10MB max
          allowEmptyFiles: false,
          filter: part => {
            // Permita todos os tipos de arquivo
            return true;
          }
        });
        console.log('[API][POST] formidable configurado');
      } catch (error) {
        console.error('[API][POST] Erro ao configurar formidable:', error);
        return res.status(500).json({ error: 'Erro ao configurar sistema de upload' });
      }

      try {
        // Processamento assíncrono do formdata (usando async/await)
        const [fields, files] = await form.parse(req);
        
        console.log('[API][POST] Upload processado. Fields:', fields);
        console.log('[API][POST] Arquivos recebidos:', files ? Object.keys(files) : 'nenhum');
        
        // Monta objeto de respostas
        const textResponses = JSON.parse(fields.textResponses?.[0] || '{}');
        const filesResponses = {};
        
        // Tratamento de arquivos upload
        if (files && Object.keys(files).length > 0) {
          console.log('[API][POST] Detalhes dos arquivos:', JSON.stringify(files, null, 2));
          
          for (const [fieldName, fileList] of Object.entries(files)) {
            if (fileList && fileList.length > 0) {
              const fileData = fileList[0]; // Pega o primeiro arquivo do campo
              
              filesResponses[fieldName.replace('file_', '')] = {
                filename: fileData.originalFilename || fileData.originalName || 'arquivo.dat',
                path: fileData.filepath || fileData.path || 'simulado-em-memoria',
                mimetype: fileData.mimetype || fileData.type || 'application/octet-stream',
                size: fileData.size || 0,
              };
              
              console.log(`[API][POST] Arquivo processado: ${fieldName} -> ${fileData.originalFilename || fileData.originalName}`);
            }
          }
        }
        
        const responses = {
          textResponses,
          files: filesResponses,
          submittedAt: new Date().toISOString(),
        };
        
        console.log('[API][POST] Salvando respostas no checklist:', responses);
        
        // Busca o checklist antes de atualizar para uso posterior
        const checklistBeforeUpdate = await mockPrisma.checklist.findFirst({
          where: { publicToken: token }
        });
        
        if (!checklistBeforeUpdate) {
          throw new Error('Checklist não encontrado ao tentar salvar resposta');
        }
        
        // Salva as respostas no checklist usando o mockDb
        await mockPrisma.checklist.update({
          where: { publicToken: token },
          data: { responses: JSON.stringify(responses), status: 'Respondido' },
        });
        
        // Registrar evento para análises
        trackResponseCompleted(checklistBeforeUpdate.id, `resp_${Date.now()}`, null);
        
        console.log('[API][POST] Respostas salvas com sucesso!');
        return res.status(200).json({ success: true });
      } catch (error) {
        console.error('[API][POST] Erro ao processar formulário ou salvar respostas:', error);
        return res.status(500).json({ 
          error: 'Erro ao processar envio', 
          message: error.message || 'Erro desconhecido', 
          details: error.toString() 
        });
      }
    }

    // Método não suportado
    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    console.error('[API] Erro não tratado:', error);
    return res.status(500).json({ error: 'Erro interno do servidor', details: error.toString() });
  }
}

