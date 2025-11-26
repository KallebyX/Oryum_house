'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { cn, formatDateTime, formatDate } from '@/lib/utils';
import {
  X,
  Clock,
  MapPin,
  Calendar,
  User,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Ban,
  Edit,
  Trash2,
  DollarSign,
} from 'lucide-react';
import {
  type Booking,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
} from '@/types/booking';
import { useCancelBooking } from '@/hooks/use-bookings';

interface BookingDetailDrawerProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  condominiumId: string;
}

const statusColorClasses: Record<string, string> = {
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400',
  green: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  red: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
};

const statusIconMap = {
  PENDING: AlertCircle,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
  CANCELED: Ban,
};

export function BookingDetailDrawer({
  booking,
  open,
  onOpenChange,
  condominiumId,
}: BookingDetailDrawerProps) {
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);

  const cancelBooking = useCancelBooking(condominiumId, booking?.id || '');

  if (!open || !booking) return null;

  const startDate = new Date(booking.startAt);
  const endDate = new Date(booking.endAt);
  const isPast = endDate < new Date();
  const canCancel = booking.status === 'PENDING' || booking.status === 'APPROVED';
  const canApprove = booking.status === 'PENDING';

  const StatusIcon = statusIconMap[booking.status];

  const handleCancel = async () => {
    if (!isConfirmingCancel) {
      setIsConfirmingCancel(true);
      return;
    }

    try {
      await cancelBooking.mutateAsync();
      onOpenChange(false);
    } catch (error) {
      console.error('Error canceling booking:', error);
    } finally {
      setIsConfirmingCancel(false);
    }
  };

  const getDurationString = () => {
    const diffMs = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}min`;
  };

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
          'fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white dark:bg-gray-950',
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
                    'text-xs gap-1',
                    statusColorClasses[BOOKING_STATUS_COLORS[booking.status]]
                  )}
                >
                  <StatusIcon className="h-3 w-3" />
                  {BOOKING_STATUS_LABELS[booking.status]}
                </Badge>
                {isPast && (
                  <Badge variant="outline" className="text-xs">
                    Passada
                  </Badge>
                )}
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {booking.area?.name || 'Reserva'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formatDate(booking.startAt, 'EEEE, dd/MM/yyyy')}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Time & Duration */}
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      {' - '}
                      {endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Duração: {getDurationString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="space-y-4">
                {/* Area */}
                {booking.area && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Local</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {booking.area.name}
                      </p>
                      {booking.area.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {booking.area.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Unit */}
                {booking.unit && (
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Unidade</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Bloco {booking.unit.block} - Apartamento {booking.unit.number}
                      </p>
                    </div>
                  </div>
                )}

                {/* Capacity */}
                {booking.area?.capacity && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Capacidade</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Até {booking.area.capacity} pessoas
                      </p>
                    </div>
                  </div>
                )}

                {/* Fee */}
                {booking.area?.feePlaceholder && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Taxa</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        R$ {booking.area.feePlaceholder.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {booking.notes && (
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Observações</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {booking.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Rejection Reason */}
                {booking.status === 'REJECTED' && booking.rejectionReason && (
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-1">
                      Motivo da rejeição:
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {booking.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              {/* Requester */}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Solicitante</p>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <Avatar
                    fallback={booking.requestedBy?.name || 'U'}
                    className="h-10 w-10"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {booking.requestedBy?.name || 'Morador'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {booking.requestedBy?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Area Rules */}
              {booking.area?.rules && (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Regras do local</p>
                  <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {booking.area.rules}
                    </p>
                  </div>
                </div>
              )}

              {/* Created At */}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Solicitado em</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          {(canCancel || canApprove) && !isPast && (
            <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900">
              <div className="flex gap-2">
                {canApprove && (
                  <>
                    <Button className="flex-1 gap-2" variant="default">
                      <CheckCircle className="h-4 w-4" />
                      Aprovar
                    </Button>
                    <Button className="flex-1 gap-2" variant="outline">
                      <XCircle className="h-4 w-4" />
                      Rejeitar
                    </Button>
                  </>
                )}
                {canCancel && !canApprove && (
                  <Button
                    variant={isConfirmingCancel ? 'destructive' : 'outline'}
                    className="flex-1 gap-2"
                    onClick={handleCancel}
                  >
                    <Ban className="h-4 w-4" />
                    {isConfirmingCancel ? 'Confirmar Cancelamento' : 'Cancelar Reserva'}
                  </Button>
                )}
              </div>
              {isConfirmingCancel && (
                <p className="text-xs text-red-500 mt-2 text-center">
                  Clique novamente para confirmar o cancelamento
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
