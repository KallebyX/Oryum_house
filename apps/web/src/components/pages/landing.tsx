'use client';

import Link from 'next/link';
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
  Zap
} from 'lucide-react';

const features = [
  {
    icon: ClipboardList,
    title: 'Gestão de Demandas',
    description: 'Sistema completo de tickets com kanban, SLA e acompanhamento em tempo real.',
  },
  {
    icon: Calendar,
    title: 'Reservas de Áreas',
    description: 'Calendário inteligente para agendamento de áreas comuns com regras automáticas.',
  },
  {
    icon: MessageSquare,
    title: 'Comunicados',
    description: 'Central de comunicação com notificações push e confirmação de leitura.',
  },
  {
    icon: Vote,
    title: 'Assembleias Digitais',
    description: 'Votações online seguras com quórum automático e assinatura eletrônica.',
  },
  {
    icon: Shield,
    title: 'Portaria Virtual',
    description: 'Controle de visitantes, entregas e ocorrências com QR codes.',
  },
  {
    icon: BarChart3,
    title: 'Relatórios Inteligentes',
    description: 'Dashboard com métricas e relatórios exportáveis em PDF/CSV.',
  },
];

const stats = [
  { label: 'Condomínios Ativos', value: '500+' },
  { label: 'Usuários Cadastrados', value: '50K+' },
  { label: 'Demandas Resolvidas', value: '1M+' },
  { label: 'Satisfação', value: '4.9/5' },
];

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Oryum House</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Recursos
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Preços
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contato
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Começar Grátis</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Gestão de Condomínios
                <span className="block text-primary">Inteligente e Completa</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Sistema PWA 100% responsivo para síndicos e moradores. 
                Demandas, reservas, comunicados, assembleias e muito mais em uma única plataforma.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" asChild>
                  <Link href="/auth/signup">
                    <Zap className="mr-2 h-5 w-5" />
                    Começar Grátis
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#demo">
                    <Smartphone className="mr-2 h-5 w-5" />
                    Ver Demo
                  </Link>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tudo que você precisa para gerenciar seu condomínio
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Recursos completos para síndicos, zeladores, porteiros e moradores
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* PWA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <Smartphone className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Progressive Web App (PWA)
                </h2>
                <p className="text-xl text-muted-foreground">
                  Funciona como um app nativo no seu smartphone, com notificações push e funcionamento offline
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-full w-fit mx-auto mb-4">
                    <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Offline First</h3>
                  <p className="text-muted-foreground">
                    Continue usando mesmo sem internet
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-full w-fit mx-auto mb-4">
                    <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Notificações Push</h3>
                  <p className="text-muted-foreground">
                    Receba alertas em tempo real
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-full w-fit mx-auto mb-4">
                    <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Multi-tenant</h3>
                  <p className="text-muted-foreground">
                    Gerencie múltiplos condomínios
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto para modernizar seu condomínio?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Junte-se a centenas de condomínios que já revolucionaram sua gestão com o Oryum House
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/signup">
                  Começar Grátis Agora
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link href="#contact">
                  Falar com Vendas
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Oryum House</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#privacy" className="hover:text-foreground transition-colors">
                Privacidade
              </a>
              <a href="#terms" className="hover:text-foreground transition-colors">
                Termos
              </a>
              <a href="#support" className="hover:text-foreground transition-colors">
                Suporte
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 Oryum House. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
