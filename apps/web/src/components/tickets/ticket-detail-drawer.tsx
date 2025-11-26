'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { cn, formatDateTime, formatRelativeTime } from '@/lib/utils';
import {
  X,
  Clock,
  User,
  MapPin,
  Calendar,
  Tag,
  MessageSquare,
  Paperclip,
  Edit,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  History,
  Star,
  Send,
} from 'lucide-react';
import {
  type Ticket,
  type TicketStatus,
  TICKET_STATUS_LABELS,
  TICKET_STATUS_COLORS,
  TICKET_PRIORITY_LABELS,
  TICKET_PRIORITY_COLORS,
  TICKET_CATEGORY_LABELS,
} from '@/types/ticket';
import { TicketComments } from './ticket-comments';
import { TicketStatusSelect } from './ticket-status-select';

interface TicketDetailDrawerProps {
  ticket: Ticket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  condominiumId: string;
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

type TabType = 'details' | 'comments' | 'history';

export function TicketDetailDrawer({
  ticket,
  open,
  onOpenChange,
  condominiumId,
}: TicketDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('details');

  if (!open || !ticket) return null;

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'details', label: 'Detalhes', icon: Tag },
    { id: 'comments', label: 'Comentários', icon: MessageSquare },
    { id: 'history', label: 'Histórico', icon: History },
  ];

  // Demo status history
  const statusHistory = ticket.statusHistory || [
    {
      id: '1',
      ticketId: ticket.id,
      fromStatus: 'NOVA' as TicketStatus,
      toStatus: 'EM_AVALIACAO' as TicketStatus,
      changedById: 'user-1',
      changedBy: { id: 'user-1', name: 'Carlos Santos', email: 'carlos@email.com' },
      note: 'Ticket recebido para avaliação',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      ticketId: ticket.id,
      fromStatus: 'EM_AVALIACAO' as TicketStatus,
      toStatus: 'EM_ANDAMENTO' as TicketStatus,
      changedById: 'user-1',
      changedBy: { id: 'user-1', name: 'Carlos Santos', email: 'carlos@email.com' },
      note: 'Iniciando trabalho',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 transition-opacity',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => onOpenChange(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 h-full w-full max-w-xl bg-white dark:bg-gray-950',
          'border-l border-gray-200 dark:border-gray-800 shadow-xl',
          'transform transition-transform duration-300 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-200 dark:border-gray-800 p-6">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="secondary"
                  className={cn(
                    'text-xs',
                    statusColorClasses[TICKET_STATUS_COLORS[ticket.status]]
                  )}
                >
                  {TICKET_STATUS_LABELS[ticket.status]}
                </Badge>
                <Badge
                  variant="secondary"
                  className={cn(
                    'text-xs',
                    priorityColorClasses[TICKET_PRIORITY_COLORS[ticket.priority]]
                  )}
                >
                  {TICKET_PRIORITY_LABELS[ticket.priority]}
                </Badge>
                {ticket.priority === 'ALTA' && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {ticket.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                #{ticket.id.slice(0, 8)} • {TICKET_CATEGORY_LABELS[ticket.category]}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Status Change */}
          <div className="border-b border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900">
            <TicketStatusSelect
              ticketId={ticket.id}
              currentStatus={ticket.status}
              condominiumId={condominiumId}
            />
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex px-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Descrição
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {ticket.description}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Location */}
                  {ticket.location && (
                    <div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <MapPin className="h-3 w-3" />
                        Localização
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {ticket.location}
                      </p>
                    </div>
                  )}

                  {/* Unit */}
                  {ticket.unit && (
                    <div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <User className="h-3 w-3" />
                        Unidade
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {ticket.unit.block} - {ticket.unit.number}
                      </p>
                    </div>
                  )}

                  {/* Created */}
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <Calendar className="h-3 w-3" />
                      Criado em
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {formatDateTime(ticket.createdAt)}
                    </p>
                  </div>

                  {/* SLA */}
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <Clock className="h-3 w-3" />
                      SLA
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {ticket.slaHours} horas
                    </p>
                  </div>
                </div>

                {/* People */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Pessoas
                  </h3>

                  {/* Opened By */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <Avatar
                      fallback={ticket.openedBy?.name || 'U'}
                      className="h-10 w-10"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {ticket.openedBy?.name || 'Usuário'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Solicitante
                      </p>
                    </div>
                  </div>

                  {/* Assigned To */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                    {ticket.assignedTo ? (
                      <>
                        <Avatar
                          fallback={ticket.assignedTo.name}
                          className="h-10 w-10"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {ticket.assignedTo.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Responsável
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Não atribuído
                          </p>
                          <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                            Atribuir responsável
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {ticket.tags && ticket.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {ticket.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Satisfaction */}
                {ticket.satisfactionScore && (
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">
                        Avaliação do morador
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            'h-5 w-5',
                            star <= ticket.satisfactionScore!
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300 dark:text-gray-600'
                          )}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {ticket.satisfactionScore}/5
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'comments' && (
              <TicketComments
                ticketId={ticket.id}
                condominiumId={condominiumId}
                comments={ticket.comments}
              />
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                {statusHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nenhum histórico de alterações
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />
                    {statusHistory.map((history, index) => (
                      <div key={history.id} className="relative flex gap-4 pb-6">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800 z-10">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-sm text-gray-900 dark:text-white">
                            <span className="font-medium">
                              {history.changedBy?.name || 'Sistema'}
                            </span>{' '}
                            alterou o status
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <Badge variant="outline" className="text-xs mr-1">
                              {TICKET_STATUS_LABELS[history.fromStatus]}
                            </Badge>
                            <ChevronRight className="inline h-3 w-3 mx-1" />
                            <Badge
                              variant="secondary"
                              className={cn(
                                'text-xs',
                                statusColorClasses[TICKET_STATUS_COLORS[history.toStatus]]
                              )}
                            >
                              {TICKET_STATUS_LABELS[history.toStatus]}
                            </Badge>
                          </p>
                          {history.note && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                              "{history.note}"
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {formatRelativeTime(history.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {ticket.status !== 'CONCLUIDA' && ticket.status !== 'CANCELADA' && (
            <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900">
              <div className="flex gap-2">
                <Button className="flex-1 gap-2" variant="default">
                  <CheckCircle className="h-4 w-4" />
                  Marcar como Concluída
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
