# 🏠 Oryum House - TODO List de Correções e Implementações

> **Última atualização:** 2025-11-21
> **Status Geral:** 🔴 Crítico - Múltiplos módulos incompletos

---

## 📊 Resumo Executivo

| Categoria | Total | Completo | Incompleto | % Completo |
|-----------|-------|----------|------------|------------|
| Backend Modules | 17 | 12 | 5 | 70% |
| Frontend Pages | 15 | 5 | 10 | 33% |
| Testes | 0 | 0 | 0 | 0% |
| Documentação | 2 | 1 | 1 | 50% |
| Segurança | 8 | 3 | 5 | 37% |

---

## 🚨 PRIORIDADE CRÍTICA (P0) - BLOQUEADORES

### Backend

#### 1. ⚠️ Implementar Módulo de Condomínios (STUB)
**Arquivos:** `apps/api/src/modules/condominium/`
- [ ] Criar DTOs completos (`dto/condominium.dto.ts`)
  - CreateCondominiumDto
  - UpdateCondominiumDto
  - CondominiumQueryDto
  - CondominiumStatsDto
- [ ] Implementar `condominium.service.ts` completo
  - `create()` - criar condomínio
  - `findAll()` - listar com paginação
  - `findOne()` - buscar por ID
  - `update()` - atualizar dados
  - `remove()` - soft delete
  - `getStats()` - estatísticas do condomínio
  - `uploadLogo()` - upload de logo
- [ ] Implementar `condominium.controller.ts` completo
  - GET `/condominiums` - listar
  - POST `/condominiums` - criar (ADMIN only)
  - GET `/condominiums/:id` - detalhes
  - PATCH `/condominiums/:id` - atualizar
  - DELETE `/condominiums/:id` - remover
  - GET `/condominiums/:id/stats` - estatísticas
  - POST `/condominiums/:id/logo` - upload logo
- [ ] Adicionar validações e guards apropriados

**Impacto:** Sistema multi-tenant não funciona sem isso
**Estimativa:** 8h
**Status:** 🔴 Não iniciado

---

#### 2. ⚠️ Implementar Módulo de Usuários (STUB)
**Arquivos:** `apps/api/src/modules/user/`
- [ ] Criar DTOs completos (`dto/user.dto.ts`)
  - CreateUserDto
  - UpdateUserDto
  - UserQueryDto
  - UserProfileDto
  - ChangePasswordDto
  - UpdateAvatarDto
- [ ] Implementar `user.service.ts` completo
  - `create()` - criar usuário com hash de senha
  - `findAll()` - listar com filtros e paginação
  - `findOne()` - buscar por ID
  - `findByEmail()` - buscar por email
  - `update()` - atualizar perfil
  - `updateAvatar()` - atualizar foto
  - `changePassword()` - trocar senha
  - `remove()` - soft delete
  - `getMemberships()` - buscar memberships do usuário
  - `addToCondominium()` - adicionar usuário a condomínio
  - `removeFromCondominium()` - remover de condomínio
- [ ] Implementar `user.controller.ts` completo
  - GET `/users` - listar (ADMIN only)
  - GET `/users/me` - perfil atual
  - GET `/users/:id` - detalhes usuário
  - PATCH `/users/:id` - atualizar
  - DELETE `/users/:id` - remover
  - POST `/users/:id/avatar` - upload avatar
  - PATCH `/users/:id/password` - trocar senha
  - GET `/users/:id/memberships` - memberships
  - POST `/users/:id/memberships` - adicionar a condomínio
  - DELETE `/users/:id/memberships/:membershipId` - remover
- [ ] Adicionar validações robustas

**Impacto:** Gestão de usuários não funciona
**Estimativa:** 10h
**Status:** 🔴 Não iniciado

---

#### 3. ⚠️ Implementar Módulo de Unidades (STUB)
**Arquivos:** `apps/api/src/modules/unit/`
- [ ] Criar DTOs completos (`dto/unit.dto.ts`)
  - CreateUnitDto
  - UpdateUnitDto
  - UnitQueryDto
  - AssignOwnerDto
  - AddOccupantDto
