import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});
    const [emailSent, setEmailSent] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        setEmailSent(true);
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            </div>

            <div className="mb-4 text-sm text-gray-600 text-center">
                Thanks for signing up! Before getting started, please verify your email address by clicking on the link we just emailed to you. If you didn't receive the email, we will gladly send you another.
            </div>

            {(status === 'verification-link-sent' || emailSent) && (
                <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md p-4 text-center">
                    <svg className="w-5 h-5 text-green-600 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    A new verification link has been sent to your email address.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-6 flex flex-col space-y-4">
                    <PrimaryButton
                        disabled={processing}
                        className="w-full justify-center"
                    >
                        {processing ? 'Sending...' : 'Resend Verification Email'}
                    </PrimaryButton>

                    <div className="text-center">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Log Out
                        </Link>
                    </div>
                </div>
            </form>

            <div className="mt-6 text-xs text-gray-500 text-center">
                <p>Check your spam folder if you don't see the email in your inbox.</p>
            </div>
        </GuestLayout>
    );
}
