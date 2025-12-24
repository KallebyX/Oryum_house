'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ============================================================================
// Tabs Root
// ============================================================================

const Tabs = TabsPrimitive.Root;

// ============================================================================
// Tabs List Variants
// ============================================================================

const tabsListVariants = cva(
  'inline-flex items-center justify-center text-muted-foreground',
  {
    variants: {
      variant: {
        default: 'h-10 rounded-lg bg-muted p-1 gap-1',
        underline: 'border-b border-border gap-0 bg-transparent p-0 h-auto',
        pills: 'gap-2 bg-transparent p-0 h-auto',
        segment: 'h-11 rounded-xl bg-muted/50 p-1 gap-0.5 shadow-inner-soft',
        card: 'gap-3 bg-transparent p-0 h-auto flex-wrap',
        minimal: 'gap-4 bg-transparent p-0 h-auto',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      fullWidth: false,
    },
  }
);

// ============================================================================
// Tabs Trigger Variants
// ============================================================================

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: [
          'rounded-md px-3 py-1.5',
          'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
          'hover:text-foreground',
        ],
        underline: [
          'relative px-4 py-3 rounded-none border-b-2 border-transparent -mb-px',
          'data-[state=active]:border-primary data-[state=active]:text-foreground',
          'hover:text-foreground hover:border-border',
          'transition-colors duration-200',
        ],
        pills: [
          'rounded-full px-4 py-2 border border-transparent',
          'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary',
          'hover:bg-muted hover:text-foreground',
          'transition-all duration-200',
        ],
        segment: [
          'rounded-lg px-4 py-2 flex-1',
          'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md',
          'hover:text-foreground',
          'transition-all duration-200',
        ],
        card: [
          'relative rounded-xl px-5 py-4 border border-border bg-card',
          'data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-foreground data-[state=active]:shadow-md',
          'hover:border-primary/50 hover:bg-muted/50',
          'transition-all duration-200',
        ],
        minimal: [
          'relative px-1 py-2 text-muted-foreground',
          'data-[state=active]:text-foreground',
          'hover:text-foreground',
          'transition-colors duration-200',
          'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 after:transition-transform after:duration-200',
          'data-[state=active]:after:scale-x-100',
        ],
      },
      size: {
        sm: '',
        default: '',
        lg: '',
      },
      fullWidth: {
        true: 'flex-1',
        false: '',
      },
    },
    compoundVariants: [
      // Size variations for default variant
      { variant: 'default', size: 'sm', className: 'px-2 py-1 text-xs' },
      { variant: 'default', size: 'lg', className: 'px-4 py-2 text-base' },
      // Size variations for underline variant
      { variant: 'underline', size: 'sm', className: 'px-3 py-2 text-xs' },
      { variant: 'underline', size: 'lg', className: 'px-5 py-4 text-base' },
      // Size variations for pills variant
      { variant: 'pills', size: 'sm', className: 'px-3 py-1.5 text-xs' },
      { variant: 'pills', size: 'lg', className: 'px-5 py-2.5 text-base' },
      // Size variations for segment variant
      { variant: 'segment', size: 'sm', className: 'px-3 py-1.5 text-xs' },
      { variant: 'segment', size: 'lg', className: 'px-5 py-2.5 text-base' },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
);

// ============================================================================
// Tabs Content Variants
// ============================================================================

const tabsContentVariants = cva(
  'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      animation: {
        none: '',
        fade: 'data-[state=active]:animate-fade-in data-[state=inactive]:animate-fade-out',
        slide: 'data-[state=active]:animate-slide-in-from-right data-[state=inactive]:animate-slide-out-to-left',
        scale: 'data-[state=active]:animate-scale-in data-[state=inactive]:animate-scale-out',
      },
      spacing: {
        none: '',
        sm: 'mt-3',
        default: 'mt-4',
        lg: 'mt-6',
      },
    },
    defaultVariants: {
      animation: 'fade',
      spacing: 'default',
    },
  }
);

// ============================================================================
// Component Types
// ============================================================================

interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  description?: string;
}

interface TabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>,
    VariantProps<typeof tabsContentVariants> {}

// ============================================================================
// Tabs List Component
// ============================================================================

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, fullWidth, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, fullWidth, className }))}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

// ============================================================================
// Tabs Trigger Component
// ============================================================================

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, size, fullWidth, icon, badge, description, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, size, fullWidth, className }))}
    {...props}
  >
    {variant === 'card' && description ? (
      <div className="flex flex-col items-start gap-1">
        <div className="flex items-center gap-2">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span className="font-medium">{children}</span>
          {badge && <span className="flex-shrink-0">{badge}</span>}
        </div>
        <span className="text-xs text-muted-foreground font-normal">{description}</span>
      </div>
    ) : (
      <span className="flex items-center gap-2">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {badge && <span className="flex-shrink-0">{badge}</span>}
      </span>
    )}
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// ============================================================================
// Tabs Content Component
// ============================================================================

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, animation, spacing, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(tabsContentVariants({ animation, spacing, className }))}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// ============================================================================
// View Toggle Component (Segmented Control)
// ============================================================================

interface ViewToggleOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  hideLabel?: boolean;
}

interface ViewToggleProps {
  value: string;
  onValueChange: (value: string) => void;
  options: ViewToggleOption[];
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const viewToggleSizes = {
  sm: 'h-8 text-xs',
  default: 'h-9 text-sm',
  lg: 'h-11 text-base',
};

const viewToggleButtonSizes = {
  sm: 'px-2.5 py-1',
  default: 'px-3 py-1.5',
  lg: 'px-4 py-2',
};

function ViewToggle({ value, onValueChange, options, size = 'default', className }: ViewToggleProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center rounded-lg border border-border bg-card p-1 gap-0.5',
        'shadow-sm',
        viewToggleSizes[size],
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onValueChange(option.value)}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-md font-medium',
            'ring-offset-background transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
            'disabled:pointer-events-none disabled:opacity-50',
            viewToggleButtonSizes[size],
            value === option.value
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
        >
          {option.icon && (
            <span className="flex-shrink-0 [&>svg]:h-4 [&>svg]:w-4">
              {option.icon}
            </span>
          )}
          {!option.hideLabel && (
            <span className={cn(option.icon && 'hidden sm:inline')}>
              {option.label}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ViewToggle,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants,
};

export type { TabsListProps, TabsTriggerProps, TabsContentProps, ViewToggleProps, ViewToggleOption };
