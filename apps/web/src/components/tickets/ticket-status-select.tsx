'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChevronDown, Check, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUpdateTicketStatus } from '@/hooks/use-tickets';
import {
  type TicketStatus,
  TICKET_STATUS_LABELS,
  TICKET_STATUS_COLORS,
} from '@/types/ticket';

interface TicketStatusSelectProps {
  ticketId: string;
  currentStatus: TicketStatus;
  condominiumId: string;
  onStatusChange?: (newStatus: TicketStatus) => void;
}

const statusColorClasses: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800',
  orange: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800',
  purple: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800',
  green: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800',
  red: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800',
};

const statusDotClasses: Record<string, string> = {
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
};

const allStatuses: TicketStatus[] = [
  'NOVA',
  'EM_AVALIACAO',
  'EM_ANDAMENTO',
  'AGUARDANDO_MORADOR',
  'CONCLUIDA',
  'CANCELADA',
];

// Define valid status transitions
const validTransitions: Record<TicketStatus, TicketStatus[]> = {
  NOVA: ['EM_AVALIACAO', 'EM_ANDAMENTO', 'CANCELADA'],
  EM_AVALIACAO: ['EM_ANDAMENTO', 'AGUARDANDO_MORADOR', 'NOVA', 'CANCELADA'],
  EM_ANDAMENTO: ['AGUARDANDO_MORADOR', 'CONCLUIDA', 'CANCELADA'],
  AGUARDANDO_MORADOR: ['EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'],
  CONCLUIDA: [], // Cannot change once completed
  CANCELADA: [], // Cannot change once cancelled
};

export function TicketStatusSelect({
  ticketId,
  currentStatus,
  condominiumId,
  onStatusChange,
}: TicketStatusSelectProps) {
  const [isChanging, setIsChanging] = useState(false);
  const [localStatus, setLocalStatus] = useState(currentStatus);

  const updateStatus = useUpdateTicketStatus(condominiumId, ticketId);

  const availableStatuses = validTransitions[localStatus];
  const isEditable = availableStatuses.length > 0;

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (newStatus === localStatus) return;

    setIsChanging(true);
    try {
      await updateStatus.mutateAsync({ status: newStatus });
      setLocalStatus(newStatus);
      onStatusChange?.(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsChanging(false);
    }
  };

  const currentColor = TICKET_STATUS_COLORS[localStatus];

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>

      {isEditable ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isChanging}
              className={cn(
                'gap-2 border',
                statusColorClasses[currentColor]
              )}
            >
              {isChanging ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <div className={cn('h-2 w-2 rounded-full', statusDotClasses[currentColor])} />
              )}
              {TICKET_STATUS_LABELS[localStatus]}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {allStatuses.map((status) => {
              const color = TICKET_STATUS_COLORS[status];
              const isAvailable = availableStatuses.includes(status);
              const isCurrent = status === localStatus;

              return (
                <DropdownMenuItem
                  key={status}
                  disabled={!isAvailable && !isCurrent}
                  onClick={() => handleStatusChange(status)}
                  className={cn(
                    'gap-2',
                    !isAvailable && !isCurrent && 'opacity-50'
                  )}
                >
                  <div className={cn('h-2 w-2 rounded-full', statusDotClasses[color])} />
                  <span className="flex-1">{TICKET_STATUS_LABELS[status]}</span>
                  {isCurrent && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Badge
          variant="secondary"
          className={cn(
            'gap-2',
            statusColorClasses[currentColor]
          )}
        >
          <div className={cn('h-2 w-2 rounded-full', statusDotClasses[currentColor])} />
          {TICKET_STATUS_LABELS[localStatus]}
        </Badge>
      )}

      {!isEditable && (
        <span className="text-xs text-gray-400 dark:text-gray-500">
          (status final)
        </span>
      )}
    </div>
  );
}
