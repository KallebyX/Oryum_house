'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Icons } from '@/components/ui/icons';
import { CheckCircle2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const emailValue = formData.get('email') as string;
    setEmail(emailValue);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao solicitar recuperação de senha');
      }

      setSuccess(true);
    } catch (error: any) {
      setError(
        error.message ||
          'Ocorreu um erro ao solicitar a recuperação de senha. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Email enviado!
            </h1>
            <p className="text-sm text-muted-foreground">
              Se existe uma conta associada a{' '}
              <span className="font-medium">{email}</span>, você receberá um email
              com instruções para redefinir sua senha.
            </p>
          </div>

          <Alert>
            <AlertDescription>
              <p className="mb-2">
                Por favor, verifique sua caixa de entrada e também a pasta de spam.
              </p>
              <p>O link de recuperação é válido por 1 hora.</p>
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/auth/signin">Voltar para o login</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSuccess(false);
                setEmail('');
              }}
            >
              Enviar para outro email
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Esqueceu sua senha?
          </h1>
          <p className="text-sm text-muted-foreground">
            Digite seu email e enviaremos instruções para redefinir sua senha
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          <form onSubmit={onSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="[email protected]"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  required
                />
              </div>
              <Button disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Enviar instruções
              </Button>
            </div>
          </form>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Lembrou sua senha?{' '}
            <Link
              href="/auth/signin"
              className="underline underline-offset-4 hover:text-primary"
            >
              Faça login
            </Link>
          </p>
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link
              href="/auth/signup"
              className="underline underline-offset-4 hover:text-primary"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
