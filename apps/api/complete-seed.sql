-- Seed completo para Oryum House
-- Executar após criar as tabelas

-- Inserir usuários de exemplo
INSERT INTO users (id, name, email, phone, role, avatar_url, is_active, password_hash, last_login_at, created_at, updated_at) VALUES
('admin-001', 'Administrador Global', 'admin@oryumhouse.com', '+55 11 99999-9999', 'ADMIN_GLOBAL', NULL, true, '$2b$10$rQZ8K9vX2mN3pL1qR4sT5u', NULL, NOW(), NOW()),
('sindico-001', 'João Silva', 'sindico@residencial.com', '+55 11 98888-8888', 'SINDICO', NULL, true, '$2b$10$rQZ8K9vX2mN3pL1qR4sT5u', NULL, NOW(), NOW()),
('zelador-001', 'Pedro Santos', 'zelador@residencial.com', '+55 11 97777-7777', 'ZELADOR', NULL, true, '$2b$10$rQZ8K9vX2mN3pL1qR4sT5u', NULL, NOW(), NOW()),
('portaria-001', 'Maria Costa', 'portaria@residencial.com', '+55 11 96666-6666', 'PORTARIA', NULL, true, '$2b$10$rQZ8K9vX2mN3pL1qR4sT5u', NULL, NOW(), NOW()),
('morador-001', 'Ana Oliveira', 'morador@residencial.com', '+55 11 95555-5555', 'MORADOR', NULL, true, '$2b$10$rQZ8K9vX2mN3pL1qR4sT5u', NULL, NOW(), NOW()),
('morador-002', 'Carlos Lima', 'carlos@residencial.com', '+55 11 94444-4444', 'MORADOR', NULL, true, '$2b$10$rQZ8K9vX2mN3pL1qR4sT5u', NULL, NOW(), NOW()),
('morador-003', 'Lucia Ferreira', 'lucia@residencial.com', '+55 11 93333-3333', 'MORADOR', NULL, true, '$2b$10$rQZ8K9vX2mN3pL1qR4sT5u', NULL, NOW(), NOW());

-- Inserir condomínio
INSERT INTO condominiums (id, name, cnpj, address_street, address_number, address_district, address_city, address_state, address_cep, settings, logo_url, created_at, updated_at) VALUES
('cond-001', 'Residencial Horizonte', '12.345.678/0001-90', 'Rua das Flores', '123', 'Centro', 'Caçapava do Sul', 'RS', '96570-000', '{"theme": "blue", "timezone": "America/Sao_Paulo"}', NULL, NOW(), NOW());

-- Inserir unidades
INSERT INTO units (id, condominium_id, block, number, area_m2, owner_id, is_active, created_at, updated_at) VALUES
('unit-001', 'cond-001', 'A', '101', 85.5, 'morador-001', true, NOW(), NOW()),
('unit-002', 'cond-001', 'A', '102', 85.5, 'morador-002', true, NOW(), NOW()),
('unit-003', 'cond-001', 'A', '103', 85.5, 'morador-003', true, NOW(), NOW()),
('unit-004', 'cond-001', 'B', '201', 95.0, NULL, true, NOW(), NOW()),
('unit-005', 'cond-001', 'B', '202', 95.0, NULL, true, NOW(), NOW());

-- Inserir membros
INSERT INTO memberships (id, user_id, condominium_id, role, created_at, updated_at) VALUES
('mem-001', 'sindico-001', 'cond-001', 'SINDICO', NOW(), NOW()),
('mem-002', 'zelador-001', 'cond-001', 'ZELADOR', NOW(), NOW()),
('mem-003', 'portaria-001', 'cond-001', 'PORTARIA', NOW(), NOW()),
('mem-004', 'morador-001', 'cond-001', 'MORADOR', NOW(), NOW()),
('mem-005', 'morador-002', 'cond-001', 'MORADOR', NOW(), NOW()),
('mem-006', 'morador-003', 'cond-001', 'MORADOR', NOW(), NOW());

-- Inserir demandas de exemplo
INSERT INTO tickets (id, condominium_id, unit_id, opened_by_id, assigned_to_id, category, priority, status, sla_hours, title, description, location, tags, checklist, satisfaction_score, closed_at, created_at, updated_at) VALUES
('ticket-001', 'cond-001', 'unit-001', 'morador-001', 'zelador-001', 'HIDRAULICA', 'ALTA', 'EM_ANDAMENTO', 4, 'Vazamento no banheiro', 'Há um vazamento na torneira do banheiro principal', 'Bloco A, Apto 101', ARRAY['vazamento', 'banheiro'], '[]', NULL, NULL, NOW(), NOW()),
('ticket-002', 'cond-001', 'unit-002', 'morador-002', 'zelador-001', 'ELETRICA', 'MEDIA', 'EM_AVALIACAO', 8, 'Lâmpada queimada', 'A lâmpada da sala está queimada', 'Bloco A, Apto 102', ARRAY['lampada', 'sala'], '[]', NULL, NULL, NOW(), NOW()),
('ticket-003', 'cond-001', NULL, 'sindico-001', 'zelador-001', 'LIMPEZA', 'BAIXA', 'NOVA', 24, 'Limpeza da área comum', 'Limpeza geral da área de lazer', 'Área de lazer', ARRAY['limpeza', 'area_comum'], '[]', NULL, NULL, NOW(), NOW());

