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

interface Assembly {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  type: 'ordinary' | 'extraordinary';
  quorumRequired: number;
  currentParticipation: number;
  topics: AssemblyTopic[];
}

interface AssemblyTopic {
  id: string;
  title: string;
  description: string;
  votingType: 'simple' | 'qualified' | 'unanimous';
  result?: {
    approve: number;
    reject: number;
    abstain: number;
  };
  status: 'pending' | 'voting' | 'approved' | 'rejected';
}

const mockAssemblies: Assembly[] = [
  {
    id: '1',
    title: 'Assembleia Geral Ordinaria 2024',
    description: 'Prestacao de contas e aprovacao do orcamento para 2025',
    date: '2024-12-15T19:00:00',
    status: 'scheduled',
    type: 'ordinary',
    quorumRequired: 50,
    currentParticipation: 0,
    topics: [
      {
        id: '1-1',
        title: 'Aprovacao das contas de 2024',
        description: 'Analise e votacao das contas apresentadas pelo sindico',
        votingType: 'simple',
        status: 'pending',
      },
      {
        id: '1-2',
        title: 'Orcamento 2025',
        description: 'Votacao do orcamento proposto para o proximo ano',
        votingType: 'simple',
        status: 'pending',
      },
    ],
  },
  {
    id: '2',
    title: 'Assembleia Extraordinaria - Reforma da Fachada',
    description: 'Discussao e votacao sobre a reforma da fachada do predio',
    date: '2024-12-20T19:00:00',
    status: 'in_progress',
    type: 'extraordinary',
    quorumRequired: 67,
    currentParticipation: 72,
    topics: [
      {
        id: '2-1',
        title: 'Aprovacao do projeto de reforma',
        description: 'Votacao do projeto apresentado pela empresa XYZ',
        votingType: 'qualified',
        result: { approve: 45, reject: 12, abstain: 3 },
        status: 'approved',
      },
      {
        id: '2-2',
        title: 'Aprovacao do rateio',
        description: 'Forma de pagamento da reforma',
        votingType: 'qualified',
        status: 'voting',
      },
    ],
  },
  {
    id: '3',
    title: 'Assembleia Geral Ordinaria 2023',
    description: 'Prestacao de contas do exercicio de 2023',
    date: '2024-03-15T19:00:00',
    status: 'completed',
    type: 'ordinary',
    quorumRequired: 50,
    currentParticipation: 78,
    topics: [
      {
        id: '3-1',
        title: 'Aprovacao das contas de 2023',
        description: 'Contas apresentadas e aprovadas pela maioria',
        votingType: 'simple',
        result: { approve: 52, reject: 8, abstain: 5 },
        status: 'approved',
      },
    ],
  },
];

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  scheduled: 'Agendada',
  in_progress: 'Em Andamento',
  completed: 'Concluida',
  cancelled: 'Cancelada',
};

const topicStatusColors = {
  pending: 'bg-gray-100 text-gray-800',
  voting: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const topicStatusLabels = {
  pending: 'Pendente',
  voting: 'Em Votacao',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
};

export default function AssembliesPage() {
  const [assemblies] = useState<Assembly[]>(mockAssemblies);
  const [selectedAssembly, setSelectedAssembly] = useState<Assembly | null>(null);
  const [isVoteDialogOpen, setIsVoteDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<AssemblyTopic | null>(null);

  const handleVote = (vote: 'approve' | 'reject' | 'abstain') => {
    console.log('Vote:', vote, 'for topic:', selectedTopic?.id);
    setIsVoteDialogOpen(false);
    setSelectedTopic(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assembleias</h1>
          <p className="text-gray-600">Participacao em assembleias e votacoes</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Agendadas</div>
            <div className="text-2xl font-bold text-blue-600">
              {assemblies.filter((a) => a.status === 'scheduled').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Em Andamento</div>
            <div className="text-2xl font-bold text-green-600">
              {assemblies.filter((a) => a.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Concluidas</div>
            <div className="text-2xl font-bold text-gray-600">
              {assemblies.filter((a) => a.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Sua Participacao</div>
            <div className="text-2xl font-bold text-purple-600">78%</div>
          </CardContent>
        </Card>
      </div>

      {/* Assemblies List */}
      <div className="space-y-4">
        {assemblies.map((assembly) => (
          <Card key={assembly.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{assembly.title}</CardTitle>
                  <CardDescription>{assembly.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {assembly.type === 'ordinary' ? 'Ordinaria' : 'Extraordinaria'}
                  </Badge>
                  <Badge className={statusColors[assembly.status]}>
                    {statusLabels[assembly.status]}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label className="text-sm text-gray-600">Data e Hora</Label>
                  <p className="font-medium">
                    {new Date(assembly.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Quorum Necessario</Label>
                  <p className="font-medium">{assembly.quorumRequired}%</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Participacao Atual</Label>
                  <p className="font-medium">
                    {assembly.currentParticipation > 0 ? `${assembly.currentParticipation}%` : '-'}
                  </p>
                </div>
              </div>

              {/* Topics */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Pautas</h4>
                <div className="space-y-2">
                  {assembly.topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{topic.title}</p>
                        <p className="text-xs text-gray-600">{topic.description}</p>
                        {topic.result && (
                          <div className="flex space-x-4 mt-2 text-xs">
                            <span className="text-green-600">
                              Aprovam: {topic.result.approve}
                            </span>
                            <span className="text-red-600">
                              Rejeitam: {topic.result.reject}
                            </span>
                            <span className="text-gray-600">
                              Abstencoes: {topic.result.abstain}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={topicStatusColors[topic.status]}>
                          {topicStatusLabels[topic.status]}
                        </Badge>
                        {topic.status === 'voting' && assembly.status === 'in_progress' && (
                          <Dialog open={isVoteDialogOpen} onOpenChange={setIsVoteDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                onClick={() => setSelectedTopic(topic)}
                              >
                                Votar
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Votar na Pauta</DialogTitle>
                                <DialogDescription>
                                  {selectedTopic?.title}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <p className="text-sm text-gray-600 mb-4">
                                  {selectedTopic?.description}
                                </p>
                                <div className="flex justify-center space-x-4">
                                  <Button
                                    variant="outline"
                                    className="border-green-500 text-green-600 hover:bg-green-50"
                                    onClick={() => handleVote('approve')}
                                  >
                                    Aprovar
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="border-red-500 text-red-600 hover:bg-red-50"
                                    onClick={() => handleVote('reject')}
                                  >
                                    Rejeitar
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleVote('abstain')}
                                  >
                                    Abster-se
                                  </Button>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  variant="ghost"
                                  onClick={() => setIsVoteDialogOpen(false)}
                                >
                                  Cancelar
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {assembly.status === 'scheduled' && (
                <div className="mt-4 pt-4 border-t">
                  <Button className="w-full">Confirmar Presenca</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
