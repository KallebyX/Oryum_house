'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Ticket,
  CalendarDays,
  Megaphone,
  Trophy,
  Users,
  DoorOpen,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Activity,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const quickStats = [
  {
    label: 'Demandas Abertas',
    value: 8,
    trend: '+2 hoje',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-950/50',
    icon: Ticket,
  },
  {
    label: 'Reservas Hoje',
    value: 3,
    trend: 'Confirmadas',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-950/50',
    icon: CalendarDays,
  },
  {
    label: 'Entregas Pendentes',
    value: 2,
    trend: 'Aguardando',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-950/50',
    icon: DoorOpen,
  },
  {
    label: 'Seus Pontos',
    value: '2.450',
    trend: 'Nivel 7',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-950/50',
    icon: Trophy,
  },
];

const modules = [
  {
    title: 'Demandas',
    description: 'Gerencie as demandas do condominio',
    icon: Ticket,
    href: '/dashboard/tickets',
    stats: [
      { label: 'Total', value: 24, color: 'text-blue-600' },
      { label: 'Em andamento', value: 8, color: 'text-orange-600' },
      { label: 'Concluidas', value: 12, color: 'text-green-600' },
    ],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Reservas',
    description: 'Areas comuns e agendamentos',
    icon: CalendarDays,
    href: '/dashboard/bookings',
    stats: [
      { label: 'Hoje', value: 3, color: 'text-green-600' },
      { label: 'Esta semana', value: 12, color: 'text-blue-600' },
      { label: 'Pendentes', value: 2, color: 'text-orange-600' },
    ],
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Comunicados',
    description: 'Avisos e notificacoes',
    icon: Megaphone,
    href: '/dashboard/notices',
    stats: [
      { label: 'Ativos', value: 5, color: 'text-blue-600' },
      { label: 'Fixados', value: 2, color: 'text-purple-600' },
      { label: 'Novos', value: 1, color: 'text-green-600' },
    ],
    gradient: 'from-orange-500 to-red-500',
  },
  {
    title: 'Assembleias',
    description: 'Votacoes e reunioes',
    icon: Users,
    href: '/dashboard/assemblies',
    stats: [
      { label: 'Ativas', value: 2, color: 'text-green-600' },
      { label: 'Participacao', value: '78%', color: 'text-blue-600' },
      { label: 'Proxima', value: '15/12', color: 'text-orange-600' },
    ],
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    title: 'Portaria',
    description: 'Visitantes e entregas',
    icon: DoorOpen,
    href: '/dashboard/portaria',
    stats: [
      { label: 'Visitantes hoje', value: 8, color: 'text-blue-600' },
      { label: 'Entregas', value: 5, color: 'text-green-600' },
      { label: 'Pendentes', value: 2, color: 'text-orange-600' },
    ],
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Relatorios',
    description: 'Estatisticas e analises',
    icon: BarChart3,
    href: '/dashboard/reports',
    stats: [
      { label: 'Satisfacao', value: '4.2', color: 'text-green-600' },
      { label: 'SLA medio', value: '2.1h', color: 'text-blue-600' },
      { label: 'Economia', value: 'R$ 2.4k', color: 'text-green-600' },
    ],
    gradient: 'from-pink-500 to-rose-500',
  },
];

const recentActivity = [
  {
    title: 'Demanda #123 concluida',
    description: 'Manutencao da piscina - ha 2 horas',
    color: 'bg-green-500',
    icon: CheckCircle2,
  },
  {
    title: 'Nova reserva aprovada',
    description: 'Salao de festas - amanha as 19h',
    color: 'bg-blue-500',
    icon: CalendarDays,
  },
  {
    title: 'Comunicado publicado',
    description: 'Manutencao do elevador - ha 4 horas',
    color: 'bg-orange-500',
    icon: Megaphone,
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Bem-vindo ao Oryum House</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">admin@oryumhouse.com</span>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/login'}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="stat-card">
                <CardContent className="p-5">
                  <div className={cn('stat-card-icon', stat.bgColor, stat.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className={cn('stat-card-value', stat.color)}>{stat.value}</div>
                  <div className="stat-card-label">{stat.label}</div>
                  <div className="stat-card-trend positive">
                    <Activity className="h-3 w-3" />
                    <span>{stat.trend}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Gamification Card */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 p-6 text-white">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Trophy className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Sua Gamificacao</h2>
                  <p className="text-white/80">Pontos, nivel e conquistas</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">7</div>
                  <div className="text-sm text-white/80">Nivel</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">2.450</div>
                  <div className="text-sm text-white/80">Pontos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">#3</div>
                  <div className="text-sm text-white/80">Ranking</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">8/17</div>
                  <div className="text-sm text-white/80">Conquistas</div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <Link href="/dashboard/gamification">
                  Ver Detalhes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-transparent hover:bg-white/10 text-white border-white/30"
              >
                <Link href="/dashboard/ranking">Ver Ranking</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-transparent hover:bg-white/10 text-white border-white/30"
              >
                <Link href="/dashboard/achievements">Ver Conquistas</Link>
              </Button>
            </div>
          </div>
        </Card>

        {/* Modules Grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Modulos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Card
                  key={module.title}
                  className="group hover:shadow-lg hover:border-primary/20 transition-all duration-200"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white',
                          module.gradient
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{module.title}</CardTitle>
                        <CardDescription className="text-xs">{module.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {module.stats.map((stat) => (
                        <div key={stat.label} className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{stat.label}</span>
                          <span className={cn('font-semibold', stat.color)}>{stat.value}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      className="w-full group-hover:shadow-sm"
                      asChild
                    >
                      <Link href={module.href}>
                        Acessar
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Atividade Recente</CardTitle>
                <CardDescription>Ultimas acoes no sistema</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                <Zap className="h-4 w-4" />
                Ver tudo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center text-white', activity.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
