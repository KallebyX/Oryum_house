import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Oryum House - Sistema de Gestão de Condomínios',
  description: 'Transforme a gestão do seu condomínio com tecnologia inteligente. Sistema completo com demandas, reservas, comunicados e muito mais.',
};

export default async function HomePage() {
  // Redirecionar para a landing page de vendas
  redirect('/landing');
}
