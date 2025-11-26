'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Loader2,
  ChevronDown,
  Calendar,
  Pin,
  Users,
  Building,
  Home,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCreateNotice } from '@/hooks/use-notices';
import {
  type NoticeAudience,
  NOTICE_AUDIENCE_LABELS,
  NOTICE_AUDIENCE_DESCRIPTIONS,
} from '@/types/notice';

interface CreateNoticeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  condominiumId: string;
}

const audienceIcons: Record<NoticeAudience, any> = {
  ALL: Users,
  BLOCK: Building,
  UNIT: Home,
};

interface FormData {
  title: string;
  content: string;
  audience: NoticeAudience;
  pinned: boolean;
  publishNow: boolean;
  publishedAt: string;
  expiresAt: string;
}

export function CreateNoticeDialog({
  open,
  onOpenChange,
  condominiumId,
}: CreateNoticeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    audience: 'ALL',
    pinned: false,
    publishNow: true,
    publishedAt: '',
    expiresAt: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const createNotice = useCreateNotice(condominiumId);

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      audience: 'ALL',
      pinned: false,
      publishNow: true,
      publishedAt: '',
      expiresAt: '',
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Título deve ter pelo menos 5 caracteres';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Conteúdo é obrigatório';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Conteúdo deve ter pelo menos 10 caracteres';
    }

    if (!formData.publishNow && !formData.publishedAt) {
      newErrors.publishedAt = 'Data de publicação é obrigatória para agendamento';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await createNotice.mutateAsync({
        title: formData.title.trim(),
        content: formData.content.trim(),
        audience: formData.audience,
        pinned: formData.pinned,
        publishedAt: formData.publishNow
          ? new Date().toISOString()
          : new Date(formData.publishedAt).toISOString(),
        expiresAt: formData.expiresAt
          ? new Date(formData.expiresAt).toISOString()
          : undefined,
      });
      handleClose();
    } catch (error) {
      console.error('Error creating notice:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const AudienceIcon = audienceIcons[formData.audience];

  // Get min dates
  const now = new Date();
  const minPublishDate = now.toISOString().slice(0, 16);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Comunicado</DialogTitle>
          <DialogDescription>
            Crie um novo comunicado para os moradores do condomínio
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Ex: Manutenção Programada do Elevador"
              className={cn(
                'w-full rounded-lg border px-3 py-2 text-sm',
                'bg-white dark:bg-gray-950',
                'placeholder:text-gray-500 dark:placeholder:text-gray-400',
                'focus:outline-none focus:ring-1 focus:ring-blue-500',
                errors.title
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-200 dark:border-gray-800 focus:border-blue-500'
              )}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Conteúdo *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="Digite o conteúdo do comunicado..."
              rows={5}
              className={cn(
                'w-full rounded-lg border px-3 py-2 text-sm resize-none',
                'bg-white dark:bg-gray-950',
                'placeholder:text-gray-500 dark:placeholder:text-gray-400',
                'focus:outline-none focus:ring-1 focus:ring-blue-500',
                errors.content
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-200 dark:border-gray-800 focus:border-blue-500'
              )}
            />
            {errors.content && (
              <p className="text-xs text-red-500 mt-1">{errors.content}</p>
            )}
          </div>

          {/* Audience & Pinned Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Audiência
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <AudienceIcon className="h-4 w-4" />
                      {NOTICE_AUDIENCE_LABELS[formData.audience]}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {(['ALL', 'BLOCK', 'UNIT'] as NoticeAudience[]).map((audience) => {
                    const Icon = audienceIcons[audience];
                    return (
                      <DropdownMenuItem
                        key={audience}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, audience }))
                        }
                        className="flex flex-col items-start py-2"
                      >
                        <span className="flex items-center gap-2 font-medium">
                          <Icon className="h-4 w-4" />
                          {NOTICE_AUDIENCE_LABELS[audience]}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">
                          {NOTICE_AUDIENCE_DESCRIPTIONS[audience]}
                        </span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Pinned Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fixar no topo
              </label>
              <Button
                type="button"
                variant={formData.pinned ? 'default' : 'outline'}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, pinned: !prev.pinned }))
                }
                className="w-full gap-2"
              >
                <Pin className={cn('h-4 w-4', formData.pinned && 'fill-current')} />
                {formData.pinned ? 'Fixado' : 'Não fixado'}
              </Button>
            </div>
          </div>

          {/* Publish Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Publicação
            </label>
            <div className="flex gap-2 mb-3">
              <Button
                type="button"
                variant={formData.publishNow ? 'default' : 'outline'}
                size="sm"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, publishNow: true }))
                }
              >
                Publicar agora
              </Button>
              <Button
                type="button"
                variant={!formData.publishNow ? 'default' : 'outline'}
                size="sm"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, publishNow: false }))
                }
              >
                Agendar
              </Button>
            </div>

            {!formData.publishNow && (
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="datetime-local"
                  value={formData.publishedAt}
                  min={minPublishDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, publishedAt: e.target.value }))
                  }
                  className={cn(
                    'w-full rounded-lg border px-3 py-2 pl-10 text-sm',
                    'bg-white dark:bg-gray-950',
                    'focus:outline-none focus:ring-1 focus:ring-blue-500',
                    errors.publishedAt
                      ? 'border-red-500'
                      : 'border-gray-200 dark:border-gray-800 focus:border-blue-500'
                  )}
                />
                {errors.publishedAt && (
                  <p className="text-xs text-red-500 mt-1">{errors.publishedAt}</p>
                )}
              </div>
            )}
          </div>

          {/* Expiration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data de expiração (opcional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="datetime-local"
                value={formData.expiresAt}
                min={minPublishDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, expiresAt: e.target.value }))
                }
                className={cn(
                  'w-full rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2 pl-10 text-sm',
                  'bg-white dark:bg-gray-950',
                  'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                )}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Deixe em branco para comunicado sem prazo de expiração
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {formData.publishNow ? 'Publicar' : 'Agendar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