- [ ] Implementar `unit.service.ts` completo
  - `create()` - criar unidade
  - `findAll()` - listar por condomínio
  - `findOne()` - buscar por ID
  - `update()` - atualizar dados
  - `remove()` - soft delete
  - `assignOwner()` - atribuir proprietário
  - `addOccupant()` - adicionar ocupante
  - `removeOccupant()` - remover ocupante
  - `getOccupants()` - listar ocupantes
- [ ] Implementar `unit.controller.ts` completo
  - GET `/condominiums/:condominiumId/units` - listar
  - POST `/condominiums/:condominiumId/units` - criar
  - GET `/condominiums/:condominiumId/units/:id` - detalhes
  - PATCH `/condominiums/:condominiumId/units/:id` - atualizar
  - DELETE `/condominiums/:condominiumId/units/:id` - remover
  - POST `/units/:id/owner` - atribuir proprietário
  - POST `/units/:id/occupants` - adicionar ocupante
  - DELETE `/units/:id/occupants/:userId` - remover ocupante
- [ ] Validações de propriedade e ocupação

**Impacto:** Gestão de unidades não funciona
**Estimativa:** 8h
**Status:** 🔴 Não iniciado

---

#### 4. ⚠️ Implementar Módulo de Manutenções (VAZIO)
**Arquivos:** `apps/api/src/modules/maintenance/`
- [ ] Criar estrutura completa do módulo
  - `maintenance.controller.ts`
  - `maintenance.service.ts`
  - `dto/maintenance.dto.ts`
- [ ] Criar DTOs
  - CreateMaintenancePlanDto
  - UpdateMaintenancePlanDto
  - MaintenanceExecutionDto
  - MaintenanceQueryDto
- [ ] Implementar serviço de manutenções preventivas
  - Gerenciamento de planos (RRULE para recorrência)
  - Criação automática de execuções
  - Histórico de manutenções
  - Notificações de manutenção agendada
- [ ] Implementar endpoints
  - CRUD de planos de manutenção
  - Execução de manutenções
  - Calendário de manutenções
  - Relatórios de manutenções
- [ ] Integrar com sistema de notificações

**Impacto:** Funcionalidade prometida não existe
**Estimativa:** 12h
**Status:** 🔴 Não iniciado

---

#### 5. ⚠️ Implementar Módulo de Relatórios (VAZIO)
**Arquivos:** `apps/api/src/modules/report/`
- [ ] Criar estrutura completa do módulo
  - `report.controller.ts`
  - `report.service.ts`
  - `dto/report.dto.ts`
- [ ] Criar DTOs
  - GenerateReportDto
  - ReportQueryDto
  - ReportFilterDto
- [ ] Implementar tipos de relatórios
  - Relatório de demandas (tickets)
  - Relatório de satisfação
  - Relatório de reservas
  - Relatório de assembleias
  - Relatório financeiro (resumo)
  - Relatório de ocorrências
- [ ] Implementar endpoints
  - GET `/reports/tickets` - relatório de demandas
  - GET `/reports/satisfaction` - satisfação
  - GET `/reports/bookings` - reservas
  - GET `/reports/assemblies` - assembleias
  - POST `/reports/custom` - relatório customizado
  - GET `/reports/:id/export` - exportar (CSV/PDF)
- [ ] Adicionar exportação em múltiplos formatos

**Impacto:** Analytics e relatórios não funcionam
**Estimativa:** 14h
**Status:** 🔴 Não iniciado

---

#### 6. 🔒 Implementar Condominium Access Guard
**Arquivos:**
- `apps/api/src/common/guards/condominium-access.guard.ts` (criar)
- `apps/api/src/common/decorators/condominium.decorator.ts` (atualizar)

- [ ] Criar `CondominiumAccessGuard`
  - Verificar se usuário tem acesso ao condomínio
  - Validar membership ativo
  - Verificar role dentro do condomínio
