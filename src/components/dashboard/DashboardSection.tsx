import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardSectionProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export function DashboardSection({
    title,
    description,
    icon: Icon,
    action,
    children,
    className,
}: DashboardSectionProps) {
    return (
        <section className={cn('space-y-4', className)}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    {Icon && (
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                            <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                        </div>
                    )}
                    <div>
                        <h2 className="font-display text-lg font-semibold tracking-tight text-slate-900">
                            {title}
                        </h2>
                        {description && (
                            <p className="mt-0.5 text-sm text-slate-500">{description}</p>
                        )}
                    </div>
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}
