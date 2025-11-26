/**
 * Booking Types and Interfaces
 */

export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';

export interface BookingUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface BookingUnit {
  id: string;
  block: string;
  number: string;
}

export interface BookingArea {
  id: string;
  name: string;
  description?: string;
  rules?: string;
  capacity?: number;
  requiresApproval: boolean;
  feePlaceholder?: number;
  isActive: boolean;
}

export interface Booking {
  id: string;
  condominiumId: string;
  areaId: string;
  area?: BookingArea;
  unitId: string;
  unit?: BookingUnit;
  requestedById: string;
  requestedBy?: BookingUser;
  startAt: string;
  endAt: string;
  status: BookingStatus;
  notes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  canceled: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
  byArea: Record<string, number>;
}

export interface BookingFilters {
  status?: BookingStatus | BookingStatus[];
  areaId?: string;
  unitId?: string;
  startDate?: string;
  endDate?: string;
  myBookings?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateBookingData {
  areaId: string;
  unitId: string;
  startAt: string;
  endAt: string;
  notes?: string;
}

export interface UpdateBookingData {
  startAt?: string;
  endAt?: string;
  notes?: string;
}

export interface ApproveRejectBookingData {
  status: 'APPROVED' | 'REJECTED';
  reason?: string;
}

export interface CheckAvailabilityData {
  areaId: string;
  startAt: string;
  endAt: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  bookingId?: string;
}

// UI Helper constants
export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovada',
  REJECTED: 'Rejeitada',
  CANCELED: 'Cancelada',
};

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING: 'yellow',
  APPROVED: 'green',
  REJECTED: 'red',
  CANCELED: 'gray',
};

// Common areas for demo
export const DEMO_AREAS: BookingArea[] = [
  {
    id: 'area-1',
    name: 'Salão de Festas',
    description: 'Salão para eventos e festas',
    rules: 'Máximo 50 pessoas. Horário até 22h.',
    capacity: 50,
    requiresApproval: true,
    feePlaceholder: 200,
    isActive: true,
  },
  {
    id: 'area-2',
    name: 'Churrasqueira',
    description: 'Área de churrasco coberta',
    rules: 'Máximo 20 pessoas. Limpar após uso.',
    capacity: 20,
    requiresApproval: false,
    feePlaceholder: 100,
    isActive: true,
  },
  {
    id: 'area-3',
    name: 'Quadra Esportiva',
    description: 'Quadra poliesportiva',
    rules: 'Reserva por período de 1h.',
    capacity: 10,
    requiresApproval: false,
    isActive: true,
  },
  {
    id: 'area-4',
    name: 'Sala de Reuniões',
    description: 'Sala para reuniões e encontros',
    rules: 'Máximo 10 pessoas.',
    capacity: 10,
    requiresApproval: false,
    isActive: true,
  },
  {
    id: 'area-5',
    name: 'Espaço Gourmet',
    description: 'Cozinha compartilhada para eventos',
    rules: 'Máximo 30 pessoas. Horário até 23h.',
    capacity: 30,
    requiresApproval: true,
    feePlaceholder: 150,
    isActive: true,
  },
];
