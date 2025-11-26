'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { cn, formatDate, formatDateTime } from '@/lib/utils';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ChevronRight,
  Users,
} from 'lucide-react';
import {
  type Booking,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
  DEMO_AREAS,
} from '@/types/booking';

interface BookingListProps {
  bookings: Booking[];
  isLoading?: boolean;
  onBookingClick: (booking: Booking) => void;
}

const statusColorClasses: Record<string, string> = {
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400',
  green: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  red: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
};

// Demo data
const demoBookings: Booking[] = [
  {
    id: '1',
    condominiumId: 'demo-condo-1',
    areaId: 'area-1',
    area: DEMO_AREAS[0],
    unitId: 'unit-1',
    unit: { id: 'unit-1', block: 'A', number: '302' },
    requestedById: 'user-1',
    requestedBy: { id: 'user-1', name: 'Maria Silva', email: 'maria@email.com' },
    startAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    status: 'APPROVED',
    notes: 'Festa de aniversário - 30 convidados',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    condominiumId: 'demo-condo-1',
    areaId: 'area-2',
    area: DEMO_AREAS[1],
    unitId: 'unit-2',
    unit: { id: 'unit-2', block: 'B', number: '501' },
    requestedById: 'user-2',
    requestedBy: { id: 'user-2', name: 'João Santos', email: 'joao@email.com' },
    startAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING',
    notes: 'Churrasco familiar',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    condominiumId: 'demo-condo-1',
    areaId: 'area-3',
    area: DEMO_AREAS[2],
    unitId: 'unit-3',
    unit: { id: 'unit-3', block: 'A', number: '101' },
    requestedById: 'user-3',
    requestedBy: { id: 'user-3', name: 'Pedro Costa', email: 'pedro@email.com' },
    startAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    status: 'APPROVED',
    notes: 'Jogo de futebol',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    condominiumId: 'demo-condo-1',
    areaId: 'area-5',
    area: DEMO_AREAS[4],
    unitId: 'unit-4',
    unit: { id: 'unit-4', block: 'C', number: '202' },
    requestedById: 'user-4',
    requestedBy: { id: 'user-4', name: 'Ana Oliveira', email: 'ana@email.com' },
    startAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
    status: 'REJECTED',
    notes: 'Jantar com amigos',
    rejectionReason: 'Data já reservada por outro morador',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function BookingListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20" />
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

export function BookingList({ bookings, isLoading, onBookingClick }: BookingListProps) {
  if (isLoading) {
    return <BookingListSkeleton />;
  }

  const displayBookings = bookings.length > 0 ? bookings : demoBookings;

  if (displayBookings.length === 0) {
    return (
      <Card className="p-8">
        <EmptyState
          icon={Calendar}
          title="Nenhuma reserva encontrada"
          description="Não há reservas que correspondam aos filtros selecionados."
          action={{
            label: 'Criar nova reserva',
            onClick: () => {},
          }}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {displayBookings.map((booking) => {
        const startDate = new Date(booking.startAt);
        const endDate = new Date(booking.endAt);
        const isPast = endDate < new Date();
        const isToday = startDate.toDateString() === new Date().toDateString();

        return (
          <Card
            key={booking.id}
            className={cn(
              'group cursor-pointer p-4 transition-all duration-200',
              'hover:shadow-soft hover:border-gray-300 dark:hover:border-gray-700',
              isPast && 'opacity-60',
              isToday && 'border-l-4 border-l-blue-500'
            )}
            onClick={() => onBookingClick(booking)}
          >
            <div className="flex items-start gap-4">
              {/* Date Box */}
              <div className={cn(
                'flex flex-col items-center justify-center rounded-lg p-3 min-w-[60px]',
                isToday
                  ? 'bg-blue-100 dark:bg-blue-950/30'
                  : 'bg-gray-100 dark:bg-gray-800'
              )}>
                <span className={cn(
                  'text-xs font-medium uppercase',
                  isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
                )}>
                  {startDate.toLocaleDateString('pt-BR', { weekday: 'short' })}
                </span>
                <span className={cn(
                  'text-2xl font-bold',
                  isToday ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                )}>
                  {startDate.getDate()}
                </span>
                <span className={cn(
                  'text-xs',
                  isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
                )}>
                  {startDate.toLocaleDateString('pt-BR', { month: 'short' })}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {booking.area?.name || 'Área'}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs',
                          statusColorClasses[BOOKING_STATUS_COLORS[booking.status]]
                        )}
                      >
                        {BOOKING_STATUS_LABELS[booking.status]}
                      </Badge>
                      {isToday && (
                        <Badge variant="default" className="text-xs">
                          Hoje
                        </Badge>
                      )}
                    </div>
                    {booking.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
                        {booking.notes}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 flex-shrink-0 transition-colors" />
                </div>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                  {/* Time */}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    {' - '}
                    {endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  {/* Unit */}
                  {booking.unit && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      Bloco {booking.unit.block} - {booking.unit.number}
                    </span>
                  )}

                  {/* Requested by */}
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {booking.requestedBy?.name || 'Morador'}
                  </span>

                  {/* Capacity */}
                  {booking.area?.capacity && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      Até {booking.area.capacity} pessoas
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
