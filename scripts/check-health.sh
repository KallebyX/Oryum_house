#!/bin/bash

# Script de verificação de saúde dos serviços
# Execute: ./scripts/check-health.sh

echo "🏥 Oryum House - Health Check"
echo "============================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_service() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Verificando $service_name... "
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "$expected_status"; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FALHOU${NC}"
        return 1
    fi
}

check_docker_service() {
    local service_name=$1
    echo -n "Verificando container $service_name... "
    
    if docker-compose ps "$service_name" | grep -q "Up"; then
        echo -e "${GREEN}✅ Rodando${NC}"
        return 0
    else
        echo -e "${RED}❌ Parado${NC}"
        return 1
    fi
}

echo "🐳 Verificando containers Docker:"
check_docker_service "postgres"
check_docker_service "redis"
check_docker_service "minio"
check_docker_service "nginx"

echo ""
echo "🌐 Verificando serviços web:"
check_service "Frontend" "http://localhost:3000"
check_service "API" "http://localhost:3001/api"
check_service "Swagger" "http://localhost:3001/api/docs"
check_service "pgAdmin" "http://localhost:5050"
check_service "MinIO Console" "http://localhost:9001"
check_service "MailHog" "http://localhost:8025"
check_service "Prometheus" "http://localhost:9090"

echo ""
echo "📊 Verificando banco de dados:"
if docker-compose exec -T postgres psql -U oryumhouse -d oryumhouse -c "SELECT COUNT(*) FROM users;" > /dev/null 2>&1; then
    user_count=$(docker-compose exec -T postgres psql -U oryumhouse -d oryumhouse -t -c "SELECT COUNT(*) FROM users;" | xargs)
    echo -e "Usuários no banco: ${GREEN}$user_count${NC}"
    
    ticket_count=$(docker-compose exec -T postgres psql -U oryumhouse -d oryumhouse -t -c "SELECT COUNT(*) FROM tickets;" | xargs)
    echo -e "Demandas no banco: ${GREEN}$ticket_count${NC}"
else
    echo -e "${RED}❌ Erro ao conectar com o banco${NC}"
fi

echo ""
echo "🔗 URLs importantes:"
echo "• Frontend: http://localhost:3000"
echo "• API: http://localhost:3001"
echo "• Swagger: http://localhost:3001/api/docs"
echo "• pgAdmin: http://localhost:5050"
echo "• MinIO: http://localhost:9001"
echo "• MailHog: http://localhost:8025"
echo "• Prometheus: http://localhost:9090"

echo ""
echo -e "${YELLOW}💡 Dica:${NC} Use 'docker-compose logs -f [serviço]' para ver logs detalhados"
