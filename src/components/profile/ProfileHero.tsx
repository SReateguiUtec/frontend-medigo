import { Mail, Pencil } from 'lucide-react';
import { DashboardPanel } from '@/components/dashboard';
import { ProfileStatusBadge } from './ProfileUI';

interface ProfileHeroProps {
    title: string;
    email: string;
    photoSlot: React.ReactNode;
    accountActive: boolean;
    badges?: React.ReactNode;
    onEdit?: () => void;
    footer?: React.ReactNode;
}

export function ProfileHero({ title, email, photoSlot, accountActive, badges, onEdit, footer }: ProfileHeroProps) {
    return (
        <DashboardPanel className="mb-8 overflow-hidden p-0">
            <div className="h-24 bg-linear-to-r from-blue-700 via-blue-600 to-blue-700 md:h-28" />

            <div className="px-5 pb-6 md:px-8">
                {/* Row: photo + info + edit button all on same baseline */}
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    {/* Left: avatar (overlaps banner) + identity */}
                    <div className="flex items-center gap-5">
                        <div className="-mt-14 shrink-0 md:-mt-16">
                            {photoSlot}
                        </div>
                        {/* Info — sits in the white area, no negative margin */}
                        <div className="min-w-0 pt-2">
                            <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                                {title}
                            </h1>
                            <p className="mt-1.5 flex items-center gap-2 text-sm text-slate-500">
                                <Mail className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                                <span className="truncate">{email}</span>
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <ProfileStatusBadge active={accountActive} />
                                {badges}
                            </div>
                        </div>
                    </div>

                    {onEdit && (
                        <button
                            type="button"
                            onClick={onEdit}
                            className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 md:w-auto"
                        >
                            <Pencil className="h-4 w-4" strokeWidth={1.75} />
                            Editar perfil
                        </button>
                    )}
                </div>

                {footer && <div className="mt-5 border-t border-slate-100 pt-5">{footer}</div>}
            </div>
        </DashboardPanel>
    );
}
