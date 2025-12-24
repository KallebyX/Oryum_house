'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Ticket,
  CalendarDays,
  DollarSign,
  Download,
  FileSpreadsheet,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  Building2,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Construction,
} from 'lucide-react';

interface StatCard {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: string;
}

interface CategoryData {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

const overviewStats: StatCard[] = [
  {
    label: 'Total de Demandas',
    value: 156,
    change: 12,
    changeLabel: 'vs mes anterior',
    icon: <Ticket className="h-5 w-5" />,
    color: 'text-blue-600 dark:text-blue-400',
  },
  {
    label: 'Taxa de Resolucao',
    value: '94%',
    change: 3,
    changeLabel: 'vs mes anterior',
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: 'text-green-600 dark:text-green-400',
  },
  {
    label: 'Tempo Medio (SLA)',
    value: '2.3h',
    change: -15,
    changeLabel: 'melhoria',
    icon: <Clock className="h-5 w-5" />,
    color: 'text-purple-600 dark:text-purple-400',
  },
  {
    label: 'Satisfacao Media',
    value: '4.5/5',
    change: 0.2,
    changeLabel: 'vs mes anterior',
    icon: <Activity className="h-5 w-5" />,
    color: 'text-amber-600 dark:text-amber-400',
  },
];

const ticketStats: StatCard[] = [
  { label: 'Abertas', value: 24, icon: <AlertTriangle className="h-5 w-5" />, color: 'text-blue-600' },
  { label: 'Em Andamento', value: 18, icon: <Clock className="h-5 w-5" />, color: 'text-orange-600' },
  { label: 'Resolvidas', value: 114, icon: <CheckCircle2 className="h-5 w-5" />, color: 'text-green-600' },
  { label: 'Canceladas', value: 0, icon: <XCircle className="h-5 w-5" />, color: 'text-red-600' },
];

const bookingStats: StatCard[] = [
  { label: 'Reservas este Mes', value: 45, icon: <CalendarDays className="h-5 w-5" />, color: 'text-blue-600' },
  { label: 'Taxa de Ocupacao', value: '72%', icon: <PieChart className="h-5 w-5" />, color: 'text-green-600' },
  { label: 'Area mais Popular', value: 'Salao de Festas', icon: <Building2 className="h-5 w-5" />, color: 'text-purple-600' },
  { label: 'Receita Reservas', value: 'R$ 3.500', icon: <DollarSign className="h-5 w-5" />, color: 'text-amber-600' },
];

const ticketCategories: CategoryData[] = [
  { name: 'Manutencao', count: 45, percentage: 29, color: 'bg-blue-500' },
  { name: 'Limpeza', count: 32, percentage: 21, color: 'bg-green-500' },
  { name: 'Seguranca', count: 28, percentage: 18, color: 'bg-red-500' },
  { name: 'Barulho', count: 24, percentage: 15, color: 'bg-yellow-500' },
  { name: 'Outros', count: 27, percentage: 17, color: 'bg-gray-500' },
];

const priorityData = [
  { priority: 'Urgente', color: 'bg-red-500', time: '45 min', count: 12 },
  { priority: 'Alta', color: 'bg-orange-500', time: '2h', count: 28 },
  { priority: 'Media', color: 'bg-yellow-500', time: '6h', count: 65 },
  { priority: 'Baixa', color: 'bg-green-500', time: '24h', count: 51 },
];

const weeklyActivity = [
  { day: 'Seg', value: 8 },
  { day: 'Ter', value: 12 },
  { day: 'Qua', value: 15 },
  { day: 'Qui', value: 10 },
  { day: 'Sex', value: 18 },
  { day: 'Sab', value: 5 },
  { day: 'Dom', value: 3 },
];

const areaRanking = [
  { name: 'Salao de Festas', bookings: 18, revenue: 'R$ 1.800', occupancy: 85 },
  { name: 'Churrasqueira', bookings: 15, revenue: 'R$ 750', occupancy: 70 },
  { name: 'Quadra Esportiva', bookings: 8, revenue: 'R$ 400', occupancy: 45 },
  { name: 'Piscina (Exclusiva)', bookings: 4, revenue: 'R$ 550', occupancy: 30 },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('month');

  const renderTrendIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="h-3.5 w-3.5" />;
    if (change < 0) return <ArrowDownRight className="h-3.5 w-3.5" />;
    return <Minus className="h-3.5 w-3.5" />;
  };

