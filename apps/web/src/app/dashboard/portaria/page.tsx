'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users,
  Package,
  UserPlus,
  Search,
  Clock,
  CheckCircle2,
  LogIn,
  LogOut,
  Building2,
  Phone,
  FileText,
  TrendingUp,
  AlertCircle,
  Truck,
  Bell,
  PackageCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Visitor {
  id: string;
  name: string;
  document: string;
  photo?: string;
  unitId: string;
  unitNumber: string;
  authorizedBy: string;
  type: 'visitor' | 'service' | 'delivery';
  status: 'expected' | 'checked_in' | 'checked_out';
  expectedAt?: string;
  checkedInAt?: string;
  checkedOutAt?: string;
  notes?: string;
}

interface Delivery {
  id: string;
  trackingCode?: string;
  carrier: string;
  description: string;
  unitId: string;
  unitNumber: string;
  status: 'received' | 'notified' | 'collected';
  receivedAt: string;
  notifiedAt?: string;
  collectedAt?: string;
  collectedBy?: string;
  photo?: string;
}

const mockVisitors: Visitor[] = [
  {
    id: '1',
    name: 'Maria Silva',
    document: '123.456.789-00',
    unitId: '1',
    unitNumber: '101',
    authorizedBy: 'Joao Santos',
    type: 'visitor',
    status: 'expected',
    expectedAt: '2024-12-22T14:00:00',
    notes: 'Mae do morador',
  },
  {
    id: '2',
    name: 'Pedro Tecnico',
    document: '987.654.321-00',
    unitId: '2',
    unitNumber: '202',
    authorizedBy: 'Ana Costa',
    type: 'service',
    status: 'checked_in',
    checkedInAt: '2024-12-22T10:30:00',
    notes: 'Manutencao ar condicionado',
  },
  {
    id: '3',
    name: 'Carlos Entregador',
    document: '456.789.123-00',
    unitId: '3',
    unitNumber: '303',
    authorizedBy: 'Sistema',
    type: 'delivery',
    status: 'checked_out',
    checkedInAt: '2024-12-22T09:00:00',
    checkedOutAt: '2024-12-22T09:15:00',
  },
];

const mockDeliveries: Delivery[] = [
  {
    id: '1',
    trackingCode: 'BR123456789',
    carrier: 'Correios',
    description: 'Pacote pequeno',
    unitId: '1',
    unitNumber: '101',
    status: 'received',
    receivedAt: '2024-12-22T08:30:00',
  },
  {
    id: '2',
    carrier: 'Mercado Livre',
    description: 'Caixa grande',
    unitId: '2',
    unitNumber: '202',
    status: 'notified',
    receivedAt: '2024-12-21T15:00:00',
    notifiedAt: '2024-12-21T15:05:00',
  },
  {
    id: '3',
    trackingCode: 'AM987654321',
    carrier: 'Amazon',
    description: 'Envelope',
    unitId: '3',
    unitNumber: '303',
    status: 'collected',
    receivedAt: '2024-12-20T10:00:00',
    notifiedAt: '2024-12-20T10:05:00',
    collectedAt: '2024-12-20T18:30:00',
    collectedBy: 'Paulo Morador',
  },
];

const visitorStatusConfig = {
  expected: {
    label: 'Aguardando',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
    icon: Clock,
  },
  checked_in: {
    label: 'Na Portaria',
    color: 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
    icon: LogIn,
  },
  checked_out: {
    label: 'Saiu',
    color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    icon: LogOut,
  },
};

const visitorTypeConfig = {
  visitor: { label: 'Visitante', color: 'border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400' },
  service: { label: 'Servico', color: 'border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-400' },
  delivery: { label: 'Entrega', color: 'border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400' },
};

const deliveryStatusConfig = {
  received: {
    label: 'Recebido',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
    icon: Package,
  },
  notified: {
    label: 'Notificado',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
    icon: Bell,
  },
  collected: {
    label: 'Retirado',
    color: 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
    icon: PackageCheck,
  },
};

