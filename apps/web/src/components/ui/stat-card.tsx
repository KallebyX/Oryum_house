import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink';
  className?: string;
  onClick?: () => void;
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    icon: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    value: 'text-blue-700 dark:text-blue-300',
    gradient: 'from-blue-500/10 to-transparent',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950/20',
    icon: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    value: 'text-green-700 dark:text-green-300',
    gradient: 'from-green-500/10 to-transparent',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    icon: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    value: 'text-purple-700 dark:text-purple-300',
    gradient: 'from-purple-500/10 to-transparent',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    icon: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    value: 'text-orange-700 dark:text-orange-300',
    gradient: 'from-orange-500/10 to-transparent',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950/20',
    icon: 'text-red-600 dark:text-red-400',
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    value: 'text-red-700 dark:text-red-300',
    gradient: 'from-red-500/10 to-transparent',
  },
  pink: {
    bg: 'bg-pink-50 dark:bg-pink-950/20',
    icon: 'text-pink-600 dark:text-pink-400',
    iconBg: 'bg-pink-100 dark:bg-pink-900/30',
    value: 'text-pink-700 dark:text-pink-300',
    gradient: 'from-pink-500/10 to-transparent',
  },
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = 'blue',
  className,
  onClick,
}: StatCardProps) {
  const colors = colorVariants[color];

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-card p-6',
        'hover:shadow-soft-lg transition-all duration-300',
        onClick && 'cursor-pointer hover:scale-[1.02]',
        className
      )}
      onClick={onClick}
    >
      {/* Background gradient */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-50',
          colors.gradient
        )}
      />

      {/* Content */}
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className={cn('text-3xl font-bold', colors.value)}>{value}</h3>
            </div>
            {description && (
              <p className="mt-2 text-xs text-muted-foreground">{description}</p>
            )}
          </div>

          {/* Icon */}
          <div className={cn('rounded-lg p-3', colors.iconBg)}>
            <Icon className={cn('h-6 w-6', colors.icon)} />
          </div>
        </div>

        {/* Trend */}
        {trend && (
          <div className="mt-4 flex items-center gap-2">
            <span
              className={cn(
                'text-xs font-medium',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
