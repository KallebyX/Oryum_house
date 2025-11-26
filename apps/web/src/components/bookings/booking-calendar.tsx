'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import {
  type Booking,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
  DEMO_AREAS,
} from '@/types/booking';

interface BookingCalendarProps {
  bookings: Booking[];
  isLoading?: boolean;
  onBookingClick: (booking: Booking) => void;
  onCreateClick: () => void;
}

const statusBgClasses: Record<string, string> = {
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  gray: 'bg-gray-400',
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
    notes: 'Festa de aniversário',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    notes: 'Churrasco',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    status: 'APPROVED',
    notes: 'Jogo de futebol',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    condominiumId: 'demo-condo-1',
    areaId: 'area-1',
    area: DEMO_AREAS[0],
    unitId: 'unit-4',
    unit: { id: 'unit-4', block: 'C', number: '202' },
    requestedById: 'user-4',
    requestedBy: { id: 'user-4', name: 'Ana Oliveira', email: 'ana@email.com' },
    startAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    endAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(),
    status: 'APPROVED',
    notes: 'Confraternização',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function CalendarSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
          {[...Array(35)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function BookingCalendar({
  bookings,
  isLoading,
  onBookingClick,
  onCreateClick,
}: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const displayBookings = bookings.length > 0 ? bookings : demoBookings;

  const { calendarDays, monthName, year } = useMemo(() => {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // Previous month days
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
        isCurrentMonth: true,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i),
        isCurrentMonth: false,
      });
    }

    return {
      calendarDays: days,
      monthName: currentDate.toLocaleDateString('pt-BR', { month: 'long' }),
      year: currentDate.getFullYear(),
    };
  }, [currentDate]);

  const getBookingsForDate = (date: Date) => {
    return displayBookings.filter((booking) => {
      const bookingDate = new Date(booking.startAt);
      return bookingDate.toDateString() === date.toDateString();
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  const today = new Date();
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="capitalize">
              {monthName} {year}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Hoje
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const dayBookings = getBookingsForDate(day.date);
            const isToday = day.date.toDateString() === today.toDateString();
            const isPast = day.date < today && !isToday;

            return (
              <div
                key={index}
                className={cn(
                  'min-h-[100px] rounded-lg border p-1 transition-colors',
                  day.isCurrentMonth
                    ? 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800'
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-900',
                  isToday && 'ring-2 ring-blue-500 border-blue-500',
                  isPast && day.isCurrentMonth && 'opacity-50'
                )}
              >
                {/* Day number */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                      isToday
                        ? 'bg-blue-500 text-white'
                        : day.isCurrentMonth
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400 dark:text-gray-600'
                    )}
                  >
                    {day.date.getDate()}
                  </span>
                  {day.isCurrentMonth && !isPast && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 opacity-0 hover:opacity-100 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCreateClick();
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {/* Bookings */}
                <div className="space-y-1">
                  {dayBookings.slice(0, 2).map((booking) => (
                    <div
                      key={booking.id}
                      onClick={() => onBookingClick(booking)}
                      className={cn(
                        'cursor-pointer rounded px-1.5 py-0.5 text-xs truncate',
                        'hover:opacity-80 transition-opacity',
                        statusBgClasses[BOOKING_STATUS_COLORS[booking.status]],
                        'text-white'
                      )}
                      title={`${booking.area?.name} - ${booking.notes || ''}`}
                    >
                      {booking.area?.name}
                    </div>
                  ))}
                  {dayBookings.length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 px-1">
                      +{dayBookings.length - 2} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
          <span className="text-gray-500 dark:text-gray-400">Legenda:</span>
          {(['APPROVED', 'PENDING', 'REJECTED', 'CANCELED'] as const).map((status) => (
            <div key={status} className="flex items-center gap-1.5">
              <div
                className={cn(
                  'h-3 w-3 rounded',
                  statusBgClasses[BOOKING_STATUS_COLORS[status]]
                )}
              />
              <span className="text-gray-600 dark:text-gray-400">
                {BOOKING_STATUS_LABELS[status]}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
