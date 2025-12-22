# Prisma Migrations

Este diretorio contem as migrations do banco de dados.

## Gerando Migrations

Para gerar uma nova migration apos modificar o `schema.prisma`:

```bash
cd apps/api
npx prisma migrate dev --name nome_da_migration
```

## Aplicando Migrations em Producao

Para aplicar migrations em producao:

```bash
cd apps/api
npx prisma migrate deploy
```

## Primeira Configuracao

1. Configure a variavel de ambiente `DATABASE_URL` no arquivo `.env`:
   ```
   DATABASE_URL="postgresql://usuario:senha@host:5432/oryumhouse"
   ```

2. Gere a migration inicial:
   ```bash
   npx prisma migrate dev --name init
   ```

3. Popule o banco com dados iniciais:
   ```bash
   npx prisma db seed
   ```

## Comandos Uteis

- `npx prisma generate` - Gera o Prisma Client
- `npx prisma db push` - Sincroniza schema sem gerar migration (dev only)
- `npx prisma studio` - Interface visual para o banco
- `npx prisma format` - Formata o schema.prisma

## CI/CD

Em pipelines de CI/CD, use:
```bash
npx prisma generate
npx prisma migrate deploy
```

O comando `migrate deploy` aplica migrations pendentes de forma segura em producao.
