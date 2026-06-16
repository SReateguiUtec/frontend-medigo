import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const inputClassName =
    'w-full min-h-[44px] rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500';

interface ProfileFormFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
    helperText?: string;
    min?: string | number;
    max?: string | number;
    maxLength?: number;
    step?: string | number;
    rows?: number;
    autoComplete?: string;
    as?: 'input' | 'textarea';
}

export function ProfileFormField({
    label,
    name,
    value,
    onChange,
    type = 'text',
    placeholder,
    disabled,
    helperText,
    min,
    max,
    maxLength,
    step,
    rows = 4,
    autoComplete,
    as = 'input',
}: ProfileFormFieldProps) {
    return (
        <div>
            <label htmlFor={name} className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>
            {as === 'textarea' ? (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    rows={rows}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn(inputClassName, 'resize-none py-3')}
                />
            ) : (
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    min={min}
                    max={max}
                    maxLength={maxLength}
                    step={step}
                    autoComplete={autoComplete}
                    className={inputClassName}
                />
            )}
            {helperText && <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>}
        </div>
    );
}

interface ProfileFormActionsProps {
    onCancel: () => void;
    submitLabel?: string;
    isSubmitting?: boolean;
}

export function ProfileFormActions({
    onCancel,
    submitLabel = 'Guardar cambios',
    isSubmitting,
}: ProfileFormActionsProps) {
    return (
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border border-slate-200/80 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50"
            >
                Cancelar
            </button>
            <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50"
            >
                {isSubmitting ? 'Guardando...' : submitLabel}
            </button>
        </div>
    );
}

interface ProfileFieldProps {
    icon: LucideIcon;
    label: string;
    value: React.ReactNode;
}

export function ProfileField({ icon: Icon, label, value }: ProfileFieldProps) {
    return (
        <div className="flex items-start gap-3 rounded-xl px-1 py-3 transition-colors hover:bg-slate-50/80">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">{label}</p>
                <p className="mt-0.5 text-sm font-medium text-slate-900">{value}</p>
            </div>
        </div>
    );
}

interface ProfileInfoSectionProps {
    title: string;
    description?: string;
    icon: LucideIcon;
    children: React.ReactNode;
}

export function ProfileInfoSection({ title, description, icon: Icon, children }: ProfileInfoSectionProps) {
    return (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:p-6">
            <div className="mb-4 flex items-start gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                    <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </div>
                <div>
                    <h2 className="font-display text-base font-semibold text-slate-900">{title}</h2>
                    {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
                </div>
            </div>
            <div className="divide-y divide-slate-100">{children}</div>
        </section>
    );
}

export function ProfileAlert({ type, message }: { type: 'error' | 'success'; message: string }) {
    const isError = type === 'error';

    return (
        <div
            role="alert"
            className={cn(
                'mb-6 rounded-2xl border px-4 py-3.5',
                isError
                    ? 'border-rose-200/80 bg-rose-50/80 text-rose-800'
                    : 'border-emerald-200/80 bg-emerald-50/80 text-emerald-800'
            )}
        >
            <p className="text-sm font-semibold">{isError ? 'Error' : 'Listo'}</p>
            <p className="mt-0.5 text-sm opacity-90">{message}</p>
        </div>
    );
}

export function ProfileLoading() {
    return (
        <div className="flex min-h-[320px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                <p className="text-sm text-slate-500">Cargando perfil...</p>
            </div>
        </div>
    );
}

interface ProfileStatusBadgeProps {
    active: boolean;
}

export function ProfileStatusBadge({ active }: ProfileStatusBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1',
                active
                    ? 'bg-emerald-50 text-emerald-800 ring-emerald-100'
                    : 'bg-amber-50 text-amber-800 ring-amber-100'
            )}
        >
            {active ? 'Cuenta activa' : 'Cuenta inactiva'}
        </span>
    );
}
