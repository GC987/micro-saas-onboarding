const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Limpar dados existentes
    await prisma.checklist.deleteMany({});
    await prisma.user.deleteMany({});

    // Criar usuários padrão
    const users = [
      {
        name: 'Administrador',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
      },
      {
        name: 'Editor',
        email: 'editor@example.com',
        password: await bcrypt.hash('editor123', 10),
      },
      {
        name: 'Usuário',
        email: 'user@example.com',
        password: await bcrypt.hash('user123', 10),
      }
    ];

    for (const user of users) {
      await prisma.user.create({
        data: user
      });
    }

    console.log('✅ Usuários criados com sucesso!');

    // Criar checklist de exemplo
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });

    if (adminUser) {
      const checklist = await prisma.checklist.create({
        data: {
          userId: adminUser.id,
          clientName: 'Cliente Exemplo',
          clientEmail: 'cliente@exemplo.com',
          serviceType: 'Consultoria',
          fields: JSON.stringify([
            { type: 'text', label: 'Nome completo', required: true },
            { type: 'email', label: 'Email de contato', required: true },
            { type: 'file', label: 'Documento de identidade', required: true },
            { type: 'text', label: 'Observações', required: false }
          ]),
          publicToken: 'demo-checklist-token',
          status: 'Pendente',
        }
      });

      console.log('✅ Checklist de exemplo criado com sucesso!');
    }

    console.log('✅ Seed concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
