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
import { ViewToggle } from '@/components/ui/tabs';
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

  const viewToggleOptions = [
    { value: 'calendar', label: 'Calendario', icon: <Calendar className="h-4 w-4" /> },
    { value: 'list', label: 'Lista', icon: <LayoutList className="h-4 w-4" /> },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Reservas
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie as reservas de areas comuns do condominio
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <ViewToggle
              value={viewMode}
              onValueChange={(value) => setViewMode(value as ViewMode)}
              options={viewToggleOptions}
            />

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="gap-2 shadow-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>

            {/* Create Button */}
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="gap-2 shadow-sm"
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
