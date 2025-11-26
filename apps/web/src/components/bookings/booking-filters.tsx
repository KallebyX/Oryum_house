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
  CalendarIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  type BookingFilters,
  type BookingStatus,
  BOOKING_STATUS_LABELS,
  DEMO_AREAS,
} from '@/types/booking';

interface BookingFiltersBarProps {
  filters: BookingFilters;
  onFilterChange: (filters: BookingFilters) => void;
}

const ALL_STATUSES: BookingStatus[] = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELED'];

export function BookingFiltersBar({ filters, onFilterChange }: BookingFiltersBarProps) {
  const [dateRange, setDateRange] = useState({
    start: filters.startDate || '',
    end: filters.endDate || '',
  });

  const selectedStatuses = Array.isArray(filters.status)
    ? filters.status
    : filters.status
    ? [filters.status]
    : [];

  const handleStatusChange = (status: BookingStatus, checked: boolean) => {
    const newStatuses = checked
      ? [...selectedStatuses, status]
      : selectedStatuses.filter((s) => s !== status);
    onFilterChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const handleAreaChange = (areaId: string) => {
    onFilterChange({
      ...filters,
      areaId: filters.areaId === areaId ? undefined : areaId,
    });
  };

  const handleMyBookingsChange = () => {
    onFilterChange({
      ...filters,
      myBookings: !filters.myBookings,
    });
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const newDateRange = { ...dateRange, [type]: value };
    setDateRange(newDateRange);
    onFilterChange({
      ...filters,
      startDate: newDateRange.start || undefined,
      endDate: newDateRange.end || undefined,
    });
  };

  const clearFilters = () => {
    setDateRange({ start: '', end: '' });
    onFilterChange({});
  };

  const activeFilterCount =
    selectedStatuses.length +
    (filters.areaId ? 1 : 0) +
    (filters.myBookings ? 1 : 0) +
    (filters.startDate ? 1 : 0) +
    (filters.endDate ? 1 : 0);

  const selectedArea = DEMO_AREAS.find((a) => a.id === filters.areaId);

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-white dark:bg-gray-950 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Date Range */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => handleDateChange('start', e.target.value)}
              className={cn(
                'h-10 rounded-lg border border-gray-200 dark:border-gray-800',
                'bg-gray-50 dark:bg-gray-900 pl-10 pr-3 text-sm',
                'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              )}
            />
          </div>
          <span className="text-gray-400">até</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => handleDateChange('end', e.target.value)}
            className={cn(
              'h-10 rounded-lg border border-gray-200 dark:border-gray-800',
              'bg-gray-50 dark:bg-gray-900 px-3 text-sm',
              'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
            )}
          />
        </div>

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
                  {BOOKING_STATUS_LABELS[status]}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Area Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                Área
                {selectedArea && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedArea.name}
                  </Badge>
                )}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {DEMO_AREAS.map((area) => (
                <DropdownMenuCheckboxItem
                  key={area.id}
                  checked={filters.areaId === area.id}
                  onCheckedChange={() => handleAreaChange(area.id)}
                >
                  {area.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* My Bookings Toggle */}
          <Button
            variant={filters.myBookings ? 'default' : 'outline'}
            size="sm"
            onClick={handleMyBookingsChange}
          >
            Minhas Reservas
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
          {filters.startDate && (
            <Badge variant="secondary" className="gap-1">
              De: {new Date(filters.startDate).toLocaleDateString('pt-BR')}
              <button
                onClick={() => handleDateChange('start', '')}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.endDate && (
            <Badge variant="secondary" className="gap-1">
              Até: {new Date(filters.endDate).toLocaleDateString('pt-BR')}
              <button
                onClick={() => handleDateChange('end', '')}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedStatuses.map((status) => (
            <Badge key={status} variant="secondary" className="gap-1">
              {BOOKING_STATUS_LABELS[status]}
              <button
                onClick={() => handleStatusChange(status, false)}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedArea && (
            <Badge variant="secondary" className="gap-1">
              {selectedArea.name}
              <button
                onClick={() => handleAreaChange(selectedArea.id)}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.myBookings && (
            <Badge variant="secondary" className="gap-1">
              Minhas Reservas
              <button
                onClick={handleMyBookingsChange}
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
