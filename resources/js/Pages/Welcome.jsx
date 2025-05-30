import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <AppLayout title="Welcome to STUDIFY">
            <Head title="Welcome" />
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Welcome to STUDIFY
                    </h1>
                    <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                        Learn from the best instructors around the world. Start your journey today!
                    </p>
                    <div className="space-x-4">
                        <a
                            href="/register"
                            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Get Started
                        </a>
                        <a
                            href="/login"
                            className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                        >
                            Sign In
                        </a>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

