import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useState } from 'react';
import axios from 'axios';

const getProfilePictureUrl = (user) => {
    if (user.profile_picture) {
        return `/storage/${user.profile_picture}`;
    }
    if (user.avatar) {
        return user.avatar; // Google avatar URL
    }
    return null; // or a default placeholder
};

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
    className = '',
    countries,
}) {
    const user = usePage().props.auth.user;

    // Debug logging
    console.log('Profile form user data:', user);
    console.log('profile_picture field:', user.profile_picture);
    console.log('avatar field:', user.avatar);
    console.log('profile_image accessor:', user.profile_image);

    // Fix the initial preview URL to handle both cases
    const [previewUrl, setPreviewUrl] = useState(() => {
        // Priority: custom profile picture > Google avatar > null
        if (user.profile_picture) {
            return `/storage/${user.profile_picture}`;
        }
        if (user.avatar) {
            return user.avatar; // Google URL
        }
        return null;
    });

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            profile_picture: null,
            country: user.country || '',
            city: user.city || '',
            zip_code: user.zip_code || '',
            _method: 'patch',
        });

    const submit = (e) => {
        e.preventDefault();

        post(route('profile.update'));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('profile_picture', file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setPreviewUrl(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const removeProfilePicture = () => {
        // Change this from patch to post
        axios.post(route('profile.remove-picture'))
            .then(() => {
                setPreviewUrl(null);
                setData('profile_picture', null);
            })
            .catch(error => {
                console.error('Error removing profile picture:', error);
            });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form
                onSubmit={submit}
                className="mt-6 space-y-6"
                encType="multipart/form-data"
            >
                {/* Profile Picture Section */}
                <div>
                    <InputLabel htmlFor="profile_picture" value="Profile Picture" />

                    <div className="mt-2 flex items-center space-x-6">
                        <div className="shrink-0">
                            {previewUrl ? (
                                <img
                                    className="h-20 w-20 object-cover rounded-full border-2 border-gray-300"
                                    src={previewUrl}
                                    alt="Profile preview"
                                />
                            ) : (
                                <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center border-2 border-gray-300">
                                    <svg
                                        className="h-10 w-10 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <span>Change</span>
                                <input
                                    id="profile_picture"
                                    name="profile_picture"
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={handleFileChange}
                                />
                            </label>

                            {(previewUrl || user.profile_picture || user.avatar) && (
                                <button
                                    type="button"
                                    onClick={removeProfilePicture}
                                    className="text-sm text-red-600 hover:text-red-500"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>

                    <InputError message={errors.profile_picture} className="mt-2" />
                    <p className="mt-1 text-sm text-gray-500">
                        JPG, PNG, GIF up to 2MB
                    </p>
                </div>

                {/* Name Field */}
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* Email Field */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* Country Field */}
                <div>
                    <InputLabel htmlFor="country" value="Country (Optional)" />
                    <select
                        id="country"
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        value={data.country}
                        onChange={(e) => setData('country', e.target.value)}
                    >
                        <option value="">Select a country</option>
                        {countries.map((country) => (
                            <option key={country} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                    <InputError className="mt-2" message={errors.country} />
                </div>

                {/* City Field */}
                <div>
                    <InputLabel htmlFor="city" value="City (Optional)" />
                    <TextInput
                        id="city"
                        className="mt-1 block w-full"
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        autoComplete="address-level2"
                        placeholder="Enter your city"
                    />
                    <InputError className="mt-2" message={errors.city} />
                </div>

                {/* Zip Code Field */}
                <div>
                    <InputLabel htmlFor="zip_code" value="Zip Code (Optional)" />
                    <TextInput
                        id="zip_code"
                        className="mt-1 block w-full"
                        value={data.zip_code}
                        onChange={(e) => setData('zip_code', e.target.value)}
                        autoComplete="postal-code"
                        placeholder="Enter your zip code"
                    />
                    <InputError className="mt-2" message={errors.zip_code} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                A new verification link has been sent to your email
                                address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
