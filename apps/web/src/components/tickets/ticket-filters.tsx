'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  X,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  type TicketFilters,
  type TicketStatus,
  type TicketPriority,
  type TicketCategory,
  TICKET_STATUS_LABELS,
  TICKET_PRIORITY_LABELS,
  TICKET_CATEGORY_LABELS,
} from '@/types/ticket';

interface TicketFiltersBarProps {
  filters: TicketFilters;
  onFilterChange: (filters: TicketFilters) => void;
}

const ALL_STATUSES: TicketStatus[] = [
  'NOVA',
  'EM_AVALIACAO',
  'EM_ANDAMENTO',
  'AGUARDANDO_MORADOR',
  'CONCLUIDA',
  'CANCELADA',
];

const ALL_PRIORITIES: TicketPriority[] = ['BAIXA', 'MEDIA', 'ALTA'];

const ALL_CATEGORIES: TicketCategory[] = [
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

export function TicketFiltersBar({ filters, onFilterChange }: TicketFiltersBarProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');

  const selectedStatuses = Array.isArray(filters.status)
    ? filters.status
    : filters.status
    ? [filters.status]
    : [];

  const selectedPriorities = Array.isArray(filters.priority)
    ? filters.priority
    : filters.priority
    ? [filters.priority]
    : [];

  const selectedCategories = Array.isArray(filters.category)
    ? filters.category
    : filters.category
    ? [filters.category]
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, search: searchValue });
  };

  const handleStatusChange = (status: TicketStatus, checked: boolean) => {
    const newStatuses = checked
      ? [...selectedStatuses, status]
      : selectedStatuses.filter((s) => s !== status);
    onFilterChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const handlePriorityChange = (priority: TicketPriority, checked: boolean) => {
    const newPriorities = checked
      ? [...selectedPriorities, priority]
      : selectedPriorities.filter((p) => p !== priority);
    onFilterChange({
      ...filters,
      priority: newPriorities.length > 0 ? newPriorities : undefined,
    });
  };

  const handleCategoryChange = (category: TicketCategory, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter((c) => c !== category);
    onFilterChange({
      ...filters,
      category: newCategories.length > 0 ? newCategories : undefined,
    });
  };

  const clearFilters = () => {
    setSearchValue('');
    onFilterChange({});
  };

  const activeFilterCount =
    selectedStatuses.length +
    selectedPriorities.length +
    selectedCategories.length +
    (filters.search ? 1 : 0);

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-white dark:bg-gray-950 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar demandas..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={cn(
                'h-10 w-full rounded-lg border border-gray-200 dark:border-gray-800',
                'bg-gray-50 dark:bg-gray-900 pl-10 pr-4 text-sm',
                'placeholder:text-gray-500 dark:placeholder:text-gray-400',
                'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              )}
            />
          </div>
        </form>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Status
                {selectedStatuses.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {selectedStatuses.length}
                  </Badge>
                )}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {ALL_STATUSES.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={(checked) => handleStatusChange(status, checked)}
                >
                  {TICKET_STATUS_LABELS[status]}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Priority Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                Prioridade
                {selectedPriorities.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {selectedPriorities.length}
                  </Badge>
                )}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {ALL_PRIORITIES.map((priority) => (
                <DropdownMenuCheckboxItem
                  key={priority}
                  checked={selectedPriorities.includes(priority)}
                  onCheckedChange={(checked) => handlePriorityChange(priority, checked)}
                >
                  {TICKET_PRIORITY_LABELS[priority]}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                Categoria
                {selectedCategories.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {selectedCategories.length}
                  </Badge>
                )}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {ALL_CATEGORIES.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                >
                  {TICKET_CATEGORY_LABELS[category]}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
              Limpar ({activeFilterCount})
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Busca: {filters.search}
              <button
                onClick={() => {
                  setSearchValue('');
                  onFilterChange({ ...filters, search: undefined });
                }}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedStatuses.map((status) => (
            <Badge key={status} variant="secondary" className="gap-1">
              {TICKET_STATUS_LABELS[status]}
              <button
                onClick={() => handleStatusChange(status, false)}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedPriorities.map((priority) => (
            <Badge key={priority} variant="secondary" className="gap-1">
              {TICKET_PRIORITY_LABELS[priority]}
              <button
                onClick={() => handlePriorityChange(priority, false)}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedCategories.map((category) => (
            <Badge key={category} variant="secondary" className="gap-1">
              {TICKET_CATEGORY_LABELS[category]}
              <button
                onClick={() => handleCategoryChange(category, false)}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
