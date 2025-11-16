'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Plus, MoreVertical, Clock, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  priority: 'BAIXA' | 'MEDIA' | 'ALTA';
  assignee?: {
    name: string;
    avatar?: string;
  };
  dueDate?: Date;
  tags?: string[];
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  cards: KanbanCard[];
}

const priorityColors = {
  BAIXA: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  MEDIA: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400',
  ALTA: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
};

export function KanbanBoard() {
  const [columns] = useState<KanbanColumn[]>([
    {
      id: 'nova',
      title: 'Nova',
      color: 'blue',
      cards: [
        {
          id: '1',
          title: 'Troca de lâmpadas do corredor',
          priority: 'BAIXA',
          assignee: undefined,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          tags: ['elétrica'],
        },
        {
          id: '2',
          title: 'Limpeza da caixa d\'água',
          priority: 'MEDIA',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          tags: ['manutenção'],
        },
      ],
    },
    {
      id: 'em-avaliacao',
      title: 'Em Avaliação',
      color: 'yellow',
      cards: [
        {
          id: '3',
          title: 'Conserto do elevador',
          priority: 'ALTA',
          assignee: { name: 'Pedro Costa' },
          tags: ['urgente', 'elevador'],
        },
      ],
    },
    {
      id: 'em-andamento',
      title: 'Em Andamento',
      color: 'orange',
      cards: [
        {
          id: '4',
          title: 'Vazamento no banheiro',
          description: 'Apartamento 302',
          priority: 'ALTA',
          assignee: { name: 'Carlos Santos' },
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          tags: ['hidráulica', 'urgente'],
        },
        {
          id: '5',
          title: 'Pintura do hall de entrada',
          priority: 'MEDIA',
          assignee: { name: 'João Silva' },
          tags: ['pintura'],
        },
      ],
    },
    {
      id: 'concluida',
      title: 'Concluída',
      color: 'green',
      cards: [
        {
          id: '6',
          title: 'Manutenção da piscina',
          priority: 'MEDIA',
          assignee: { name: 'Maria Silva' },
          tags: ['manutenção'],
        },
      ],
    },
  ]);

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80"
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full',
                      column.color === 'blue' && 'bg-blue-500',
                      column.color === 'yellow' && 'bg-yellow-500',
                      column.color === 'orange' && 'bg-orange-500',
                      column.color === 'green' && 'bg-green-500'
                    )}
                  />
                  <CardTitle className="text-sm font-semibold">
                    {column.title}
                  </CardTitle>
                  <Badge variant="secondary" className="ml-1">
                    {column.cards.length}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {column.cards.map((card) => (
                <div
                  key={card.id}
                  className={cn(
                    'group rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4',
                    'hover:shadow-soft hover:border-gray-300 dark:hover:border-gray-700',
                    'transition-all duration-200 cursor-pointer'
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white leading-snug">
                      {card.title}
                    </h4>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Atribuir</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {card.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                      {card.description}
                    </p>
                  )}

                  {card.tags && card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {card.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-900 px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {card.assignee ? (
                        <Avatar
                          size="sm"
                          fallback={card.assignee.name}
                          className="h-6 w-6"
                        />
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
                          <User className="h-3 w-3 text-gray-400" />
                        </div>
                      )}
                      <Badge
                        variant="secondary"
                        className={cn('text-xs', priorityColors[card.priority])}
                      >
                        {card.priority}
                      </Badge>
                    </div>
                    {card.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>{formatRelativeTime(card.dueDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