export default function PortariaPage() {
  const [visitors] = useState<Visitor[]>(mockVisitors);
  const [deliveries] = useState<Delivery[]>(mockDeliveries);
  const [isNewVisitorOpen, setIsNewVisitorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVisitors = visitors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.unitNumber.includes(searchTerm)
  );

  const filteredDeliveries = deliveries.filter(
    (d) =>
      d.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.unitNumber.includes(searchTerm) ||
      d.trackingCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const visitorsToday = visitors.filter((v) => v.status !== 'checked_out').length;
  const visitorsInPortaria = visitors.filter((v) => v.status === 'checked_in').length;
  const pendingDeliveries = deliveries.filter((d) => d.status !== 'collected').length;
  const collectedToday = deliveries.filter((d) => d.status === 'collected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Portaria</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Controle de visitantes e entregas do condominio
          </p>
        </div>
        <Dialog open={isNewVisitorOpen} onOpenChange={setIsNewVisitorOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-sm">
              <UserPlus className="h-4 w-4" />
              Novo Visitante
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Autorizar Visitante</DialogTitle>
              <DialogDescription>
                Preencha os dados do visitante para autorizar a entrada
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" placeholder="Digite o nome" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="document">Documento</Label>
                <Input id="document" placeholder="CPF ou RG" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="unit">Unidade</Label>
                  <Input id="unit" placeholder="Ex: 101" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo</Label>
                  <select
                    id="type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="visitor">Visitante</option>
                    <option value="service">Servico</option>
                    <option value="delivery">Entrega</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Observacoes</Label>
                <Input id="notes" placeholder="Motivo da visita (opcional)" />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsNewVisitorOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsNewVisitorOpen(false)} className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Autorizar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card group">
          <CardContent className="p-5">
            <div className="stat-card-icon">
              <Users className="h-5 w-5" />
            </div>
            <div className="stat-card-value text-foreground">{visitorsToday}</div>
            <div className="stat-card-label">Visitantes Hoje</div>
            <div className="stat-card-trend positive">
              <TrendingUp className="h-3 w-3" />
              <span>+2 vs ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card group">
          <CardContent className="p-5">
            <div className="stat-card-icon !bg-green-100 !text-green-600 dark:!bg-green-950/50 dark:!text-green-400">
              <LogIn className="h-5 w-5" />
            </div>
            <div className="stat-card-value text-green-600 dark:text-green-400">{visitorsInPortaria}</div>
            <div className="stat-card-label">Na Portaria</div>
            <div className="stat-card-trend positive">
              <Clock className="h-3 w-3" />
              <span>Em atendimento</span>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card group">
          <CardContent className="p-5">
            <div className="stat-card-icon !bg-amber-100 !text-amber-600 dark:!bg-amber-950/50 dark:!text-amber-400">
              <Package className="h-5 w-5" />
            </div>
            <div className="stat-card-value text-amber-600 dark:text-amber-400">{pendingDeliveries}</div>
            <div className="stat-card-label">Entregas Pendentes</div>
            <div className="stat-card-trend">
              <AlertCircle className="h-3 w-3 text-amber-500" />
              <span className="text-amber-600 dark:text-amber-400">Aguardando retirada</span>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card group">
          <CardContent className="p-5">
            <div className="stat-card-icon !bg-gray-100 !text-gray-600 dark:!bg-gray-800 dark:!text-gray-400">
              <PackageCheck className="h-5 w-5" />
            </div>
            <div className="stat-card-value text-muted-foreground">{collectedToday}</div>
            <div className="stat-card-label">Retiradas Hoje</div>
            <div className="stat-card-trend positive">
              <CheckCircle2 className="h-3 w-3" />
              <span>Concluidas</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="visitors" className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList variant="underline" className="w-full sm:w-auto">
            <TabsTrigger
              value="visitors"
              variant="underline"
              icon={<Users className="h-4 w-4" />}
            >
              Visitantes
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {visitors.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="deliveries"
              variant="underline"
              icon={<Package className="h-4 w-4" />}
            >
              Entregas
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {deliveries.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Visitors Tab */}
        <TabsContent value="visitors" className="mt-6 space-y-4">
          {filteredVisitors.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-1">Nenhum visitante encontrado</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  {searchTerm
                    ? 'Tente buscar por outro nome ou unidade'
                    : 'Nao ha visitantes registrados no momento'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredVisitors.map((visitor) => {
                const statusConfig = visitorStatusConfig[visitor.status];
                const typeConfig = visitorTypeConfig[visitor.type];
                const StatusIcon = statusConfig.icon;

                return (
                  <Card
                    key={visitor.id}
                    className="group hover:shadow-md hover:border-primary/20 transition-all duration-200"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <span className="text-lg font-semibold text-primary">
                              {visitor.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-foreground truncate">
                              {visitor.name}
                            </h3>
                            <Badge variant="outline" className={cn('text-xs', typeConfig.color)}>
                              {typeConfig.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3.5 w-3.5" />
                              Unidade {visitor.unitNumber}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-3.5 w-3.5" />
                              {visitor.document}
                            </span>
                          </div>
                          {visitor.notes && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {visitor.notes}
                            </p>
                          )}
                        </div>

                        {/* Status & Actions */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Badge className={cn('gap-1', statusConfig.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig.label}
                          </Badge>
                          {visitor.status === 'expected' && (
                            <Button size="sm" className="shadow-sm">
                              <LogIn className="h-4 w-4 mr-1" />
                              Check-in
                            </Button>
                          )}
                          {visitor.status === 'checked_in' && (
                            <Button size="sm" variant="outline">
                              <LogOut className="h-4 w-4 mr-1" />
                              Check-out
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Deliveries Tab */}
        <TabsContent value="deliveries" className="mt-6 space-y-4">
          {filteredDeliveries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-1">Nenhuma entrega encontrada</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  {searchTerm
                    ? 'Tente buscar por outro codigo ou transportadora'
                    : 'Nao ha entregas registradas no momento'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredDeliveries.map((delivery) => {
                const statusConfig = deliveryStatusConfig[delivery.status];
                const StatusIcon = statusConfig.icon;

                return (
                  <Card
                    key={delivery.id}
                    className="group hover:shadow-md hover:border-primary/20 transition-all duration-200"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950/50 dark:to-orange-950/50 flex items-center justify-center">
                            <Truck className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-foreground">
                              {delivery.carrier}
                            </h3>
                            <span className="text-sm text-muted-foreground">
                              - {delivery.description}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3.5 w-3.5" />
                              Unidade {delivery.unitNumber}
                            </span>
                            {delivery.trackingCode && (
                              <span className="flex items-center gap-1 font-mono text-xs">
                                <Package className="h-3.5 w-3.5" />
                                {delivery.trackingCode}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 inline mr-1" />
                            Recebido em{' '}
                            {new Date(delivery.receivedAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <Badge className={cn('gap-1', statusConfig.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig.label}
                          </Badge>
                          {delivery.status === 'received' && (
                            <Button size="sm" className="shadow-sm">
                              <Bell className="h-4 w-4 mr-1" />
                              Notificar
                            </Button>
                          )}
                          {delivery.status === 'notified' && (
                            <Button size="sm" variant="outline">
                              <PackageCheck className="h-4 w-4 mr-1" />
                              Marcar Retirado
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
