'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function RankingPage() {
  // Mock data - em produção virá da API
  const rankings = [
    {
      position: 1,
      userId: '1',
      name: 'Maria Silva',
      points: 3850,
      level: 9,
      avatarUrl: null,
    },
    {
      position: 2,
      userId: '2',
      name: 'João Santos',
      points: 3120,
      level: 8,
      avatarUrl: null,
    },
    {
      position: 3,
      userId: '3',
      name: 'Ana Costa',
      points: 2450,
      level: 7,
      avatarUrl: null,
      isCurrentUser: true,
    },
    {
      position: 4,
      userId: '4',
      name: 'Pedro Oliveira',
      points: 2100,
      level: 7,
      avatarUrl: null,
    },
    {
      position: 5,
      userId: '5',
      name: 'Carolina Mendes',
      points: 1890,
      level: 6,
      avatarUrl: null,
    },
    {
      position: 6,
      userId: '6',
      name: 'Roberto Alves',
      points: 1650,
      level: 6,
      avatarUrl: null,
    },
    {
      position: 7,
      userId: '7',
      name: 'Fernanda Lima',
      points: 1420,
      level: 5,
      avatarUrl: null,
    },
    {
      position: 8,
      userId: '8',
      name: 'Lucas Pereira',
      points: 1280,
      level: 5,
      avatarUrl: null,
    },
    {
      position: 9,
      userId: '9',
      name: 'Juliana Rocha',
      points: 1050,
      level: 4,
      avatarUrl: null,
    },
    {
      position: 10,
      userId: '10',
      name: 'Carlos Eduardo',
      points: 890,
      level: 4,
      avatarUrl: null,
    },
  ];

  const getMedalIcon = (position: number) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `#${position}`;
  };

  const getMedalColor = (position: number) => {
    if (position === 1) return 'from-yellow-400 to-yellow-600';
    if (position === 2) return 'from-gray-300 to-gray-500';
    if (position === 3) return 'from-orange-400 to-orange-600';
    return 'from-gray-100 to-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <Link href="/dashboard/gamification" className="text-white hover:text-yellow-100 mb-4 inline-block">
              ← Voltar à Gamificação
            </Link>
            <h1 className="text-3xl font-bold text-white mt-2">🏆 Ranking dos Moradores</h1>
            <p className="text-yellow-100 mt-1">Os moradores mais engajados do condomínio</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top 3 Destaque */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {rankings.slice(0, 3).map((user) => (
            <Card
              key={user.userId}
              className={`bg-gradient-to-br ${getMedalColor(user.position)} border-2 ${
                user.position === 1 ? 'border-yellow-400 shadow-2xl' : 'border-gray-300'
              } ${user.position === 1 ? 'md:order-2 transform md:scale-110' : ''} ${
                user.position === 2 ? 'md:order-1' : ''
              } ${user.position === 3 ? 'md:order-3' : ''}`}
            >
              <CardHeader className="text-center pb-2">
                <div className="text-5xl mb-2">{getMedalIcon(user.position)}</div>
                <CardTitle className={user.position === 1 ? 'text-white' : 'text-gray-800'}>
                  {user.name}
                </CardTitle>
                <CardDescription className={user.position === 1 ? 'text-yellow-100' : 'text-gray-600'}>
                  Nível {user.level}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className={`text-3xl font-bold ${user.position === 1 ? 'text-white' : 'text-gray-900'}`}>
                  {user.points.toLocaleString()}
                </div>
                <div className={`text-sm ${user.position === 1 ? 'text-yellow-100' : 'text-gray-600'}`}>
                  pontos
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ranking Completo */}
        <Card>
          <CardHeader>
            <CardTitle>Ranking Completo</CardTitle>
            <CardDescription>Posição de todos os moradores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rankings.map((user) => (
                <div
                  key={user.userId}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                    user.isCurrentUser
                      ? 'bg-purple-100 border-2 border-purple-400 shadow-md'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Posição */}
                    <div className="flex-shrink-0 w-12 text-center">
                      {user.position <= 3 ? (
                        <span className="text-2xl">{getMedalIcon(user.position)}</span>
                      ) : (
                        <span className="text-lg font-bold text-gray-600">#{user.position}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
                        {user.name.charAt(0)}
                      </div>
                    </div>

                    {/* Nome e Nível */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-semibold ${user.isCurrentUser ? 'text-purple-900' : 'text-gray-900'}`}>
                          {user.name}
                        </h3>
                        {user.isCurrentUser && (
                          <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">Você</span>
                        )}
                      </div>
                      <p className={`text-sm ${user.isCurrentUser ? 'text-purple-700' : 'text-gray-600'}`}>
                        Nível {user.level}
                      </p>
                    </div>

                    {/* Pontos */}
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${user.isCurrentUser ? 'text-purple-600' : 'text-gray-900'}`}>
                        {user.points.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">pontos</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dica de Engajamento */}
        <Card className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">💡 Dica</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800">
              Ganhe mais pontos participando ativamente do condomínio: leia comunicados, vote em assembleias,
              resolva demandas e faça reservas de áreas comuns!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
