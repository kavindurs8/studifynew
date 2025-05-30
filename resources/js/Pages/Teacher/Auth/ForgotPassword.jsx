import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';

export default function TeacherForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('teacher.password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password - Teacher" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 text-center">
                    Reset Teacher Password
                </h1>
                <p className="mt-2 text-sm text-gray-600 text-center">
                    Forgot your password? No problem. Just let us know your email address and we will email you a password reset link.
                </p>
            </div>

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
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="flex items-center justify-between mt-6">
                    <Link
                        href={route('teacher.login')}
                        className="text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Back to Login
                    </Link>

                    <PrimaryButton disabled={processing}>
                        {processing ? 'Sending...' : 'Email Password Reset Link'}
                    </PrimaryButton>
                </div>
            </form>

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
