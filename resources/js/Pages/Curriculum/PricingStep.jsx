import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { FaArrowLeft, FaCheck, FaDollarSign, FaGift } from 'react-icons/fa';

export default function PricingStep({ data, setData, errors, pricingTiers, courseId, onPrev }) {
    const [submitting, setSubmitting] = useState(false);
    const { put, processing } = useForm();

    const handlePricingTierChange = (tierId) => {
        const tier = pricingTiers.find(t => t.id === parseInt(tierId));
        if (tier) {
            setData('pricing_tier_id', tier.id);
        }
    };

    const handleSubmitForReview = async () => {
        setSubmitting(true);

        try {
            // First update the course with final details
            const updateData = {
                pricing_tier_id: data.pricing_tier_id,
                level: data.level,
                language: data.language
            };

            await fetch(`/teacher/courses/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(updateData)
            });

            // Then submit for review
            const response = await fetch(`/teacher/courses/${courseId}/submit-for-review`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            const result = await response.json();

            if (result.success) {
                // Redirect to course management with success message
                window.location.href = `/teacher/courses?message=Course submitted for review successfully!`;
            } else {
                alert(result.error || 'Failed to submit course for review');
            }
        } catch (error) {
            console.error('Error submitting course:', error);
            alert('An error occurred while submitting the course for review');
        } finally {
            setSubmitting(false);
        }
    };

    const selectedTier = pricingTiers.find(t => t.id === data.pricing_tier_id);
    const isFree = selectedTier?.price === 0;

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Set a Price for Your Course</h2>
                <p className="text-gray-600 mt-2">
                    Please select the currency and the price tier for your course. If you'd like to offer your course for free,
                    it must have a total video length of less than 2 hours. Also, courses with practice tests can not be free.
                </p>
            </div>

            <div className="space-y-8">
                {/* Pricing Tiers */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Pricing Tier</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pricingTiers.map((tier) => (
                            <div
                                key={tier.id}
                                className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                    data.pricing_tier_id === tier.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => handlePricingTierChange(tier.id)}
                            >
                                {data.pricing_tier_id === tier.id && (
                                    <div className="absolute top-2 right-2">
                                        <div className="bg-blue-500 text-white rounded-full p-1">
                                            <FaCheck className="h-3 w-3" />
                                        </div>
                                    </div>
                                )}

                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        {tier.price === 0 ? (
                                            <FaGift className="h-6 w-6 text-green-500" />
                                        ) : (
                                            <FaDollarSign className="h-6 w-6 text-blue-500" />
                                        )}
                                    </div>

                                    <h4 className="font-semibold text-gray-900">{tier.name}</h4>

                                    <div className="text-2xl font-bold text-gray-900 mt-2">
                                        {tier.price === 0 ? (
                                            'FREE'
                                        ) : (
                                            `${tier.currency_symbol}${tier.price}`
                                        )}
                                    </div>

                                    {tier.description && (
                                        <p className="text-sm text-gray-600 mt-2">{tier.description}</p>
                                    )}

                                    {tier.features && tier.features.length > 0 && (
                                        <ul className="text-xs text-gray-500 mt-3 space-y-1">
                                            {tier.features.map((feature, index) => (
                                                <li key={index} className="flex items-center">
                                                    <FaCheck className="h-3 w-3 text-green-500 mr-1" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <input
                                    type="radio"
                                    name="pricing_tier"
                                    value={tier.id}
                                    checked={data.pricing_tier_id === tier.id}
                                    onChange={() => handlePricingTierChange(tier.id)}
                                    className="sr-only"
                                />
                            </div>
                        ))}
                    </div>
                    {errors.pricing_tier_id && (
                        <p className="mt-2 text-sm text-red-600">{errors.pricing_tier_id}</p>
                    )}
                </div>

                {/* Course Level */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Level</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {['beginner', 'intermediate', 'advanced'].map((level) => (
                            <div
                                key={level}
                                className={`border-2 rounded-lg p-3 cursor-pointer text-center transition-all ${
                                    data.level === level
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setData('level', level)}
                            >
                                <div className="font-medium text-gray-900 capitalize">{level}</div>
                                <input
                                    type="radio"
                                    name="level"
                                    value={level}
                                    checked={data.level === level}
                                    onChange={(e) => setData('level', e.target.value)}
                                    className="sr-only"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Course Language */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Language</h3>
                    <select
                        value={data.language}
                        onChange={(e) => setData('language', e.target.value)}
                        className="mt-1 block w-full md:w-1/2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                        <option value="chinese">Chinese</option>
                        <option value="japanese">Japanese</option>
                        <option value="arabic">Arabic</option>
                        <option value="hindi">Hindi</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Free Course Warning */}
                {isFree && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <FaGift className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">
                                    Free Course Requirements
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Total video content must be less than 2 hours</li>
                                        <li>Courses with quizzes cannot be free</li>
                                        <li>Limited marketing features</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Course Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-700">Price:</span>
                            <span className="ml-2 text-gray-900">
                                {selectedTier ? (
                                    selectedTier.price === 0 ? 'FREE' : `${selectedTier.currency_symbol}${selectedTier.price}`
                                ) : 'Not selected'}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Level:</span>
                            <span className="ml-2 text-gray-900 capitalize">{data.level}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Language:</span>
                            <span className="ml-2 text-gray-900 capitalize">{data.language}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Status:</span>
                            <span className="ml-2 text-yellow-600">Will be submitted for review</span>
                        </div>
                    </div>
                </div>

                {/* Submission Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FaCheck className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">
                                Ready to Submit for Review
                            </h3>
                            <p className="mt-2 text-sm text-blue-700">
                                Once you submit your course, it will be reviewed by our team. This process typically takes 1-3 business days.
                                You'll receive an email notification when the review is complete.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-8 border-t mt-8">
                <button
                    type="button"
                    onClick={onPrev}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <FaArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                </button>

                <button
                    type="button"
                    onClick={handleSubmitForReview}
                    disabled={submitting || !data.pricing_tier_id}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Submitting...' : 'Submit for Review'}
                    <FaCheck className="ml-2 h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
