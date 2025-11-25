'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { cn, formatRelativeTime, formatDate } from '@/lib/utils';
import {
  Ticket as TicketIcon,
  Clock,
  User,
  MapPin,
  MessageSquare,
  Paperclip,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import {
  type Ticket,
  TICKET_STATUS_LABELS,
  TICKET_STATUS_COLORS,
  TICKET_PRIORITY_LABELS,
  TICKET_PRIORITY_COLORS,
  TICKET_CATEGORY_LABELS,
} from '@/types/ticket';

interface TicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
  onTicketClick: (ticket: Ticket) => void;
}

const statusColorClasses: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400',
  green: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  red: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
};

const priorityColorClasses: Record<string, string> = {
  green: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400',
  red: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
};

// Demo data for when no tickets are provided
const demoTickets: Ticket[] = [
  {
    id: '1',
    condominiumId: 'demo-condo-1',
    title: 'Vazamento no banheiro do 3o andar',
    description: 'Vazamento constante na torneira do banheiro social. Necessita reparo urgente.',
    category: 'HIDRAULICA',
    priority: 'ALTA',
    status: 'EM_ANDAMENTO',
    slaHours: 24,
    tags: ['urgente', 'hidraulica'],
    location: 'Bloco A - Apto 302',
    openedById: 'user-1',
    openedBy: { id: 'user-1', name: 'Maria Silva', email: 'maria@email.com' },
    assignedToId: 'user-2',
    assignedTo: { id: 'user-2', name: 'Carlos Santos', email: 'carlos@email.com' },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    comments: [{ id: '1', ticketId: '1', userId: 'user-2', message: 'Orçamento solicitado', createdAt: '', updatedAt: '' }],
  },
  {
    id: '2',
    condominiumId: 'demo-condo-1',
    title: 'Troca de lâmpadas do corredor',
    description: 'Várias lâmpadas do corredor do 2o andar estão queimadas.',
    category: 'ELETRICA',
    priority: 'MEDIA',
    status: 'NOVA',
    slaHours: 48,
    tags: ['eletrica'],
    location: 'Bloco B - Corredor 2o andar',
    openedById: 'user-3',
    openedBy: { id: 'user-3', name: 'João Oliveira', email: 'joao@email.com' },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    condominiumId: 'demo-condo-1',
    title: 'Manutenção preventiva do elevador',
    description: 'Manutenção mensal programada do elevador social.',
    category: 'ELEVADOR',
    priority: 'MEDIA',
    status: 'EM_AVALIACAO',
    slaHours: 72,
    tags: ['manutencao', 'elevador'],
    location: 'Elevador Social',
    openedById: 'user-4',
    openedBy: { id: 'user-4', name: 'Pedro Costa', email: 'pedro@email.com' },
    assignedToId: 'user-5',
    assignedTo: { id: 'user-5', name: 'Técnico ABC', email: 'tecnico@email.com' },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    condominiumId: 'demo-condo-1',
    title: 'Limpeza da piscina',
    description: 'Limpeza semanal da piscina e verificação do pH.',
    category: 'PISCINA',
    priority: 'BAIXA',
    status: 'CONCLUIDA',
    slaHours: 24,
    tags: ['limpeza', 'piscina'],
    location: 'Área de Lazer',
    openedById: 'user-4',
    openedBy: { id: 'user-4', name: 'Pedro Costa', email: 'pedro@email.com' },
    satisfactionScore: 5,
    closedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    condominiumId: 'demo-condo-1',
    title: 'Portão da garagem com defeito',
    description: 'O portão da garagem está fazendo barulho estranho ao abrir.',
    category: 'SEGURANCA',
    priority: 'ALTA',
    status: 'AGUARDANDO_MORADOR',
    slaHours: 12,
    tags: ['urgente', 'seguranca'],
    location: 'Garagem',
    openedById: 'user-1',
    openedBy: { id: 'user-1', name: 'Maria Silva', email: 'maria@email.com' },
    assignedToId: 'user-2',
    assignedTo: { id: 'user-2', name: 'Carlos Santos', email: 'carlos@email.com' },
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

function TicketListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-start gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
            <Skeleton className="h-8 w-8" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function TicketList({ tickets, isLoading, onTicketClick }: TicketListProps) {
  if (isLoading) {
    return <TicketListSkeleton />;
  }

  const displayTickets = tickets.length > 0 ? tickets : demoTickets;

  if (displayTickets.length === 0) {
    return (
      <Card className="p-8">
        <EmptyState
          icon={TicketIcon}
          title="Nenhuma demanda encontrada"
          description="Não há demandas que correspondam aos filtros selecionados."
          action={{
            label: 'Criar nova demanda',
            onClick: () => {},
          }}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {displayTickets.map((ticket) => (
        <Card
          key={ticket.id}
          className={cn(
            'group cursor-pointer p-4 transition-all duration-200',
            'hover:shadow-soft hover:border-gray-300 dark:hover:border-gray-700',
            ticket.priority === 'ALTA' && 'border-l-4 border-l-red-500'
          )}
          onClick={() => onTicketClick(ticket)}
        >
          <div className="flex items-start gap-4">
            {/* Avatar / Icon */}
            <div className="flex-shrink-0">
              {ticket.assignedTo ? (
                <Avatar
                  fallback={ticket.assignedTo.name}
                  className="h-10 w-10"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {ticket.title}
                    </h3>
                    {ticket.priority === 'ALTA' && (
                      <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                    {ticket.description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 flex-shrink-0 transition-colors" />
              </div>

              {/* Meta info */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {/* Status Badge */}
                <Badge
                  variant="secondary"
                  className={cn(
                    'text-xs',
                    statusColorClasses[TICKET_STATUS_COLORS[ticket.status]]
                  )}
                >
                  {TICKET_STATUS_LABELS[ticket.status]}
                </Badge>

                {/* Priority Badge */}
                <Badge
                  variant="secondary"
                  className={cn(
                    'text-xs',
                    priorityColorClasses[TICKET_PRIORITY_COLORS[ticket.priority]]
                  )}
                >
                  {TICKET_PRIORITY_LABELS[ticket.priority]}
                </Badge>

                {/* Category */}
                <Badge variant="outline" className="text-xs">
                  {TICKET_CATEGORY_LABELS[ticket.category]}
                </Badge>

                {/* Location */}
                {ticket.location && (
                  <span className="hidden sm:flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <MapPin className="h-3 w-3" />
                    {ticket.location}
                  </span>
                )}

                {/* Comments count */}
                {ticket.comments && ticket.comments.length > 0 && (
                  <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <MessageSquare className="h-3 w-3" />
                    {ticket.comments.length}
                  </span>
                )}

                {/* Attachments count */}
                {ticket.attachments && ticket.attachments.length > 0 && (
                  <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Paperclip className="h-3 w-3" />
                    {ticket.attachments.length}
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <span>
                    Aberto por {ticket.openedBy?.name || 'Usuário'}
                  </span>
                  {ticket.assignedTo && (
                    <span className="hidden sm:inline">
                      Responsável: {ticket.assignedTo.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatRelativeTime(ticket.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
