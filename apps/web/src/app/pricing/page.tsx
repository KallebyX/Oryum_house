'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  ArrowLeft, 
  Check, 
  X,
  Star,
  Calculator,
  TrendingUp,
  Phone,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Users
} from 'lucide-react';

const plans = [
  {
    name: 'Essencial',
    description: 'Perfeito para condomínios pequenos que querem começar a digitalização',
    residents: 'Até 50 moradores',
    price: 197,
    originalPrice: 280,
    savings: 83,
    features: [
      'Sistema de demandas completo',
      'Kanban visual para gestão',
      'Comunicados e avisos',
      'Gestão de usuários e perfis',
      'Relatórios básicos (PDF/CSV)',
      'App móvel (PWA)',
      'Backup automático diário',
      'Suporte por email',
      'SSL e segurança básica',
    ],
    limitations: [
      'Máximo 50 moradores',
      '500 demandas por mês',
      '1GB de armazenamento',
      'Suporte apenas por email',
    ],
    popular: false,
    color: 'blue',
  },
  {
    name: 'Profissional',
    description: 'A escolha ideal para condomínios que querem todas as funcionalidades',
    residents: 'Até 200 moradores',
    price: 297,
    originalPrice: 420,
    savings: 123,
    features: [
      'Tudo do plano Essencial',
      'Reservas de áreas comuns',
      'Calendário inteligente',
      'Assembleias digitais',
      'Votações online seguras',
      'Portaria virtual',
      'Controle de visitantes',
      'Registro de entregas',
      'Dashboard executivo',
      'Notificações push',
      'Suporte prioritário',
      'Integrações básicas',
      'Relatórios avançados',
      'Múltiplos administradores',
    ],
    limitations: [
      'Máximo 200 moradores',
      '2.000 demandas por mês',
      '5GB de armazenamento',
    ],
    popular: true,
    color: 'green',
  },
  {
    name: 'Enterprise',
    description: 'Para grandes condomínios e administradoras que gerenciam múltiplos prédios',
    residents: 'Moradores ilimitados',
    price: 397,
    originalPrice: 580,
    savings: 183,
    features: [
      'Tudo do plano Profissional',
      'Moradores ilimitados',
      'Múltiplos condomínios',
      'API personalizada',
      'Webhooks customizados',
      'Relatórios executivos',
      'Business Intelligence',
      'Suporte 24/7 por WhatsApp',
      'Treinamento presencial incluído',
      'Customizações sob medida',
      'Integração WhatsApp Business',
      'Backup premium com redundância',
      'SLA garantido de 99.9%',
      'Gerente de conta dedicado',
    ],
    limitations: [],
    popular: false,
    color: 'purple',
  },
];

const comparisonFeatures = [
  { name: 'Sistema de Demandas', essential: true, professional: true, enterprise: true },
  { name: 'Kanban Visual', essential: true, professional: true, enterprise: true },
  { name: 'App Móvel (PWA)', essential: true, professional: true, enterprise: true },
  { name: 'Comunicados', essential: true, professional: true, enterprise: true },
  { name: 'Relatórios Básicos', essential: true, professional: true, enterprise: true },
  { name: 'Backup Automático', essential: true, professional: true, enterprise: true },
  { name: 'Reservas de Áreas', essential: false, professional: true, enterprise: true },
  { name: 'Assembleias Digitais', essential: false, professional: true, enterprise: true },
  { name: 'Portaria Virtual', essential: false, professional: true, enterprise: true },
  { name: 'Dashboard Executivo', essential: false, professional: true, enterprise: true },
  { name: 'Notificações Push', essential: false, professional: true, enterprise: true },
  { name: 'Múltiplos Condomínios', essential: false, professional: false, enterprise: true },
  { name: 'API Personalizada', essential: false, professional: false, enterprise: true },
  { name: 'Integração WhatsApp', essential: false, professional: false, enterprise: true },
  { name: 'Suporte 24/7', essential: false, professional: false, enterprise: true },
  { name: 'Treinamento Presencial', essential: false, professional: false, enterprise: true },
];

