// Utilitário para gerar templates de email

// Template para novo checklist
export const newChecklistTemplate = (options) => {
  const {
    clientName,
    checklistName,
    companyName = 'CheckClient',
    publicLink,
    expirationDays = 7,
    logo = '/logo.svg',
    primaryColor = '#3b82f6',
    contactEmail = 'suporte@checkclient.com'
  } = options;
  
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expirationDays);
  const formattedDate = expirationDate.toLocaleDateString('pt-BR');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Novo Checklist: ${checklistName}</title>
      <style>
        body { 
          font-family: 'Helvetica', Arial, sans-serif; 
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 20px 0;
        }
        .logo {
          max-width: 150px;
          max-height: 60px;
        }
        .content {
          background-color: #fff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: ${primaryColor};
          color: white;
          text-decoration: none;
          border-radius: 4px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #666;
        }
        .expiration {
          color: #e53e3e;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logo}" alt="${companyName}" class="logo" />
        </div>
        <div class="content">
          <h1>Olá, ${clientName}!</h1>
          <p>A ${companyName} acabou de criar um novo checklist para você:</p>
          <h2>${checklistName}</h2>
          <p>Para preencher seu checklist e enviar as informações necessárias, 
          clique no botão abaixo:</p>
          
          <div style="text-align: center;">
            <a href="${publicLink}" class="button">Acessar Checklist</a>
          </div>
          
          <p class="expiration">Este link expira em: ${formattedDate}</p>
          
          <p>Se tiver qualquer dúvida, entre em contato conosco respondendo a este email
          ou através do endereço: <a href="mailto:${contactEmail}">${contactEmail}</a></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ${companyName}. Todos os direitos reservados.</p>
          <p>Este email foi enviado para você porque foi solicitado o preenchimento de um checklist.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template para lembrete
export const reminderTemplate = (options) => {
  const {
    clientName,
    checklistName,
    companyName = 'CheckClient',
    publicLink,
    expirationDays = 3,
    completionPercentage = 0,
    logo = '/logo.svg',
    primaryColor = '#3b82f6',
    contactEmail = 'suporte@checkclient.com'
  } = options;
  
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + expirationDays);
  const formattedDate = expirationDate.toLocaleDateString('pt-BR');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lembrete: ${checklistName}</title>
      <style>
        body { 
          font-family: 'Helvetica', Arial, sans-serif; 
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 20px 0;
        }
        .logo {
          max-width: 150px;
          max-height: 60px;
        }
        .content {
          background-color: #fff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: ${primaryColor};
          color: white;
          text-decoration: none;
          border-radius: 4px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #666;
        }
        .expiration {
          color: #e53e3e;
          font-weight: bold;
        }
        .progress-container {
          background-color: #e2e8f0;
          border-radius: 10px;
          height: 20px;
          width: 100%;
          margin: 15px 0;
        }
        .progress-bar {
          background-color: ${primaryColor};
          height: 20px;
          border-radius: 10px;
          width: ${completionPercentage}%;
        }
        .progress-text {
          text-align: center;
          font-size: 12px;
          margin-top: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logo}" alt="${companyName}" class="logo" />
        </div>
        <div class="content">
          <h1>Lembrete: Checklist Pendente</h1>
          <p>Olá, ${clientName}!</p>
          <p>Notamos que você ainda não completou o checklist "${checklistName}" enviado pela ${companyName}.</p>
          
          <div class="progress-container">
            <div class="progress-bar"></div>
          </div>
          <div class="progress-text">
            ${completionPercentage}% completo
          </div>
          
          <p>Para continuar seu preenchimento, clique no botão abaixo:</p>
          
          <div style="text-align: center;">
            <a href="${publicLink}" class="button">Continuar Preenchimento</a>
          </div>
          
          <p class="expiration">Este link expira em: ${formattedDate}</p>
          
          <p>Precisando de ajuda? Entre em contato conosco respondendo a este email
          ou através do endereço: <a href="mailto:${contactEmail}">${contactEmail}</a></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ${companyName}. Todos os direitos reservados.</p>
          <p>Este email foi enviado para você porque foi solicitado o preenchimento de um checklist.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template para notificação de resposta completa
export const completedChecklistTemplate = (options) => {
  const {
    adminName,
    clientName,
    checklistName,
    companyName = 'CheckClient',
    adminDashboardLink,
    logo = '/logo.svg',
    primaryColor = '#3b82f6'
  } = options;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Checklist Respondido: ${checklistName}</title>
      <style>
        body { 
          font-family: 'Helvetica', Arial, sans-serif; 
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 20px 0;
        }
        .logo {
          max-width: 150px;
          max-height: 60px;
        }
        .content {
          background-color: #fff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: ${primaryColor};
          color: white;
          text-decoration: none;
          border-radius: 4px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #666;
        }
        .highlight {
          background-color: #d1fae5;
          color: #065f46;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          font-weight: bold;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logo}" alt="${companyName}" class="logo" />
        </div>
        <div class="content">
          <h1>Checklist Respondido!</h1>
          <p>Olá, ${adminName}!</p>
          
          <div class="highlight">
            ${clientName} completou o checklist "${checklistName}"!
          </div>
          
          <p>Você já pode revisar as respostas e documentos enviados pelo cliente acessando o dashboard.</p>
          
          <div style="text-align: center;">
            <a href="${adminDashboardLink}" class="button">Ver Respostas</a>
          </div>
          
          <p>Recomendamos revisar as informações e entrar em contato com o cliente caso seja necessário
          algum ajuste ou informação adicional.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ${companyName}. Todos os direitos reservados.</p>
          <p>Este é um email automático do sistema ${companyName}.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
