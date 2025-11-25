'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { TicketStats } from '@/components/tickets/ticket-stats';
import { TicketList } from '@/components/tickets/ticket-list';
import { TicketKanban } from '@/components/tickets/ticket-kanban';
import { TicketFiltersBar } from '@/components/tickets/ticket-filters';
import { CreateTicketDialog } from '@/components/tickets/create-ticket-dialog';
import { TicketDetailDrawer } from '@/components/tickets/ticket-detail-drawer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Plus,
  LayoutList,
  LayoutGrid,
  RefreshCw,
} from 'lucide-react';
import { useTickets, useTicketStats } from '@/hooks/use-tickets';
import { useAppStore } from '@/stores/app-store';
import type { Ticket, TicketFilters } from '@/types/ticket';

type ViewMode = 'list' | 'kanban';

export default function TicketsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filters, setFilters] = useState<TicketFilters>({});
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);

  // For demo purposes, using a fixed condominium ID
  const selectedCondominiumId = useAppStore((state) => state.selectedCondominiumId) || 'demo-condo-1';

  const {
    data: ticketsData,
    isLoading: ticketsLoading,
    refetch: refetchTickets,
  } = useTickets(selectedCondominiumId, filters);

  const {
    data: statsData,
    isLoading: statsLoading,
  } = useTicketStats(selectedCondominiumId);

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDetailDrawerOpen(true);
  };

  const handleFilterChange = (newFilters: TicketFilters) => {
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    refetchTickets();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Demandas
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gerencie as demandas e solicitações do condomínio
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center rounded-lg border bg-white dark:bg-gray-950 p-1">
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
              <button
                onClick={() => setViewMode('kanban')}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  viewMode === 'kanban'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Kanban</span>
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
              <span>Nova Demanda</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <TicketStats stats={statsData} isLoading={statsLoading} />

        {/* Filters */}
        <TicketFiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Content */}
        <div className="min-h-[400px]">
          {viewMode === 'list' ? (
            <TicketList
              tickets={ticketsData?.data || []}
              isLoading={ticketsLoading}
              onTicketClick={handleTicketClick}
            />
          ) : (
            <TicketKanban
              condominiumId={selectedCondominiumId}
              onTicketClick={handleTicketClick}
            />
          )}
        </div>
      </div>

      {/* Create Ticket Dialog */}
      <CreateTicketDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        condominiumId={selectedCondominiumId}
      />

      {/* Ticket Detail Drawer */}
      <TicketDetailDrawer
        ticket={selectedTicket}
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        condominiumId={selectedCondominiumId}
      />
    </DashboardLayout>
  );
}
