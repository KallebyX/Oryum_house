'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

type ReportType = 'overview' | 'tickets' | 'bookings' | 'financial';

interface StatCard {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
}

const overviewStats: StatCard[] = [
  { label: 'Total de Demandas', value: 156, change: 12, changeLabel: 'vs mes anterior' },
  { label: 'Taxa de Resolucao', value: '94%', change: 3, changeLabel: 'vs mes anterior' },
  { label: 'Tempo Medio (SLA)', value: '2.3h', change: -15, changeLabel: 'melhoria' },
  { label: 'Satisfacao Media', value: '4.5/5', change: 0.2, changeLabel: 'vs mes anterior' },
];

const ticketStats: StatCard[] = [
  { label: 'Abertas', value: 24 },
  { label: 'Em Andamento', value: 18 },
  { label: 'Resolvidas', value: 114 },
  { label: 'Canceladas', value: 0 },
];

const bookingStats: StatCard[] = [
  { label: 'Reservas este Mes', value: 45 },
  { label: 'Taxa de Ocupacao', value: '72%' },
  { label: 'Area mais Popular', value: 'Salao de Festas' },
  { label: 'Receita Reservas', value: 'R$ 3.500' },
];

interface CategoryData {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

const ticketCategories: CategoryData[] = [
  { name: 'Manutencao', count: 45, percentage: 29, color: 'bg-blue-500' },
  { name: 'Limpeza', count: 32, percentage: 21, color: 'bg-green-500' },
  { name: 'Seguranca', count: 28, percentage: 18, color: 'bg-red-500' },
  { name: 'Barulho', count: 24, percentage: 15, color: 'bg-yellow-500' },
  { name: 'Outros', count: 27, percentage: 17, color: 'bg-gray-500' },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportType>('overview');
  const [dateRange, setDateRange] = useState('month');

  const renderStatCard = (stat: StatCard, index: number) => (
    <Card key={index}>
      <CardContent className="p-4">
        <div className="text-sm text-gray-600">{stat.label}</div>
        <div className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</div>
        {stat.change !== undefined && (
          <div
            className={`text-xs mt-1 ${
              stat.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {stat.change >= 0 ? '+' : ''}
            {stat.change}% {stat.changeLabel}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatorios</h1>
          <p className="text-gray-600">Estatisticas e analises do condominio</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="week">Ultima Semana</option>
            <option value="month">Ultimo Mes</option>
            <option value="quarter">Ultimo Trimestre</option>
            <option value="year">Ultimo Ano</option>
          </select>
          <Button variant="outline">Exportar PDF</Button>
          <Button variant="outline">Exportar Excel</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b">
        {[
          { id: 'overview', label: 'Visao Geral' },
          { id: 'tickets', label: 'Demandas' },
          { id: 'bookings', label: 'Reservas' },
          { id: 'financial', label: 'Financeiro' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab(tab.id as ReportType)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewStats.map((stat, index) => renderStatCard(stat, index))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Demandas por Categoria</CardTitle>
                <CardDescription>Distribuicao das demandas abertas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ticketCategories.map((category) => (
                    <div key={category.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{category.name}</span>
                        <span className="text-gray-600">
                          {category.count} ({category.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${category.color} h-2 rounded-full`}
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Ultimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map((day, index) => {
                    const value = [8, 12, 15, 10, 18, 5, 3][index];
                    const maxValue = 18;
                    return (
                      <div key={day} className="flex items-center space-x-3">
                        <span className="w-8 text-sm text-gray-600">{day}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-blue-500 h-4 rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${(value / maxValue) * 100}%` }}
                          >
                            <span className="text-xs text-white font-medium">{value}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ticketStats.map((stat, index) => renderStatCard(stat, index))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tempo de Resolucao por Prioridade</CardTitle>
              <CardDescription>Media de tempo para resolver demandas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-red-500">Urgente</Badge>
                    <span className="text-sm">Tempo medio: 45 min</span>
                  </div>
                  <span className="text-sm text-gray-600">12 demandas</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-orange-500">Alta</Badge>
                    <span className="text-sm">Tempo medio: 2h</span>
                  </div>
                  <span className="text-sm text-gray-600">28 demandas</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-yellow-500">Media</Badge>
                    <span className="text-sm">Tempo medio: 6h</span>
                  </div>
                  <span className="text-sm text-gray-600">65 demandas</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-green-500">Baixa</Badge>
                    <span className="text-sm">Tempo medio: 24h</span>
                  </div>
                  <span className="text-sm text-gray-600">51 demandas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bookingStats.map((stat, index) => renderStatCard(stat, index))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Areas mais Utilizadas</CardTitle>
              <CardDescription>Ranking de reservas por area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Salao de Festas', bookings: 18, revenue: 'R$ 1.800' },
                  { name: 'Churrasqueira', bookings: 15, revenue: 'R$ 750' },
                  { name: 'Quadra Esportiva', bookings: 8, revenue: 'R$ 400' },
                  { name: 'Piscina (Exclusiva)', bookings: 4, revenue: 'R$ 550' },
                ].map((area, index) => (
                  <div
                    key={area.name}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium">{area.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{area.bookings} reservas</p>
                      <p className="text-xs text-gray-600">{area.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Financial Tab */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🚧</span>
                <div>
                  <h3 className="font-medium text-yellow-800">Modulo em Desenvolvimento</h3>
                  <p className="text-sm text-yellow-700">
                    O modulo financeiro completo estara disponivel em breve.
                    Por enquanto, voce pode visualizar as informacoes basicas de receitas de reservas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600">Receita de Reservas</div>
                <div className="text-2xl font-bold text-green-600">R$ 3.500</div>
                <div className="text-xs text-gray-500">Este mes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600">Taxa de Inadimplencia</div>
                <div className="text-2xl font-bold text-gray-400">--</div>
                <div className="text-xs text-gray-500">Em breve</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600">Balanco Mensal</div>
                <div className="text-2xl font-bold text-gray-400">--</div>
                <div className="text-xs text-gray-500">Em breve</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
