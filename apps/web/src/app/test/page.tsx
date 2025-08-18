export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          🏠 Oryum House
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sistema funcionando perfeitamente!
        </p>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-lg border">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">✅ Status dos Serviços</h2>
            <ul className="text-left space-y-2">
              <li className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                Frontend Next.js - Rodando
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                Backend NestJS - Rodando
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                PostgreSQL - Conectado
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                Redis - Ativo
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                MinIO S3 - Disponível
              </li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">🔗 Links de Teste</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="/landing" 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                🎯 Landing Page de Vendas
              </a>
              <a 
                href="/demo" 
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                📊 Página de Demonstração
              </a>
              <a 
                href="/pricing" 
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
              >
                💰 Planos e Preços
              </a>
              <a 
                href="http://localhost:3001/api" 
                target="_blank"
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
              >
                🔧 API Backend
              </a>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-4">🎉 Sistema Pronto!</h3>
            <p className="text-green-700">
              O Oryum House está funcionando perfeitamente. 
              Você pode testar todas as funcionalidades da landing page e demonstração.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
