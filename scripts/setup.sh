#!/bin/bash

# Script de configuração inicial do Oryum House
# Execute: chmod +x scripts/setup.sh && ./scripts/setup.sh

set -e

echo "🏠 Oryum House - Setup Inicial"
echo "==============================="

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não encontrado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js 18+ primeiro."
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versão 18+ é necessário. Versão atual: $(node --version)"
    exit 1
fi

echo "✅ Dependências verificadas"

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp env.example .env
    echo "✅ Arquivo .env criado. Configure as variáveis conforme necessário."
else
    echo "✅ Arquivo .env já existe"
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

echo "🐳 Iniciando serviços Docker..."
docker-compose up -d postgres redis minio clamav mailhog prometheus

echo "⏳ Aguardando serviços iniciarem..."
sleep 10

# Verificar se PostgreSQL está rodando
echo "🔍 Verificando PostgreSQL..."
until docker-compose exec postgres pg_isready -U oryumhouse; do
    echo "Aguardando PostgreSQL..."
    sleep 2
done
echo "✅ PostgreSQL está rodando"

# Gerar cliente Prisma
echo "🔧 Gerando cliente Prisma..."
cd apps/api
npm run db:generate

# Executar migrações
echo "📊 Executando migrações do banco..."
npm run db:migrate

# Executar seed
echo "🌱 Populando banco com dados de demonstração..."
npm run seed

cd ../..

echo ""
echo "🎉 Setup concluído com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Execute: npm run dev"
echo "2. Acesse: http://localhost:3000"
echo "3. Use as credenciais de demo do README.md"
echo ""
echo "🔗 URLs importantes:"
echo "• Frontend: http://localhost:3000"
echo "• API: http://localhost:3001"
echo "• Swagger: http://localhost:3001/api/docs"
echo "• pgAdmin: http://localhost:5050"
echo "• MinIO: http://localhost:9001"
echo "• MailHog: http://localhost:8025"
echo ""
echo "📚 Consulte o README.md para mais informações"
