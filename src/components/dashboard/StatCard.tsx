import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    label: string;
    value: string;
    hint?: string;
    icon: LucideIcon;
    trend?: string;
    trendPositive?: boolean;
    className?: string;
}

export function StatCard({ label, value, hint, icon: Icon, trend, trendPositive, className }: StatCardProps) {
    return (
        <article
            className={cn(
                'group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-blue-200/80 hover:shadow-[0_8px_24px_rgba(15,118,110,0.08)]',
                className
            )}
        >
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100/80">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </div>
                {trend && (
                    <span
                        className={cn(
                            'rounded-full px-2.5 py-1 text-xs font-medium',
                            trendPositive === false
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-emerald-50 text-emerald-700'
                        )}
                    >
                        {trend}
                    </span>
                )}
            </div>
            <p className="mt-4 text-sm text-slate-500">{label}</p>
            <p className="mt-1 font-display text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
                {value}
            </p>
            {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </article>
    );
}
