'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Building2 } from 'lucide-react';

export default function TermsPage() {
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
            <span className="text-lg font-bold text-gray-900">Oryum House</span>
          </div>

          <Button className="bg-gradient-to-r from-blue-600 to-blue-700" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
        </div>
      </header>

      <main className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                Termos de Servico
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Ultima atualizacao: Dezembro de 2024
              </p>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    1. Aceitacao dos Termos
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Ao acessar e utilizar o sistema Oryum House, voce concorda em cumprir e estar vinculado
                    a estes Termos de Servico. Se voce nao concordar com qualquer parte destes termos, nao
                    devera utilizar nossos servicos.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    2. Descricao do Servico
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    O Oryum House e uma plataforma de gestao condominial que oferece funcionalidades para:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li>Gestao de demandas e solicitacoes</li>
                    <li>Reservas de areas comuns</li>
                    <li>Comunicados e avisos</li>
                    <li>Assembleias digitais</li>
                    <li>Portaria virtual</li>
                    <li>Relatorios e analises</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    3. Cadastro e Conta
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Para utilizar o sistema, voce devera criar uma conta fornecendo informacoes verdadeiras
                    e completas. Voce e responsavel por manter a confidencialidade de sua senha e por todas
                    as atividades realizadas em sua conta.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    4. Uso Aceitavel
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Voce concorda em utilizar o sistema apenas para fins legitimos e de acordo com estes termos.
                    E proibido:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li>Violar qualquer lei ou regulamento aplicavel</li>
                    <li>Transmitir conteudo ilegal, difamatorio ou prejudicial</li>
                    <li>Tentar acessar areas restritas do sistema</li>
                    <li>Interferir no funcionamento normal da plataforma</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    5. Pagamentos e Planos
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Os planos de assinatura sao cobrados mensalmente. O periodo de teste gratuito de 30 dias
                    esta disponivel para novos clientes. Cancelamentos podem ser feitos a qualquer momento
                    sem multas ou penalidades.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    6. Propriedade Intelectual
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Todo o conteudo, marcas, logos e software do Oryum House sao propriedade da Oryum Tech
                    e estao protegidos por leis de propriedade intelectual.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    7. Limitacao de Responsabilidade
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    O Oryum House e fornecido como esta. Nao garantimos que o servico sera ininterrupto
                    ou livre de erros. Em nenhum caso seremos responsaveis por danos indiretos, incidentais
                    ou consequenciais.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    8. Alteracoes nos Termos
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Reservamo-nos o direito de modificar estes termos a qualquer momento. As alteracoes
                    serao comunicadas atraves do sistema ou por e-mail. O uso continuado apos as
                    modificacoes constitui aceitacao dos novos termos.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    9. Contato
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Para duvidas sobre estes termos, entre em contato:
                  </p>
                  <ul className="list-none text-gray-700 mt-2 space-y-1">
                    <li>Email: kallebyevangelho03@gmail.com</li>
                    <li>WhatsApp: (55) 99125-5935</li>
                  </ul>
                </section>
              </div>

              <div className="mt-8 pt-6 border-t text-center">
                <p className="text-sm text-gray-500">
                  Desenvolvido pela Oryum Tech - Cacapava do Sul, RS
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
