'use client';

import { StatCard } from '@/components/ui/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Megaphone,
  Pin,
  Clock,
  CheckCircle,
  Eye,
  Calendar,
} from 'lucide-react';

interface NoticeStatsProps {
  condominiumId: string;
  isLoading?: boolean;
}

export function NoticeStats({ condominiumId, isLoading }: NoticeStatsProps) {
  // Demo stats
  const stats = {
    total: 28,
    active: 12,
    pinned: 3,
    scheduled: 2,
    expired: 13,
    avgReadRate: 78,
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
        title="Total"
        value={stats.total}
        icon={Megaphone}
        color="blue"
        description="Todos os comunicados"
      />

      <StatCard
        title="Ativos"
        value={stats.active}
        icon={CheckCircle}
        color="green"
        description="Publicados e vigentes"
      />

      <StatCard
        title="Fixados"
        value={stats.pinned}
        icon={Pin}
        color="purple"
        description="Destacados no topo"
      />

      <StatCard
        title="Agendados"
        value={stats.scheduled}
        icon={Calendar}
        color="orange"
        description="Publicação futura"
      />

      <StatCard
        title="Expirados"
        value={stats.expired}
        icon={Clock}
        color="red"
        description="Fora de vigência"
      />

      <StatCard
        title="Taxa de Leitura"
        value={`${stats.avgReadRate}%`}
        icon={Eye}
        color="blue"
        description="Média de confirmações"
        trend={{ value: 5, label: 'vs. mês anterior', isPositive: true }}
      />
    </div>
  );
}