export default function PricingPage() {
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
            <span className="text-lg font-bold text-gray-900">Oryum House - Planos</span>
          </div>

          <Button className="bg-gradient-to-r from-blue-600 to-blue-700" asChild>
            <a href="#contact">Teste Grátis</a>
          </Button>
        </div>
      </header>

      <main className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Planos que Cabem no seu Orçamento
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Preços justos e transparentes. Sem taxas ocultas, sem surpresas. 
              Todos os planos incluem <strong className="text-green-600">30 dias grátis</strong>!
            </p>
            
            <div className="inline-flex items-center rounded-full bg-green-100 px-6 py-3 text-green-700">
              <TrendingUp className="mr-2 h-5 w-5" />
              <span className="font-semibold">💰 Economia média de 60% nos custos administrativos</span>
            </div>
          </div>

          {/* Plans Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'ring-2 ring-green-500 shadow-xl bg-gradient-to-br from-white to-green-50' 
                  : 'hover:shadow-lg'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-full text-sm font-medium">
                      ⭐ Mais Escolhido
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                  <div className="text-sm text-blue-600 font-medium mt-3 bg-blue-50 px-3 py-1 rounded-full">
                    {plan.residents}
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-sm text-gray-500">R$</span>
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-500">/mês</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-sm text-gray-500 line-through">R$ {plan.originalPrice}</span>
                      <span className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                        {Math.round((1 - plan.price / plan.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                    <div className="text-lg font-semibold text-green-700">
                      Economia de R$ {plan.savings}/mês
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <li key={limitIndex} className="flex items-start text-gray-500">
                        <X className="h-4 w-4 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-sm">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' 
                        : plan.color === 'purple'
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                    }`}
                    asChild
                  >
                    <a href="#contact">
                      Começar Teste Grátis
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  
                  <p className="text-center text-xs text-gray-500 mt-3">
                    30 dias grátis • Cancele quando quiser
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comparison Table */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Comparação Detalhada de Funcionalidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-6 font-semibold">Funcionalidade</th>
                      <th className="text-center py-4 px-6 font-semibold text-blue-600">Essencial</th>
                      <th className="text-center py-4 px-6 font-semibold text-green-600">Profissional</th>
                      <th className="text-center py-4 px-6 font-semibold text-purple-600">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium">{feature.name}</td>
                        <td className="text-center py-4 px-6">
                          {feature.essential ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                        <td className="text-center py-4 px-6">
                          {feature.professional ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                        <td className="text-center py-4 px-6">
                          {feature.enterprise ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Value Proposition */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <Calculator className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Transparência Total</h3>
                <p className="text-gray-600 mb-4">
                  Sem taxas ocultas, sem surpresas. O que você vê é o que você paga.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ Sem taxa de setup</li>
                  <li>✅ Sem taxa por usuário extra</li>
                  <li>✅ Sem cobrança por demanda</li>
                  <li>✅ Cancelamento gratuito</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Segurança Garantida</h3>
                <p className="text-gray-600 mb-4">
                  Seus dados protegidos com a mesma segurança dos bancos.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>🔒 Criptografia SSL/TLS</li>
                  <li>🛡️ Conformidade LGPD</li>
                  <li>💾 Backup automático</li>
                  <li>🔍 Auditoria completa</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-purple-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Implementação Rápida</h3>
                <p className="text-gray-600 mb-4">
                  Sistema funcionando em até 48 horas com migração completa dos dados.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>⚡ Setup em 2-5 dias</li>
                  <li>📚 Treinamento incluído</li>
                  <li>🔄 Migração de dados</li>
                  <li>🎯 Suporte dedicado</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* ROI Section */}
          <Card className="mb-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-6">
                  Por que o Oryum House se Paga Sozinho?
                </h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white/10 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">⏰ Tempo Poupado</h4>
                    <div className="text-2xl font-bold mb-2">15h/semana</div>
                    <p className="text-green-100 text-sm">
                      Menos tempo em tarefas administrativas manuais
                    </p>
                  </div>

                  <div className="bg-white/10 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">📄 Menos Papel</h4>
                    <div className="text-2xl font-bold mb-2">90%</div>
                    <p className="text-green-100 text-sm">
                      Redução em impressões e papelada
                    </p>
                  </div>

                  <div className="bg-white/10 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">📞 Menos Ligações</h4>
                    <div className="text-2xl font-bold mb-2">80%</div>
                    <p className="text-green-100 text-sm">
                      Redução em ligações e interrupções
                    </p>
                  </div>

                  <div className="bg-white/10 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">😊 Mais Satisfação</h4>
                    <div className="text-2xl font-bold mb-2">4.8/5</div>
                    <p className="text-green-100 text-sm">
                      Nota média de satisfação dos moradores
                    </p>
                  </div>
                </div>

                <div className="bg-white/10 p-6 rounded-lg max-w-2xl mx-auto">
                  <h4 className="text-xl font-bold mb-4">💡 Exemplo Real</h4>
                  <p className="text-lg leading-relaxed">
                    <strong>Residencial Jardins (120 moradores)</strong> economizou <strong>R$ 1.800/mês</strong> 
                    em custos administrativos usando o plano Profissional. 
                    ROI de <strong>607% ao ano</strong>!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Pricing */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Dúvidas sobre Preços?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">💳 Como funciona o pagamento?</h4>
                    <p className="text-gray-600">
                      Cobrança mensal via boleto ou cartão. Primeiro mês grátis, depois débito automático.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">📈 O preço aumenta com o tempo?</h4>
                    <p className="text-gray-600">
                      Não! Preço fixo por 12 meses. Reajustes apenas anuais seguindo inflação (IPCA).
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">🔄 Posso mudar de plano?</h4>
                    <p className="text-gray-600">
                      Sim! Upgrade instantâneo, downgrade no próximo ciclo. Sem burocracia.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">❌ Posso cancelar quando quiser?</h4>
                    <p className="text-gray-600">
                      Sim! Sem multa, sem fidelidade. Cancele quando quiser e seus dados ficam 30 dias disponíveis.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">🎓 Tem treinamento incluído?</h4>
                    <p className="text-gray-600">
                      Sim! Todos os planos incluem treinamento online. Enterprise tem presencial incluído.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">📊 Tem taxa por relatório?</h4>
                    <p className="text-gray-600">
                      Não! Relatórios ilimitados em todos os planos. Exporte quantos quiser.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Offer */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
            <CardContent className="p-8">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold mb-4">
                  🎉 Oferta Especial de Lançamento
                </h3>
                <p className="text-xl mb-6 opacity-90">
                  Para os primeiros 100 condomínios que aderirem ao sistema
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <Zap className="h-8 w-8 mx-auto mb-2" />
                    <h4 className="font-bold">30 Dias Grátis</h4>
                    <p className="text-sm opacity-80">Teste completo sem compromisso</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <Star className="h-8 w-8 mx-auto mb-2" />
                    <h4 className="font-bold">50% OFF Setup</h4>
                    <p className="text-sm opacity-80">Implementação e treinamento</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2" />
                    <h4 className="font-bold">3 Meses 20% OFF</h4>
                    <p className="text-sm opacity-80">Desconto nos primeiros meses</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
                    asChild
                  >
                    <a href="#contact">
                      Garantir Minha Vaga
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6"
                    asChild
                  >
                    <a href="tel:+5555991255935">
                      <Phone className="mr-2 h-5 w-5" />
                      Falar com Consultor
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact CTA */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ainda tem dúvidas sobre qual plano escolher?
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Nossa equipe especializada te ajuda a escolher o plano ideal para seu condomínio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="https://wa.me/5555991255935?text=Olá! Gostaria de saber mais sobre os planos do Oryum House">
                  <Phone className="mr-2 h-5 w-5" />
                  WhatsApp: (55) 99125-5935
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="mailto:kallebyevangelho03@gmail.com">
                  Email: kallebyevangelho03@gmail.com
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
