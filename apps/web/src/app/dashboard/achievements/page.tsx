'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Mock data - em produção virá da API
  const achievements = [
    // PARTICIPATION
    {
      id: '1',
      key: 'FIRST_NOTICE_READ',
      name: 'Bem Informado',
      description: 'Leia seu primeiro comunicado',
      category: 'PARTICIPATION',
      points: 5,
      icon: '📰',
      unlocked: true,
      unlockedAt: '2025-01-01T10:00:00Z',
    },
    {
      id: '2',
      key: 'NOTICE_READER',
      name: 'Leitor Assíduo',
      description: 'Leia 10 comunicados',
      category: 'PARTICIPATION',
      points: 20,
      icon: '📖',
      unlocked: true,
      unlockedAt: '2025-01-08T10:15:00Z',
    },
    {
      id: '3',
      key: 'NOTICE_MASTER',
      name: 'Mestre da Informação',
      description: 'Leia 50 comunicados',
      category: 'PARTICIPATION',
      points: 50,
      icon: '📚',
      unlocked: false,
    },
    {
      id: '4',
      key: 'FIRST_ASSEMBLY_VOTE',
      name: 'Primeiro Voto',
      description: 'Vote em uma assembleia',
      category: 'PARTICIPATION',
      points: 15,
      icon: '🗳️',
      unlocked: true,
      unlockedAt: '2025-01-03T14:20:00Z',
    },
    {
      id: '5',
      key: 'ASSEMBLY_PARTICIPANT',
      name: 'Participante Ativo',
      description: 'Vote em 5 assembleias',
      category: 'PARTICIPATION',
      points: 40,
      icon: '🎯',
      unlocked: true,
      unlockedAt: '2025-01-10T14:30:00Z',
    },
    {
      id: '6',
      key: 'ASSEMBLY_CHAMPION',
      name: 'Campeão da Democracia',
      description: 'Vote em 20 assembleias',
      category: 'PARTICIPATION',
      points: 100,
      icon: '👑',
      unlocked: false,
    },

    // COMMUNITY
    {
      id: '7',
      key: 'FIRST_TICKET',
      name: 'Primeira Demanda',
      description: 'Abra sua primeira demanda',
      category: 'COMMUNITY',
      points: 10,
      icon: '🎫',
      unlocked: true,
      unlockedAt: '2025-01-02T09:30:00Z',
    },
    {
      id: '8',
      key: 'PROBLEM_SOLVER',
      name: 'Solucionador',
      description: 'Complete 5 demandas',
      category: 'COMMUNITY',
      points: 30,
      icon: '🛠️',
      unlocked: true,
      unlockedAt: '2025-01-05T16:45:00Z',
    },
    {
      id: '9',
      key: 'SUPER_SOLVER',
      name: 'Super Solucionador',
      description: 'Complete 20 demandas',
      category: 'COMMUNITY',
      points: 80,
      icon: '⚡',
      unlocked: false,
    },
    {
      id: '10',
      key: 'INCIDENT_REPORTER',
      name: 'Olho Vivo',
      description: 'Reporte 3 ocorrências',
      category: 'COMMUNITY',
      points: 25,
      icon: '👁️',
      unlocked: false,
    },

    // PUNCTUALITY
    {
      id: '11',
      key: 'FIRST_BOOKING',
      name: 'Primeira Reserva',
      description: 'Faça sua primeira reserva',
      category: 'PUNCTUALITY',
      points: 5,
      icon: '📅',
      unlocked: true,
      unlockedAt: '2025-01-04T11:00:00Z',
    },
    {
      id: '12',
      key: 'BOOKING_REGULAR',
      name: 'Usuário Regular',
      description: 'Faça 10 reservas',
      category: 'PUNCTUALITY',
      points: 30,
      icon: '🎯',
      unlocked: false,
    },
    {
      id: '13',
      key: 'BOOKING_MASTER',
      name: 'Mestre das Reservas',
      description: 'Faça 50 reservas',
      category: 'PUNCTUALITY',
      points: 75,
      icon: '🌟',
      unlocked: false,
    },

    // SUPPORT
    {
      id: '14',
      key: 'DOCUMENT_UPLOADER',
      name: 'Organizador',
      description: 'Faça upload de 5 documentos',
      category: 'SUPPORT',
      points: 30,
      icon: '📁',
      unlocked: false,
    },

    // SPECIAL
    {
      id: '15',
      key: 'LEVEL_5',
      name: 'Nível 5 Alcançado',
      description: 'Alcance o nível 5',
      category: 'SPECIAL',
      points: 50,
      icon: '⭐',
      unlocked: true,
      unlockedAt: '2025-01-06T12:00:00Z',
    },
    {
      id: '16',
      key: 'LEVEL_10',
      name: 'Nível 10 Alcançado',
      description: 'Alcance o nível 10',
      category: 'SPECIAL',
      points: 100,
      icon: '💫',
      unlocked: false,
    },
    {
      id: '17',
      key: 'PIONEER',
      name: 'Pioneiro',
      description: 'Um dos primeiros 10 moradores cadastrados',
      category: 'SPECIAL',
      points: 25,
      icon: '🏅',
      unlocked: true,
      unlockedAt: '2025-01-01T08:00:00Z',
    },
  ];

  const categories = [
    { key: 'PARTICIPATION', name: 'Participação', color: 'blue', emoji: '🎯' },
    { key: 'COMMUNITY', name: 'Comunidade', color: 'green', emoji: '🏘️' },
    { key: 'PUNCTUALITY', name: 'Pontualidade', color: 'yellow', emoji: '⏰' },
    { key: 'SUPPORT', name: 'Suporte', color: 'purple', emoji: '🤝' },
    { key: 'SPECIAL', name: 'Especiais', color: 'pink', emoji: '✨' },
  ];

  const filteredAchievements = selectedCategory
    ? achievements.filter((a) => a.category === selectedCategory)
    : achievements;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalPoints = achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <Link href="/dashboard/gamification" className="text-white hover:text-green-100 mb-4 inline-block">
              ← Voltar à Gamificação
            </Link>
            <h1 className="text-3xl font-bold text-white mt-2">🏆 Conquistas</h1>
            <p className="text-green-100 mt-1">
              {unlockedCount} de {achievements.length} desbloqueadas • {totalPoints} pontos ganhos
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros por Categoria */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
            <CardDescription>Filtre conquistas por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(null)}
              >
                Todas ({achievements.length})
              </Button>
              {categories.map((category) => {
                const count = achievements.filter((a) => a.category === category.key).length;
                return (
                  <Button
                    key={category.key}
                    variant={selectedCategory === category.key ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.key)}
                  >
                    {category.emoji} {category.name} ({count})
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Grid de Conquistas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-md'
                  : 'bg-gray-100 border-gray-300 opacity-60'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="text-4xl">{achievement.icon}</div>
                  {achievement.unlocked && (
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      ✓ Desbloqueada
                    </div>
                  )}
                  {!achievement.unlocked && (
                    <div className="bg-gray-400 text-white text-xs px-2 py-1 rounded-full">
                      🔒 Bloqueada
                    </div>
                  )}
                </div>
                <CardTitle className={`mt-2 ${achievement.unlocked ? 'text-green-900' : 'text-gray-600'}`}>
                  {achievement.name}
                </CardTitle>
                <CardDescription className={achievement.unlocked ? 'text-green-700' : 'text-gray-500'}>
                  {achievement.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${achievement.unlocked ? 'text-green-700' : 'text-gray-500'}`}>
                    +{achievement.points} pontos
                  </span>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <span className="text-xs text-gray-500">
                      {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
