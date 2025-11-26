'use client';

import { StatCard } from '@/components/ui/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Star,
} from 'lucide-react';
import type { TicketStats as TicketStatsType } from '@/types/ticket';

interface TicketStatsProps {
  stats?: TicketStatsType;
  isLoading?: boolean;
}

export function TicketStats({ stats, isLoading }: TicketStatsProps) {
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

  // Demo data if no stats provided
  const displayStats: TicketStatsType = stats || {
    total: 48,
    nova: 8,
    emAvaliacao: 5,
    emAndamento: 12,
    aguardandoMorador: 3,
    concluida: 18,
    cancelada: 2,
    byCategory: {} as any,
    byPriority: {} as any,
    avgResolutionTime: 4.2,
    slaCompliance: 94,
    satisfactionAvg: 4.5,
  };

  const pendingCount = displayStats.nova + displayStats.emAvaliacao;
  const inProgressCount = displayStats.emAndamento + displayStats.aguardandoMorador;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard
        title="Total de Demandas"
        value={displayStats.total}
        icon={Ticket}
        color="blue"
        description="Todas as demandas"
      />

      <StatCard
        title="Pendentes"
        value={pendingCount}
        icon={AlertCircle}
        color="orange"
        description="Aguardando atendimento"
        trend={
          pendingCount > 10
            ? { value: 15, label: 'vs. semana anterior', isPositive: false }
            : undefined
        }
      />

      <StatCard
        title="Em Andamento"
        value={inProgressCount}
        icon={Clock}
        color="purple"
        description="Sendo trabalhadas"
      />

      <StatCard
        title="Concluídas"
        value={displayStats.concluida}
        icon={CheckCircle}
        color="green"
        description="Este mês"
        trend={{ value: 12, label: 'vs. mês anterior', isPositive: true }}
      />

      <StatCard
        title="SLA Cumprido"
        value={`${displayStats.slaCompliance}%`}
        icon={TrendingUp}
        color="blue"
        description="Meta: 90%"
        trend={
          displayStats.slaCompliance >= 90
            ? { value: 4, label: 'acima da meta', isPositive: true }
            : { value: 90 - displayStats.slaCompliance, label: 'abaixo da meta', isPositive: false }
        }
      />

      <StatCard
        title="Satisfação"
        value={displayStats.satisfactionAvg.toFixed(1)}
        icon={Star}
        color="pink"
        description="Média de avaliações"
      />
    </div>
  );
}
