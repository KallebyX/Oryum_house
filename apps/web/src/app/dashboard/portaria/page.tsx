'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type TabType = 'visitors' | 'deliveries';

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

const visitorStatusColors = {
  expected: 'bg-blue-100 text-blue-800',
  checked_in: 'bg-green-100 text-green-800',
  checked_out: 'bg-gray-100 text-gray-800',
};

const visitorStatusLabels = {
  expected: 'Esperado',
  checked_in: 'Na Portaria',
  checked_out: 'Saiu',
};

const visitorTypeLabels = {
  visitor: 'Visitante',
  service: 'Servico',
  delivery: 'Entrega',
};

const deliveryStatusColors = {
  received: 'bg-yellow-100 text-yellow-800',
  notified: 'bg-blue-100 text-blue-800',
  collected: 'bg-green-100 text-green-800',
};

const deliveryStatusLabels = {
  received: 'Recebido',
  notified: 'Notificado',
  collected: 'Retirado',
};

export default function PortariaPage() {
  const [activeTab, setActiveTab] = useState<TabType>('visitors');
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portaria</h1>
          <p className="text-gray-600">Controle de visitantes e entregas</p>
        </div>
        <Dialog open={isNewVisitorOpen} onOpenChange={setIsNewVisitorOpen}>
          <DialogTrigger asChild>
            <Button>Novo Visitante</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Autorizar Visitante</DialogTitle>
              <DialogDescription>
                Preencha os dados do visitante
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Nome completo" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="document">Documento</Label>
                <Input id="document" placeholder="CPF ou RG" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unidade</Label>
                <Input id="unit" placeholder="Numero da unidade" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Observacoes</Label>
                <Input id="notes" placeholder="Motivo da visita" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewVisitorOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsNewVisitorOpen(false)}>
                Autorizar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Visitantes Hoje</div>
            <div className="text-2xl font-bold text-blue-600">
              {visitors.filter((v) => v.status !== 'checked_out').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Na Portaria</div>
            <div className="text-2xl font-bold text-green-600">
              {visitors.filter((v) => v.status === 'checked_in').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Entregas Pendentes</div>
            <div className="text-2xl font-bold text-yellow-600">
              {deliveries.filter((d) => d.status !== 'collected').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Retiradas Hoje</div>
            <div className="text-2xl font-bold text-gray-600">
              {deliveries.filter((d) => d.status === 'collected').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b">
        <button
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'visitors'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('visitors')}
        >
          Visitantes
        </button>
        <button
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'deliveries'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('deliveries')}
        >
          Entregas
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <Input
          placeholder={
            activeTab === 'visitors'
              ? 'Buscar por nome ou unidade...'
              : 'Buscar por transportadora, codigo ou unidade...'
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Content */}
      {activeTab === 'visitors' ? (
        <div className="space-y-4">
          {filteredVisitors.map((visitor) => (
            <Card key={visitor.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                      {visitor.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium">{visitor.name}</h3>
                      <p className="text-sm text-gray-600">
                        Unidade {visitor.unitNumber} - Autorizado por {visitor.authorizedBy}
                      </p>
                      {visitor.notes && (
                        <p className="text-xs text-gray-500">{visitor.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{visitorTypeLabels[visitor.type]}</Badge>
                    <Badge className={visitorStatusColors[visitor.status]}>
                      {visitorStatusLabels[visitor.status]}
                    </Badge>
                    {visitor.status === 'expected' && (
                      <Button size="sm">Check-in</Button>
                    )}
                    {visitor.status === 'checked_in' && (
                      <Button size="sm" variant="outline">Check-out</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredVisitors.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                Nenhum visitante encontrado
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDeliveries.map((delivery) => (
            <Card key={delivery.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">
                      📦
                    </div>
                    <div>
                      <h3 className="font-medium">{delivery.carrier}</h3>
                      <p className="text-sm text-gray-600">
                        Unidade {delivery.unitNumber} - {delivery.description}
                      </p>
                      {delivery.trackingCode && (
                        <p className="text-xs text-gray-500">
                          Rastreio: {delivery.trackingCode}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        Recebido em:{' '}
                        {new Date(delivery.receivedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={deliveryStatusColors[delivery.status]}>
                      {deliveryStatusLabels[delivery.status]}
                    </Badge>
                    {delivery.status === 'received' && (
                      <Button size="sm">Notificar</Button>
                    )}
                    {delivery.status === 'notified' && (
                      <Button size="sm" variant="outline">Marcar Retirado</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredDeliveries.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                Nenhuma entrega encontrada
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
