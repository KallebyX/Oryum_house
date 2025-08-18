-- Criação manual das tabelas principais para teste

-- Enums como tipos
CREATE TYPE "UserRole" AS ENUM ('ADMIN_GLOBAL', 'SINDICO', 'ZELADOR', 'PORTARIA', 'MORADOR');
CREATE TYPE "TicketStatus" AS ENUM ('NOVA', 'EM_AVALIACAO', 'EM_ANDAMENTO', 'AGUARDANDO_MORADOR', 'CONCLUIDA', 'CANCELADA');
CREATE TYPE "TicketPriority" AS ENUM ('BAIXA', 'MEDIA', 'ALTA');
CREATE TYPE "TicketCategory" AS ENUM ('ELETRICA', 'HIDRAULICA', 'LIMPEZA', 'SEGURANCA', 'OUTROS');
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELED');
CREATE TYPE "AssemblyStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED');
CREATE TYPE "IncidentType" AS ENUM ('SEGURANCA', 'BARULHO', 'VAZAMENTO', 'MANUTENCAO', 'OUTROS');
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
CREATE TYPE "NotificationType" AS ENUM ('TICKET_UPDATE', 'NEW_NOTICE', 'ASSEMBLY_REMINDER', 'BOOKING_APPROVED', 'DELIVERY_RECEIVED', 'VISITOR_ARRIVED', 'MAINTENANCE_SCHEDULED', 'INCIDENT_REPORTED');

-- Tabela Users
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Tabela Condominiums
CREATE TABLE "condominiums" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "logoUrl" TEXT,
    "settings" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "condominiums_pkey" PRIMARY KEY ("id")
);

-- Tabela Units
CREATE TABLE "units" (
    "id" TEXT NOT NULL,
    "condominiumId" TEXT NOT NULL,
    "block" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "areaM2" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- Tabela Memberships
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "condominiumId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- Tabela Tickets
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "condominiumId" TEXT NOT NULL,
    "unitId" TEXT,
    "openedById" TEXT NOT NULL,
    "assignedToId" TEXT,
    "category" "TicketCategory" NOT NULL,
    "priority" "TicketPriority" NOT NULL DEFAULT 'MEDIA',
    "status" "TicketStatus" NOT NULL DEFAULT 'NOVA',
    "slaHours" INTEGER NOT NULL DEFAULT 24,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "tags" TEXT[],
    "checklist" JSONB,
    "satisfactionScore" INTEGER,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- Índices únicos
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "units_condominiumId_block_number_key" ON "units"("condominiumId", "block", "number");
CREATE UNIQUE INDEX "memberships_userId_condominiumId_key" ON "memberships"("userId", "condominiumId");

-- Índices de performance
CREATE INDEX "tickets_condominiumId_status_idx" ON "tickets"("condominiumId", "status");
CREATE INDEX "tickets_condominiumId_priority_idx" ON "tickets"("condominiumId", "priority");
CREATE INDEX "tickets_condominiumId_category_idx" ON "tickets"("condominiumId", "category");
CREATE INDEX "tickets_condominiumId_assignedToId_idx" ON "tickets"("condominiumId", "assignedToId");

-- Foreign keys
ALTER TABLE "units" ADD CONSTRAINT "units_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "units" ADD CONSTRAINT "units_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_openedById_fkey" FOREIGN KEY ("openedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
