// Script para execução de migrações do Prisma
const { execSync } = require('child_process');

console.log('🔄 Executando migrações do Prisma...');

try {
  // Limpar cache do Prisma
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Criar migrações
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  
  console.log('✅ Migrações aplicadas com sucesso!');
} catch (error) {
  console.error('❌ Erro ao executar migrações:', error);
  process.exit(1);
}
