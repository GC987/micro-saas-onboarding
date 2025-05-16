import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verificar se o usuário está logado via localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      // Se estiver logado, redirecionar para o dashboard
      router.push('/dashboard');
    }
  }, []);

  return (
    <>
      <Head>
        <title>CheckClient - Gerenciamento de Checklists</title>
        <meta name="description" content="Sistema de checklists personalizados para agilizar seus processos" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <img src="/logo.svg" alt="CheckClient Logo" className="w-24 h-24 mb-6" />
        <h1 className="text-4xl font-bold mb-4 text-gray-800">CheckClient</h1>
        <p className="text-lg mb-8 text-gray-600 max-w-md text-center">Simplifique seu processo de onboarding com checklists personalizados e profissionais.</p>
        <div className="space-x-4">
          <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Entrar</a>
          <a href="/register" className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors">Criar conta</a>
        </div>
        <p className="mt-8 text-sm text-gray-500"> 2025 CheckClient - Todos os direitos reservados</p>
      </div>
    </>
  );
}
