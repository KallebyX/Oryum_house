'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Building2, Shield } from 'lucide-react';

export default function PrivacyPage() {
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
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-center">
                Politica de Privacidade
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Ultima atualizacao: Dezembro de 2024
              </p>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    1. Introducao
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    A Oryum Tech, desenvolvedora do sistema Oryum House, esta comprometida em proteger
                    sua privacidade. Esta politica descreve como coletamos, usamos e protegemos suas
                    informacoes pessoais em conformidade com a Lei Geral de Protecao de Dados (LGPD).
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    2. Dados Coletados
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Coletamos os seguintes tipos de informacoes:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li><strong>Dados de identificacao:</strong> nome, e-mail, telefone, CPF</li>
                    <li><strong>Dados de endereco:</strong> apartamento, bloco, condominio</li>
                    <li><strong>Dados de uso:</strong> logs de acesso, acoes realizadas no sistema</li>
                    <li><strong>Dados de comunicacao:</strong> mensagens, demandas, reservas</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    3. Finalidade do Tratamento
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Seus dados sao utilizados para:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li>Prover e manter o funcionamento do sistema</li>
                    <li>Autenticar e autorizar acesso aos recursos</li>
                    <li>Processar demandas, reservas e comunicados</li>
                    <li>Gerar relatorios e estatisticas para o condominio</li>
                    <li>Enviar notificacoes relevantes sobre o sistema</li>
                    <li>Melhorar nossos servicos e experiencia do usuario</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    4. Compartilhamento de Dados
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Seus dados podem ser compartilhados com:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li>Administracao do condominio (sindico, zelador)</li>
                    <li>Outros moradores (apenas informacoes publicas do condominio)</li>
                    <li>Prestadores de servico essenciais (hospedagem, backup)</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-2">
                    Nao vendemos ou compartilhamos seus dados com terceiros para fins de marketing.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    5. Seguranca dos Dados
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Implementamos medidas de seguranca para proteger seus dados:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li>Criptografia SSL/TLS em todas as comunicacoes</li>
                    <li>Senhas armazenadas com hash seguro (bcrypt)</li>
                    <li>Backups automaticos diarios</li>
                    <li>Controle de acesso baseado em funcoes</li>
                    <li>Monitoramento de seguranca continuo</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    6. Seus Direitos (LGPD)
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Voce tem direito a:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li>Confirmar a existencia de tratamento de seus dados</li>
                    <li>Acessar seus dados pessoais</li>
                    <li>Corrigir dados incompletos ou desatualizados</li>
                    <li>Solicitar anonimizacao ou exclusao de dados desnecessarios</li>
                    <li>Revogar consentimento a qualquer momento</li>
                    <li>Solicitar portabilidade dos dados</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    7. Retencao de Dados
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Seus dados sao mantidos enquanto voce for usuario ativo do sistema. Apos
                    cancelamento da conta, os dados sao mantidos por 30 dias para recuperacao
                    e depois anonimizados ou excluidos, exceto quando houver obrigacao legal
                    de retencao.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    8. Cookies e Tecnologias
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Utilizamos cookies essenciais para:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li>Manter sua sessao autenticada</li>
                    <li>Lembrar suas preferencias</li>
                    <li>Garantir a seguranca do sistema</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    9. Alteracoes nesta Politica
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Podemos atualizar esta politica periodicamente. Alteracoes significativas
                    serao comunicadas por e-mail ou atraves do sistema.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    10. Contato do Encarregado (DPO)
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Para exercer seus direitos ou esclarecer duvidas sobre privacidade:
                  </p>
                  <ul className="list-none text-gray-700 mt-2 space-y-1">
                    <li>Email: kallebyevangelho03@gmail.com</li>
                    <li>WhatsApp: (55) 99125-5935</li>
                    <li>Endereco: Cacapava do Sul - RS</li>
                  </ul>
                </section>
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 text-center">
                    Esta politica esta em conformidade com a Lei Geral de Protecao de Dados (LGPD - Lei 13.709/2018)
                  </p>
                </div>
                <p className="text-sm text-gray-500 text-center mt-4">
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
