/**
 * Ticket Types and Interfaces
 */

export type TicketStatus =
  | 'NOVA'
  | 'EM_AVALIACAO'
  | 'EM_ANDAMENTO'
  | 'AGUARDANDO_MORADOR'
  | 'CONCLUIDA'
  | 'CANCELADA';

export type TicketPriority = 'BAIXA' | 'MEDIA' | 'ALTA';

export type TicketCategory =
  | 'ELETRICA'
  | 'HIDRAULICA'
  | 'LIMPEZA'
  | 'SEGURANCA'
  | 'ESTRUTURAL'
  | 'JARDIM'
  | 'PISCINA'
  | 'ELEVADOR'
  | 'OUTROS';

export interface TicketUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface TicketUnit {
  id: string;
  block: string;
  number: string;
}

export interface TicketAttachment {
  id: string;
  ticketId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedById: string;
  uploadedBy?: TicketUser;
  createdAt: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  userId: string;
  user?: TicketUser;
  message: string;
  mentions?: string[];
  attachments?: TicketAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketStatusHistory {
  id: string;
  ticketId: string;
  fromStatus: TicketStatus;
  toStatus: TicketStatus;
  changedById: string;
  changedBy?: TicketUser;
  note?: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  condominiumId: string;
  unitId?: string;
  unit?: TicketUnit;
  openedById: string;
  openedBy?: TicketUser;
  assignedToId?: string;
  assignedTo?: TicketUser;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  slaHours: number;
  slaDueDate?: string;
  title: string;
  description: string;
  location?: string;
  tags: string[];
  checklist?: TicketChecklistItem[];
  satisfactionScore?: number;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory?: TicketStatusHistory[];
  comments?: TicketComment[];
  attachments?: TicketAttachment[];
}

export interface TicketChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TicketStats {
  total: number;
  nova: number;
  emAvaliacao: number;
  emAndamento: number;
  aguardandoMorador: number;
  concluida: number;
  cancelada: number;
  byCategory: Record<TicketCategory, number>;
  byPriority: Record<TicketPriority, number>;
  avgResolutionTime: number;
  slaCompliance: number;
  satisfactionAvg: number;
}

export interface TicketKanbanColumn {
  id: TicketStatus;
  title: string;
  color: string;
  tickets: Ticket[];
}

export interface TicketFilters {
  status?: TicketStatus | TicketStatus[];
  priority?: TicketPriority | TicketPriority[];
  category?: TicketCategory | TicketCategory[];
  assignedToId?: string;
  openedById?: string;
  unitId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTicketData {
  title: string;
  description: string;
  category: TicketCategory;
  priority?: TicketPriority;
  unitId?: string;
  location?: string;
  tags?: string[];
  attachments?: File[];
}

export interface UpdateTicketData {
  title?: string;
  description?: string;
  category?: TicketCategory;
  priority?: TicketPriority;
  assignedToId?: string;
  location?: string;
  tags?: string[];
  checklist?: TicketChecklistItem[];
  slaHours?: number;
}

export interface UpdateTicketStatusData {
  status: TicketStatus;
  note?: string;
}

export interface AddTicketCommentData {
  message: string;
  mentions?: string[];
  attachments?: string[];
}

// UI Helper types
export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  NOVA: 'Nova',
  EM_AVALIACAO: 'Em Avaliação',
  EM_ANDAMENTO: 'Em Andamento',
  AGUARDANDO_MORADOR: 'Aguardando Morador',
  CONCLUIDA: 'Concluída',
  CANCELADA: 'Cancelada',
};

export const TICKET_STATUS_COLORS: Record<TicketStatus, string> = {
  NOVA: 'blue',
  EM_AVALIACAO: 'yellow',
  EM_ANDAMENTO: 'orange',
  AGUARDANDO_MORADOR: 'purple',
  CONCLUIDA: 'green',
  CANCELADA: 'red',
};

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
};

export const TICKET_PRIORITY_COLORS: Record<TicketPriority, string> = {
  BAIXA: 'green',
  MEDIA: 'yellow',
  ALTA: 'red',
};

export const TICKET_CATEGORY_LABELS: Record<TicketCategory, string> = {
  ELETRICA: 'Elétrica',
  HIDRAULICA: 'Hidráulica',
  LIMPEZA: 'Limpeza',
  SEGURANCA: 'Segurança',
  ESTRUTURAL: 'Estrutural',
  JARDIM: 'Jardim',
  PISCINA: 'Piscina',
  ELEVADOR: 'Elevador',
  OUTROS: 'Outros',
};

export const TICKET_CATEGORY_ICONS: Record<TicketCategory, string> = {
  ELETRICA: 'Zap',
  HIDRAULICA: 'Droplets',
  LIMPEZA: 'Sparkles',
  SEGURANCA: 'Shield',
  ESTRUTURAL: 'Building',
  JARDIM: 'Leaf',
  PISCINA: 'Waves',
  ELEVADOR: 'ArrowUpDown',
  OUTROS: 'MoreHorizontal',
};
