-- Seed simples para teste

-- Inserir condomínio
INSERT INTO "condominiums" (id, name, cnpj, street, number, district, city, state, cep) 
VALUES ('cond1', 'Residencial Horizonte', '12.345.678/0001-90', 'Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01234-567');

-- Inserir usuários (senha hash para 'senha123')
INSERT INTO "users" (id, email, name, phone, "passwordHash") VALUES
('admin1', 'admin@oryumhouse.com', 'Admin Global', '+5511999999999', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqyT/WVKM7pUlJi.1Nqn.ey'),
('sindico1', 'sindico@residencialhorizonte.com', 'Maria Silva', '+5511888888888', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqyT/WVKM7pUlJi.1Nqn.ey'),
('zelador1', 'zelador@residencialhorizonte.com', 'João Santos', '+5511777777777', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqyT/WVKM7pUlJi.1Nqn.ey'),
('morador1', 'morador1@exemplo.com', 'Carlos Oliveira', '+5511666666666', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqyT/WVKM7pUlJi.1Nqn.ey'),
('morador2', 'morador2@exemplo.com', 'Ana Costa', '+5511555555555', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqyT/WVKM7pUlJi.1Nqn.ey');

-- Inserir unidades
INSERT INTO "units" (id, "condominiumId", block, number, "areaM2", "ownerId") VALUES
('unit1', 'cond1', 'Bloco 1', '101', 75.5, 'morador1'),
('unit2', 'cond1', 'Bloco 1', '102', 75.5, 'morador2'),
('unit3', 'cond1', 'Bloco 1', '103', 75.5, NULL),
('unit4', 'cond1', 'Bloco 2', '201', 85.0, NULL),
('unit5', 'cond1', 'Bloco 2', '202', 85.0, NULL);

-- Inserir memberships (papéis)
INSERT INTO "memberships" (id, "userId", "condominiumId", role) VALUES
('memb1', 'admin1', 'cond1', 'ADMIN_GLOBAL'),
('memb2', 'sindico1', 'cond1', 'SINDICO'),
('memb3', 'zelador1', 'cond1', 'ZELADOR'),
('memb4', 'morador1', 'cond1', 'MORADOR'),
('memb5', 'morador2', 'cond1', 'MORADOR');

-- Inserir algumas demandas
INSERT INTO "tickets" (id, "condominiumId", "unitId", "openedById", "assignedToId", category, priority, status, title, description, location, tags, "slaHours") VALUES
('ticket1', 'cond1', 'unit1', 'morador1', 'zelador1', 'HIDRAULICA', 'ALTA', 'EM_ANDAMENTO', 'Vazamento no banheiro', 'Há um vazamento no registro do banheiro causando infiltração', 'Banheiro social', ARRAY['urgente', 'infiltração'], 12),
('ticket2', 'cond1', NULL, 'morador2', NULL, 'ELETRICA', 'MEDIA', 'NOVA', 'Lâmpada queimada no corredor', 'A lâmpada do corredor do 2º andar está queimada há 3 dias', '2º andar - corredor', ARRAY['iluminação'], 24),
('ticket3', 'cond1', NULL, 'sindico1', 'zelador1', 'LIMPEZA', 'MEDIA', 'EM_AVALIACAO', 'Limpeza da piscina', 'A piscina precisa de limpeza e tratamento da água', 'Área de lazer - piscina', ARRAY['piscina', 'manutenção'], 48);

-- Verificar se os dados foram inseridos
SELECT 'Usuários criados:' as info, count(*) as total FROM users;
SELECT 'Condomínios criados:' as info, count(*) as total FROM condominiums;
SELECT 'Unidades criadas:' as info, count(*) as total FROM units;
SELECT 'Demandas criadas:' as info, count(*) as total FROM tickets;
