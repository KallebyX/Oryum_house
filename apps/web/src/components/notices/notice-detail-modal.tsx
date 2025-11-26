'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatDateTime, formatRelativeTime } from '@/lib/utils';
import {
  X,
  Pin,
  Clock,
  Eye,
  Users,
  Calendar,
  CheckCircle,
  Edit,
  Trash2,
  Share2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  type Notice,
  NOTICE_AUDIENCE_LABELS,
} from '@/types/notice';
import { useConfirmNoticeRead } from '@/hooks/use-notices';

interface NoticeDetailModalProps {
  notice: Notice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  condominiumId: string;
}

export function NoticeDetailModal({
  notice,
  open,
  onOpenChange,
  condominiumId,
}: NoticeDetailModalProps) {
  const confirmRead = useConfirmNoticeRead(condominiumId, notice?.id || '');

  if (!notice) return null;

  const isExpired = notice.expiresAt && new Date(notice.expiresAt) < new Date();
  const isScheduled = notice.publishedAt && new Date(notice.publishedAt) > new Date();

  const handleConfirmRead = async () => {
    try {
      await confirmRead.mutateAsync();
    } catch (error) {
      console.error('Error confirming read:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {notice.pinned && (
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400">
                    <Pin className="h-3 w-3 mr-1" />
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
                {notice.hasRead && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Lido
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-xl">{notice.title}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {NOTICE_AUDIENCE_LABELS[notice.audience]}
              {notice.audienceFilter?.blocks && (
                <span className="text-xs">({notice.audienceFilter.blocks.join(', ')})</span>
              )}
            </span>

            {notice.readCount !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {notice.readCount} confirmações de leitura
              </span>
            )}

            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Publicado {formatRelativeTime(notice.publishedAt || notice.createdAt)}
            </span>
          </div>

          {/* Notice Content */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {notice.content}
            </p>
          </div>

          {/* Expiration Info */}
          {notice.expiresAt && (
            <div className={cn(
              'mt-6 p-4 rounded-lg',
              isExpired
                ? 'bg-gray-100 dark:bg-gray-900'
                : 'bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800'
            )}>
              <p className={cn(
                'text-sm flex items-center gap-2',
                isExpired
                  ? 'text-gray-600 dark:text-gray-400'
                  : 'text-yellow-700 dark:text-yellow-300'
              )}>
                <Clock className="h-4 w-4" />
                {isExpired
                  ? `Expirou em ${formatDateTime(notice.expiresAt)}`
                  : `Válido até ${formatDateTime(notice.expiresAt)}`
                }
              </p>
            </div>
          )}

          {/* Scheduled Info */}
          {isScheduled && notice.publishedAt && (
            <div className="mt-6 p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-700 dark:text-orange-300 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Agendado para publicação em {formatDateTime(notice.publishedAt)}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 flex items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Compartilhar
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {!notice.hasRead && !isExpired && (
              <Button
                onClick={handleConfirmRead}
                disabled={confirmRead.isPending}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Confirmar Leitura
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