- [ ] Atualizar decorator para usar o guard
- [ ] Aplicar guard em todos os endpoints que precisam
  - Tickets, Bookings, Notices, Assemblies, etc.
- [ ] Adicionar testes para o guard

**Impacto:** SEGURANÇA - Usuários podem acessar dados de outros condomínios
**Estimativa:** 4h
**Status:** 🔴 Crítico

---

#### 7. 🔒 Corrigir CORS em Produção
**Arquivos:**
- `apps/api/src/main.ts:69`
- `apps/api/src/core/websocket/websocket.gateway.ts:24`

- [ ] Remover placeholder 'https://your-domain.com'
- [ ] Usar variável de ambiente `CORS_ORIGINS`
- [ ] Documentar no .env.example
- [ ] Validar configuração em ambientes

**Impacto:** Aplicação não funcionará em produção
**Estimativa:** 0.5h
**Status:** 🔴 Bloqueador

---

#### 8. 📝 Criar .env.example (Backend)
**Arquivos:** `apps/api/.env.example` (criar)

- [ ] Criar arquivo com todas variáveis necessárias
  - DATABASE_URL
  - JWT_SECRET / JWT_REFRESH_SECRET
  - REDIS_HOST / REDIS_PORT
  - S3_* (MinIO/AWS)
  - SMTP_* (Email)
  - CORS_ORIGINS
  - API_PORT
  - NODE_ENV
  - NEXTAUTH_URL
  - VAPID_* (Web Push)
  - CLAMAV_HOST / CLAMAV_PORT
  - MAX_FILE_SIZE
  - ALLOWED_FILE_TYPES
- [ ] Adicionar comentários explicativos
- [ ] Criar arquivo .env.development
- [ ] Criar arquivo .env.production.example

**Impacto:** Desenvolvedores não conseguem configurar ambiente
**Estimativa:** 1h
**Status:** 🔴 Bloqueador

---

### Frontend

#### 9. 🔐 Implementar Autenticação NextAuth
**Arquivos:** `apps/web/src/app/api/auth/[...nextauth]/`

- [ ] Criar diretório e arquivo `route.ts`
- [ ] Configurar NextAuth handler
  - Credentials provider
  - Google OAuth (opcional)
  - Session strategy (JWT)
  - Callbacks (jwt, session)
- [ ] Integrar com backend API (`/auth/login`)
- [ ] Configurar refresh token
- [ ] Testar fluxo completo de autenticação

**Impacto:** Autenticação não funciona
**Estimativa:** 4h
**Status:** 🔴 Bloqueador

---

#### 10. 🚪 Criar Páginas de Autenticação
**Arquivos:** `apps/web/src/app/auth/`

- [ ] Criar `/auth/signin/page.tsx`
  - Formulário de login
  - Integração com NextAuth `signIn()`
  - Redirecionamento após login
  - Mensagens de erro
- [ ] Criar `/auth/signup/page.tsx`
  - Formulário de cadastro
  - Validação com Zod
  - Integração com API
  - Confirmação de email (opcional)
- [ ] Criar `/auth/error/page.tsx`
  - Exibir erros de autenticação
  - Tratamento de diferentes tipos de erro
- [ ] Criar `/forgot-password/page.tsx`
  - Formulário de recuperação
  - Envio de email
  - Reset de senha

**Impacto:** Usuários não conseguem entrar no sistema
**Estimativa:** 6h
**Status:** 🔴 Bloqueador

---

#### 11. 🎫 Criar Módulo de Tickets (Dashboard)
**Arquivos:** `apps/web/src/app/dashboard/tickets/`

- [ ] Criar `/dashboard/tickets/page.tsx`
  - Lista de tickets com filtros
  - Busca textual
  - Paginação
  - Ações rápidas
- [ ] Criar `/dashboard/tickets/kanban/page.tsx`
  - Board Kanban com drag & drop
  - Colunas por status
  - Filtros e busca
- [ ] Criar `/dashboard/tickets/[id]/page.tsx`
  - Detalhes do ticket
  - Timeline de mudanças
  - Comentários
  - Upload de anexos
  - Avaliação de satisfação
