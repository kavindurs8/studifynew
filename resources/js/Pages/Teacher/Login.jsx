import { useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';

export default function TeacherLogin({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('teacher.login'));
    };

    return (
        <GuestLayout>
            <Head title="Teacher Login" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 text-center">
                    Teacher Login
                </h1>
                <p className="mt-2 text-sm text-gray-600 text-center">
                    Sign in to your teacher account
                </p>
            </div>

            {/* Status Messages */}
            {status && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="text-sm text-green-700">{status}</div>
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between mt-4">
                    <Link
                        href={route('teacher.password.request')}
                        className="text-sm text-blue-600 hover:text-blue-500 underline"
                    >
                        Forgot your password?
                    </Link>

                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                </div>

                <div className="flex items-center justify-between mt-6">
                    <div className="text-sm">
                        <Link
                            href={route('teacher.register')}
                            className="text-blue-600 hover:text-blue-500"
                        >
                            Don't have an account? Register
                        </Link>
                    </div>

                    <PrimaryButton disabled={processing}>
                        {processing ? 'Signing in...' : 'Sign in'}
                    </PrimaryButton>
                </div>
            </form>

            {/* Back to Home */}
            <div className="mt-6 text-center">
                <Link
                    href="/"
                    className="text-sm text-gray-600 hover:text-gray-500"
                >
                    ← Back to Home
                </Link>
            </div>
        </GuestLayout>
    );
}
