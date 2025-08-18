# 🚀 Guia de Deploy - Oryum House

Este guia detalha como fazer o deploy do sistema Oryum House em diferentes ambientes.

## 📋 Pré-requisitos

### Servidor de Produção
- **Sistema Operacional**: Ubuntu 20.04+ ou CentOS 8+
- **Recursos Mínimos**: 4 vCPUs, 8GB RAM, 100GB SSD
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Nginx**: 1.18+ (se usar proxy reverso externo)

### Domínio e SSL
- Domínio configurado (ex: `oryumhouse.com.br`)
- Certificado SSL (Let's Encrypt recomendado)

## 🛠️ Deploy com Docker Compose

### 1. Preparar o Servidor

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
```

### 2. Clonar e Configurar

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/oryumhouse.git
cd oryumhouse

# Criar arquivo de produção
cp env.example .env.production

# Editar variáveis de produção
nano .env.production
```

### 3. Configurar Variáveis de Ambiente

```bash
# .env.production
NODE_ENV=production

# Database
DATABASE_URL="postgresql://oryumhouse:SENHA_FORTE_AQUI@postgres:5432/oryumhouse"

# JWT
JWT_SECRET="jwt-secret-muito-forte-aqui-256-bits"
JWT_EXPIRES_IN="7d"

# NextAuth
NEXTAUTH_URL="https://seu-dominio.com.br"
NEXTAUTH_SECRET="nextauth-secret-muito-forte-aqui"

# Email (configurar com seu provedor SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seu-email@gmail.com"
SMTP_PASS="sua-senha-de-app"
SMTP_FROM="noreply@seu-dominio.com.br"

# S3/MinIO
S3_ENDPOINT="https://s3.seu-dominio.com.br"
S3_ACCESS_KEY="access-key-forte"
S3_SECRET_KEY="secret-key-muito-forte"
S3_BUCKET="oryumhouse-files"

# Web Push (gerar com web-push generate-vapid-keys)
VAPID_PUBLIC_KEY="sua-vapid-public-key"
VAPID_PRIVATE_KEY="sua-vapid-private-key"
VAPID_SUBJECT="mailto:admin@seu-dominio.com.br"

# Segurança
RATE_LIMIT_TTL="60"
RATE_LIMIT_LIMIT="100"
```

### 4. Deploy

```bash
# Criar rede Docker
docker network create oryumhouse-network

# Build das imagens
docker-compose -f docker-compose.prod.yml build

# Iniciar serviços
docker-compose -f docker-compose.prod.yml up -d

# Verificar status
docker-compose -f docker-compose.prod.yml ps

# Executar migrações
docker-compose -f docker-compose.prod.yml exec api npm run db:migrate

# Executar seed (opcional)
docker-compose -f docker-compose.prod.yml exec api npm run seed
```

## 🔧 Configuração do Nginx (Proxy Reverso)

### 1. Instalar Nginx

```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

### 2. Configurar Virtual Host

```nginx
# /etc/nginx/sites-available/oryumhouse
server {
    listen 80;
    server_name seu-dominio.com.br www.seu-dominio.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com.br www.seu-dominio.com.br;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com.br/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_dhparam /etc/nginx/dhparam.pem;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=web:10m rate=30r/s;

    # API routes
    location /api {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # WebSocket específico
    location /ws {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend
    location / {
        limit_req zone=web burst=50 nodelay;
        
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # MinIO S3 (opcional, se expor publicamente)
    location /files {
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS for file uploads
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization" always;
        
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin * always;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization" always;
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type 'text/plain charset=UTF-8';
            add_header Content-Length 0;
            return 204;
        }
    }

    # Logs
    access_log /var/log/nginx/oryumhouse.access.log;
    error_log /var/log/nginx/oryumhouse.error.log;
}
```

### 3. Ativar Site e SSL

```bash
# Gerar DH params
sudo openssl dhparam -out /etc/nginx/dhparam.pem 2048

# Ativar site
sudo ln -s /etc/nginx/sites-available/oryumhouse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com.br -d www.seu-dominio.com.br

# Configurar renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoramento

### 1. Configurar Prometheus + Grafana

```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - oryumhouse-network

volumes:
  grafana_data:

networks:
  oryumhouse-network:
    external: true
```

### 2. Configurar Logs Centralizados

```bash
# Instalar Loki + Promtail
docker run -d --name=loki -p 3100:3100 grafana/loki:latest
docker run -d --name=promtail -v /var/log:/var/log grafana/promtail:latest
```

## 🔄 CI/CD com GitHub Actions

### 1. Configurar Secrets no GitHub

```
DOCKER_REGISTRY_URL
DOCKER_USERNAME
DOCKER_PASSWORD
DEPLOY_HOST
DEPLOY_USER
DEPLOY_SSH_KEY
```

### 2. Workflow de Deploy

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_SSH_KEY }}
          script: |
            cd /opt/oryumhouse
            git pull origin main
            docker-compose -f docker-compose.prod.yml down
            docker-compose -f docker-compose.prod.yml build
            docker-compose -f docker-compose.prod.yml up -d
            docker-compose -f docker-compose.prod.yml exec -T api npm run db:migrate
```

## 🔒 Segurança em Produção

### 1. Firewall

```bash
# Configurar UFW
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
```

### 2. Backup Automático

```bash
# Script de backup
#!/bin/bash
# /opt/scripts/backup.sh

BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup do banco
docker exec postgres pg_dump -U oryumhouse oryumhouse > $BACKUP_DIR/db_$DATE.sql

# Backup dos arquivos
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /opt/oryumhouse/uploads

# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

# Crontab: 0 2 * * * /opt/scripts/backup.sh
```

### 3. Monitoramento de Segurança

```bash
# Fail2ban para proteção contra brute force
sudo apt install fail2ban -y

# Configurar jail personalizado
sudo tee /etc/fail2ban/jail.local << EOF
[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/oryumhouse.error.log
maxretry = 3
bantime = 3600

[nginx-req-limit]
enabled = true
filter = nginx-req-limit
logpath = /var/log/nginx/oryumhouse.error.log
maxretry = 10
bantime = 600
EOF

sudo systemctl restart fail2ban
```

## 📈 Otimizações de Performance

### 1. Redis para Cache

```yaml
# Adicionar ao docker-compose.prod.yml
redis:
  image: redis:7-alpine
  command: redis-server --appendonly yes
  volumes:
    - redis_data:/data
  networks:
    - oryumhouse-network
```

### 2. CDN para Assets Estáticos

```javascript
// next.config.js
const nextConfig = {
  images: {
    domains: ['cdn.seu-dominio.com.br'],
  },
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.seu-dominio.com.br' 
    : '',
};
```

## 🆘 Troubleshooting

### Logs dos Serviços

```bash
# Ver logs em tempo real
docker-compose -f docker-compose.prod.yml logs -f

# Logs específicos
docker-compose -f docker-compose.prod.yml logs api
docker-compose -f docker-compose.prod.yml logs web
docker-compose -f docker-compose.prod.yml logs postgres
```

### Comandos Úteis

```bash
# Restart de serviços
docker-compose -f docker-compose.prod.yml restart api
docker-compose -f docker-compose.prod.yml restart web

# Verificar saúde
./scripts/check-health.sh

# Backup manual
docker exec postgres pg_dump -U oryumhouse oryumhouse > backup.sql

# Restore
docker exec -i postgres psql -U oryumhouse oryumhouse < backup.sql
```

### Problemas Comuns

1. **Erro de conexão com banco**
   - Verificar se PostgreSQL está rodando
   - Verificar variáveis de ambiente
   - Verificar rede Docker

2. **Upload de arquivos não funciona**
   - Verificar configurações S3/MinIO
   - Verificar permissões de pasta
   - Verificar ClamAV

3. **WebSocket não conecta**
   - Verificar configuração Nginx
   - Verificar CORS
   - Verificar JWT

4. **Emails não são enviados**
   - Verificar configurações SMTP
   - Verificar firewall
   - Verificar logs do MailHog

---

## ✅ Checklist de Deploy

- [ ] Servidor configurado com Docker
- [ ] Domínio apontando para o servidor
- [ ] Certificado SSL configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados migrado
- [ ] Seed executado (opcional)
- [ ] Nginx configurado
- [ ] Firewall configurado
- [ ] Backup configurado
- [ ] Monitoramento ativo
- [ ] CI/CD configurado
- [ ] Testes de carga realizados

**🎉 Parabéns! Seu sistema Oryum House está em produção!**