- [ ] Criar `/dashboard/tickets/new/page.tsx`
  - Formulário de criação
  - Upload de imagens
  - Seleção de categoria e prioridade
- [ ] Criar hooks em `hooks/use-tickets.ts`
  - useTickets (lista)
  - useTicket (detalhes)
  - useCreateTicket
  - useUpdateTicket
  - useTicketComments

**Impacto:** Funcionalidade principal não existe
**Estimativa:** 16h
**Status:** 🔴 Bloqueador

---

#### 12. 📅 Criar Módulo de Reservas (Dashboard)
**Arquivos:** `apps/web/src/app/dashboard/bookings/`

- [ ] Criar `/dashboard/bookings/page.tsx`
  - Lista de reservas
  - Filtros (status, área, data)
  - Ações (cancelar, aprovar)
- [ ] Criar `/dashboard/bookings/new/page.tsx`
  - Calendário de disponibilidade
  - Seleção de área comum
  - Formulário de reserva
  - Regras de uso
- [ ] Criar `/dashboard/bookings/[id]/page.tsx`
  - Detalhes da reserva
  - Informações da área
  - Ações (aprovar/rejeitar para síndico)
- [ ] Criar hooks em `hooks/use-bookings.ts`
  - useBookings (lista)
  - useBooking (detalhes)
  - useCreateBooking
  - useCancelBooking
  - useAreas (áreas comuns)

**Impacto:** Reservas não funcionam
**Estimativa:** 12h
**Status:** 🔴 Bloqueador

---

#### 13. 📢 Criar Módulo de Comunicados (Dashboard)
**Arquivos:** `apps/web/src/app/dashboard/notices/`

- [ ] Criar `/dashboard/notices/page.tsx`
  - Feed de comunicados
  - Comunicados fixados no topo
  - Filtros (categoria, data)
  - Confirmação de leitura
- [ ] Criar `/dashboard/notices/new/page.tsx` (SINDICO only)
  - Formulário de criação
  - Editor rich text
  - Segmentação (bloco/unidade)
  - Upload de imagens
  - Fixar comunicado
- [ ] Criar `/dashboard/notices/[id]/page.tsx`
  - Visualização completa
  - Marcar como lido
  - Contador de leituras (para síndico)
- [ ] Criar hooks em `hooks/use-notices.ts`

**Impacto:** Comunicação com moradores não funciona
**Estimativa:** 10h
**Status:** 🔴 Bloqueador

---

#### 14. 📝 Criar .env.example (Frontend)
**Arquivos:** `apps/web/.env.example` (criar)

- [ ] Criar arquivo com variáveis necessárias
  - NEXT_PUBLIC_API_URL
  - NEXTAUTH_URL
  - NEXTAUTH_SECRET
  - GOOGLE_CLIENT_ID (opcional)
  - GOOGLE_CLIENT_SECRET (opcional)
- [ ] Adicionar comentários explicativos
- [ ] Criar .env.local.example

**Impacto:** Desenvolvedores não conseguem configurar
**Estimativa:** 0.5h
**Status:** 🔴 Bloqueador

---

#### 15. 🎨 Gerar Assets PWA
**Arquivos:** `apps/web/public/`

- [ ] Criar/gerar ícones PWA
  - favicon.ico (16x16, 32x32)
  - apple-touch-icon.png (180x180)
  - icon-72x72.png até icon-512x512.png
- [ ] Criar screenshots
  - screenshot-wide.png (1280x720)
  - screenshot-narrow.png (640x1136)
- [ ] Criar og-image.png (Open Graph)
- [ ] Configurar next-pwa em `next.config.js`
- [ ] Testar instalação PWA

**Impacto:** PWA não pode ser instalado
**Estimativa:** 2h
**Status:** 🔴 Bloqueador

---

## 🔶 PRIORIDADE ALTA (P1) - IMPORTANTES

### Backend

