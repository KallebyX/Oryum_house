'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: 'Erro de Configuração',
    description:
      'Há um problema com a configuração do servidor. Entre em contato com o suporte.',
  },
  AccessDenied: {
    title: 'Acesso Negado',
    description:
      'Você não tem permissão para acessar este recurso. Verifique suas credenciais.',
  },
  Verification: {
    title: 'Erro de Verificação',
    description:
      'O token de verificação é inválido ou expirou. Solicite um novo link de verificação.',
  },
  OAuthSignin: {
    title: 'Erro no OAuth',
    description:
      'Erro ao tentar fazer login com o provedor OAuth. Tente novamente.',
  },
  OAuthCallback: {
    title: 'Erro no Callback',
    description:
      'Erro ao processar o retorno do provedor OAuth. Tente novamente.',
  },
  OAuthCreateAccount: {
    title: 'Erro ao Criar Conta',
    description:
      'Não foi possível criar sua conta com o provedor OAuth. Tente usar email e senha.',
  },
  EmailCreateAccount: {
    title: 'Erro ao Criar Conta',
    description:
      'Não foi possível criar sua conta com este email. Tente outro email ou entre em contato com o suporte.',
  },
  Callback: {
    title: 'Erro de Callback',
    description:
      'Erro ao processar o callback de autenticação. Tente fazer login novamente.',
  },
  OAuthAccountNotLinked: {
    title: 'Conta Não Vinculada',
    description:
      'Este email já está registrado com outro método de login. Use o método original para fazer login.',
  },
  EmailSignin: {
    title: 'Erro ao Enviar Email',
    description:
      'Não foi possível enviar o email de verificação. Verifique seu endereço de email.',
  },
  CredentialsSignin: {
    title: 'Erro de Credenciais',
    description:
      'Email ou senha inválidos. Verifique suas credenciais e tente novamente.',
  },
  SessionRequired: {
    title: 'Sessão Expirada',
    description: 'Sua sessão expirou. Por favor, faça login novamente.',
  },
  Default: {
    title: 'Erro de Autenticação',
    description:
      'Ocorreu um erro inesperado durante a autenticação. Tente novamente.',
  },
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error') || 'Default';

  const errorInfo =
    errorMessages[error as keyof typeof errorMessages] || errorMessages.Default;

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Ops! Algo deu errado
          </h1>
          <p className="text-sm text-muted-foreground">
            Encontramos um problema ao tentar autenticá-lo
          </p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{errorInfo.title}</AlertTitle>
          <AlertDescription>{errorInfo.description}</AlertDescription>
        </Alert>

        <div className="flex flex-col gap-2">
          <Button asChild>
            <Link href="/auth/signin">Voltar para o login</Link>
          </Button>

          {error === 'CredentialsSignin' && (
            <Button variant="outline" asChild>
              <Link href="/auth/forgot-password">Esqueci minha senha</Link>
            </Button>
          )}

          {error === 'OAuthAccountNotLinked' && (
            <Button variant="outline" asChild>
              <Link href="/auth/signin">Fazer login com email</Link>
            </Button>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Precisa de ajuda?{' '}
            <Link
              href="/support"
              className="underline underline-offset-4 hover:text-primary"
            >
              Entre em contato com o suporte
            </Link>
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="rounded-md bg-muted p-4">
            <p className="text-xs font-mono">
              <strong>Debug Info:</strong> {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
