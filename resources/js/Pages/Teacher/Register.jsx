import { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';

export default function TeacherRegister() {
    const { props } = usePage();
    const [currentStep, setCurrentStep] = useState(1);
    const [showOtpForm, setShowOtpForm] = useState(props.show_otp_form || false);
    const [teacherId, setTeacherId] = useState(props.teacher_id || null);
    const [isVerified, setIsVerified] = useState(props.email_verified || false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        nationality: '',
        contact_no: '',
        linkedin_id: '',
        expertise_area: '',
        teaching_experience: '',
        recent_company: '',
        recent_qualification: '',
        university_name: '',
        specialization: '',
        cv: null,
    });

    const { data: otpData, setData: setOtpData, post: postOtp, processing: otpProcessing, errors: otpErrors } = useForm({
        teacher_id: props.teacher_id || '',
        otp: '',
    });

    // Handle props changes
    useEffect(() => {
        if (props.teacher_id) {
            setTeacherId(props.teacher_id);
            setOtpData('teacher_id', props.teacher_id);
        }
        if (props.show_otp_form) {
            setShowOtpForm(true);
        }
        if (props.email_verified) {
            setIsVerified(true);
        }
    }, [props]);

    const expertiseAreas = [
        'Development', 'Business', 'Finance & Accounting', 'IT & Software',
        'Office Productivity', 'Personal Development', 'Design', 'Marketing',
        'Lifestyle', 'Photography & Video', 'Health & Fitness', 'Music',
        'Teaching & Academics', 'Other'
    ];

    const experienceOptions = ['0', '0 - 1', '1 - 3', '3 - 5', '5 + years'];

    const nextStep = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted with data:', data);

        post('/teacher/register', {
            forceFormData: true,
            onSuccess: () => {
                console.log('Registration successful');
                // The component will re-render with new props
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            }
        });
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        postOtp('/teacher/verify-otp', {
            onSuccess: (page) => {
                console.log('OTP verification successful');
                // Check if we're being redirected
                if (page.props.redirect) {
                    window.location.href = page.props.redirect;
                }
            },
            onError: (errors) => {
                console.log('OTP errors:', errors);
            }
        });
    };

    const resendOtp = () => {
        post('/teacher/resend-otp', {
            teacher_id: teacherId,
        });
    };

    // Show success message if verified
    if (isVerified) {
        return (
            <GuestLayout>
                <Head title="Registration Complete" />
                <div className="text-center">
                    <div className="mb-4 text-green-600">
                        <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Complete!</h2>
                    <p className="text-gray-600 mb-6">
                        Your email has been verified successfully. Your account is now pending admin approval.
                        You will receive an email notification once your account is approved.
                    </p>
                    <a href="/teacher/login" className="text-blue-600 hover:text-blue-500">
                        Go to Login
                    </a>
                </div>
            </GuestLayout>
        );
    }

    // Show OTP form if registration is complete
    if (showOtpForm) {
        return (
            <GuestLayout>
                <Head title="Verify Email" />
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Verify Your Email</h2>
                    <p className="text-gray-600 mb-6">
                        We've sent a 6-digit OTP to your email address. Please enter it below to verify your account.
                    </p>

                    {/* Show success/error messages */}
                    {props.message && (
                        <div className={`mb-4 p-4 rounded ${props.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {props.message}
                        </div>
                    )}

                    <form onSubmit={handleOtpSubmit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="otp" value="Enter OTP" />
                            <TextInput
                                id="otp"
                                type="text"
                                className="mt-1 block w-full text-center text-2xl tracking-widest"
                                value={otpData.otp}
                                onChange={(e) => setOtpData('otp', e.target.value)}
                                maxLength="6"
                                placeholder="000000"
                            />
                            <InputError message={otpErrors.otp || errors.otp} className="mt-2" />
                        </div>

                        <PrimaryButton className="w-full" disabled={otpProcessing}>
                            {otpProcessing ? 'Verifying...' : 'Verify OTP'}
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

    return (
        <GuestLayout>
            <Head title="Teacher Registration" />

            {/* Show success/error messages */}
            {props.message && (
                <div className={`mb-4 p-4 rounded ${props.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {props.message}
                </div>
            )}

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
                    Teacher Registration
                </h2>

                {/* Progress Bar */}
                <div className="flex items-center justify-center mb-6">
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                                {step}
                            </div>
                            {step < 3 && (
                                <div className={`w-16 h-1 ${
                                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="name" value="Full Name" />
                                <TextInput
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    className="mt-1 block w-full"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    className="mt-1 block w-full"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="nationality" value="Nationality" />
                                <TextInput
                                    id="nationality"
                                    className="mt-1 block w-full"
                                    value={data.nationality}
                                    onChange={(e) => setData('nationality', e.target.value)}
                                    required
                                />
                                <InputError message={errors.nationality} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="contact_no" value="Contact Number" />
                                <TextInput
                                    id="contact_no"
                                    className="mt-1 block w-full"
                                    value={data.contact_no}
                                    onChange={(e) => setData('contact_no', e.target.value)}
                                    required
                                />
                                <InputError message={errors.contact_no} className="mt-2" />
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel htmlFor="linkedin_id" value="LinkedIn ID (Optional)" />
                                <TextInput
                                    id="linkedin_id"
                                    className="mt-1 block w-full"
                                    value={data.linkedin_id}
                                    onChange={(e) => setData('linkedin_id', e.target.value)}
                                />
                                <InputError message={errors.linkedin_id} className="mt-2" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Professional Information */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>

                        <div>
                            <InputLabel htmlFor="expertise_area" value="Area of Expertise" />
                            <select
                                id="expertise_area"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                value={data.expertise_area}
                                onChange={(e) => setData('expertise_area', e.target.value)}
                                required
                            >
                                <option value="">Select your area of expertise</option>
                                {expertiseAreas.map((area) => (
                                    <option key={area} value={area}>{area}</option>
                                ))}
                            </select>
                            <InputError message={errors.expertise_area} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="teaching_experience" value="Teaching Experience" />
                            <select
                                id="teaching_experience"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                value={data.teaching_experience}
                                onChange={(e) => setData('teaching_experience', e.target.value)}
                                required
                            >
                                <option value="">Select your teaching experience</option>
                                {experienceOptions.map((exp) => (
                                    <option key={exp} value={exp}>{exp} years</option>
                                ))}
                            </select>
                            <InputError message={errors.teaching_experience} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="recent_company" value="Recent Company/Organization/Institute" />
                            <TextInput
                                id="recent_company"
                                className="mt-1 block w-full"
                                value={data.recent_company}
                                onChange={(e) => setData('recent_company', e.target.value)}
                                required
                            />
                            <InputError message={errors.recent_company} className="mt-2" />
                        </div>
                    </div>
                )}

                {/* Step 3: Qualifications & Documents */}
                {currentStep === 3 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">Qualifications & Documents</h3>

                        <div>
                            <InputLabel htmlFor="recent_qualification" value="Recent Qualification" />
                            <TextInput
                                id="recent_qualification"
                                className="mt-1 block w-full"
                                value={data.recent_qualification}
                                onChange={(e) => setData('recent_qualification', e.target.value)}
                                required
                            />
                            <InputError message={errors.recent_qualification} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="university_name" value="University Name" />
                            <TextInput
                                id="university_name"
                                className="mt-1 block w-full"
                                value={data.university_name}
                                onChange={(e) => setData('university_name', e.target.value)}
                                required
                            />
                            <InputError message={errors.university_name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="specialization" value="PhD/Masters Specialization (Optional)" />
                            <textarea
                                id="specialization"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                rows="3"
                                value={data.specialization}
                                onChange={(e) => setData('specialization', e.target.value)}
                                placeholder="Please mention your specialization..."
                            />
                            <InputError message={errors.specialization} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="cv" value="Upload CV" />
                            <input
                                id="cv"
                                type="file"
                                className="mt-1 block w-full"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setData('cv', e.target.files[0])}
                                required
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Accepted formats: PDF, DOC, DOCX (Max: 5MB)
                            </p>
                            <InputError message={errors.cv} className="mt-2" />
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                    {currentStep > 1 && (
                        <SecondaryButton type="button" onClick={prevStep}>
                            Previous
                        </SecondaryButton>
                    )}

                    <div className="ml-auto">
                        {currentStep < 3 ? (
                            <PrimaryButton type="button" onClick={nextStep}>
                                Next
                            </PrimaryButton>
                        ) : (
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing ? 'Registering...' : 'Complete Registration'}
                            </PrimaryButton>
                        )}
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
