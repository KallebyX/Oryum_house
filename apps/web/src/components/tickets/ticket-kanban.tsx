'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Plus, MoreVertical, Clock, User, AlertTriangle, GripVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useTicketKanban, useUpdateTicketStatus } from '@/hooks/use-tickets';
import {
  type Ticket,
  type TicketStatus,
  TICKET_STATUS_LABELS,
  TICKET_PRIORITY_LABELS,
  TICKET_PRIORITY_COLORS,
} from '@/types/ticket';

interface TicketKanbanProps {
  condominiumId: string;
  onTicketClick: (ticket: Ticket) => void;
}

interface KanbanColumn {
  id: TicketStatus;
  title: string;
  color: string;
  bgColor: string;
}

const columns: KanbanColumn[] = [
  { id: 'NOVA', title: 'Nova', color: 'bg-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-950/20' },
  { id: 'EM_AVALIACAO', title: 'Em Avaliação', color: 'bg-yellow-500', bgColor: 'bg-yellow-50 dark:bg-yellow-950/20' },
  { id: 'EM_ANDAMENTO', title: 'Em Andamento', color: 'bg-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-950/20' },
  { id: 'AGUARDANDO_MORADOR', title: 'Aguardando', color: 'bg-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-950/20' },
  { id: 'CONCLUIDA', title: 'Concluída', color: 'bg-green-500', bgColor: 'bg-green-50 dark:bg-green-950/20' },
];

const priorityColorClasses: Record<string, string> = {
  green: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400',
  red: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
};

