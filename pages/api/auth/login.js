// Versão simulada da API de login para teste

// Usuários simulados para teste
const mockUsers = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@example.com',
    password: 'admin123', // Em produção, usar hash
    role: 'admin'
  },
  {
    id: '2',
    name: 'Editor',
    email: 'editor@example.com',
    password: 'editor123',
    role: 'editor'
  },
  {
    id: '3',
    name: 'Usuário Teste',
    email: 'user@example.com',
    password: 'user123',
    role: 'viewer'
  }
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha obrigatórios' });
  }
  
  try {
    // Verificação simulada
    const user = mockUsers.find(user => user.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    
    if (user.password !== password) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }
    
    // Não retornar a senha
    const { password: _, ...safeUser } = user;
    
    return res.status(200).json(safeUser);
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
}
