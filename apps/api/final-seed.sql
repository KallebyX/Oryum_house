-- Seed final para Oryum House
-- Baseado na estrutura real das tabelas

-- Limpar dados existentes
DELETE FROM tickets;
DELETE FROM memberships;
DELETE FROM units;
DELETE FROM condominiums;
DELETE FROM users;

-- Inserir usuários de exemplo
INSERT INTO users (id, name, email, phone, "passwordHash", "avatarUrl", "isActive", "lastLoginAt", "createdAt", "updatedAt") VALUES
('admin-001', 'Administrador Global', 'admin@oryumhouse.com', '+55 11 99999-9999', '$2b$10$rQZ8K9vX2mN3pL1qR4sT5u', NULL, true, NULL, NOW(), NOW()),
('sindico-001', 'João Silva', 'sindico@residencial.com', '+55 11 98888-8888', '$2b$10$rQZ8K9vX2mN3pL1qR4sT5u', NULL, true, NULL, NOW(), NOW()),
('zelador-001', 'Pedro Santos', 'zelador@residencial.com', '+55 11 97777-7777', '$2b$10$rQZ8K9vX2mN3pL1qR4sT5u', NULL, true, NULL, NOW(), NOW()),
('portaria-001', 'Maria Costa', 'portaria@residencial.com', '+55 11 96666-6666', '$2b$10$rQZ8K9vX2mN3pL1qR4sT5u', NULL, true, NULL, NOW(), NOW()),
('morador-001', 'Ana Oliveira', 'morador@residencial.com', '+55 11 95555-5555', '$2b$10$rQZ8K9vX2mN3pL1qR4sT5u', NULL, true, NULL, NOW(), NOW()),
('morador-002', 'Carlos Lima', 'carlos@residencial.com', '+55 11 94444-4444', '$2b$10$rQZ8K9vX2mN3pL1qR4sT5u', NULL, true, NULL, NOW(), NOW()),
('morador-003', 'Lucia Ferreira', 'lucia@residencial.com', '+55 11 93333-3333', '$2b$10$rQZ8K9vX2mN3pL1qR4sT5u', NULL, true, NULL, NOW(), NOW());

-- Inserir condomínio
INSERT INTO condominiums (id, name, cnpj, street, number, district, city, state, cep, "logoUrl", settings, "isActive", "createdAt", "updatedAt") VALUES
('cond-001', 'Residencial Horizonte', '12.345.678/0001-90', 'Rua das Flores', '123', 'Centro', 'Caçapava do Sul', 'RS', '96570-000', NULL, '{"theme": "blue", "timezone": "America/Sao_Paulo"}', true, NOW(), NOW());

-- Inserir unidades
INSERT INTO units (id, "condominiumId", block, number, "areaM2", "ownerId", "isActive", "createdAt", "updatedAt") VALUES
('unit-001', 'cond-001', 'A', '101', 85.5, 'morador-001', true, NOW(), NOW()),
('unit-002', 'cond-001', 'A', '102', 85.5, 'morador-002', true, NOW(), NOW()),
('unit-003', 'cond-001', 'A', '103', 85.5, 'morador-003', true, NOW(), NOW()),
('unit-004', 'cond-001', 'B', '201', 95.0, NULL, true, NOW(), NOW()),
('unit-005', 'cond-001', 'B', '202', 95.0, NULL, true, NOW(), NOW());

-- Inserir membros
INSERT INTO memberships (id, "userId", "condominiumId", role, "createdAt", "updatedAt") VALUES
('mem-001', 'sindico-001', 'cond-001', 'SINDICO', NOW(), NOW()),
('mem-002', 'zelador-001', 'cond-001', 'ZELADOR', NOW(), NOW()),
('mem-003', 'portaria-001', 'cond-001', 'PORTARIA', NOW(), NOW()),
('mem-004', 'morador-001', 'cond-001', 'MORADOR', NOW(), NOW()),
('mem-005', 'morador-002', 'cond-001', 'MORADOR', NOW(), NOW()),
('mem-006', 'morador-003', 'cond-001', 'MORADOR', NOW(), NOW());

-- Inserir demandas de exemplo
INSERT INTO tickets (id, "condominiumId", "unitId", "openedById", "assignedToId", category, priority, status, "slaHours", title, description, location, tags, checklist, "satisfactionScore", "closedAt", "createdAt", "updatedAt") VALUES
('ticket-001', 'cond-001', 'unit-001', 'morador-001', 'zelador-001', 'HIDRAULICA', 'ALTA', 'EM_ANDAMENTO', 4, 'Vazamento no banheiro', 'Há um vazamento na torneira do banheiro principal', 'Bloco A, Apto 101', ARRAY['vazamento', 'banheiro'], '[]', NULL, NULL, NOW(), NOW()),
('ticket-002', 'cond-001', 'unit-002', 'morador-002', 'zelador-001', 'ELETRICA', 'MEDIA', 'EM_AVALIACAO', 8, 'Lâmpada queimada', 'A lâmpada da sala está queimada', 'Bloco A, Apto 102', ARRAY['lampada', 'sala'], '[]', NULL, NULL, NOW(), NOW()),
('ticket-003', 'cond-001', NULL, 'sindico-001', 'zelador-001', 'LIMPEZA', 'BAIXA', 'NOVA', 24, 'Limpeza da área comum', 'Limpeza geral da área de lazer', 'Área de lazer', ARRAY['limpeza', 'area_comum'], '[]', NULL, NULL, NOW(), NOW());

-- Verificar dados inseridos
SELECT 'Usuários criados:' as info, count(*) as total FROM users;
SELECT 'Condomínios criados:' as info, count(*) as total FROM condominiums;
SELECT 'Unidades criadas:' as info, count(*) as total FROM units;
SELECT 'Membros criados:' as info, count(*) as total FROM memberships;
SELECT 'Demandas criadas:' as info, count(*) as total FROM tickets;

-- Mostrar usuários criados
SELECT name, email, role FROM users;
