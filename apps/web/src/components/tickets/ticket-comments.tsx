'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Send, Paperclip, MessageSquare } from 'lucide-react';
import { useAddTicketComment } from '@/hooks/use-tickets';
import type { TicketComment } from '@/types/ticket';

interface TicketCommentsProps {
  ticketId: string;
  condominiumId: string;
  comments?: TicketComment[];
}

// Demo comments
const demoComments: TicketComment[] = [
  {
    id: '1',
    ticketId: 'demo',
    userId: 'user-1',
    user: { id: 'user-1', name: 'Carlos Santos', email: 'carlos@email.com' },
    message: 'Orçamento solicitado ao fornecedor. Aguardando retorno em até 48h.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    ticketId: 'demo',
    userId: 'user-2',
    user: { id: 'user-2', name: 'Maria Silva', email: 'maria@email.com' },
    message: 'Obrigada pelo retorno! Fico no aguardo.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    ticketId: 'demo',
    userId: 'user-1',
    user: { id: 'user-1', name: 'Carlos Santos', email: 'carlos@email.com' },
    message: 'Orçamento aprovado. Serviço agendado para amanhã às 14h. Por favor, aguarde em casa ou deixe a chave com o porteiro.',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

export function TicketComments({
  ticketId,
  condominiumId,
  comments,
}: TicketCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addComment = useAddTicketComment(condominiumId, ticketId);

  const displayComments = comments && comments.length > 0 ? comments : demoComments;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment.mutateAsync({ message: newComment.trim() });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Comments List */}
      <div className="flex-1 space-y-4">
        {displayComments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nenhum comentário ainda
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Seja o primeiro a comentar
            </p>
          </div>
        ) : (
          displayComments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar
                fallback={comment.user?.name || 'U'}
                className="h-8 w-8 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {comment.user?.name || 'Usuário'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                </div>
                <div className="rounded-lg bg-gray-100 dark:bg-gray-900 p-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {comment.message}
                  </p>
                </div>
                {comment.attachments && comment.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {comment.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2 py-1 rounded bg-gray-100 dark:bg-gray-900 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Paperclip className="h-3 w-3" />
                        {attachment.fileName}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex gap-3">
          <Avatar
            fallback="EU"
            className="h-8 w-8 flex-shrink-0"
          />
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicionar um comentário..."
                rows={2}
                className={cn(
                  'w-full rounded-lg border border-gray-200 dark:border-gray-800',
                  'bg-gray-50 dark:bg-gray-900 p-3 pr-12 text-sm resize-none',
                  'placeholder:text-gray-500 dark:placeholder:text-gray-400',
                  'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                )}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Anexar arquivo"
                >
                  <Paperclip className="h-4 w-4 text-gray-400" />
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newComment.trim() || isSubmitting}
                  className="h-8 w-8 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Use @nome para mencionar alguém
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
