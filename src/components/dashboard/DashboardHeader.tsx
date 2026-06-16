import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
    title: string;
    subtitle: string;
    action?: React.ReactNode;
    className?: string;
}

export function DashboardHeader({ title, subtitle, action, className }: DashboardHeaderProps) {
    return (
        <header className={cn('mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
            <div>
                <p className="mb-1 text-sm font-medium tracking-wide text-blue-700/80 uppercase">
                    Panel
                </p>
                <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                    {title}
                </h1>
                <p className="mt-2 max-w-xl text-base text-slate-500">{subtitle}</p>
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </header>
    );
}