#### 16. ✅ Habilitar ThrottlerGuard Globalmente
**Arquivos:** `apps/api/src/app.module.ts`
- [ ] Adicionar `APP_GUARD` provider no AppModule
- [ ] Configurar exceções se necessário
- [ ] Testar rate limiting

**Estimativa:** 0.5h
**Status:** 🟡 Pendente

---

#### 17. 🗄️ Adicionar Índices no Prisma Schema
**Arquivos:** `apps/api/prisma/schema.prisma`
- [ ] User.email (já unique, mas adicionar index)
- [ ] User.lastLoginAt
- [ ] Membership.userId
- [ ] Booking.startAt + endAt (composite)
- [ ] Assembly.startAt
- [ ] Delivery.receivedAt
- [ ] Ticket.status + priority (composite)
- [ ] Executar nova migration

**Estimativa:** 1h
**Status:** 🟡 Pendente

---

#### 18. 🎯 Implementar Audit Logging Service
**Arquivos:** `apps/api/src/core/audit/` (criar)
- [ ] Criar módulo de auditoria
- [ ] Service para registrar ações
- [ ] Decorator `@AuditLog()` para controllers
- [ ] Integrar em operações sensíveis
- [ ] Endpoints para consulta de logs

**Estimativa:** 6h
**Status:** 🟡 Pendente

---

#### 19. 🏥 Criar Health Check Endpoints
**Arquivos:** `apps/api/src/core/health/` (criar)
- [ ] Endpoint `/health` (liveness)
- [ ] Endpoint `/health/ready` (readiness)
- [ ] Verificação de conexão com DB
- [ ] Verificação de conexão com Redis
- [ ] Verificação de serviços externos

**Estimativa:** 3h
**Status:** 🟡 Pendente

---

#### 20. 🎮 Criar Seeder de Achievements
**Arquivos:** `apps/api/prisma/seed-achievements.ts`
- [ ] Criar arquivo de seed separado
- [ ] Popular achievements padrão
  - FIRST_TICKET
  - READER_10
  - VOTER_5
  - GOOD_NEIGHBOR
  - etc.
- [ ] Integrar no seed principal
- [ ] Documentar achievements disponíveis

**Estimativa:** 2h
**Status:** 🟡 Pendente

---

#### 21. 📝 Completar File Upload Service
**Arquivos:** `apps/api/src/core/file-upload/file-upload.service.ts`
- [ ] Implementar `listFiles()` real
- [ ] Adicionar garbage collection
- [ ] Limpeza de arquivos órfãos
- [ ] Relatório de uso de storage

**Estimativa:** 4h
**Status:** 🟡 Pendente

---

#### 22. 🔔 Implementar Web Push Notifications
**Arquivos:** `apps/api/src/core/notification/`
- [ ] Implementar envio real de web push
- [ ] Criar tabela de subscriptions no Prisma
- [ ] Endpoints para gerenciar subscriptions
- [ ] Integrar com service worker no frontend

**Estimativa:** 8h
**Status:** 🟡 Pendente

---

### Frontend

#### 23. 🗳️ Criar Módulo de Assembleias
**Arquivos:** `apps/web/src/app/dashboard/assemblies/`
- [ ] Página de lista de assembleias
- [ ] Página de detalhes e votação
- [ ] Formulário de criação (SINDICO)
- [ ] Sistema de votação em tempo real
- [ ] Visualização de resultados
- [ ] Hooks necessários

**Estimativa:** 14h
**Status:** 🟡 Pendente

---

#### 24. 🚪 Criar Módulo de Portaria
**Arquivos:** `apps/web/src/app/dashboard/portaria/`
- [ ] Página de entregas
- [ ] Página de visitantes
- [ ] Registro de ocorrências
- [ ] Geração de QR codes
- [ ] Hooks necessários

**Estimativa:** 12h
**Status:** 🟡 Pendente

---

#### 25. 📊 Criar Módulo de Relatórios
**Arquivos:** `apps/web/src/app/dashboard/reports/`
- [ ] Dashboard de relatórios
- [ ] Seleção de tipo de relatório
- [ ] Filtros de período
- [ ] Visualização de gráficos
- [ ] Exportação (CSV/PDF)
- [ ] Hooks necessários

