import { Sidebar } from './Sidebar';

interface AuthenticatedLayoutProps {
    children: React.ReactNode;
    noPadding?: boolean;
}

export const AuthenticatedLayout = ({ children, noPadding = false }: AuthenticatedLayoutProps) => {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 ml-0 md:ml-64 overflow-y-auto transition-all duration-300">
                <div className={noPadding ? 'h-full' : 'p-4 md:p-8'}>
                    {children}
                </div>
            </main>
        </div>
    );
};
