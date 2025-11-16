import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

/**
 * Query keys for tickets
 */
export const ticketKeys = {
  all: ['tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (filters: any) => [...ticketKeys.lists(), { filters }] as const,
  details: () => [...ticketKeys.all, 'detail'] as const,
  detail: (id: string) => [...ticketKeys.details(), id] as const,
  kanban: (condominiumId: string) => [...ticketKeys.all, 'kanban', condominiumId] as const,
  stats: (condominiumId: string) => [...ticketKeys.all, 'stats', condominiumId] as const,
};

/**
 * Fetch all tickets with filters
 */
export function useTickets(condominiumId: string, filters?: any) {
  return useQuery({
    queryKey: ticketKeys.list(filters),
    queryFn: () => api.get(`/condominiums/${condominiumId}/tickets`, { params: filters }),
    enabled: !!condominiumId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Fetch a single ticket by ID
 */
export function useTicket(condominiumId: string, ticketId: string) {
  return useQuery({
    queryKey: ticketKeys.detail(ticketId),
    queryFn: () => api.get(`/condominiums/${condominiumId}/tickets/${ticketId}`),
    enabled: !!condominiumId && !!ticketId,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Fetch Kanban view
 */
export function useTicketKanban(condominiumId: string) {
  return useQuery({
    queryKey: ticketKeys.kanban(condominiumId),
    queryFn: () => api.get(`/condominiums/${condominiumId}/tickets/kanban`),
    enabled: !!condominiumId,
    staleTime: 10 * 1000, // 10 seconds - more frequent updates for kanban
    refetchInterval: 30 * 1000, // Auto-refetch every 30 seconds
  });
}

/**
 * Fetch ticket statistics
 */
export function useTicketStats(condominiumId: string) {
  return useQuery({
    queryKey: ticketKeys.stats(condominiumId),
    queryFn: () => api.get(`/condominiums/${condominiumId}/tickets/stats`),
    enabled: !!condominiumId,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Create a new ticket
 */
export function useCreateTicket(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => api.post(`/condominiums/${condominiumId}/tickets`, data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.kanban(condominiumId) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.stats(condominiumId) });
    },
  });
}

/**
 * Update a ticket
 */
export function useUpdateTicket(condominiumId: string, ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => api.patch(`/condominiums/${condominiumId}/tickets/${ticketId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.kanban(condominiumId) });
    },
  });
}

/**
 * Update ticket status
 */
export function useUpdateTicketStatus(condominiumId: string, ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { status: string; note?: string }) =>
      api.patch(`/condominiums/${condominiumId}/tickets/${ticketId}/status`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.kanban(condominiumId) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.stats(condominiumId) });
    },
  });
}

/**
 * Add comment to ticket
 */
export function useAddTicketComment(condominiumId: string, ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { message: string; mentions?: string[]; attachments?: string[] }) =>
      api.post(`/condominiums/${condominiumId}/tickets/${ticketId}/comments`, data),
    onSuccess: () => {
      // Invalidate ticket detail to show new comment
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
    },
  });
}
