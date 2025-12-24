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
import { ViewToggle } from '@/components/ui/tabs';
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

  const viewToggleOptions = [
    { value: 'list', label: 'Lista', icon: <LayoutList className="h-4 w-4" /> },
    { value: 'kanban', label: 'Kanban', icon: <LayoutGrid className="h-4 w-4" /> },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Demandas
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie as demandas e solicitacoes do condominio
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
