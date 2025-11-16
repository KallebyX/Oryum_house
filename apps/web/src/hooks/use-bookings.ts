import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

/**
 * Query keys for bookings
 */
export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (condominiumId: string, filters?: any) => [...bookingKeys.lists(), condominiumId, { filters }] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
  stats: (condominiumId: string) => [...bookingKeys.all, 'stats', condominiumId] as const,
};

/**
 * Fetch all bookings with filters
 */
export function useBookings(condominiumId: string, filters?: any) {
  return useQuery({
    queryKey: bookingKeys.list(condominiumId, filters),
    queryFn: () => api.get(`/condominiums/${condominiumId}/bookings`, { params: filters }),
    enabled: !!condominiumId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Fetch a single booking by ID
 */
export function useBooking(condominiumId: string, bookingId: string) {
  return useQuery({
    queryKey: bookingKeys.detail(bookingId),
    queryFn: () => api.get(`/condominiums/${condominiumId}/bookings/${bookingId}`),
    enabled: !!condominiumId && !!bookingId,
  });
}

/**
 * Create a new booking
 */
export function useCreateBooking(condominiumId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => api.post(`/condominiums/${condominiumId}/bookings`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.stats(condominiumId) });
    },
  });
}

/**
 * Update booking
 */
export function useUpdateBooking(condominiumId: string, bookingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => api.patch(`/condominiums/${condominiumId}/bookings/${bookingId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}

/**
 * Cancel booking
 */
export function useCancelBooking(condominiumId: string, bookingId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post(`/condominiums/${condominiumId}/bookings/${bookingId}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.stats(condominiumId) });
    },
  });
}

/**
 * Check availability
 */
export function useCheckAvailability(condominiumId: string) {
  return useMutation({
    mutationFn: (data: { areaId: string; startAt: string; endAt: string }) =>
      api.post(`/condominiums/${condominiumId}/bookings/check-availability`, data),
  });
}
