function Error({ statusCode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Erro!</h1>
      <p className="mb-2">{statusCode ? `Código: ${statusCode}` : 'Ocorreu um erro inesperado.'}</p>
      <a href="/" className="text-blue-600 underline">Voltar para o início</a>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
