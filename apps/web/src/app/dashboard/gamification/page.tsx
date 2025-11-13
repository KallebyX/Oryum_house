'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GamificationPage() {
  // Mock data - em produção virá da API
  const userStats = {
    points: 2450,
    level: 7,
    rankPosition: 3,
    achievementsUnlocked: 8,
    totalAchievements: 17,
    pointsToNextLevel: 150,
    nextLevel: 8,
  };

  const recentAchievements = [
    {
      id: '1',
      name: 'Participante Ativo',
      description: 'Vote em 5 assembleias',
      category: 'PARTICIPATION',
      points: 40,
      unlockedAt: '2025-01-10T14:30:00Z',
      icon: '🗳️',
    },
    {
      id: '2',
      name: 'Leitor Assíduo',
      description: 'Leia 10 comunicados',
      category: 'PARTICIPATION',
      points: 20,
      unlockedAt: '2025-01-08T10:15:00Z',
      icon: '📖',
    },
    {
      id: '3',
      name: 'Solucionador',
      description: 'Complete 5 demandas',
      category: 'COMMUNITY',
      points: 30,
      unlockedAt: '2025-01-05T16:45:00Z',
      icon: '🛠️',
    },
  ];

  const pointsHistory = [
    { id: '1', points: 15, reason: 'Votou em item de assembleia', date: '2025-01-10T14:30:00Z' },
    { id: '2', points: 5, reason: 'Leu um comunicado', date: '2025-01-10T09:20:00Z' },
    { id: '3', points: 20, reason: 'Resolveu um chamado', date: '2025-01-09T15:10:00Z' },
    { id: '4', points: 10, reason: 'Criou um novo chamado', date: '2025-01-09T11:05:00Z' },
    { id: '5', points: 5, reason: 'Fez uma reserva', date: '2025-01-08T18:30:00Z' },
  ];

  const progressPercentage = ((userStats.points % 100) / 100) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <Link href="/dashboard" className="text-white hover:text-purple-100 mb-4 inline-block">
              ← Voltar ao Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white mt-2">🏆 Gamificação</h1>
            <p className="text-purple-100 mt-1">Acompanhe sua evolução e conquistas</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Pontos */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-700">Pontos Totais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{userStats.points.toLocaleString()}</div>
            </CardContent>
          </Card>

          {/* Nível */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-700">Nível Atual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">Nível {userStats.level}</div>
            </CardContent>
          </Card>

          {/* Ranking */}
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="pb-3">
              <CardDescription className="text-yellow-700">Posição no Ranking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">#{userStats.rankPosition}</div>
            </CardContent>
          </Card>

          {/* Conquistas */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-700">Conquistas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {userStats.achievementsUnlocked}/{userStats.totalAchievements}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progresso para Próximo Nível */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Progresso para Nível {userStats.nextLevel}</CardTitle>
            <CardDescription>
              Faltam {userStats.pointsToNextLevel} pontos para o próximo nível
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Nível {userStats.level}</span>
                <span>Nível {userStats.nextLevel}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 text-center">
                {Math.round(progressPercentage)}% concluído
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conquistas Recentes */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Conquistas Recentes</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/achievements">Ver Todas</Link>
                </Button>
              </div>
              <CardDescription>Últimas conquistas desbloqueadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                  >
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-purple-900">{achievement.name}</h4>
                      <p className="text-sm text-purple-700">{achievement.description}</p>
                      <div className="flex items-center mt-2 space-x-3">
                        <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                          +{achievement.points} pontos
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Pontos */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Histórico de Pontos</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/ranking">Ver Ranking</Link>
                </Button>
              </div>
              <CardDescription>Pontos ganhos recentemente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pointsHistory.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{entry.reason}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.date).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-lg font-bold text-green-600">+{entry.points}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
