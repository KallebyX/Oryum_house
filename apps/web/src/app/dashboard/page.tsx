'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Bem-vindo ao Oryum House</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">admin@oryumhouse.com</span>
              <Button variant="outline" onClick={() => window.location.href = '/login'}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Demandas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                🎫 Demandas
              </CardTitle>
              <CardDescription>
                Gerencie as demandas do condomínio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="text-2xl font-bold text-blue-600">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Em andamento</span>
                  <span className="text-lg font-semibold text-orange-600">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Concluídas</span>
                  <span className="text-lg font-semibold text-green-600">12</span>
                </div>
                <Button className="w-full mt-4" asChild>
                  <Link href="/dashboard/tickets">Ver Todas</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reservas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                📅 Reservas
              </CardTitle>
              <CardDescription>
                Áreas comuns e agendamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Hoje</span>
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Esta semana</span>
                  <span className="text-lg font-semibold text-blue-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pendentes</span>
                  <span className="text-lg font-semibold text-orange-600">2</span>
                </div>
                <Button className="w-full mt-4" asChild>
                  <Link href="/dashboard/bookings">Ver Reservas</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comunicados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                📢 Comunicados
              </CardTitle>
              <CardDescription>
                Avisos e notificações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ativos</span>
                  <span className="text-2xl font-bold text-blue-600">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fixados</span>
                  <span className="text-lg font-semibold text-purple-600">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Novos</span>
                  <span className="text-lg font-semibold text-green-600">1</span>
                </div>
                <Button className="w-full mt-4" asChild>
                  <Link href="/dashboard/notices">Ver Comunicados</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Assembleias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                🏛️ Assembleias
              </CardTitle>
              <CardDescription>
                Votações e reuniões
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ativas</span>
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Participação</span>
                  <span className="text-lg font-semibold text-blue-600">78%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Próxima</span>
                  <span className="text-lg font-semibold text-orange-600">15/12</span>
                </div>
                <Button className="w-full mt-4" asChild>
                  <Link href="/dashboard/assemblies">Ver Assembleias</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Portaria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                🚪 Portaria
              </CardTitle>
              <CardDescription>
                Visitantes e entregas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Visitantes hoje</span>
                  <span className="text-2xl font-bold text-blue-600">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Entregas</span>
                  <span className="text-lg font-semibold text-green-600">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pendentes</span>
                  <span className="text-lg font-semibold text-orange-600">2</span>
                </div>
                <Button className="w-full mt-4" asChild>
                  <Link href="/dashboard/portaria">Ver Portaria</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Relatórios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                📊 Relatórios
              </CardTitle>
              <CardDescription>
                Estatísticas e análises
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Satisfação</span>
                  <span className="text-2xl font-bold text-green-600">4.2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">SLA médio</span>
                  <span className="text-lg font-semibold text-blue-600">2.1h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Economia</span>
                  <span className="text-lg font-semibold text-green-600">R$ 2.4k</span>
                </div>
                <Button className="w-full mt-4" asChild>
                  <Link href="/dashboard/reports">Ver Relatórios</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Últimas ações no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Demanda #123 concluída</p>
                    <p className="text-xs text-gray-600">Manutenção da piscina - há 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nova reserva aprovada</p>
                    <p className="text-xs text-gray-600">Salão de festas - amanhã às 19h</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Comunicado publicado</p>
                    <p className="text-xs text-gray-600">Manutenção do elevador - há 4 horas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
