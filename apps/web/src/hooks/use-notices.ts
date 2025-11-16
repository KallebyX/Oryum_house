import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

/**
 * Query keys for notices
 */
export const noticeKeys = {
  all: ['notices'] as const,
  lists: () => [...noticeKeys.all, 'list'] as const,
  list: (condominiumId: string, filters?: any) => [...noticeKeys.lists(), condominiumId, { filters }] as const,
  details: () => [...noticeKeys.all, 'detail'] as const,
  detail: (id: string) => [...noticeKeys.details(), id] as const,
  stats: (condominiumId: string) => [...noticeKeys.all, 'stats', condominiumId] as const,
};

/**
 * Fetch all notices with filters
 */
export function useNotices(condominiumId: string, filters?: any) {
  return useQuery({
    queryKey: noticeKeys.list(condominiumId, filters),
    queryFn: () => api.get(`/condominiums/${condominiumId}/notices`, { params: filters }),
    enabled: !!condominiumId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch a single notice by ID
 */
export function useNotice(condominiumId: string, noticeId: string) {
  return useQuery({
    queryKey: noticeKeys.detail(noticeId),
    queryFn: () => api.get(`/condominiums/${condominiumId}/notices/${noticeId}`),
    enabled: !!condominiumId && !!noticeId,
  });
}

/**
 * Create a new notice
 */
export function useCreateNotice(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => api.post(`/condominiums/${condominiumId}/notices`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: noticeKeys.stats(condominiumId) });
    },
  });
}

/**
 * Confirm notice read
 */
export function useConfirmNoticeRead(condominiumId: string, noticeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post(`/condominiums/${condominiumId}/notices/${noticeId}/confirm-read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.detail(noticeId) });
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
    },
  });
}
