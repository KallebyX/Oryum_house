import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LandingPage } from '@/components/pages/landing';

export const metadata: Metadata = {
  title: 'Início',
  description: 'Bem-vindo ao Oryum House - Sistema de gestão de condomínios',
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return <LandingPage />;
}
