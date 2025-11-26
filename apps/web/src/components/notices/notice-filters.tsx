'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Search,
  X,
  Pin,
  Eye,
  EyeOff,
} from 'lucide-react';
import { type NoticeFilters } from '@/types/notice';

interface NoticeFiltersBarProps {
  filters: NoticeFilters;
  onFilterChange: (filters: NoticeFilters) => void;
}

export function NoticeFiltersBar({ filters, onFilterChange }: NoticeFiltersBarProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, search: searchValue || undefined });
  };

  const togglePinnedOnly = () => {
    onFilterChange({
      ...filters,
      pinnedOnly: !filters.pinnedOnly,
    });
  };

  const togglePublishedOnly = () => {
    onFilterChange({
      ...filters,
      publishedOnly: !filters.publishedOnly,
    });
  };

  const toggleIncludeExpired = () => {
    onFilterChange({
      ...filters,
      includeExpired: !filters.includeExpired,
    });
  };

  const clearFilters = () => {
    setSearchValue('');
    onFilterChange({});
  };

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    (filters.pinnedOnly ? 1 : 0) +
    (filters.publishedOnly ? 1 : 0) +
    (filters.includeExpired ? 1 : 0);

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-white dark:bg-gray-950 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar comunicados..."
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

        {/* Filter Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={filters.pinnedOnly ? 'default' : 'outline'}
            size="sm"
            onClick={togglePinnedOnly}
            className="gap-2"
          >
            <Pin className="h-4 w-4" />
            Fixados
          </Button>

          <Button
            variant={filters.publishedOnly ? 'default' : 'outline'}
            size="sm"
            onClick={togglePublishedOnly}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Publicados
          </Button>

          <Button
            variant={filters.includeExpired ? 'default' : 'outline'}
            size="sm"
            onClick={toggleIncludeExpired}
            className="gap-2"
          >
            <EyeOff className="h-4 w-4" />
            Incluir Expirados
          </Button>

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
          {filters.pinnedOnly && (
            <Badge variant="secondary" className="gap-1">
              Apenas Fixados
              <button
                onClick={togglePinnedOnly}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.publishedOnly && (
            <Badge variant="secondary" className="gap-1">
              Apenas Publicados
              <button
                onClick={togglePublishedOnly}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.includeExpired && (
            <Badge variant="secondary" className="gap-1">
              Incluindo Expirados
              <button
                onClick={toggleIncludeExpired}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
