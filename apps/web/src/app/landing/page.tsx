'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Users, 
  ClipboardList, 
  Calendar, 
  MessageSquare, 
  Vote,
  Shield,
  BarChart3,
  Smartphone,
  Zap,
  Check,
  X,
  ArrowRight,
  Star,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
  Play,
  Globe,
  Clock,
  Target,
  Award
} from 'lucide-react';

const features = [
  {
    icon: ClipboardList,
    title: 'Sistema de Demandas Inteligente',
    description: 'Kanban visual, SLA automático, histórico completo e avaliação de satisfação. Nunca mais perca o controle das solicitações.',
    highlight: true,
  },
  {
    icon: Calendar,
    title: 'Reservas Automatizadas',
    description: 'Calendário inteligente com regras personalizáveis, aprovação automática e controle de conflitos.',
  },
  {
    icon: MessageSquare,
    title: 'Comunicação Centralizada',
    description: 'Feed de comunicados com confirmação de leitura, segmentação por bloco e notificações push.',
  },
  {
    icon: Vote,
    title: 'Assembleias Digitais',
    description: 'Votações online seguras, controle de quórum automático e atas geradas automaticamente.',
  },
  {
    icon: Shield,
    title: 'Portaria Virtual',
    description: 'Controle de visitantes com QR codes, registro de entregas e gestão de ocorrências.',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Executivo',
    description: 'Métricas em tempo real, relatórios personalizados e exportação em PDF/CSV.',
  },
  {
    icon: Smartphone,
    title: 'App Nativo (PWA)',
    description: 'Funciona como aplicativo no celular, com notificações push e modo offline.',
  },
  {
    icon: Users,
    title: 'Gestão Multi-usuário',
    description: 'Controle de acesso por perfil: síndico, zelador, porteiro e moradores.',
  },
];

