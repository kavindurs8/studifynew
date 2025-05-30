import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';

export default function VerifyEmail({ teacher_id, message }) {
    const { data, setData, post, processing, errors } = useForm({
        teacher_id: teacher_id || '',
        otp: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('teacher.verify-otp'));
    };

    const resendOtp = () => {
        post(route('teacher.resend-otp'), {
            teacher_id: teacher_id,
        });
    };

    return (
        <GuestLayout>
            <Head title="Verify Email" />

            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Verify Your Email</h2>
                <p className="text-gray-600 mb-6">
                    We've sent a 6-digit OTP to your email address. Please enter it below to verify your account.
                </p>

                {message && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                        {message}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="otp" value="Enter OTP" />
                        <TextInput
                            id="otp"
                            type="text"
                            className="mt-1 block w-full text-center text-2xl tracking-widest"
                            value={data.otp}
                            onChange={(e) => setData('otp', e.target.value)}
                            maxLength="6"
                            placeholder="000000"
                        />
                        <InputError message={errors.otp} className="mt-2" />
                    </div>

                    <PrimaryButton className="w-full" disabled={processing}>
                        {processing ? 'Verifying...' : 'Verify OTP'}
                    </PrimaryButton>
                </form>

                <div className="mt-4">
                    <button
                        type="button"
                        onClick={resendOtp}
                        className="text-sm text-blue-600 hover:text-blue-500"
                    >
                        Didn't receive the OTP? Resend
                    </button>
                </div>
            </div>
        </GuestLayout>
    );
}
