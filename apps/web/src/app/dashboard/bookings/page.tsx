'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { BookingStats } from '@/components/bookings/booking-stats';
import { BookingList } from '@/components/bookings/booking-list';
import { BookingCalendar } from '@/components/bookings/booking-calendar';
import { BookingFiltersBar } from '@/components/bookings/booking-filters';
import { CreateBookingDialog } from '@/components/bookings/create-booking-dialog';
import { BookingDetailDrawer } from '@/components/bookings/booking-detail-drawer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Plus,
  LayoutList,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { useBookings } from '@/hooks/use-bookings';
import { useAppStore } from '@/stores/app-store';
import type { Booking, BookingFilters } from '@/types/booking';

type ViewMode = 'list' | 'calendar';

export default function BookingsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [filters, setFilters] = useState<BookingFilters>({});
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);

  const selectedCondominiumId = useAppStore((state) => state.selectedCondominiumId) || 'demo-condo-1';

  const {
    data: bookingsData,
    isLoading: bookingsLoading,
    refetch: refetchBookings,
  } = useBookings(selectedCondominiumId, filters);

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailDrawerOpen(true);
  };

  const handleFilterChange = (newFilters: BookingFilters) => {
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    refetchBookings();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Reservas
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gerencie as reservas de áreas comuns do condomínio
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center rounded-lg border bg-white dark:bg-gray-950 p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  viewMode === 'calendar'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                )}
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Calendário</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  viewMode === 'list'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                )}
              >
                <LayoutList className="h-4 w-4" />
                <span className="hidden sm:inline">Lista</span>
              </button>
            </div>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>

            {/* Create Button */}
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Reserva</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <BookingStats condominiumId={selectedCondominiumId} />

        {/* Filters */}
        <BookingFiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Content */}
        <div className="min-h-[500px]">
          {viewMode === 'calendar' ? (
            <BookingCalendar
              bookings={bookingsData?.data || []}
              isLoading={bookingsLoading}
              onBookingClick={handleBookingClick}
              onCreateClick={() => setCreateDialogOpen(true)}
            />
          ) : (
            <BookingList
              bookings={bookingsData?.data || []}
              isLoading={bookingsLoading}
              onBookingClick={handleBookingClick}
            />
          )}
        </div>
      </div>

      {/* Create Booking Dialog */}
      <CreateBookingDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        condominiumId={selectedCondominiumId}
      />

      {/* Booking Detail Drawer */}
      <BookingDetailDrawer
        booking={selectedBooking}
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        condominiumId={selectedCondominiumId}
      />
    </DashboardLayout>
  );
}
