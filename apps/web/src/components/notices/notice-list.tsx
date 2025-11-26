'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { cn, formatDate, formatRelativeTime } from '@/lib/utils';
import {
  Megaphone,
  Pin,
  Clock,
  Eye,
  Users,
  Calendar,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import {
  type Notice,
  NOTICE_AUDIENCE_LABELS,
} from '@/types/notice';

interface NoticeListProps {
  notices: Notice[];
  isLoading?: boolean;
  onNoticeClick: (notice: Notice) => void;
}

// Demo data
const demoNotices: Notice[] = [
  {
    id: '1',
    condominiumId: 'demo-condo-1',
    title: 'Manutenção Programada do Elevador',
    content: 'Informamos que no dia 15/12 será realizada manutenção preventiva no elevador social. O serviço está previsto para das 8h às 12h. Durante este período, apenas o elevador de serviço estará disponível.',
    audience: 'ALL',
    pinned: true,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readCount: 45,
    hasRead: true,
  },
  {
    id: '2',
    condominiumId: 'demo-condo-1',
    title: 'Assembleia Geral Ordinária',
    content: 'Convidamos todos os condôminos para a Assembleia Geral Ordinária que será realizada no dia 20/12 às 19h no salão de festas. Pauta: Prestação de contas 2024 e eleição do conselho fiscal.',
    audience: 'ALL',
    pinned: true,
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    readCount: 32,
    hasRead: false,
  },
  {
    id: '3',
    condominiumId: 'demo-condo-1',
    title: 'Horário de Funcionamento - Festas de Fim de Ano',
    content: 'Durante o período de festas (24/12 a 01/01), a portaria funcionará em regime especial. Visitantes devem ser previamente cadastrados.',
    audience: 'ALL',
    pinned: false,
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    readCount: 28,
    hasRead: true,
  },
  {
    id: '4',
    condominiumId: 'demo-condo-1',
    title: 'Limpeza da Caixa d\'Água - Bloco B',
    content: 'Informamos aos moradores do Bloco B que a limpeza da caixa d\'água será realizada no dia 18/12. O abastecimento será interrompido das 8h às 14h.',
    audience: 'BLOCK',
    audienceFilter: { blocks: ['B'] },
    pinned: false,
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    readCount: 12,
    hasRead: false,
  },
  {
    id: '5',
    condominiumId: 'demo-condo-1',
    title: 'Novo Sistema de Encomendas',
    content: 'A partir de janeiro, todas as encomendas serão registradas no novo sistema digital. Os moradores receberão notificação via app quando houver entregas.',
    audience: 'ALL',
    pinned: false,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    readCount: 52,
    hasRead: true,
  },
];

function NoticeListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="p-5">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function NoticeList({ notices, isLoading, onNoticeClick }: NoticeListProps) {
  if (isLoading) {
    return <NoticeListSkeleton />;
  }

  const displayNotices = notices.length > 0 ? notices : demoNotices;

  // Sort: pinned first, then by date
  const sortedNotices = [...displayNotices].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
  });

  if (sortedNotices.length === 0) {
    return (
      <Card className="p-8">
        <EmptyState
          icon={Megaphone}
          title="Nenhum comunicado encontrado"
          description="Não há comunicados que correspondam aos filtros selecionados."
          action={{
            label: 'Criar novo comunicado',
            onClick: () => {},
          }}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedNotices.map((notice) => {
        const isExpired = notice.expiresAt && new Date(notice.expiresAt) < new Date();
        const isScheduled = notice.publishedAt && new Date(notice.publishedAt) > new Date();

        return (
          <Card
            key={notice.id}
            className={cn(
              'group cursor-pointer p-5 transition-all duration-200',
              'hover:shadow-soft hover:border-gray-300 dark:hover:border-gray-700',
              notice.pinned && 'border-l-4 border-l-purple-500 bg-purple-50/30 dark:bg-purple-950/10',
              isExpired && 'opacity-60',
              !notice.hasRead && !isExpired && 'bg-blue-50/50 dark:bg-blue-950/10'
            )}
            onClick={() => onNoticeClick(notice)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-start gap-3 mb-2">
                  {notice.pinned && (
                    <Pin className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {notice.title}
                    </h3>
                  </div>
                </div>

                {/* Content Preview */}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 ml-7">
                  {notice.content}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 ml-7">
                  {/* Status Badges */}
                  {notice.pinned && (
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400">
                      Fixado
                    </Badge>
                  )}
                  {isScheduled && (
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      Agendado
                    </Badge>
                  )}
                  {isExpired && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      Expirado
                    </Badge>
                  )}
                  {notice.hasRead && !isExpired && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Lido
                    </Badge>
                  )}

                  {/* Audience */}
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {NOTICE_AUDIENCE_LABELS[notice.audience]}
                    {notice.audienceFilter?.blocks && (
                      <span>({notice.audienceFilter.blocks.join(', ')})</span>
                    )}
                  </span>

                  {/* Read Count */}
                  {notice.readCount !== undefined && (
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {notice.readCount} leituras
                    </span>
                  )}

                  {/* Date */}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(notice.publishedAt || notice.createdAt)}
                  </span>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 flex-shrink-0 transition-colors mt-1" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
