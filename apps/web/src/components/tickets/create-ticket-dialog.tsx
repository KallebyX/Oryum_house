'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  X,
  Plus,
  Upload,
  Loader2,
  ChevronDown,
  Zap,
  Droplets,
  Sparkles,
  Shield,
  Building,
  Leaf,
  Waves,
  ArrowUpDown,
  MoreHorizontal,
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
import { useCreateTicket } from '@/hooks/use-tickets';
import {
  type TicketCategory,
  type TicketPriority,
  TICKET_CATEGORY_LABELS,
  TICKET_PRIORITY_LABELS,
  TICKET_PRIORITY_COLORS,
} from '@/types/ticket';

interface CreateTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  condominiumId: string;
}

const categoryIcons: Record<TicketCategory, any> = {
  ELETRICA: Zap,
  HIDRAULICA: Droplets,
  LIMPEZA: Sparkles,
  SEGURANCA: Shield,
  ESTRUTURAL: Building,
  JARDIM: Leaf,
  PISCINA: Waves,
  ELEVADOR: ArrowUpDown,
  OUTROS: MoreHorizontal,
};

const allCategories: TicketCategory[] = [
  'ELETRICA',
  'HIDRAULICA',
  'LIMPEZA',
  'SEGURANCA',
  'ESTRUTURAL',
  'JARDIM',
  'PISCINA',
  'ELEVADOR',
  'OUTROS',
];

const allPriorities: TicketPriority[] = ['BAIXA', 'MEDIA', 'ALTA'];

const priorityColorClasses: Record<string, string> = {
  green: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400',
  red: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
};

interface FormData {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  location: string;
  tags: string[];
}

export function CreateTicketDialog({
  open,
  onOpenChange,
  condominiumId,
}: CreateTicketDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: 'OUTROS',
    priority: 'MEDIA',
    location: '',
    tags: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const createTicket = useCreateTicket(condominiumId);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'OUTROS',
      priority: 'MEDIA',
      location: '',
      tags: [],
    });
    setErrors({});
    setTagInput('');
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

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Descrição deve ter pelo menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await createTicket.mutateAsync({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
        location: formData.location.trim() || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      });
      handleClose();
    } catch (error) {
      console.error('Error creating ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const CategoryIcon = categoryIcons[formData.category];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova Demanda</DialogTitle>
          <DialogDescription>
            Preencha as informações para criar uma nova demanda
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
              placeholder="Ex: Vazamento no banheiro do 3o andar"
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Descreva detalhadamente o problema ou solicitação..."
              rows={4}
              className={cn(
                'w-full rounded-lg border px-3 py-2 text-sm resize-none',
                'bg-white dark:bg-gray-950',
                'placeholder:text-gray-500 dark:placeholder:text-gray-400',
                'focus:outline-none focus:ring-1 focus:ring-blue-500',
                errors.description
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-200 dark:border-gray-800 focus:border-blue-500'
              )}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category & Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoria
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <CategoryIcon className="h-4 w-4" />
                      {TICKET_CATEGORY_LABELS[formData.category]}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {allCategories.map((category) => {
                    const Icon = categoryIcons[category];
                    return (
                      <DropdownMenuItem
                        key={category}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, category }))
                        }
                        className="gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {TICKET_CATEGORY_LABELS[category]}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prioridade
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between"
                  >
                    <Badge
                      variant="secondary"
                      className={cn(
                        'text-xs',
                        priorityColorClasses[TICKET_PRIORITY_COLORS[formData.priority]]
                      )}
                    >
                      {TICKET_PRIORITY_LABELS[formData.priority]}
                    </Badge>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  {allPriorities.map((priority) => (
                    <DropdownMenuItem
                      key={priority}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, priority }))
                      }
                      className="gap-2"
                    >
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs',
                          priorityColorClasses[TICKET_PRIORITY_COLORS[priority]]
                        )}
                      >
                        {TICKET_PRIORITY_LABELS[priority]}
                      </Badge>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Localização
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="Ex: Bloco A - Apartamento 302"
              className={cn(
                'w-full rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm',
                'bg-white dark:bg-gray-950',
                'placeholder:text-gray-500 dark:placeholder:text-gray-400',
                'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              )}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Adicionar tag..."
                className={cn(
                  'flex-1 rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm',
                  'bg-white dark:bg-gray-950',
                  'placeholder:text-gray-500 dark:placeholder:text-gray-400',
                  'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTag}
                className="px-3"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Anexos
            </label>
            <div
              className={cn(
                'flex flex-col items-center justify-center rounded-lg border-2 border-dashed',
                'border-gray-200 dark:border-gray-800 p-6',
                'hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer'
              )}
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Arraste arquivos ou clique para selecionar
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, PDF até 10MB
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Criar Demanda
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
