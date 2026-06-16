import { cn } from '@/lib/utils';

interface DashboardPanelProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md';
}

export function DashboardPanel({ children, className, padding = 'md' }: DashboardPanelProps) {
    const paddingClass = {
        none: '',
        sm: 'p-4',
        md: 'p-5 md:p-6',
    };

    return (
        <div
            className={cn(
                'rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]',
                paddingClass[padding],
                className
            )}
        >
            {children}
        </div>
    );
}
