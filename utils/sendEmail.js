const nodemailer = require('nodemailer');

// Cria o transporter usando variáveis de ambiente
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para 465, false para outros
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envia um e-mail para o destinatário informado
 * @param {string} to - E-mail de destino
 * @param {string} subject - Assunto do e-mail
 * @param {string} html - Corpo do e-mail em HTML
 */
async function sendEmail({ to, subject, html }) {
  const info = await transporter.sendMail({
    from: `CheckClient <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
  return info;
}

module.exports = sendEmail;
