'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, TrendingUp, Award, Zap, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const userLevel = {
  current: 7,
  xp: 2450,
  nextLevelXp: 3000,
  progress: 82,
};

const achievements = [
  {
    id: 1,
    title: 'Primeira Demanda',
    description: 'Criou sua primeira demanda',
    icon: Target,
    unlocked: true,
    unlockedAt: '2024-01-15',
    rarity: 'common',
  },
  {
    id: 2,
    title: 'Resolvedor Dedicado',
    description: 'Concluiu 10 demandas',
    icon: Star,
    unlocked: true,
    unlockedAt: '2024-02-01',
    rarity: 'rare',
  },
  {
    id: 3,
    title: 'Comunicador Ativo',
    description: 'Leu 50 comunicados',
    icon: Zap,
    unlocked: true,
    unlockedAt: '2024-02-10',
    rarity: 'rare',
  },
  {
    id: 4,
    title: 'Participante Engajado',
    description: 'Votou em 5 assembleias',
    icon: Trophy,
    unlocked: true,
    unlockedAt: '2024-03-01',
    rarity: 'epic',
  },
  {
    id: 5,
    title: 'Mestre das Demandas',
    description: 'Concluiu 50 demandas',
    icon: Crown,
    unlocked: false,
    rarity: 'legendary',
  },
  {
    id: 6,
    title: 'Guardião do Condomínio',
    description: 'Relatou 20 ocorrências',
    icon: Award,
    unlocked: false,
    rarity: 'epic',
  },
];

const leaderboard = [
  { rank: 1, name: 'Carlos Santos', points: 3250, level: 9, trend: 'up' },
  { rank: 2, name: 'Maria Silva', points: 2980, level: 8, trend: 'up' },
  { rank: 3, name: 'João Silva', points: 2450, level: 7, trend: 'same', isUser: true },
  { rank: 4, name: 'Ana Costa', points: 2100, level: 7, trend: 'down' },
  { rank: 5, name: 'Pedro Lima', points: 1890, level: 6, trend: 'up' },
];

const rarityStyles = {
  common: {
    bg: 'bg-gray-100 dark:bg-gray-900',
    border: 'border-gray-300 dark:border-gray-700',
    text: 'text-gray-700 dark:text-gray-300',
    badge: 'bg-gray-500',
  },
  rare: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-300 dark:border-blue-700',
    text: 'text-blue-700 dark:text-blue-300',
    badge: 'bg-blue-500',
  },
  epic: {
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    border: 'border-purple-300 dark:border-purple-700',
    text: 'text-purple-700 dark:text-purple-300',
    badge: 'bg-purple-500',
  },
  legendary: {
    bg: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20',
    border: 'border-yellow-400 dark:border-yellow-600',
    text: 'text-yellow-700 dark:text-yellow-300',
    badge: 'bg-gradient-to-r from-yellow-500 to-orange-500',
  },
};

export default function GamificationPage() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Gamificação 🏆
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Acompanhe seu progresso e conquistas
        </p>
      </div>

      {/* Level & Progress */}
      <Card className="mb-8 overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-900">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1">
                  <div className="h-full w-full rounded-full bg-white dark:bg-gray-950 flex items-center justify-center">
                    <span className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {userLevel.current}
                    </span>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center animate-bounce-subtle">
                  <Crown className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-1">
                  Nível {userLevel.current}
                </h3>
                <p className="text-purple-700 dark:text-purple-300">
                  {userLevel.xp.toLocaleString()} / {userLevel.nextLevelXp.toLocaleString()} XP
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-700 dark:text-purple-300 mb-1">
                Faltam {(userLevel.nextLevelXp - userLevel.xp).toLocaleString()} XP
              </p>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                #{leaderboard[2].rank} no Ranking
              </Badge>
            </div>
          </div>
          <div className="relative">
            <div className="h-4 bg-purple-200/50 dark:bg-purple-900/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full transition-all duration-500 animate-shimmer bg-[length:200%_100%]"
                style={{ width: `${userLevel.progress}%` }}
              />
            </div>
            <p className="text-center mt-2 text-sm font-medium text-purple-700 dark:text-purple-300">
              {userLevel.progress}% para o próximo nível
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Achievements */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Conquistas</CardTitle>
              <CardDescription>
                {achievements.filter((a) => a.unlocked).length} de {achievements.length}{' '}
                desbloqueadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  const styles = rarityStyles[achievement.rarity];

                  return (
                    <div
                      key={achievement.id}
                      className={cn(
                        'relative rounded-lg border-2 p-4 transition-all duration-200',
                        styles.bg,
                        styles.border,
                        achievement.unlocked
                          ? 'hover:scale-105 hover:shadow-soft-lg cursor-pointer'
                          : 'opacity-50 grayscale'
                      )}
                    >
                      {achievement.unlocked && (
                        <div className="absolute -top-2 -right-2">
                          <div className={cn('h-6 w-6 rounded-full flex items-center justify-center', styles.badge)}>
                            <Star className="h-3 w-3 text-white fill-current" />
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <div className={cn('flex-shrink-0 rounded-lg p-2', achievement.unlocked ? styles.bg : 'bg-gray-100 dark:bg-gray-900')}>
                          <Icon className={cn('h-6 w-6', styles.text)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={cn('font-semibold text-sm mb-1', styles.text)}>
                            {achievement.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {achievement.description}
                          </p>
                          {achievement.unlocked && achievement.unlockedAt && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              Desbloqueado em {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ranking</CardTitle>
              <CardDescription>Top 5 moradores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={cn(
                      'flex items-center gap-3 rounded-lg p-3 transition-all',
                      entry.isUser
                        ? 'bg-blue-50 dark:bg-blue-950/20 ring-2 ring-blue-500/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm',
                        entry.rank === 1 && 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white',
                        entry.rank === 2 && 'bg-gradient-to-br from-gray-300 to-gray-400 text-white',
                        entry.rank === 3 && 'bg-gradient-to-br from-orange-400 to-orange-500 text-white',
                        entry.rank > 3 && 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400'
                      )}
                    >
                      {entry.rank}
                    </div>
                    <Avatar size="sm" fallback={entry.name} />
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm font-medium truncate', entry.isUser && 'text-blue-700 dark:text-blue-300')}>
                        {entry.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>Nível {entry.level}</span>
                        <span>•</span>
                        <span>{entry.points.toLocaleString()} XP</span>
                      </div>
                    </div>
                    <div>
                      {entry.trend === 'up' && (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      )}
                      {entry.trend === 'down' && (
                        <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