// Demo data
const demoKanbanData: Record<TicketStatus, Ticket[]> = {
  NOVA: [
    {
      id: '1',
      condominiumId: 'demo-condo-1',
      title: 'Troca de lâmpadas do corredor',
      description: 'Várias lâmpadas queimadas no 2o andar',
      category: 'ELETRICA',
      priority: 'BAIXA',
      status: 'NOVA',
      slaHours: 48,
      tags: ['eletrica'],
      openedById: 'user-1',
      openedBy: { id: 'user-1', name: 'Maria Silva', email: 'maria@email.com' },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      condominiumId: 'demo-condo-1',
      title: 'Limpeza da caixa d\'água',
      description: 'Manutenção semestral programada',
      category: 'LIMPEZA',
      priority: 'MEDIA',
      status: 'NOVA',
      slaHours: 168,
      tags: ['manutencao'],
      openedById: 'user-2',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  EM_AVALIACAO: [
    {
      id: '3',
      condominiumId: 'demo-condo-1',
      title: 'Conserto do elevador',
      description: 'Barulho estranho ao subir',
      category: 'ELEVADOR',
      priority: 'ALTA',
      status: 'EM_AVALIACAO',
      slaHours: 24,
      tags: ['urgente', 'elevador'],
      openedById: 'user-3',
      assignedToId: 'user-4',
      assignedTo: { id: 'user-4', name: 'Pedro Costa', email: 'pedro@email.com' },
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ],
  EM_ANDAMENTO: [
    {
      id: '4',
      condominiumId: 'demo-condo-1',
      title: 'Vazamento no banheiro',
      description: 'Apartamento 302 - torneira',
      category: 'HIDRAULICA',
      priority: 'ALTA',
      status: 'EM_ANDAMENTO',
      slaHours: 24,
      tags: ['hidraulica', 'urgente'],
      location: 'Bloco A - Apto 302',
      openedById: 'user-1',
      assignedToId: 'user-5',
      assignedTo: { id: 'user-5', name: 'Carlos Santos', email: 'carlos@email.com' },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      condominiumId: 'demo-condo-1',
      title: 'Pintura do hall de entrada',
      description: 'Renovação da pintura',
      category: 'ESTRUTURAL',
      priority: 'MEDIA',
      status: 'EM_ANDAMENTO',
      slaHours: 72,
      tags: ['pintura'],
      openedById: 'user-2',
      assignedToId: 'user-6',
      assignedTo: { id: 'user-6', name: 'João Silva', email: 'joao@email.com' },
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  AGUARDANDO_MORADOR: [
    {
      id: '6',
      condominiumId: 'demo-condo-1',
      title: 'Instalação de interfone',
      description: 'Aguardando acesso ao apartamento',
      category: 'ELETRICA',
      priority: 'MEDIA',
      status: 'AGUARDANDO_MORADOR',
      slaHours: 48,
      tags: ['eletrica'],
      location: 'Bloco B - Apto 501',
      openedById: 'user-3',
      assignedToId: 'user-5',
      assignedTo: { id: 'user-5', name: 'Carlos Santos', email: 'carlos@email.com' },
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
  ],
  CONCLUIDA: [
    {
      id: '7',
      condominiumId: 'demo-condo-1',
      title: 'Manutenção da piscina',
      description: 'Limpeza e verificação do pH',
      category: 'PISCINA',
      priority: 'MEDIA',
      status: 'CONCLUIDA',
      slaHours: 24,
      tags: ['manutencao'],
      openedById: 'user-4',
      assignedToId: 'user-6',
      assignedTo: { id: 'user-6', name: 'João Silva', email: 'joao@email.com' },
      satisfactionScore: 5,
      closedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  CANCELADA: [],
};

function KanbanSkeleton() {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div key={column.id} className="flex-shrink-0 w-80">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-6 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="rounded-lg border p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

export function TicketKanban({ condominiumId, onTicketClick }: TicketKanbanProps) {
  const { data: kanbanData, isLoading } = useTicketKanban(condominiumId);
  const updateStatus = useUpdateTicketStatus(condominiumId, '');

  // Use demo data if no API data
  const ticketsByStatus: Record<TicketStatus, Ticket[]> = kanbanData || demoKanbanData;

  if (isLoading) {
    return <KanbanSkeleton />;
  }

  const handleStatusChange = async (ticketId: string, newStatus: TicketStatus) => {
    // In a real implementation, this would call the API
    console.log('Status change:', ticketId, newStatus);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
      {columns.map((column) => {
        const columnTickets = ticketsByStatus[column.id] || [];

        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-80"
          >
            <Card className={cn('h-full min-h-[400px]', column.bgColor)}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn('h-2 w-2 rounded-full', column.color)} />
                    <CardTitle className="text-sm font-semibold">
                      {column.title}
                    </CardTitle>
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                      {columnTickets.length}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {columnTickets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nenhuma demanda
                    </p>
                  </div>
                ) : (
                  columnTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => onTicketClick(ticket)}
                      className={cn(
                        'group rounded-lg border border-gray-200 dark:border-gray-800',
                        'bg-white dark:bg-gray-950 p-4',
                        'hover:shadow-soft hover:border-gray-300 dark:hover:border-gray-700',
                        'transition-all duration-200 cursor-pointer',
                        ticket.priority === 'ALTA' && 'border-l-4 border-l-red-500'
                      )}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {ticket.priority === 'ALTA' && (
                            <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                          )}
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white leading-snug truncate">
                            {ticket.title}
                          </h4>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onTicketClick(ticket);
                            }}>
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {columns.filter(c => c.id !== ticket.status && c.id !== 'CANCELADA').map((col) => (
                              <DropdownMenuItem
                                key={col.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(ticket.id, col.id);
                                }}
                              >
                                Mover para {col.title}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Description */}
                      {ticket.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {ticket.description}
                        </p>
                      )}

                      {/* Tags */}
                      {ticket.tags && ticket.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {ticket.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-900 px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                          {ticket.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{ticket.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {ticket.assignedTo ? (
                            <Avatar
                              size="sm"
                              fallback={ticket.assignedTo.name}
                              className="h-6 w-6"
                            />
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
                              <User className="h-3 w-3 text-gray-400" />
                            </div>
                          )}
                          <Badge
                            variant="secondary"
                            className={cn(
                              'text-xs',
                              priorityColorClasses[TICKET_PRIORITY_COLORS[ticket.priority]]
                            )}
                          >
                            {TICKET_PRIORITY_LABELS[ticket.priority]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>{formatRelativeTime(ticket.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
