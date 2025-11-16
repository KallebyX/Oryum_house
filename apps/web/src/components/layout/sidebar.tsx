'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Ticket,
  Calendar,
  Megaphone,
  Users,
  Package,
  UserCheck,
  FileText,
  Wrench,
  AlertTriangle,
  BarChart3,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: number;
  color?: string;
}

const navigation: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: Home },
  { title: 'Demandas', href: '/dashboard/tickets', icon: Ticket, badge: 8 },
  { title: 'Reservas', href: '/dashboard/bookings', icon: Calendar, badge: 2 },
  { title: 'Comunicados', href: '/dashboard/notices', icon: Megaphone, badge: 1 },
  { title: 'Assembleias', href: '/dashboard/assemblies', icon: Users },
  { title: 'Entregas', href: '/dashboard/deliveries', icon: Package },
  { title: 'Visitantes', href: '/dashboard/visitors', icon: UserCheck },
  { title: 'Documentos', href: '/dashboard/documents', icon: FileText },
  { title: 'Manutenções', href: '/dashboard/maintenance', icon: Wrench },
  { title: 'Ocorrências', href: '/dashboard/incidents', icon: AlertTriangle },
  { title: 'Relatórios', href: '/dashboard/reports', icon: BarChart3 },
  { title: 'Gamificação', href: '/dashboard/gamification', icon: Trophy, color: 'purple' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800',
        'transition-all duration-300 ease-in-out',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center w-full')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg shadow-lg">
            O
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Oryum House
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Condomínio Alpha
              </span>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(true)}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <div className="absolute -right-3 top-20 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCollapsed(false)}
            className="h-6 w-6 rounded-full p-0 shadow-md bg-white dark:bg-gray-950"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                'hover:bg-gray-100 dark:hover:bg-gray-900',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300',
                collapsed && 'justify-center'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 flex-shrink-0 transition-colors',
                  isActive
                    ? item.color === 'purple'
                      ? 'text-purple-600'
                      : 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                )}
              />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge
                      variant={isActive ? 'default' : 'secondary'}
                      className="h-5 px-1.5 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <Avatar className="h-10 w-10 ring-2 ring-gray-200 dark:ring-gray-800">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
              JD
            </div>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                João Silva
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Síndico
              </p>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="mt-3 flex gap-2">
            <Button variant="ghost" size="sm" className="flex-1 h-8">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 h-8">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
