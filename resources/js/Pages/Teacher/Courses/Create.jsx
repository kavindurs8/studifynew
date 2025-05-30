import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Create({ categories, pricingTiers }) {
    const { auth } = usePage().props;
    const teacher = auth.teacher;

    // Debug: Log the received data ONCE
    useEffect(() => {
        console.log('=== PRICING TIERS DEBUG ===');
        console.log('Raw Pricing Tiers:', pricingTiers);
        console.log('Pricing Tiers Length:', pricingTiers?.length);
        console.log('Pricing Tiers IDs:', pricingTiers?.map(tier => tier.id));
        console.log('========================');
    }, [pricingTiers]);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        category: '',
        intended_learners: '',
        learning_objectives: ['', '', '', ''],
        requirements: '',
        target_audience: '',
        pricing_tier_id: '',
        level: 'beginner',
        language: 'English'
    });

    const [currentStep, setCurrentStep] = useState(1);

    // Memoize pricing tiers to prevent re-renders
    const safePricingTiers = React.useMemo(() => {
        if (!Array.isArray(pricingTiers)) {
            console.log('pricingTiers is not an array:', typeof pricingTiers);
            return [];
        }

        // Remove any duplicates based on ID
        const uniqueTiers = pricingTiers.filter((tier, index, self) =>
            index === self.findIndex(t => t.id === tier.id)
        );

        console.log('Original tiers:', pricingTiers.length);
        console.log('Unique tiers:', uniqueTiers.length);

        return uniqueTiers;
    }, [pricingTiers]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting form data:', data);
        post(route('teacher.courses.store'));
    };

    const addLearningObjective = () => {
        setData('learning_objectives', [...data.learning_objectives, '']);
    };

    const removeLearningObjective = (index) => {
        if (data.learning_objectives.length > 4) {
            const newObjectives = data.learning_objectives.filter((_, i) => i !== index);
            setData('learning_objectives', newObjectives);
        }
    };

    const updateLearningObjective = (index, value) => {
        const newObjectives = [...data.learning_objectives];
        newObjectives[index] = value;
        setData('learning_objectives', newObjectives);
    };

    const nextStep = () => {
        if (currentStep < 5) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    return (
        <TeacherLayout
            teacher={teacher}
            title="Create New Course - STUDIFY"
            pageTitle="Create New Course"
            pageSubtitle="Build engaging courses that inspire and educate your students with our comprehensive course creation tools."
            activeMenuItem="courses"
        >
            <Head title="Create Course" />

            <div className="mx-auto max-w-8xl">
                {/* Progress Bar Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {[1, 2, 3, 4, 5].map((step) => (
                            <div
                                key={step}
                                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                                    step <= currentStep
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-gray-600 text-gray-400'
                                }`}
                            >
                                {step}
                            </div>
                        ))}
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(currentStep / 5) * 100}%` }}
                        ></div>
                    </div>
                    <div className="mt-3 text-center">
                        <span className="text-gray-300 text-sm font-medium">
                            Step {currentStep} of 5
                        </span>
                    </div>
                </div>

                {/* Main Form Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 shadow-lg">
                    <form onSubmit={handleSubmit} className="p-8">
                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <div className="space-y-8">
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">Course Basic Information</h3>
                                    <p className="text-gray-400">Let's start with the fundamentals of your course</p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Course Title</label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 transition-colors"
                                            placeholder="Enter your course title"
                                        />
                                        {errors.title && <div className="text-red-400 text-sm mt-2">{errors.title}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Course Category</label>
                                        <select
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 transition-colors"
                                        >
                                            <option value="">Select a category</option>
                                            {categories && categories.map((category) => (
                                                <option key={category.id} value={category.slug}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category && <div className="text-red-400 text-sm mt-2">{errors.category}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Course Level</label>
                                        <select
                                            value={data.level}
                                            onChange={(e) => setData('level', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 transition-colors"
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Course Description</label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={5}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 transition-colors"
                                            placeholder="Describe what your course is about (minimum 50 characters)"
                                        />
                                        {errors.description && <div className="text-red-400 text-sm mt-2">{errors.description}</div>}
                                    </div>

                                    <div className="lg:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Intended Learners</label>
                                        <textarea
                                            value={data.intended_learners}
                                            onChange={(e) => setData('intended_learners', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 transition-colors"
                                            placeholder="Who is this course for?"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Learning Objectives */}
                        {currentStep === 2 && (
                            <div className="space-y-8">
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">Learning Objectives</h3>
                                    <p className="text-gray-400">What will students learn in your course? You must enter at least 4 learning objectives.</p>
                                </div>

                                <div className="space-y-6">
                                    {data.learning_objectives.map((objective, index) => (
                                        <div key={index} className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Learning Objective {index + 1}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={objective}
                                                        onChange={(e) => updateLearningObjective(index, e.target.value)}
                                                        className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                                                        placeholder="Students will be able to..."
                                                    />
                                                </div>
                                                {data.learning_objectives.length > 4 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLearningObjective(index)}
                                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {errors.learning_objectives && (
                                        <div className="text-red-400 text-sm">{errors.learning_objectives}</div>
                                    )}
                                </div>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={addLearningObjective}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                                    >
                                        + Add another learning objective
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Requirements or Prerequisites
                                        </label>
                                        <textarea
                                            value={data.requirements}
                                            onChange={(e) => setData('requirements', e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 transition-colors"
                                            placeholder="What skills, experience, tools or equipment do learners need?"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Target Audience
                                        </label>
                                        <textarea
                                            value={data.target_audience}
                                            onChange={(e) => setData('target_audience', e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 transition-colors"
                                            placeholder="Who will find your course content valuable?"
                                        />
                                        {errors.target_audience && <div className="text-red-400 text-sm mt-2">{errors.target_audience}</div>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Course Structure Info */}
                        {currentStep === 3 && (
                            <div className="space-y-8">
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">Course Structure</h3>
                                    <p className="text-gray-400">Plan your course structure carefully to create a clear learning path for students.</p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-700">
                                        <h4 className="font-bold text-blue-300 mb-4 text-lg">Tips for structuring your course:</h4>
                                        <ul className="space-y-3 text-blue-200">
                                            <li className="flex items-start">
                                                <span className="text-blue-400 mr-2">•</span>
                                                Start with your goals and learning objectives
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-blue-400 mr-2">•</span>
                                                Create an outline and group related lectures into sections
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-blue-400 mr-2">•</span>
                                                Each section should have at least 3 lectures
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-blue-400 mr-2">•</span>
                                                Include practical activities and assignments
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-blue-400 mr-2">•</span>
                                                Make lectures 2-7 minutes long for better engagement
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-blue-400 mr-2">•</span>
                                                Cover one concept per lecture
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-yellow-900/30 p-6 rounded-lg border border-yellow-700">
                                        <h4 className="font-bold text-yellow-300 mb-4 text-lg">Requirements:</h4>
                                        <ul className="space-y-3 text-yellow-200">
                                            <li className="flex items-start">
                                                <span className="text-yellow-400 mr-2">•</span>
                                                Your course must have at least five lectures
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-yellow-400 mr-2">•</span>
                                                All lectures must add up to at least 30+ minutes of total video
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-yellow-400 mr-2">•</span>
                                                Content must be educational and free of promotional materials
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-yellow-400 mr-2">•</span>
                                                If offering for free, total video length must be less than 2 hours
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Course Settings */}
                        {currentStep === 4 && (
                            <div className="space-y-8">
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">Course Settings</h3>
                                    <p className="text-gray-400">Configure additional settings for your course</p>
                                </div>

                                <div className="max-w-2xl mx-auto">
                                    <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Course Level</label>
                                                <select
                                                    value={data.level}
                                                    onChange={(e) => setData('level', e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                                                >
                                                    <option value="beginner">Beginner</option>
                                                    <option value="intermediate">Intermediate</option>
                                                    <option value="advanced">Advanced</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                                                <input
                                                    type="text"
                                                    value={data.language}
                                                    onChange={(e) => setData('language', e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Pricing */}
                        {currentStep === 5 && (
                            <div className="space-y-8">
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">Pricing</h3>
                                    <p className="text-gray-400">Select the pricing tier for your course. Free courses must have less than 2 hours of video content.</p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Available: {safePricingTiers.length} pricing tier(s)
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {safePricingTiers.length > 0 ? (
                                        safePricingTiers.map((tier) => (
                                            <div
                                                key={`tier-${tier.id}`}
                                                className={`border rounded-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                                                    data.pricing_tier_id === tier.id.toString()
                                                        ? 'border-blue-500 bg-blue-900/30 shadow-lg'
                                                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                                                }`}
                                                onClick={() => setData('pricing_tier_id', tier.id.toString())}
                                            >
                                                <div className="flex items-center mb-4">
                                                    <input
                                                        type="radio"
                                                        name="pricing_tier"
                                                        value={tier.id}
                                                        checked={data.pricing_tier_id === tier.id.toString()}
                                                        onChange={() => setData('pricing_tier_id', tier.id.toString())}
                                                        className="mr-3 text-blue-600 bg-gray-600 border-gray-500 focus:ring-blue-500"
                                                    />
                                                    <h4 className="font-bold text-white text-lg">
                                                        {tier.name}
                                                        {tier.is_popular && (
                                                            <span className="ml-2 px-2 py-1 text-xs bg-yellow-600 text-white rounded-full">
                                                                Popular
                                                            </span>
                                                        )}
                                                    </h4>
                                                </div>
                                                <p className="text-3xl font-bold text-white mb-2">
                                                    {tier.price > 0 ? `$${tier.price}` : 'Free'}
                                                    <span className="text-base font-normal text-gray-400">
                                                        /{tier.currency}
                                                    </span>
                                                </p>
                                                {tier.description && (
                                                    <p className="text-gray-300 mb-4">{tier.description}</p>
                                                )}
                                                {tier.features && Array.isArray(tier.features) && tier.features.length > 0 && (
                                                    <ul className="text-sm text-gray-400 space-y-2">
                                                        {tier.features.slice(0, 3).map((feature, featureIndex) => (
                                                            <li key={featureIndex} className="flex items-start">
                                                                <span className="text-blue-400 mr-2">•</span>
                                                                {feature}
                                                            </li>
                                                        ))}
                                                        {tier.features.length > 3 && (
                                                            <li className="flex items-start">
                                                                <span className="text-blue-400 mr-2">•</span>
                                                                And {tier.features.length - 3} more...
                                                            </li>
                                                        )}
                                                    </ul>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-12">
                                            <p className="text-gray-400 text-lg">No pricing tiers available</p>
                                        </div>
                                    )}
                                </div>
                                {errors.pricing_tier_id && <div className="text-red-400 text-sm text-center">{errors.pricing_tier_id}</div>}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center pt-8 border-t border-gray-600 mt-12">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                    currentStep === 1
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-600 text-white hover:bg-gray-500 hover:shadow-lg'
                                }`}
                            >
                                Previous
                            </button>

                            <div className="text-center">
                                <span className="text-gray-400 text-sm">
                                    Step {currentStep} of 5
                                </span>
                            </div>

                            {currentStep < 5 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 hover:shadow-lg"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                                        processing
                                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
                                    }`}
                                >
                                    {processing ? 'Creating...' : 'Create Course'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </TeacherLayout>
    );
}
