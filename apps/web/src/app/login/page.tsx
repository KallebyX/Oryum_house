'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simular login - em produção, isso seria uma chamada para a API
      if (email === 'admin@oryumhouse.com' && password === 'admin123') {
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Redirecionando para o dashboard...',
        });
        
        // Simular redirecionamento
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else if (email === 'sindico@residencial.com' && password === 'sindico123') {
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Redirecionando para o dashboard...',
        });
        
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else if (email === 'morador@residencial.com' && password === 'morador123') {
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Redirecionando para o dashboard...',
        });
        
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        toast({
          title: 'Erro no login',
          description: 'Email ou senha incorretos.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro no login',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white">🏠</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Oryum House
            </CardTitle>
            <CardDescription className="text-gray-600">
              Faça login para acessar seu condomínio
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                <p className="mb-2">Contas de demonstração:</p>
                <div className="space-y-1 text-xs">
                  <p><strong>Admin:</strong> admin@oryumhouse.com / admin123</p>
                  <p><strong>Síndico:</strong> sindico@residencial.com / sindico123</p>
                  <p><strong>Morador:</strong> morador@residencial.com / morador123</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Link 
                href="/landing" 
                className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
              >
                ← Voltar para a página inicial
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
