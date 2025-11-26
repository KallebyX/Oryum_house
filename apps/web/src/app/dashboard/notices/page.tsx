'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { NoticeStats } from '@/components/notices/notice-stats';
import { NoticeList } from '@/components/notices/notice-list';
import { NoticeFiltersBar } from '@/components/notices/notice-filters';
import { CreateNoticeDialog } from '@/components/notices/create-notice-dialog';
import { NoticeDetailModal } from '@/components/notices/notice-detail-modal';
import { Button } from '@/components/ui/button';
import {
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useNotices } from '@/hooks/use-notices';
import { useAppStore } from '@/stores/app-store';
import type { Notice, NoticeFilters } from '@/types/notice';

export default function NoticesPage() {
  const [filters, setFilters] = useState<NoticeFilters>({});
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const selectedCondominiumId = useAppStore((state) => state.selectedCondominiumId) || 'demo-condo-1';

  const {
    data: noticesData,
    isLoading: noticesLoading,
    refetch: refetchNotices,
  } = useNotices(selectedCondominiumId, filters);

  const handleNoticeClick = (notice: Notice) => {
    setSelectedNotice(notice);
    setDetailModalOpen(true);
  };

  const handleFilterChange = (newFilters: NoticeFilters) => {
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    refetchNotices();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Comunicados
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gerencie os comunicados e avisos do condomínio
            </p>
          </div>

          <div className="flex items-center gap-3">
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
              <span>Novo Comunicado</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <NoticeStats condominiumId={selectedCondominiumId} />

        {/* Filters */}
        <NoticeFiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Content */}
        <NoticeList
          notices={noticesData?.data || []}
          isLoading={noticesLoading}
          onNoticeClick={handleNoticeClick}
        />
      </div>

      {/* Create Notice Dialog */}
      <CreateNoticeDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        condominiumId={selectedCondominiumId}
      />

      {/* Notice Detail Modal */}
      <NoticeDetailModal
        notice={selectedNotice}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        condominiumId={selectedCondominiumId}
      />
    </DashboardLayout>
  );
}
