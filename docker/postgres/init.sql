-- Inicialização do banco de dados PostgreSQL
-- Este arquivo é executado apenas na primeira criação do container

-- Extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Índices para busca full-text em português
CREATE TEXT SEARCH CONFIGURATION pt (COPY = portuguese);

-- Função para auditoria automática
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