const plans = [
  {
    name: 'Essencial',
    description: 'Ideal para condomínios pequenos',
    residents: 'Até 50 moradores',
    price: 197,
    originalPrice: 280,
    features: [
      'Sistema de demandas completo',
      'Comunicados e avisos',
      'Gestão de usuários',
      'Relatórios básicos',
      'Suporte por email',
      'App móvel (PWA)',
      'Backup automático',
    ],
    limitations: [
      'Máximo 50 moradores',
      '500 demandas/mês',
      '1GB de armazenamento',
    ],
    popular: false,
  },
  {
    name: 'Profissional',
    description: 'Para condomínios médios',
    residents: 'Até 200 moradores',
    price: 297,
    originalPrice: 420,
    features: [
      'Tudo do plano Essencial',
      'Reservas de áreas comuns',
      'Assembleias digitais',
      'Portaria virtual',
      'Dashboard avançado',
      'Notificações push',
      'Suporte prioritário',
      'Integrações básicas',
      'Relatórios avançados',
    ],
    limitations: [
      'Máximo 200 moradores',
      '2.000 demandas/mês',
      '5GB de armazenamento',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'Para grandes condomínios',
    residents: 'Moradores ilimitados',
    price: 397,
    originalPrice: 580,
    features: [
      'Tudo do plano Profissional',
      'Moradores ilimitados',
      'Múltiplos condomínios',
      'API personalizada',
      'Relatórios executivos',
      'Suporte 24/7',
      'Treinamento incluído',
      'Customizações',
      'Integração WhatsApp',
      'Backup premium',
    ],
    limitations: [],
    popular: false,
  },
];

const testimonials = [
  {
    name: 'Maria Santos',
    role: 'Síndica - Residencial Jardins',
    content: 'Revolucionou nossa gestão! Reduzimos 80% do tempo gasto com demandas e a satisfação dos moradores aumentou muito.',
    rating: 5,
    residents: 120,
  },
  {
    name: 'João Silva',
    role: 'Administrador - Condomínio Horizonte',
    content: 'Sistema intuitivo e completo. Os moradores adoraram o app e agora tudo fica registrado e organizado.',
    rating: 5,
    residents: 85,
  },
  {
    name: 'Ana Costa',
    role: 'Síndica - Residencial Vista Verde',
    content: 'Melhor investimento que fizemos! O ROI foi imediato com a redução de custos administrativos.',
    rating: 5,
    residents: 200,
  },
];

const faqs = [
  {
    question: 'Como funciona a implementação?',
    answer: 'A implementação é 100% online e leva de 2-5 dias úteis. Nossa equipe faz toda a configuração inicial, migração de dados e treinamento da equipe.',
  },
  {
    question: 'Preciso de conhecimento técnico?',
    answer: 'Não! O sistema foi desenvolvido para ser extremamente intuitivo. Oferecemos treinamento completo e suporte contínuo.',
  },
  {
    question: 'Os dados ficam seguros?',
    answer: 'Sim! Utilizamos criptografia de ponta, backup automático diário e conformidade com a LGPD. Seus dados estão 100% protegidos.',
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim, sem multa ou burocracia. Você pode cancelar a qualquer momento e seus dados ficam disponíveis por 30 dias.',
  },
  {
    question: 'Funciona no celular?',
    answer: 'Perfeitamente! É um PWA (Progressive Web App) que funciona como aplicativo nativo, com notificações push e modo offline.',
  },
  {
    question: 'Tem período de teste?',
    answer: 'Sim! Oferecemos 30 dias grátis para você testar todas as funcionalidades sem compromisso.',
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Oryum House</h1>
              <p className="text-xs text-gray-500">Gestão Inteligente</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Funcionalidades
            </a>
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Planos
            </Link>
            <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Depoimentos
            </a>
            <a href="#about" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Quem Somos
            </a>
            <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Contato
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/signin">Entrar</Link>
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700" asChild>
              <a href="#contact">Teste Grátis</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-blue-700/5" />
        <div className="container mx-auto text-center relative">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700 mb-8">
              <Zap className="mr-2 h-4 w-4" />
              Sistema #1 em Gestão de Condomínios
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transforme a Gestão do seu
              <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Condomínio em 2024
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Sistema completo e inteligente que automatiza demandas, reservas, comunicados e assembleias. 
              Reduz custos em até <strong className="text-blue-600">60%</strong> e aumenta a satisfação dos moradores.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-6"
                asChild
              >
                <a href="#contact">
                  <Play className="mr-2 h-5 w-5" />
                  Começar Teste Grátis
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 border-blue-200 hover:bg-blue-50"
                asChild
              >
                <a href="#demo">
                  <Smartphone className="mr-2 h-5 w-5" />
                  Ver Demonstração
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {[
                { label: 'Condomínios Ativos', value: '500+' },
                { label: 'Moradores Satisfeitos', value: '50K+' },
                { label: 'Demandas Resolvidas', value: '1M+' },
                { label: 'Economia Média', value: '60%' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades que Fazem a Diferença
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tudo que você precisa para modernizar e otimizar a gestão do seu condomínio
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`text-center transition-all duration-300 hover:shadow-lg ${
                feature.highlight ? 'ring-2 ring-blue-200 bg-gradient-to-br from-blue-50 to-white' : 'hover:scale-105'
              }`}>
                <CardHeader>
                  <div className={`mx-auto mb-4 p-4 rounded-full w-fit ${
                    feature.highlight 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
                      : 'bg-blue-100'
                  }`}>
                    <feature.icon className={`h-8 w-8 ${
                      feature.highlight ? 'text-white' : 'text-blue-600'
                    }`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planos que Cabem no seu Orçamento
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Escolha o plano ideal para o tamanho do seu condomínio. Todos incluem 30 dias grátis!
            </p>
            <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm text-green-700">
              <Award className="mr-2 h-4 w-4" />
              💰 A partir de R$ 197/mês - Economia de até 60% nos custos
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'ring-2 ring-blue-500 shadow-xl bg-gradient-to-br from-white to-blue-50' 
                  : 'hover:shadow-lg'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium">
                      ⭐ Mais Popular
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="text-sm text-blue-600 font-medium mt-2">{plan.residents}</div>
                  
                  <div className="mt-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-gray-900">R$ {plan.price}</span>
                      <span className="text-gray-500">/mês</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-gray-500 line-through">R$ {plan.originalPrice}</span>
                      <span className="text-sm text-green-600 font-medium">
                        {Math.round((1 - plan.price / plan.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <li key={limitIndex} className="flex items-start text-gray-500">
                        <X className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <a href="#contact">
                      Começar Teste Grátis
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              💡 <strong>Dúvida sobre qual plano escolher?</strong> Nossa equipe te ajuda gratuitamente!
            </p>
            <Button variant="outline" asChild>
              <a href="#contact">Falar com Especialista</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que Nossos Clientes Dizem
            </h2>
            <p className="text-xl text-gray-600">
              Mais de 500 condomínios já transformaram sua gestão
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6 italic">
                    "{testimonial.content}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-xs text-blue-600 mt-1">
                      {testimonial.residents} moradores
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dúvidas Frequentes
            </h2>
            <p className="text-xl text-gray-600">
              Tudo que você precisa saber sobre o Oryum House
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="mb-4">
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </CardHeader>
                {openFaq === index && (
                  <CardContent>
                    <p className="text-gray-700">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Quem Somos
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Oryum Tech - Inovação em Gestão
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Somos uma <strong>software house especializada em criar soluções digitais completamente personalizadas</strong>. 
                  Nossa diferença está na transparência total, comunicação direta e no compromisso de entregar 
                  exatamente o que seu negócio precisa.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">3+</div>
                    <div className="text-sm text-gray-600">Anos de Experiência</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">20+</div>
                    <div className="text-sm text-gray-600">Projetos Entregues</div>
                  </div>
                </div>
                <Button asChild>
                  <a href="https://www.oryumtech.com.br/" target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Conheça a Oryum Tech
                  </a>
                </Button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Foco no Cliente</h4>
                    <p className="text-gray-600">Desenvolvemos cada funcionalidade pensando na experiência real dos usuários.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Suporte Contínuo</h4>
                    <p className="text-gray-600">Nossa equipe está sempre disponível para garantir o sucesso do seu condomínio.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Tecnologia Avançada</h4>
                    <p className="text-gray-600">Utilizamos as mais modernas tecnologias para garantir performance e segurança.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Nossa Missão</h3>
              <p className="text-lg leading-relaxed">
                Transformar a gestão condominial no Brasil através da tecnologia, 
                proporcionando mais eficiência, transparência e satisfação para síndicos e moradores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Revolucionar seu Condomínio?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Junte-se a mais de 500 condomínios que já transformaram sua gestão. 
            Comece seu teste gratuito hoje mesmo!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100"
              asChild
            >
              <a href="#contact">
                <Play className="mr-2 h-5 w-5" />
                Começar Teste Grátis - 30 Dias
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <a href="tel:+5555991255935">
                <Phone className="mr-2 h-5 w-5" />
                (55) 99125-5935
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Fale Conosco
              </h2>
              <p className="text-xl text-gray-600">
                Nossa equipe está pronta para te ajudar a transformar seu condomínio
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Entre em Contato Agora
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                      <a href="tel:+5555991255935" className="text-blue-600 hover:underline">
                        (55) 99125-5935
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">E-mail</h4>
                      <a href="mailto:kallebyevangelho03@gmail.com" className="text-blue-600 hover:underline">
                        kallebyevangelho03@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Localização</h4>
                      <p className="text-gray-600">Caçapava do Sul - RS<br />Atendimento nacional</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">🎉 Oferta Especial</h4>
                  <p className="text-green-700">
                    <strong>30 dias grátis</strong> + desconto de 20% nos primeiros 3 meses para novos clientes!
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Solicitar Demonstração
                </h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Seu nome"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp *
                    </label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="(55) 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Condomínio *
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: Residencial Jardins"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Moradores
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Selecione</option>
                      <option value="1-50">Até 50 moradores</option>
                      <option value="51-200">51 a 200 moradores</option>
                      <option value="201+">Mais de 200 moradores</option>
                    </select>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg py-6"
                  >
                    Solicitar Demonstração Gratuita
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Oryum House</h3>
                <p className="text-sm text-gray-400">by Oryum Tech</p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-8 mb-8">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                Funcionalidades
              </a>
              <a href="#plans" className="text-gray-400 hover:text-white transition-colors">
                Planos
              </a>
              <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                Quem Somos
              </a>
              <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                Contato
              </a>
            </div>
            
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-400 mb-4">
                © 2024 Oryum House - Sistema de Gestão de Condomínios
              </p>
              <p className="text-sm text-gray-500">
                Desenvolvido com ❤️ pela <a href="https://www.oryumtech.com.br/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Oryum Tech</a> em Caçapava do Sul - RS
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