**Estimativa:** 10h
**Status:** 🟡 Pendente

---

#### 26. 📦 Criar Diretório de Types
**Arquivos:** `apps/web/src/types/`
- [ ] Criar estrutura de diretórios
- [ ] `api.types.ts` - tipos de resposta da API
- [ ] `entities.types.ts` - entidades do sistema
- [ ] `forms.types.ts` - tipos de formulários
- [ ] Exportar todos em `index.ts`

**Estimativa:** 2h
**Status:** 🟡 Pendente

---

#### 27. 🧩 Adicionar Componentes UI Faltantes
**Arquivos:** `apps/web/src/components/ui/`
- [ ] `select.tsx` (Radix UI)
- [ ] `popover.tsx` (Radix UI)
- [ ] `table.tsx` (para listas)
- [ ] `pagination.tsx`
- [ ] `tabs.tsx`
- [ ] Instalar dependências faltantes

**Estimativa:** 4h
**Status:** 🟡 Pendente

---

## 🔵 PRIORIDADE MÉDIA (P2) - MELHORIAS

### Backend

#### 28. 🧪 Criar Testes Unitários
**Arquivos:** `apps/api/src/**/*.spec.ts`
- [ ] Testes para serviços core
- [ ] Testes para controllers principais
- [ ] Testes para guards e interceptors
- [ ] Configurar coverage mínimo (80%)

**Estimativa:** 40h
**Status:** 🔵 Futuro

---

#### 29. 🧪 Criar Testes E2E
**Arquivos:** `apps/api/test/`
- [ ] Setup de testes E2E
- [ ] Testes de autenticação
- [ ] Testes de fluxos principais
- [ ] Configurar CI/CD

**Estimativa:** 30h
**Status:** 🔵 Futuro

---

#### 30. 📚 Criar Documentação da API
**Arquivos:** `apps/api/README.md`, `apps/api/docs/`
- [ ] README completo
- [ ] Guia de arquitetura
- [ ] Guia de deployment
- [ ] Documentação de endpoints (além do Swagger)

**Estimativa:** 8h
**Status:** 🔵 Futuro

---

#### 31. 🔍 Habilitar Logs Estruturados do Prisma
**Arquivos:** `apps/api/src/core/prisma/prisma.service.ts`
- [ ] Descomentar event logging
- [ ] Configurar níveis de log
- [ ] Adicionar correlation IDs

**Estimativa:** 2h
**Status:** 🔵 Futuro

---

#### 32. 🔐 Fortalecer TypeScript Config
**Arquivos:** `apps/api/tsconfig.json`
- [ ] Habilitar `strictNullChecks`
- [ ] Habilitar `noImplicitAny`
- [ ] Habilitar `strictBindCallApply`
- [ ] Corrigir erros que surgirem

**Estimativa:** 6h
**Status:** 🔵 Futuro

---

#### 33. 📊 Adicionar Request ID Tracking
**Arquivos:** `apps/api/src/common/middleware/` (criar)
- [ ] Criar middleware de request ID
- [ ] Adicionar aos headers de resposta
- [ ] Integrar com logs
- [ ] Distributed tracing

**Estimativa:** 3h
**Status:** 🔵 Futuro

---

### Frontend

#### 34. 🧪 Criar Testes Frontend
**Arquivos:** `apps/web/src/**/*.test.tsx`
- [ ] Testes unitários de componentes
- [ ] Testes de hooks
- [ ] Testes E2E com Playwright
- [ ] Configurar coverage

**Estimativa:** 30h
**Status:** 🔵 Futuro

---

#### 35. 🧹 Remover Arquivos Duplicados/Não Usados
**Arquivos:**
- [ ] Remover `dashboard/new-page.tsx`
- [ ] Remover `dashboard/gamification/improved-page.tsx`
- [ ] Remover `components/pages/landing.tsx` (duplicado)
- [ ] Auditar outros arquivos não referenciados

