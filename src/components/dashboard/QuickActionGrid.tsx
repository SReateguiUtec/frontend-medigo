import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuickAction {
    title: string;
    description?: string;
    icon: LucideIcon;
    onClick: () => void;
}

interface QuickActionGridProps {
    actions: QuickAction[];
    columns?: 2 | 3 | 4;
    className?: string;
}

export function QuickActionGrid({ actions, columns = 3, className }: QuickActionGridProps) {
    const gridCols = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-2 lg:grid-cols-4',
    };

    return (
        <div className={cn('grid gap-3', gridCols[columns], className)}>
            {actions.map((action) => (
                <button
                    key={action.title}
                    type="button"
                    onClick={action.onClick}
                    className="group flex min-h-[88px] cursor-pointer items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-[0_8px_24px_rgba(15,118,110,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-100 transition-colors duration-200 group-hover:bg-blue-100 group-hover:text-blue-800 group-hover:ring-blue-200">
                        <action.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{action.title}</p>
                        {action.description && (
                            <p className="mt-0.5 truncate text-xs text-slate-500">{action.description}</p>
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
}
