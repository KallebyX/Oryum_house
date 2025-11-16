'use client';

import { Bell, Search, Moon, Sun, Command } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <button
          className={cn(
            'flex w-full items-center gap-3 rounded-lg border border-gray-300 dark:border-gray-700',
            'bg-gray-50 dark:bg-gray-900 px-4 py-2',
            'text-sm text-gray-500 dark:text-gray-400',
            'hover:border-gray-400 dark:hover:border-gray-600 transition-colors'
          )}
        >
          <Search className="h-4 w-4" />
          <span>Buscar...</span>
          <div className="ml-auto flex items-center gap-1">
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <Command className="h-3 w-3" />
              <span>K</span>
            </kbd>
          </div>
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="h-9 w-9 p-0"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
          <Bell className="h-4 w-4" />
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
          >
            3
          </Badge>
        </Button>

        {/* User Menu */}
        <Button variant="ghost" className="gap-2 h-9 px-2">
          <Avatar size="sm" fallback="João Silva" status="online" />
          <span className="hidden md:inline text-sm font-medium">João Silva</span>
        </Button>
      </div>
    </header>
  );
}
