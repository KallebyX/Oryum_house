import { IsString, IsOptional, IsEnum, IsArray, IsInt, Min, Max, IsUUID, IsJSON } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketStatus, TicketPriority, TicketCategory } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class CreateTicketDto {
  @ApiProperty({
    description: 'Título da demanda',
    example: 'Vazamento no banheiro do apartamento',
  })
  @IsString({ message: 'Título deve ser uma string' })
  title: string;

  @ApiProperty({
    description: 'Descrição detalhada da demanda',
    example: 'Há um vazamento no registro do banheiro que está causando infiltração na parede.',
  })
  @IsString({ message: 'Descrição deve ser uma string' })
  description: string;

  @ApiProperty({
    description: 'Categoria da demanda',
    enum: TicketCategory,
    example: TicketCategory.HIDRAULICA,
  })
  @IsEnum(TicketCategory, { message: 'Categoria deve ser um dos valores válidos' })
  category: TicketCategory;

  @ApiPropertyOptional({
    description: 'Prioridade da demanda',
    enum: TicketPriority,
    example: TicketPriority.MEDIA,
    default: TicketPriority.MEDIA,
  })
  @IsOptional()
  @IsEnum(TicketPriority, { message: 'Prioridade deve ser um dos valores válidos' })
  priority?: TicketPriority = TicketPriority.MEDIA;

  @ApiPropertyOptional({
    description: 'ID da unidade relacionada à demanda',
    example: 'cuid-da-unidade',
  })
  @IsOptional()
  @IsUUID(4, { message: 'ID da unidade deve ser um UUID válido' })
  unitId?: string;

  @ApiPropertyOptional({
    description: 'Localização específica da demanda',
    example: 'Banheiro social, próximo ao registro',
  })
  @IsOptional()
  @IsString({ message: 'Localização deve ser uma string' })
  location?: string;

  @ApiPropertyOptional({
    description: 'Tags para categorização adicional',
    example: ['urgente', 'infiltração'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Tags devem ser um array' })
  @IsString({ each: true, message: 'Cada tag deve ser uma string' })
  tags?: string[] = [];

  @ApiPropertyOptional({
    description: 'SLA em horas para resolução',
    example: 24,
    minimum: 1,
    maximum: 720,
    default: 24,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'SLA deve ser um número inteiro' })
  @Min(1, { message: 'SLA deve ser no mínimo 1 hora' })
  @Max(720, { message: 'SLA não pode ser maior que 720 horas (30 dias)' })
  slaHours?: number = 24;

  @ApiPropertyOptional({
    description: 'Checklist em formato JSON',
    example: { items: ['Verificar registro', 'Testar pressão', 'Aplicar vedante'] },
  })
  @IsOptional()
  checklist?: any;
}

export class UpdateTicketDto {
  @ApiPropertyOptional({
    description: 'Título da demanda',
    example: 'Vazamento no banheiro do apartamento - RESOLVIDO',
  })
  @IsOptional()
  @IsString({ message: 'Título deve ser uma string' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da demanda',
    example: 'Vazamento foi reparado e teste de pressão realizado com sucesso.',
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Categoria da demanda',
    enum: TicketCategory,
    example: TicketCategory.HIDRAULICA,
  })
  @IsOptional()
  @IsEnum(TicketCategory, { message: 'Categoria deve ser um dos valores válidos' })
  category?: TicketCategory;

  @ApiPropertyOptional({
    description: 'Prioridade da demanda',
    enum: TicketPriority,
    example: TicketPriority.ALTA,
  })
  @IsOptional()
  @IsEnum(TicketPriority, { message: 'Prioridade deve ser um dos valores válidos' })
  priority?: TicketPriority;

  @ApiPropertyOptional({
    description: 'Localização específica da demanda',
    example: 'Banheiro social, registro substituído',
  })
  @IsOptional()
  @IsString({ message: 'Localização deve ser uma string' })
  location?: string;

  @ApiPropertyOptional({
    description: 'Tags para categorização adicional',
    example: ['resolvido', 'hidráulica'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Tags devem ser um array' })
  @IsString({ each: true, message: 'Cada tag deve ser uma string' })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Checklist em formato JSON',
    example: { items: [{ task: 'Verificar registro', completed: true }] },
  })
  @IsOptional()
  checklist?: any;
}

export class AssignTicketDto {
  @ApiProperty({
    description: 'ID do usuário responsável pela demanda',
    example: 'cuid-do-usuario',
  })
  @IsUUID(4, { message: 'ID do usuário deve ser um UUID válido' })
  assignedToId: string;
}

export class UpdateTicketStatusDto {
  @ApiProperty({
    description: 'Novo status da demanda',
    enum: TicketStatus,
    example: TicketStatus.EM_ANDAMENTO,
  })
  @IsEnum(TicketStatus, { message: 'Status deve ser um dos valores válidos' })
  status: TicketStatus;

  @ApiPropertyOptional({
    description: 'Nota sobre a mudança de status',
    example: 'Técnico foi acionado e está a caminho',
  })
  @IsOptional()
  @IsString({ message: 'Nota deve ser uma string' })
  note?: string;
}

export class CloseTicketDto {
  @ApiPropertyOptional({
    description: 'Nota de fechamento da demanda',
    example: 'Problema resolvido com sucesso. Registro substituído e testado.',
  })
  @IsOptional()
  @IsString({ message: 'Nota deve ser uma string' })
  note?: string;
}

export class TicketSatisfactionDto {
  @ApiProperty({
    description: 'Nota de satisfação de 1 a 5',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @Type(() => Number)
  @IsInt({ message: 'Satisfação deve ser um número inteiro' })
  @Min(1, { message: 'Satisfação deve ser no mínimo 1' })
  @Max(5, { message: 'Satisfação deve ser no máximo 5' })
  satisfactionScore: number;

  @ApiPropertyOptional({
    description: 'Comentário sobre o atendimento',
    example: 'Atendimento rápido e eficiente. Técnico muito educado.',
  })
  @IsOptional()
  @IsString({ message: 'Comentário deve ser uma string' })
  comment?: string;
}

export class AddTicketCommentDto {
  @ApiProperty({
    description: 'Mensagem do comentário',
    example: 'Técnico chegou no local e está avaliando o problema.',
  })
  @IsString({ message: 'Mensagem deve ser uma string' })
  message: string;

  @ApiPropertyOptional({
    description: 'Lista de usuários mencionados (@usuario)',
    example: ['user-id-1', 'user-id-2'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Menções devem ser um array' })
  @IsString({ each: true, message: 'Cada menção deve ser uma string' })
  mentions?: string[] = [];

  @ApiPropertyOptional({
    description: 'URLs de anexos',
    example: ['https://s3.amazonaws.com/bucket/foto1.jpg'],
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Anexos devem ser um array' })
  @IsString({ each: true, message: 'Cada anexo deve ser uma string' })
  attachments?: string[] = [];
}

export class TicketFiltersDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrar por status',
    enum: TicketStatus,
    example: TicketStatus.NOVA,
  })
  @IsOptional()
  @IsEnum(TicketStatus, { message: 'Status deve ser um dos valores válidos' })
  status?: TicketStatus;

  @ApiPropertyOptional({
    description: 'Filtrar por prioridade',
    enum: TicketPriority,
    example: TicketPriority.ALTA,
  })
  @IsOptional()
  @IsEnum(TicketPriority, { message: 'Prioridade deve ser um dos valores válidos' })
  priority?: TicketPriority;

  @ApiPropertyOptional({
    description: 'Filtrar por categoria',
    enum: TicketCategory,
    example: TicketCategory.HIDRAULICA,
  })
  @IsOptional()
  @IsEnum(TicketCategory, { message: 'Categoria deve ser um dos valores válidos' })
  category?: TicketCategory;

  @ApiPropertyOptional({
    description: 'Filtrar por usuário responsável',
    example: 'cuid-do-usuario',
  })
  @IsOptional()
  @IsUUID(4, { message: 'ID do usuário deve ser um UUID válido' })
  assignedToId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por usuário que abriu',
    example: 'cuid-do-usuario',
  })
  @IsOptional()
  @IsUUID(4, { message: 'ID do usuário deve ser um UUID válido' })
  openedById?: string;

  @ApiPropertyOptional({
    description: 'Busca textual no título e descrição',
    example: 'vazamento banheiro',
  })
  @IsOptional()
  @IsString({ message: 'Busca deve ser uma string' })
  q?: string;

  @ApiPropertyOptional({
    description: 'Data de início do período (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsString({ message: 'Data inicial deve ser uma string' })
  from?: string;

  @ApiPropertyOptional({
    description: 'Data de fim do período (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsString({ message: 'Data final deve ser uma string' })
  to?: string;

  @ApiPropertyOptional({
    description: 'Ordenar por campo',
    example: 'createdAt',
    enum: ['createdAt', 'updatedAt', 'priority', 'status', 'slaHours'],
  })
  @IsOptional()
  @IsString({ message: 'Campo de ordenação deve ser uma string' })
  sortBy?: 'createdAt' | 'updatedAt' | 'priority' | 'status' | 'slaHours' = 'createdAt';

  @ApiPropertyOptional({
    description: 'Direção da ordenação',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString({ message: 'Direção deve ser uma string' })
  sortOrder?: 'asc' | 'desc' = 'desc';
}
