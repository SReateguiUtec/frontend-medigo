import { Sidebar } from './Sidebar';

interface AuthenticatedLayoutProps {
    children: React.ReactNode;
    noPadding?: boolean;
}

export const AuthenticatedLayout = ({ children, noPadding = false }: AuthenticatedLayoutProps) => {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 ml-64 overflow-y-auto">
                <div className={noPadding ? 'h-full' : 'p-8'}>
                    {children}
                </div>
            </main>
        </div>
    );
};
