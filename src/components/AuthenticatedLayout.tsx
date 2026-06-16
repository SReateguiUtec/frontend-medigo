import { Sidebar } from './Sidebar';

interface AuthenticatedLayoutProps {
    children: React.ReactNode;
    noPadding?: boolean;
}

export const AuthenticatedLayout = ({ children, noPadding = false }: AuthenticatedLayoutProps) => {
    return (
        <div className="flex min-h-dvh bg-[#F7F9FA]">
            <Sidebar />
            <main className="ml-0 flex-1 overflow-y-auto pt-16 transition-all duration-300 md:ml-72 md:pt-0">
                <div
                    className={
                        noPadding
                            ? 'min-h-dvh'
                            : 'mx-auto min-h-dvh max-w-7xl px-4 py-6 md:px-8 md:py-8'
                    }
                >
                    {children}
                </div>
            </main>
        </div>
    );
};