  const getTrendColor = (change: number, isPositiveBetter = true) => {
    if (change === 0) return 'text-muted-foreground';
    const isPositive = isPositiveBetter ? change > 0 : change < 0;
    return isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatorios</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Estatisticas e analises completas do condominio
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="week">Ultima Semana</option>
            <option value="month">Ultimo Mes</option>
            <option value="quarter">Ultimo Trimestre</option>
            <option value="year">Ultimo Ano</option>
          </select>
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar PDF</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar Excel</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList variant="pills" className="flex-wrap">
          <TabsTrigger
            value="overview"
            variant="pills"
            icon={<BarChart3 className="h-4 w-4" />}
          >
            Visao Geral
          </TabsTrigger>
          <TabsTrigger
            value="tickets"
            variant="pills"
            icon={<Ticket className="h-4 w-4" />}
          >
            Demandas
          </TabsTrigger>
          <TabsTrigger
            value="bookings"
            variant="pills"
            icon={<CalendarDays className="h-4 w-4" />}
          >
            Reservas
          </TabsTrigger>
          <TabsTrigger
            value="financial"
            variant="pills"
            icon={<DollarSign className="h-4 w-4" />}
          >
            Financeiro
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewStats.map((stat, index) => (
              <Card key={index} className="stat-card">
                <CardContent className="p-5">
                  <div className={cn('stat-card-icon', stat.color?.replace('text-', '!text-'))}>
                    {stat.icon}
                  </div>
                  <div className={cn('stat-card-value', stat.color)}>{stat.value}</div>
                  <div className="stat-card-label">{stat.label}</div>
                  {stat.change !== undefined && (
                    <div className={cn('stat-card-trend', getTrendColor(stat.change))}>
                      {renderTrendIcon(stat.change)}
                      <span>
                        {stat.change > 0 ? '+' : ''}
                        {stat.change}% {stat.changeLabel}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categories Chart */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Demandas por Categoria</CardTitle>
                    <CardDescription>Distribuicao das demandas abertas</CardDescription>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
                    <PieChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {ticketCategories.map((category) => (
                  <div key={category.name} className="group">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-foreground">{category.name}</span>
                      <span className="text-muted-foreground">
                        {category.count} <span className="text-xs">({category.percentage}%)</span>
                      </span>
                    </div>
                    <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          category.color,
                          'h-full rounded-full transition-all duration-500 group-hover:opacity-80'
                        )}
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weekly Activity */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Atividade Semanal</CardTitle>
                    <CardDescription>Ultimos 7 dias</CardDescription>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-950/50 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {weeklyActivity.map((day) => {
                  const maxValue = Math.max(...weeklyActivity.map((d) => d.value));
                  const percentage = (day.value / maxValue) * 100;
                  return (
                    <div key={day.day} className="group flex items-center gap-3">
                      <span className="w-10 text-sm font-medium text-muted-foreground">
                        {day.day}
                      </span>
                      <div className="flex-1 relative h-8 bg-muted rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-500 group-hover:from-blue-600 group-hover:to-blue-700 flex items-center justify-end pr-3"
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="text-xs font-semibold text-white">{day.value}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {ticketStats.map((stat, index) => (
              <Card key={index} className="stat-card">
                <CardContent className="p-5">
                  <div className={cn('stat-card-icon', `!${stat.color}`)}>
                    {stat.icon}
                  </div>
                  <div className={cn('stat-card-value', stat.color)}>{stat.value}</div>
                  <div className="stat-card-label">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resolution Time by Priority */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Tempo de Resolucao por Prioridade</CardTitle>
                  <CardDescription>Media de tempo para resolver demandas</CardDescription>
                </div>
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {priorityData.map((item) => (
                <div
                  key={item.priority}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn('h-3 w-3 rounded-full', item.color)} />
                    <div>
                      <span className="font-medium text-foreground">{item.priority}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        Tempo medio: {item.time}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-mono">
                    {item.count} demandas
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {bookingStats.map((stat, index) => (
              <Card key={index} className="stat-card">
                <CardContent className="p-5">
                  <div className={cn('stat-card-icon', `!${stat.color}`)}>
                    {stat.icon}
                  </div>
                  <div className={cn('stat-card-value', stat.color)}>
                    {typeof stat.value === 'string' && stat.value.length > 10
                      ? <span className="text-xl">{stat.value}</span>
                      : stat.value
                    }
                  </div>
                  <div className="stat-card-label">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Area Ranking */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Areas mais Utilizadas</CardTitle>
                  <CardDescription>Ranking de reservas por area</CardDescription>
                </div>
                <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {areaRanking.map((area, index) => (
                <div
                  key={area.name}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div
                    className={cn(
                      'h-10 w-10 rounded-full flex items-center justify-center font-bold text-white',
                      index === 0 ? 'bg-amber-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-amber-700' : 'bg-gray-300'
                    )}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{area.name}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {area.bookings} reservas
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {area.occupancy}% ocupacao
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {area.revenue}
                    </span>
                    <p className="text-xs text-muted-foreground">receita</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          {/* Under Development Notice */}
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
                  <Construction className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                    Modulo em Desenvolvimento
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    O modulo financeiro completo estara disponivel em breve.
                    Por enquanto, voce pode visualizar as informacoes basicas de receitas de reservas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Financial Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="stat-card">
              <CardContent className="p-5">
                <div className="stat-card-icon !bg-green-100 !text-green-600 dark:!bg-green-950/50 dark:!text-green-400">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div className="stat-card-value text-green-600 dark:text-green-400">R$ 3.500</div>
                <div className="stat-card-label">Receita de Reservas</div>
                <div className="stat-card-trend positive">
                  <TrendingUp className="h-3 w-3" />
                  <span>Este mes</span>
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card opacity-60">
              <CardContent className="p-5">
                <div className="stat-card-icon !bg-gray-100 !text-gray-400 dark:!bg-gray-800">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <div className="stat-card-value text-muted-foreground">--</div>
                <div className="stat-card-label">Taxa de Inadimplencia</div>
                <div className="stat-card-trend">
                  <Clock className="h-3 w-3" />
                  <span>Em breve</span>
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card opacity-60">
              <CardContent className="p-5">
                <div className="stat-card-icon !bg-gray-100 !text-gray-400 dark:!bg-gray-800">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div className="stat-card-value text-muted-foreground">--</div>
                <div className="stat-card-label">Balanco Mensal</div>
                <div className="stat-card-trend">
                  <Clock className="h-3 w-3" />
                  <span>Em breve</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
