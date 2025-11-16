'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import {
  Ticket,
  Calendar,
  Megaphone,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Bem-vindo de volta, João! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Aqui está o que está acontecendo no seu condomínio hoje.
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Demanda
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total de Demandas"
          value="24"
          description="8 novas esta semana"
          icon={Ticket}
          color="blue"
          trend={{ value: 12, label: 'vs. semana passada', isPositive: true }}
        />
        <StatCard
          title="Reservas Hoje"
          value="3"
          description="12 esta semana"
          icon={Calendar}
          color="green"
          trend={{ value: 8, label: 'vs. semana passada', isPositive: true }}
        />
        <StatCard
          title="Comunicados Ativos"
          value="5"
          description="1 novo comunicado"
          icon={Megaphone}
          color="purple"
        />
        <StatCard
          title="Participação Assembleias"
          value="78%"
          description="2 assembleias ativas"
          icon={Users}
          color="orange"
          trend={{ value: 5, label: 'vs. mês passado', isPositive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Tickets */}
        <Card className="lg:col-span-2 hover:shadow-soft-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Demandas Recentes</CardTitle>
                <CardDescription>Últimas atualizações do sistema</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: '#123',
                  title: 'Vazamento no banheiro',
                  status: 'EM_ANDAMENTO',
                  priority: 'ALTA',
                  assignee: 'Carlos Santos',
                  time: new Date(Date.now() - 2 * 60 * 60 * 1000),
                },
                {
                  id: '#122',
                  title: 'Manutenção da piscina',
                  status: 'CONCLUIDA',
                  priority: 'MEDIA',
                  assignee: 'Maria Silva',
                  time: new Date(Date.now() - 5 * 60 * 60 * 1000),
                },
                {
                  id: '#121',
                  title: 'Troca de lâmpadas do corredor',
                  status: 'NOVA',
                  priority: 'BAIXA',
                  assignee: null,
                  time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                },
                {
                  id: '#120',
                  title: 'Conserto do elevador',
                  status: 'EM_AVALIACAO',
                  priority: 'ALTA',
                  assignee: 'Pedro Costa',
                  time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                },
              ].map((ticket) => (
                <div
                  key={ticket.id}
                  className="group flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:border-blue-200 dark:hover:border-blue-900 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all cursor-pointer"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      ticket.status === 'CONCLUIDA'
                        ? 'bg-green-100 dark:bg-green-950/30'
                        : ticket.status === 'EM_ANDAMENTO'
                        ? 'bg-orange-100 dark:bg-orange-950/30'
                        : ticket.status === 'EM_AVALIACAO'
                        ? 'bg-yellow-100 dark:bg-yellow-950/30'
                        : 'bg-blue-100 dark:bg-blue-950/30'
                    }`}
                  >
                    {ticket.status === 'CONCLUIDA' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : ticket.status === 'EM_ANDAMENTO' ? (
                      <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {ticket.title}
                      </span>
                      <Badge
                        variant={
                          ticket.priority === 'ALTA'
                            ? 'destructive'
                            : ticket.priority === 'MEDIA'
                            ? 'warning'
                            : 'secondary'
                        }
                        className="text-xs"
                      >
                        {ticket.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <span>{ticket.id}</span>
                      <span>•</span>
                      {ticket.assignee ? (
                        <div className="flex items-center gap-1.5">
                          <Avatar size="sm" fallback={ticket.assignee} className="h-5 w-5" />
                          <span>{ticket.assignee}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Não atribuído</span>
                      )}
                      <span>•</span>
                      <span>{formatRelativeTime(ticket.time)}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats & Activity */}
        <div className="space-y-6">
          {/* Today's Activity */}
          <Card className="hover:shadow-soft-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-base">Atividade de Hoje</CardTitle>
              <CardDescription>Resumo das ações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      12 Demandas
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Concluídas hoje
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
                    <TrendingUp className="h-4 w-4" />
                    15%
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/30">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      3 Reservas
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Aprovadas hoje
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium">
                    <TrendingUp className="h-4 w-4" />
                    8%
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950/30">
                    <Megaphone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      1 Comunicado
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Publicado hoje
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gamification Quick View */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-900 hover:shadow-soft-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-base text-purple-900 dark:text-purple-100">
                Sua Gamificação 🏆
              </CardTitle>
              <CardDescription className="text-purple-700 dark:text-purple-300">
                Continue engajado!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                      Nível 7
                    </span>
                    <span className="text-sm text-purple-700 dark:text-purple-300">
                      2.450 / 3.000 XP
                    </span>
                  </div>
                  <div className="h-2 bg-purple-200 dark:bg-purple-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: '82%' }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-950/30">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      #3
                    </p>
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      Ranking
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-950/30">
                    <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                      8/17
                    </p>
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      Conquistas
                    </p>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