**Estimativa:** 1h
**Status:** 🔵 Futuro

---

#### 36. 🎨 Criar Componentes de Formulário Reutilizáveis
**Arquivos:** `apps/web/src/components/forms/`
- [ ] FormWrapper component
- [ ] FormField component
- [ ] FileUpload component
- [ ] DateTimePicker component
- [ ] RichTextEditor component

**Estimativa:** 8h
**Status:** 🔵 Futuro

---

#### 37. 📱 Testar e Otimizar PWA
**Arquivos:** `apps/web/`
- [ ] Testar instalação em dispositivos
- [ ] Otimizar service worker
- [ ] Testar modo offline
- [ ] Lighthouse audit (score 90+)

**Estimativa:** 6h
**Status:** 🔵 Futuro

---

#### 38. 🎨 Implementar Dashboard Layout Unificado
**Arquivos:** `apps/web/src/app/dashboard/layout.tsx`
- [ ] Usar DashboardLayout em todas páginas
- [ ] Navegação consistente
- [ ] Breadcrumbs
- [ ] User menu

**Estimativa:** 4h
**Status:** 🔵 Futuro

---

## 🏗️ INFRAESTRUTURA E DevOps

#### 39. 🐳 Otimizar Docker Compose
**Arquivos:** `docker-compose.yml`
- [ ] Adicionar health checks
- [ ] Otimizar volumes
- [ ] Configurar restart policies
- [ ] Adicionar traefik/nginx reverse proxy

**Estimativa:** 4h
**Status:** 🔵 Futuro

---

#### 40. 📊 Configurar Monitoring
- [ ] Configurar Prometheus completo
- [ ] Adicionar Grafana dashboards
- [ ] Configurar alertas
- [ ] Integrar com Sentry

**Estimativa:** 8h
**Status:** 🔵 Futuro

---

#### 41. 🔄 CI/CD Pipeline
- [ ] GitHub Actions para testes
- [ ] Build automático de imagens
- [ ] Deploy automático (staging)
- [ ] Release automático (produção)

**Estimativa:** 12h
**Status:** 🔵 Futuro

---

## 📈 RESUMO DE ESTIMATIVAS

| Prioridade | Tarefas | Horas Totais | Dias (8h/dia) |
|------------|---------|--------------|---------------|
| P0 - Crítico | 15 | ~109h | ~14 dias |
| P1 - Alta | 12 | ~60h | ~8 dias |
| P2 - Média | 11 | ~108h | ~14 dias |
| **TOTAL** | **38** | **~277h** | **~35 dias** |

---

## 🎯 ROADMAP SUGERIDO

### Sprint 1 (2 semanas) - MVP Funcional
- Itens P0: 1-8, 9-10 (Backend core + Auth frontend)

### Sprint 2 (2 semanas) - Features Principais
- Itens P0: 11-15 (Módulos principais do dashboard)

### Sprint 3 (1 semana) - Segurança e Estabilidade
- Itens P1: 16-22 (Melhorias de backend)

### Sprint 4 (1 semana) - Features Secundárias
- Itens P1: 23-27 (Módulos secundários do frontend)

### Sprint 5+ (Contínuo) - Qualidade e Manutenção
- Itens P2: Testes, documentação, otimizações

---

## 📝 NOTAS IMPORTANTES

1. **Segurança Crítica:** Item #6 (Condominium Access Guard) deve ser prioridade máxima
2. **Bloqueadores de Deploy:** Itens #7, #8, #14 impedem deploy em produção
3. **Funcionalidade Core:** Itens #1-5, #11-13 são essenciais para o sistema funcionar
4. **Qualidade de Código:** Testes (#28, #29, #34) são importantes mas podem ser graduais
5. **Documentação:** README e guias (#30) devem ser criados durante o desenvolvimento

---

**Gerado automaticamente em:** 2025-11-21
**Última atualização manual:** N/A
**Próxima revisão:** Após completar Sprint 1
