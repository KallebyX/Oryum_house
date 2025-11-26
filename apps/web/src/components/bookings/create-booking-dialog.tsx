'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  X,
  Loader2,
  ChevronDown,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCreateBooking, useCheckAvailability } from '@/hooks/use-bookings';
import { DEMO_AREAS, type BookingArea } from '@/types/booking';

interface CreateBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  condominiumId: string;
}

interface FormData {
  areaId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
}

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00',
];

export function CreateBookingDialog({
  open,
  onOpenChange,
  condominiumId,
}: CreateBookingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [formData, setFormData] = useState<FormData>({
    areaId: '',
    date: '',
    startTime: '',
    endTime: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const createBooking = useCreateBooking(condominiumId);
  const checkAvailability = useCheckAvailability(condominiumId);

  const selectedArea = useMemo(
    () => DEMO_AREAS.find((a) => a.id === formData.areaId),
    [formData.areaId]
  );

  const resetForm = () => {
    setFormData({
      areaId: '',
      date: '',
      startTime: '',
      endTime: '',
      notes: '',
    });
    setErrors({});
    setAvailabilityChecked(false);
    setIsAvailable(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.areaId) {
      newErrors.areaId = 'Selecione uma área';
    }

    if (!formData.date) {
      newErrors.date = 'Selecione uma data';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Data não pode ser no passado';
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Selecione o horário de início';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Selecione o horário de término';
    } else if (formData.startTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = 'Horário de término deve ser após o início';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckAvailability = async () => {
    if (!validateForm()) return;

    const startAt = `${formData.date}T${formData.startTime}:00`;
    const endAt = `${formData.date}T${formData.endTime}:00`;

    try {
      const result = await checkAvailability.mutateAsync({
        areaId: formData.areaId,
        startAt,
        endAt,
      });
      setIsAvailable(result?.available ?? true);
      setAvailabilityChecked(true);
    } catch (error) {
      // For demo, assume available
      setIsAvailable(true);
      setAvailabilityChecked(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!availabilityChecked || !isAvailable) {
      await handleCheckAvailability();
      return;
    }

    setIsSubmitting(true);
    try {
      const startAt = new Date(`${formData.date}T${formData.startTime}:00`).toISOString();
      const endAt = new Date(`${formData.date}T${formData.endTime}:00`).toISOString();

      await createBooking.mutateAsync({
        areaId: formData.areaId,
        unitId: 'demo-unit-1', // In production, get from user's unit
        startAt,
        endAt,
        notes: formData.notes || undefined,
      });
      handleClose();
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setAvailabilityChecked(false);
    setIsAvailable(null);
  };

  // Get min date (today)
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova Reserva</DialogTitle>
          <DialogDescription>
            Selecione a área e o período para fazer sua reserva
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Area Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Área *
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'w-full justify-between',
                    errors.areaId && 'border-red-500'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {selectedArea ? selectedArea.name : 'Selecione uma área'}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-full min-w-[300px]">
                {DEMO_AREAS.filter((a) => a.isActive).map((area) => (
                  <DropdownMenuItem
                    key={area.id}
                    onClick={() => handleFieldChange('areaId', area.id)}
                    className="flex flex-col items-start py-2"
                  >
                    <span className="font-medium">{area.name}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      {area.capacity && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {area.capacity}
                        </span>
                      )}
                      {area.feePlaceholder && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          R$ {area.feePlaceholder}
                        </span>
                      )}
                      {area.requiresApproval && (
                        <Badge variant="secondary" className="text-xs">
                          Requer aprovação
                        </Badge>
                      )}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {errors.areaId && (
              <p className="text-xs text-red-500 mt-1">{errors.areaId}</p>
            )}
          </div>

          {/* Selected Area Info */}
          {selectedArea && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <div className="flex flex-wrap gap-3 text-sm">
                {selectedArea.capacity && (
                  <span className="flex items-center gap-1 text-blue-700 dark:text-blue-400">
                    <Users className="h-4 w-4" />
                    Até {selectedArea.capacity} pessoas
                  </span>
                )}
                {selectedArea.feePlaceholder && (
                  <span className="flex items-center gap-1 text-blue-700 dark:text-blue-400">
                    <DollarSign className="h-4 w-4" />
                    Taxa: R$ {selectedArea.feePlaceholder.toFixed(2)}
                  </span>
                )}
                {selectedArea.requiresApproval && (
                  <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                    <AlertCircle className="h-4 w-4" />
                    Requer aprovação
                  </span>
                )}
              </div>
              {selectedArea.rules && (
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-2">
                  {selectedArea.rules}
                </p>
              )}
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={formData.date}
                min={minDate}
                onChange={(e) => handleFieldChange('date', e.target.value)}
                className={cn(
                  'w-full rounded-lg border px-3 py-2 pl-10 text-sm',
                  'bg-white dark:bg-gray-950',
                  'focus:outline-none focus:ring-1 focus:ring-blue-500',
                  errors.date
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 dark:border-gray-800 focus:border-blue-500'
                )}
              />
            </div>
            {errors.date && (
              <p className="text-xs text-red-500 mt-1">{errors.date}</p>
            )}
          </div>

          {/* Time Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Início *
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'w-full justify-between',
                      errors.startTime && 'border-red-500'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {formData.startTime || 'Horário'}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-48 overflow-y-auto">
                  {timeSlots.map((time) => (
                    <DropdownMenuItem
                      key={time}
                      onClick={() => handleFieldChange('startTime', time)}
                    >
                      {time}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {errors.startTime && (
                <p className="text-xs text-red-500 mt-1">{errors.startTime}</p>
              )}
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Término *
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'w-full justify-between',
                      errors.endTime && 'border-red-500'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {formData.endTime || 'Horário'}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-48 overflow-y-auto">
                  {timeSlots.map((time) => (
                    <DropdownMenuItem
                      key={time}
                      onClick={() => handleFieldChange('endTime', time)}
                      disabled={!!formData.startTime && time <= formData.startTime}
                    >
                      {time}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {errors.endTime && (
                <p className="text-xs text-red-500 mt-1">{errors.endTime}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              placeholder="Ex: Festa de aniversário com 30 convidados"
              rows={3}
              className={cn(
                'w-full rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm resize-none',
                'bg-white dark:bg-gray-950',
                'placeholder:text-gray-500 dark:placeholder:text-gray-400',
                'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              )}
            />
          </div>

          {/* Availability Status */}
          {availabilityChecked && (
            <div
              className={cn(
                'p-3 rounded-lg flex items-center gap-2',
                isAvailable
                  ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'
              )}
            >
              {isAvailable ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-700 dark:text-green-300">
                    Horário disponível!
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-700 dark:text-red-300">
                    Horário indisponível. Escolha outro horário.
                  </span>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            {!availabilityChecked || !isAvailable ? (
              <Button
                type="button"
                onClick={handleCheckAvailability}
                disabled={checkAvailability.isPending}
                className="gap-2"
              >
                {checkAvailability.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Verificar Disponibilidade
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirmar Reserva
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
