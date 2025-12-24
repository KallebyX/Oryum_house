'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatDateTime, formatRelativeTime } from '@/lib/utils';
import {
  X,
  Clock,
  User,
  MapPin,
  Calendar,
  Tag,
  MessageSquare,
  Edit,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  History,
  Star,
  FileText,
  Building2,
  Timer,
  UserCircle,
  ArrowRight,
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

export function TicketDetailDrawer({
  ticket,
  open,
  onOpenChange,
  condominiumId,
}: TicketDetailDrawerProps) {
  if (!open || !ticket) return null;

  // Demo status history
  const statusHistory = ticket.statusHistory || [
    {
      id: '1',
      ticketId: ticket.id,
      fromStatus: 'NOVA' as TicketStatus,
      toStatus: 'EM_AVALIACAO' as TicketStatus,
      changedById: 'user-1',
      changedBy: { id: 'user-1', name: 'Carlos Santos', email: 'carlos@email.com' },
      note: 'Ticket recebido para avaliacao',
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
          'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => onOpenChange(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 h-full w-full max-w-xl',
          'bg-background border-l border-border shadow-2xl',
          'transform transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex-shrink-0 border-b border-border bg-muted/30 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge
                    variant="secondary"
                    className={cn(
                      'text-xs font-medium',
                      statusColorClasses[TICKET_STATUS_COLORS[ticket.status]]
                    )}
                  >
                    {TICKET_STATUS_LABELS[ticket.status]}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn(
                      'text-xs font-medium',
                      priorityColorClasses[TICKET_PRIORITY_COLORS[ticket.priority]]
                    )}
                  >
                    {TICKET_PRIORITY_LABELS[ticket.priority]}
                  </Badge>
                  {ticket.priority === 'ALTA' && (
                    <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                  )}
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-foreground leading-tight">
                  {ticket.title}
                </h2>

                {/* Meta */}
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                    #{ticket.id.slice(0, 8)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    {TICKET_CATEGORY_LABELS[ticket.category]}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="outline" size="sm" className="gap-2 shadow-sm">
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Editar</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Status Change */}
          <div className="flex-shrink-0 border-b border-border p-4 bg-background">
            <TicketStatusSelect
              ticketId={ticket.id}
              currentStatus={ticket.status}
              condominiumId={condominiumId}
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="details" className="flex-1 flex flex-col min-h-0">
            <div className="flex-shrink-0 border-b border-border bg-background">
              <TabsList variant="underline" className="w-full px-4">
                <TabsTrigger
                  value="details"
                  variant="underline"
                  icon={<FileText className="h-4 w-4" />}
                >
                  Detalhes
                </TabsTrigger>
                <TabsTrigger
                  value="comments"
                  variant="underline"
                  icon={<MessageSquare className="h-4 w-4" />}
                  badge={
                    ticket.comments && ticket.comments.length > 0 ? (
                      <Badge variant="secondary" className="h-5 px-1.5 text-xs ml-1.5">
                        {ticket.comments.length}
                      </Badge>
                    ) : undefined
                  }
                >
                  Comentarios
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  variant="underline"
                  icon={<History className="h-4 w-4" />}
                >
                  Historico
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Details Tab */}
              <TabsContent value="details" className="p-6 space-y-6 mt-0" spacing="none">
                {/* Description */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Descricao
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                    {ticket.description}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Location */}
                  {ticket.location && (
                    <div className="p-4 rounded-xl bg-muted/50 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        Localizacao
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {ticket.location}
                      </p>
                    </div>
                  )}

                  {/* Unit */}
                  {ticket.unit && (
                    <div className="p-4 rounded-xl bg-muted/50 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" />
                        Unidade
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {ticket.unit.block} - {ticket.unit.number}
                      </p>
                    </div>
                  )}

                  {/* Created */}
                  <div className="p-4 rounded-xl bg-muted/50 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      Criado em
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {formatDateTime(ticket.createdAt)}
                    </p>
                  </div>

                  {/* SLA */}
                  <div className="p-4 rounded-xl bg-muted/50 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Timer className="h-3.5 w-3.5" />
                      SLA
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {ticket.slaHours} horas
                    </p>
                  </div>
                </div>

                {/* People */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Pessoas
                  </h3>

                  {/* Opened By */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                    <Avatar
                      fallback={ticket.openedBy?.name || 'U'}
                      className="h-11 w-11 border-2 border-background shadow-sm"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {ticket.openedBy?.name || 'Usuario'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Solicitante
                      </p>
                    </div>
                  </div>

                  {/* Assigned To */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                    {ticket.assignedTo ? (
                      <>
                        <Avatar
                          fallback={ticket.assignedTo.name}
                          className="h-11 w-11 border-2 border-background shadow-sm"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {ticket.assignedTo.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Responsavel
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted border-2 border-dashed border-border">
                          <UserCircle className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            Nao atribuido
                          </p>
                          <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">
                            Atribuir responsavel
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {ticket.tags && ticket.tags.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {ticket.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="rounded-full">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Satisfaction */}
                {ticket.satisfactionScore && (
                  <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                        <Star className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                        Avaliacao do morador
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            'h-6 w-6 transition-colors',
                            star <= ticket.satisfactionScore!
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300 dark:text-gray-600'
                          )}
                        />
                      ))}
                      <span className="ml-2 text-lg font-bold text-green-700 dark:text-green-400">
                        {ticket.satisfactionScore}/5
                      </span>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Comments Tab */}
              <TabsContent value="comments" className="p-6 mt-0" spacing="none">
                <TicketComments
                  ticketId={ticket.id}
                  condominiumId={condominiumId}
                  comments={ticket.comments}
                />
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="p-6 mt-0" spacing="none">
                {statusHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
                      <History className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-foreground mb-1">Nenhum historico</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Nao ha alteracoes de status registradas
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-5 top-3 bottom-3 w-0.5 bg-border" />

                    <div className="space-y-6">
                      {statusHistory.map((history) => (
                        <div key={history.id} className="relative flex gap-4">
                          {/* Timeline dot */}
                          <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background border-2 border-border shadow-sm">
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 pt-1 pb-2">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-foreground">
                                {history.changedBy?.name || 'Sistema'}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                alterou o status
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {TICKET_STATUS_LABELS[history.fromStatus]}
                              </Badge>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              <Badge
                                variant="secondary"
                                className={cn(
                                  'text-xs',
                                  statusColorClasses[TICKET_STATUS_COLORS[history.toStatus]]
                                )}
                              >
                                {TICKET_STATUS_LABELS[history.toStatus]}
                              </Badge>
                            </div>

                            {history.note && (
                              <p className="text-sm text-muted-foreground italic mb-2 pl-3 border-l-2 border-muted">
                                "{history.note}"
                              </p>
                            )}

                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatRelativeTime(history.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>

          {/* Footer Actions */}
          {ticket.status !== 'CONCLUIDA' && ticket.status !== 'CANCELADA' && (
            <div className="flex-shrink-0 border-t border-border p-4 bg-muted/30">
              <Button className="w-full gap-2 shadow-sm" size="lg">
                <CheckCircle className="h-5 w-5" />
                Marcar como Concluida
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