-- Inserir comentários nas demandas
INSERT INTO ticket_comments (id, ticket_id, author_id, message, mentions, attachments, created_at, updated_at) VALUES
('comment-001', 'ticket-001', 'morador-001', 'Vazamento começou ontem à noite', '[]', '[]', NOW(), NOW()),
('comment-002', 'ticket-001', 'zelador-001', 'Vou verificar hoje mesmo', '[]', '[]', NOW(), NOW()),
('comment-003', 'ticket-002', 'morador-002', 'Preciso urgente, trabalho de casa', '[]', '[]', NOW(), NOW());

-- Inserir histórico de status
INSERT INTO ticket_status_history (id, ticket_id, from_status, to_status, at, by_user_id, note, created_at) VALUES
('hist-001', 'ticket-001', 'NOVA', 'EM_AVALIACAO', NOW(), 'zelador-001', 'Iniciando avaliação', NOW()),
('hist-002', 'ticket-001', 'EM_AVALIACAO', 'EM_ANDAMENTO', NOW(), 'zelador-001', 'Iniciando reparo', NOW()),
('hist-003', 'ticket-002', 'NOVA', 'EM_AVALIACAO', NOW(), 'zelador-001', 'Avaliando urgência', NOW());

-- Inserir áreas comuns
INSERT INTO areas (id, condominium_id, name, description, rules, capacity, requires_approval, fee_placeholder, created_at, updated_at) VALUES
('area-001', 'cond-001', 'Salão de Festas', 'Salão para eventos e comemorações', 'Respeitar horário de silêncio após 22h', 50, true, 50.00, NOW(), NOW()),
('area-002', 'cond-001', 'Piscina', 'Piscina com deck e churrasqueira', 'Trazer toalha, respeitar horários', 30, false, 0.00, NOW(), NOW()),
('area-003', 'cond-001', 'Academia', 'Academia com equipamentos básicos', 'Trazer toalha, limpar equipamentos', 15, false, 0.00, NOW(), NOW());

-- Inserir reservas
INSERT INTO bookings (id, condominium_id, area_id, unit_id, requested_by_id, start_at, end_at, status, notes, created_at, updated_at) VALUES
('booking-001', 'cond-001', 'area-001', 'unit-001', 'morador-001', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '4 hours', 'APPROVED', 'Aniversário da minha filha', NOW(), NOW()),
('booking-002', 'cond-001', 'area-002', 'unit-002', 'morador-002', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '2 hours', 'PENDING', 'Churrasco com amigos', NOW(), NOW());

-- Inserir comunicados
INSERT INTO notices (id, condominium_id, title, content, audience, pinned, created_by_id, created_at, updated_at) VALUES
('notice-001', 'cond-001', 'Manutenção do Elevador', 'O elevador do Bloco A estará em manutenção amanhã das 8h às 12h. Pedimos desculpas pelo transtorno.', 'ALL', false, 'sindico-001', NOW(), NOW()),
('notice-002', 'cond-001', 'Assembleia Geral', 'Assembleia Geral Extraordinária será realizada no próximo sábado às 14h no salão de festas.', 'ALL', true, 'sindico-001', NOW(), NOW()),
('notice-003', 'cond-001', 'Limpeza das Áreas Comuns', 'A limpeza das áreas comuns será realizada na próxima segunda-feira.', 'ALL', false, 'zelador-001', NOW(), NOW());

-- Inserir assembleias
INSERT INTO assemblies (id, condominium_id, title, agenda, start_at, end_at, quorum_target, status, created_at, updated_at) VALUES
('assembly-001', 'cond-001', 'Assembleia Geral Extraordinária', '[{"item": "Aprovação de reforma", "description": "Reforma da fachada do prédio"}, {"item": "Aumento da taxa", "description": "Reajuste da taxa condominial"}]', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '2 hours', 25, 'ACTIVE', NOW(), NOW());

