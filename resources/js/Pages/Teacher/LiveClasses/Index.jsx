import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Index({ liveClasses = [], teacher }) {
    // Add the submitForApproval function
    const submitForApproval = (liveClassId) => {
        if (confirm('Are you sure you want to submit this class for approval?')) {
            router.patch(route('teacher.live-classes.submit-for-approval', liveClassId), {}, {
                onSuccess: () => {
                    // Success message will be handled by the backend
                },
                onError: (errors) => {
                    console.error('Error submitting for approval:', errors);
                }
            });
        }
    };

    const formatTime = (time) => {
        if (!time) return '';
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR'
        }).format(amount || 0);
    };

    const formatDuration = (minutes) => {
        if (!minutes) return '';

        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours > 0 && mins > 0) {
            return `${hours}h ${mins}m`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else {
            return `${mins}m`;
        }
    };

    // Update the formatSchedule function
    const formatSchedule = (liveClass) => {
        if (liveClass.repeat_frequency === 'monthly' && liveClass.monthly_week) {
            const weekLabels = {
                'first': '1st',
                'second': '2nd',
                'third': '3rd',
                'fourth': '4th',
                'last': 'Last'
            };
            const weekLabel = weekLabels[liveClass.monthly_week] || liveClass.monthly_week;
            return `${weekLabel} ${liveClass.day_of_week} (Monthly)`;
        } else if (liveClass.repeat_frequency === 'weekly') {
            return `${liveClass.day_of_week} (Weekly)`;
        } else if (liveClass.repeat_frequency === 'daily' || liveClass.day_of_week === 'Every Day') {
            return 'Every day (Daily)';
        }
        return `${liveClass.day_of_week} (${liveClass.repeat_frequency})`;
    };

    // Add status badge component
    const StatusBadge = ({ status }) => {
        const getBadgeColor = (status) => {
            switch(status) {
                case 'draft': return 'bg-gray-500';
                case 'pending_approval': return 'bg-yellow-500';
                case 'approved': return 'bg-green-500';
                case 'rejected': return 'bg-red-500';
                default: return 'bg-gray-500';
            }
        };

        const getStatusLabel = (status) => {
            switch(status) {
                case 'draft': return 'Draft';
                case 'pending_approval': return 'Pending Approval';
                case 'approved': return 'Approved';
                case 'rejected': return 'Rejected';
                default: return 'Unknown';
            }
        };

        return (
            <span className={`inline-block px-2 py-1 text-xs font-medium text-white rounded-full ${getBadgeColor(status)}`}>
                {getStatusLabel(status)}
            </span>
        );
    };

    return (
        <TeacherLayout
            teacher={teacher}
            title="Live Classes - STUDIFY"
            pageTitle="Live Classes"
            pageSubtitle="Manage your live classes with Zoom integration"
            activeMenuItem="live-classes"
        >
            <Head title="Live Classes" />

            <div className="space-y-6">
                {/* Header with Create Button */}
                <div className="flex justify-between items-center bg-gray-800 rounded-lg p-6 shadow-lg">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Your Live Classes</h2>
                        <p className="text-gray-400">
                            Total Classes: {liveClasses.length} |
                            Active Classes: {liveClasses.filter(cls => cls.is_active).length}
                        </p>
                    </div>
                    <Link
                        href={route('teacher.live-classes.create')}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-md flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Create Live Class
                    </Link>
                </div>

                {/* Live Classes Grid */}
                {liveClasses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {liveClasses.map((liveClass) => (
                            <div key={liveClass.id} className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {liveClass.title}
                                        </h3>
                                        <div className="flex items-center space-x-3 text-sm">
                                            <div className="flex items-center text-gray-400">
                                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                                    liveClass.is_active ? 'bg-green-500' : 'bg-gray-500'
                                                }`}></span>
                                                {liveClass.is_active ? 'Active' : 'Inactive'}
                                            </div>
                                            <StatusBadge status={liveClass.status} />
                                        </div>
                                    </div>
                                </div>

                                {/* Category Badge */}
                                <div className="mb-4">
                                    <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700 rounded-full">
                                        {liveClass.category?.name || 'Uncategorized'}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-gray-300 text-sm mb-4">
                                    {liveClass.description}
                                </p>

                                {/* Schedule Info */}
                                <div className="border-t border-gray-700 pt-4 mb-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Schedule:</span>
                                            <p className="text-white font-medium">{formatSchedule(liveClass)}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Time:</span>
                                            <p className="text-white font-medium">{formatTime(liveClass.start_time)}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Duration:</span>
                                            <p className="text-white font-medium">{formatDuration(liveClass.duration_minutes)}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Frequency:</span>
                                            <p className="text-white font-medium capitalize">{liveClass.repeat_frequency}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm">
                                        <span className="text-gray-500">Timezone:</span>
                                        <p className="text-white font-medium">{liveClass.timezone}</p>
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="border-t border-gray-700 pt-4 mb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-sm">Subscription Fee:</span>
                                        <span className="text-green-400 font-semibold">
                                            {formatCurrency(liveClass.subscription_fee)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-gray-500 text-sm">Duration:</span>
                                        <span className="text-gray-300 text-sm">
                                            {liveClass.subscription_duration_value} {liveClass.subscription_duration_type}
                                            {liveClass.subscription_duration_value > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-2">
                                    <Link
                                        href={route('teacher.live-classes.show', liveClass.id)}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md text-sm transition-colors duration-200"
                                    >
                                        Manage
                                    </Link>

                                    {/* Show submit for approval button if draft */}
                                    {liveClass.status === 'draft' && (
                                        <button
                                            onClick={() => submitForApproval(liveClass.id)}
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md text-sm transition-colors duration-200"
                                        >
                                            Submit for Approval
                                        </button>
                                    )}

                                    {/* Show join button only if approved */}
                                    {liveClass.status === 'approved' && liveClass.zoom_join_url && (
                                        <a
                                            href={liveClass.zoom_join_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm transition-colors duration-200 flex items-center"
                                        >
                                            Join
                                        </a>
                                    )}
                                </div>

                                {/* Created Date */}
                                <div className="mt-4 pt-4 border-t border-gray-700">
                                    <span className="text-xs text-gray-500">
                                        Created: {new Date(liveClass.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-12 bg-gray-800 rounded-lg">
                        <svg className="mx-auto h-16 w-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-white mb-2">No live classes yet</h3>
                        <p className="text-gray-400 mb-6">Create your first live class to start teaching online</p>
                        <Link
                            href={route('teacher.live-classes.create')}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 inline-flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Create Live Class
                        </Link>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}
