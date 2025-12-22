'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Building2,
  ArrowLeft,
  ArrowRight,
  Calculator,
  TrendingUp,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Calendar,
  MessageSquare,
  FileText,
  BarChart3,
  Phone
} from 'lucide-react';

export default function DemoPage() {
  const [residents, setResidents] = useState(100);
  
  // Cálculo de economia baseado no número de moradores
  const calculateSavings = (numResidents: number) => {
    const currentCosts = {
      adminTime: numResidents * 2.5, // R$ 2,50 por morador/mês em tempo administrativo
      paperwork: numResidents * 0.8, // R$ 0,80 em papelada/impressões
      communication: numResidents * 0.5, // R$ 0,50 em comunicação (telefone, etc)
      inefficiency: numResidents * 1.2, // R$ 1,20 em ineficiências
    };
    
    const totalCurrentCost = Object.values(currentCosts).reduce((a, b) => a + b, 0);
    const systemCost = numResidents <= 50 ? 197 : numResidents <= 200 ? 297 : 397;
    const monthlySavings = totalCurrentCost * 0.6 - systemCost; // 60% de economia menos custo do sistema
    
    return {
      currentCost: totalCurrentCost,
      systemCost,
      monthlySavings: Math.max(monthlySavings, 0),
      yearlySavings: Math.max(monthlySavings * 12, 0),
      roi: Math.max((monthlySavings * 12) / (systemCost * 12) * 100, 0),
    };
  };

  const savings = calculateSavings(residents);

  const demoStats = {
    ticketsResolved: 1247,
    avgResolutionTime: '2.3 dias',
    satisfaction: 4.8,
    communicationReach: '98%',
    reservationsManaged: 456,
    assembliesHeld: 12,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button variant="ghost" asChild>
            <Link href="/landing">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Oryum House - Demo</span>
          </div>

          <Button className="bg-gradient-to-r from-blue-600 to-blue-700" asChild>
            <a href="#contact">Quero Testar</a>
          </Button>
        </div>
      </header>

      <main className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Demo Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Demonstração Interativa
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Veja como o Oryum House pode transformar a gestão do seu condomínio com dados reais
            </p>
          </div>

          {/* Simulador de Economia */}
          <Card className="mb-12 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Calculator className="mr-3 h-6 w-6 text-green-600" />
                Simulador de Economia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Número de Moradores no seu Condomínio
                  </label>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="20"
                      max="500"
                      value={residents}
                      onChange={(e) => setResidents(parseInt(e.target.value))}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>20</span>
                      <span className="font-bold text-blue-600">{residents} moradores</span>
                      <span>500</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="text-2xl font-bold text-red-600">
                        R$ {Math.round(savings.currentCost).toLocaleString('pt-BR')}
                      </div>
                      <div className="text-sm text-gray-600">Custo Atual/mês</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="text-2xl font-bold text-blue-600">
                        R$ {savings.systemCost.toLocaleString('pt-BR')}
                      </div>
                      <div className="text-sm text-gray-600">Oryum House/mês</div>
                    </div>
                  </div>

                  <div className="bg-green-100 p-6 rounded-lg border border-green-200">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-700 mb-2">
                        R$ {Math.round(savings.monthlySavings).toLocaleString('pt-BR')}/mês
                      </div>
                      <div className="text-sm text-green-600 mb-4">Economia Mensal</div>
                      <div className="text-lg font-semibold text-green-800">
                        R$ {Math.round(savings.yearlySavings).toLocaleString('pt-BR')} economizados por ano!
                      </div>
                      <div className="text-sm text-green-600 mt-2">
                        ROI: {savings.roi.toFixed(0)}% ao ano
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Demo */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
                  Dashboard em Tempo Real
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{demoStats.ticketsResolved}</div>
                    <div className="text-sm text-gray-600">Demandas Resolvidas</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{demoStats.avgResolutionTime}</div>
                    <div className="text-sm text-gray-600">Tempo Médio</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{demoStats.satisfaction}/5</div>
                    <div className="text-sm text-gray-600">Satisfação</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{demoStats.communicationReach}</div>
                    <div className="text-sm text-gray-600">Alcance</div>
                  </div>
                </div>

                {/* Kanban Demo */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3">Novas (8)</h4>
                    <div className="space-y-2">
                      <div className="bg-white p-3 rounded shadow-sm border-l-4 border-l-blue-500">
                        <div className="text-sm font-medium">Vazamento Apt 201</div>
                        <div className="text-xs text-gray-500">Prioridade: Alta</div>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm border-l-4 border-l-blue-500">
                        <div className="text-sm font-medium">Lâmpada Corredor</div>
                        <div className="text-xs text-gray-500">Prioridade: Média</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-3">Em Avaliação (5)</h4>
                    <div className="space-y-2">
                      <div className="bg-white p-3 rounded shadow-sm border-l-4 border-l-yellow-500">
                        <div className="text-sm font-medium">Limpeza Piscina</div>
                        <div className="text-xs text-gray-500">Zelador: João</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-3">Em Andamento (12)</h4>
                    <div className="space-y-2">
                      <div className="bg-white p-3 rounded shadow-sm border-l-4 border-l-orange-500">
                        <div className="text-sm font-medium">Portão Garagem</div>
                        <div className="text-xs text-gray-500">Técnico: Carlos</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-3">Concluídas (156)</h4>
                    <div className="space-y-2">
                      <div className="bg-white p-3 rounded shadow-sm border-l-4 border-l-green-500">
                        <div className="text-sm font-medium">Interfone Apt 102</div>
                        <div className="text-xs text-gray-500">⭐ 5/5 - Excelente</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MessageSquare className="mr-2 h-5 w-5 text-blue-600" />
                    Comunicados Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                      <div className="font-medium text-sm">📌 Manutenção Elevador</div>
                      <div className="text-xs text-gray-600">Hoje, 14:30</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-sm">🏊 Nova Regra Piscina</div>
                      <div className="text-xs text-gray-600">Ontem, 09:15</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-sm">🗳️ Assembleia 20/01</div>
                      <div className="text-xs text-gray-600">2 dias atrás</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Calendar className="mr-2 h-5 w-5 text-green-600" />
                    Próximas Reservas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-sm">🎉 Salão de Festas</div>
                      <div className="text-xs text-gray-600">Sáb, 20/01 - 19h às 23h</div>
                      <div className="text-xs text-green-600">Apt 301 - Aprovado</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="font-medium text-sm">🔥 Churrasqueira</div>
                      <div className="text-xs text-gray-600">Dom, 21/01 - 12h às 16h</div>
                      <div className="text-xs text-yellow-600">Apt 205 - Pendente</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Benefícios Mensuráveis */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Redução de Custos</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">60%</div>
                <p className="text-gray-600">
                  Economia média nos custos administrativos com automação inteligente
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tempo Poupado</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">15h</div>
                <p className="text-gray-600">
                  Horas economizadas por semana na gestão administrativa
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-purple-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Satisfação</h3>
                <div className="text-3xl font-bold text-purple-600 mb-2">94%</div>
                <p className="text-gray-600">
                  Dos moradores aprovam o sistema e recomendam para outros condomínios
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Simulação de Fluxo */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Fluxo de uma Demanda Real
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-3">
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">1. Abertura</h4>
                  <p className="text-sm text-gray-600">
                    Morador relata vazamento via app em 30 segundos
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-yellow-100 p-4 rounded-full w-fit mx-auto mb-3">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h4 className="font-semibold mb-2">2. Triagem</h4>
                  <p className="text-sm text-gray-600">
                    Sistema categoriza automaticamente e define SLA
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-orange-100 p-4 rounded-full w-fit mx-auto mb-3">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold mb-2">3. Atribuição</h4>
                  <p className="text-sm text-gray-600">
                    Zelador recebe notificação e aceita demanda
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-100 p-4 rounded-full w-fit mx-auto mb-3">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold mb-2">4. Execução</h4>
                  <p className="text-sm text-gray-600">
                    Atualizações em tempo real com fotos do progresso
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">5. Conclusão</h4>
                  <p className="text-sm text-gray-600">
                    Morador avalia atendimento e demanda é arquivada
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ROI Calculator */}
          <Card className="mb-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-6">
                  Retorno do Investimento para seu Condomínio
                </h3>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold mb-3">💰 Economia Mensal</h4>
                    <div className="text-3xl font-bold mb-2">
                      R$ {Math.round(savings.monthlySavings).toLocaleString('pt-BR')}
                    </div>
                    <p className="text-blue-100">
                      Redução em custos administrativos, papel e tempo
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-3">📈 ROI Anual</h4>
                    <div className="text-3xl font-bold mb-2">
                      {savings.roi.toFixed(0)}%
                    </div>
                    <p className="text-blue-100">
                      Retorno garantido sobre o investimento
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-3">⏱️ Payback</h4>
                    <div className="text-3xl font-bold mb-2">
                      {savings.monthlySavings > 0 ? Math.ceil(savings.systemCost / savings.monthlySavings) : 0} meses
                    </div>
                    <p className="text-blue-100">
                      Tempo para recuperar o investimento
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="bg-white text-blue-600 hover:bg-gray-100"
                    asChild
                  >
                    <a href="#contact">
                      Quero Essa Economia no Meu Condomínio
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Final */}
          <Card className="text-center bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Convencido? Comece Agora Mesmo!
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                30 dias grátis + desconto especial nos primeiros 3 meses
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  asChild
                >
                  <a href="#contact">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Começar Teste Grátis Agora
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  asChild
                >
                  <a href="tel:+5555991255935">
                    <Phone className="mr-2 h-5 w-5" />
                    (55) 99125-5935
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