-- Inserir votações
INSERT INTO votes (id, assembly_id, user_id, option_id, at, created_at) VALUES
('vote-001', 'assembly-001', 'morador-001', 'option-001', NOW(), NOW()),
('vote-002', 'assembly-001', 'morador-002', 'option-001', NOW(), NOW()),
('vote-003', 'assembly-001', 'morador-003', 'option-002', NOW(), NOW());

-- Inserir entregas
INSERT INTO deliveries (id, condominium_id, unit_id, code, carrier, received_at, picked_up_at, picked_by, notes, created_at, updated_at) VALUES
('delivery-001', 'cond-001', 'unit-001', 'ABC123', 'Correios', NOW() - INTERVAL '2 hours', NULL, NULL, 'Pacote pequeno', NOW(), NOW()),
('delivery-002', 'cond-001', 'unit-002', 'DEF456', 'Mercado Livre', NOW() - INTERVAL '1 hour', NULL, NULL, 'Eletrodoméstico', NOW(), NOW());

-- Inserir visitantes
INSERT INTO visitor_passes (id, condominium_id, unit_id, visitor_name, document, qr_token, valid_from, valid_to, used_at, created_at, updated_at) VALUES
('visitor-001', 'cond-001', 'unit-001', 'Roberto Silva', '123.456.789-00', 'qr123456', NOW(), NOW() + INTERVAL '1 day', NULL, NOW(), NOW()),
('visitor-002', 'cond-001', 'unit-002', 'Fernanda Lima', '987.654.321-00', 'qr654321', NOW(), NOW() + INTERVAL '1 day', NULL, NOW(), NOW());

-- Inserir documentos
INSERT INTO documents (id, condominium_id, title, version, file_url, visibility, created_by_id, created_at, updated_at) VALUES
('doc-001', 'cond-001', 'Regulamento Interno', '1.0', '/documents/regulamento.pdf', 'ALL', 'sindico-001', NOW(), NOW()),
('doc-002', 'cond-001', 'Ata da Última Assembleia', '1.0', '/documents/ata.pdf', 'ALL', 'sindico-001', NOW(), NOW()),
('doc-003', 'cond-001', 'Contrato de Limpeza', '1.0', '/documents/contrato.pdf', 'ROLE', 'sindico-001', NOW(), NOW());

-- Inserir manutenções
INSERT INTO maintenance_plans (id, condominium_id, title, schedule, tasks, responsible_id, next_run_at, created_at, updated_at) VALUES
('maintenance-001', 'cond-001', 'Manutenção Preventiva Elevador', 'FREQ=WEEKLY;BYDAY=MO', '[{"task": "Verificar cabos", "duration": 30}, {"task": "Lubrificar", "duration": 45}]', 'zelador-001', NOW() + INTERVAL '1 week', NOW(), NOW()),
('maintenance-002', 'cond-001', 'Limpeza Caixa d''Água', 'FREQ=MONTHLY', '[{"task": "Limpeza geral", "duration": 120}, {"task": "Cloração", "duration": 30}]', 'zelador-001', NOW() + INTERVAL '1 month', NOW(), NOW());

-- Inserir ocorrências
INSERT INTO incidents (id, condominium_id, type, description, reported_by_id, status, attachments, created_at, updated_at) VALUES
('incident-001', 'cond-001', 'SEGURANCA', 'Pessoa estranha tentou entrar no prédio', 'portaria-001', 'RESOLVED', '[]', NOW() - INTERVAL '1 day', NOW()),
('incident-002', 'cond-001', 'BARULHO', 'Barulho excessivo na unidade 103', 'morador-002', 'INVESTIGATING', '[]', NOW() - INTERVAL '2 hours', NOW());

-- Verificar dados inseridos
SELECT 'Usuários criados:' as info, count(*) as total FROM users;
SELECT 'Condomínios criados:' as info, count(*) as total FROM condominiums;
SELECT 'Unidades criadas:' as info, count(*) as total FROM units;
SELECT 'Membros criados:' as info, count(*) as total FROM memberships;
SELECT 'Demandas criadas:' as info, count(*) as total FROM tickets;
SELECT 'Áreas criadas:' as info, count(*) as total FROM areas;
SELECT 'Reservas criadas:' as info, count(*) as total FROM bookings;
SELECT 'Comunicados criados:' as info, count(*) as total FROM notices;
SELECT 'Assembleias criadas:' as info, count(*) as total FROM assemblies;
SELECT 'Entregas criadas:' as info, count(*) as total FROM deliveries;
SELECT 'Visitantes criados:' as info, count(*) as total FROM visitor_passes;
SELECT 'Documentos criados:' as info, count(*) as total FROM documents;
SELECT 'Manutenções criadas:' as info, count(*) as total FROM maintenance_plans;
SELECT 'Ocorrências criadas:' as info, count(*) as total FROM incidents;
