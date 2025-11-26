'use client';

import { StatCard } from '@/components/ui/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  CalendarDays,
  CalendarRange,
} from 'lucide-react';

interface BookingStatsProps {
  condominiumId: string;
  isLoading?: boolean;
}

export function BookingStats({ condominiumId, isLoading }: BookingStatsProps) {
  // Demo stats - in production, fetch from useBookingStats hook
  const stats = {
    total: 45,
    pending: 5,
    approved: 32,
    rejected: 3,
    canceled: 5,
    todayCount: 3,
    weekCount: 12,
    monthCount: 45,
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-6">
            <Skeleton className="h-4 w-20 mb-4" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard
        title="Hoje"
        value={stats.todayCount}
        icon={CalendarDays}
        color="blue"
        description="Reservas agendadas"
      />

      <StatCard
        title="Esta Semana"
        value={stats.weekCount}
        icon={CalendarRange}
        color="purple"
        description="Próximas reservas"
      />

      <StatCard
        title="Pendentes"
        value={stats.pending}
        icon={Clock}
        color="orange"
        description="Aguardando aprovação"
        trend={
          stats.pending > 5
            ? { value: stats.pending, label: 'para aprovar', isPositive: false }
            : undefined
        }
      />

      <StatCard
        title="Aprovadas"
        value={stats.approved}
        icon={CheckCircle}
        color="green"
        description="Este mês"
        trend={{ value: 8, label: 'vs. mês anterior', isPositive: true }}
      />

      <StatCard
        title="Rejeitadas"
        value={stats.rejected}
        icon={XCircle}
        color="red"
        description="Este mês"
      />

      <StatCard
        title="Total do Mês"
        value={stats.monthCount}
        icon={Calendar}
        color="blue"
        description="Todas as reservas"
      />
    </div>
  );
}
