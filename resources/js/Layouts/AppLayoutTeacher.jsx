import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import UnregNav from '@/Nav_Bar/unreg_nav_teacher';
import Footer from '@/Nav_Bar/footer';

export default function AppLayout({ children, title = 'STUDIFY' }) {
    const { auth } = usePage().props;
    const isAuthenticated = auth && auth.user;

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={title} />

            {/* Always show UnregNav */}
            <UnregNav />

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
