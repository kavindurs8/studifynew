// filepath: e:\pil55\ST New folder (13)\STUDIFY\resources\js\Pages\Teacher\LiveClasses\Create.jsx
import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Create({ categories = [], teacher }) {
    const { data, setData, post, errors, processing } = useForm({
        title: '',
        description: '',
        live_class_category_id: '',
        day_of_week: '',
        start_time: '',
        duration_minutes: 60,
        timezone: 'UTC+05:30 - Asia/Colombo',
        repeat_frequency: 'weekly',
        subscription_fee: '',
        subscription_duration_type: 'day',
        subscription_duration_value: 30,
        // Only need weekly position for monthly scheduling
        monthly_week: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('teacher.live-classes.store'));
    };

    // Handle day of week change
    const handleDayOfWeekChange = (value) => {
        setData((prevData) => {
            const newData = { ...prevData, day_of_week: value };

            // If "Every Day" is selected, force repeat_frequency to "daily"
            if (value === 'Every Day') {
                newData.repeat_frequency = 'daily';
            } else if (value && value !== 'Every Day') {
                // If a specific day is selected, default to weekly if current is daily
                if (prevData.repeat_frequency === 'daily') {
                    newData.repeat_frequency = 'weekly';
                }
            }

            return newData;
        });
    };

    // Handle repeat frequency change
    const handleRepeatFrequencyChange = (value) => {
        setData((prevData) => {
            const newData = { ...prevData, repeat_frequency: value };

            // Reset monthly fields if not monthly
            if (value !== 'monthly') {
                newData.monthly_week = '';
            }

            return newData;
        });
    };

    // Check if day selection is "Every Day"
    const isEveryDay = data.day_of_week === 'Every Day';

    // Check if we should show monthly options
    const showMonthlyOptions = data.repeat_frequency === 'monthly' &&
                              data.day_of_week &&
                              data.day_of_week !== 'Every Day' &&
                              data.day_of_week !== '';

    // Check if a specific day is selected (not "Every Day")
    const isSpecificDay = data.day_of_week && data.day_of_week !== 'Every Day';

    // Duration options in minutes
    const durationOptions = [
        { value: 15, label: '15 minutes' },
        { value: 30, label: '30 minutes' },
        { value: 45, label: '45 minutes' },
        { value: 60, label: '1 hour' },
        { value: 90, label: '1.5 hours' },
        { value: 120, label: '2 hours' },
        { value: 150, label: '2.5 hours' },
        { value: 180, label: '3 hours' },
        { value: 240, label: '4 hours' },
        { value: 300, label: '5 hours' },
        { value: 360, label: '6 hours' },
        { value: 480, label: '8 hours' },
    ];

    // Subscription duration options
    const subscriptionDurationOptions = [
        { value: 1, label: '1 Day' },
        { value: 30, label: '1 Month' },
        { value: 60, label: '2 Months' },
        { value: 90, label: '3 Months' },
        { value: 120, label: '4 Months' },
        { value: 180, label: '6 Months' },
        { value: 365, label: '1 Year' },
    ];

    // Week options for monthly scheduling
    const weekOptions = [
        { value: 'first', label: 'First Week' },
        { value: 'second', label: 'Second Week' },
        { value: 'third', label: 'Third Week' },
        { value: 'fourth', label: 'Fourth Week' },
        { value: 'last', label: 'Last Week' },
    ];

    const timezones = [
        'UTC−12:00 - Etc/GMT+12',
        'UTC−11:00 - Pacific/Midway',
        'UTC−11:00 - Pacific/Niue',
        'UTC−11:00 - Pacific/Pago_Pago',
        'UTC−10:00 - Pacific/Honolulu',
        'UTC−10:00 - Pacific/Tahiti',
        'UTC−09:30 - Pacific/Marquesas',
        'UTC−09:00 - America/Anchorage',
        'UTC−09:00 - Pacific/Gambier',
        'UTC−08:00 - America/Los_Angeles',
        'UTC−08:00 - America/Tijuana',
        'UTC−07:00 - America/Denver',
        'UTC−07:00 - America/Phoenix',
        'UTC−06:00 - America/Chicago',
        'UTC−06:00 - America/Mexico_City',
        'UTC−05:00 - America/New_York',
        'UTC−05:00 - America/Lima',
        'UTC−04:30 - America/Caracas',
        'UTC−04:00 - America/Halifax',
        'UTC−04:00 - America/La_Paz',
        'UTC−03:30 - America/St_Johns',
        'UTC−03:00 - America/Argentina/Buenos_Aires',
        'UTC−03:00 - America/Sao_Paulo',
        'UTC−02:00 - America/Noronha',
        'UTC−02:00 - Atlantic/South_Georgia',
        'UTC−01:00 - Atlantic/Azores',
        'UTC−01:00 - Atlantic/Cape_Verde',
        'UTC±00:00 - Africa/Abidjan',
        'UTC±00:00 - Europe/London',
        'UTC±00:00 - UTC',
        'UTC+01:00 - Europe/Berlin',
        'UTC+01:00 - Africa/Lagos',
        'UTC+02:00 - Europe/Kiev',
        'UTC+02:00 - Africa/Cairo',
        'UTC+03:00 - Europe/Moscow',
        'UTC+03:00 - Africa/Nairobi',
        'UTC+03:30 - Asia/Tehran',
        'UTC+04:00 - Asia/Dubai',
        'UTC+04:00 - Europe/Samara',
        'UTC+04:30 - Asia/Kabul',
        'UTC+05:00 - Asia/Karachi',
        'UTC+05:00 - Asia/Yekaterinburg',
        'UTC+05:30 - Asia/Colombo',
        'UTC+05:30 - Asia/Kolkata',
        'UTC+05:45 - Asia/Kathmandu',
        'UTC+06:00 - Asia/Dhaka',
        'UTC+06:00 - Asia/Novosibirsk',
        'UTC+06:30 - Asia/Yangon',
        'UTC+06:30 - Indian/Cocos',
        'UTC+07:00 - Asia/Bangkok',
        'UTC+07:00 - Asia/Krasnoyarsk',
        'UTC+08:00 - Asia/Shanghai',
        'UTC+08:00 - Asia/Singapore',
        'UTC+08:00 - Australia/Perth',
        'UTC+08:45 - Australia/Eucla',
        'UTC+09:00 - Asia/Tokyo',
        'UTC+09:00 - Asia/Seoul',
        'UTC+09:00 - Asia/Yakutsk',
        'UTC+09:30 - Australia/Adelaide',
        'UTC+09:30 - Australia/Darwin',
        'UTC+10:00 - Australia/Sydney',
        'UTC+10:00 - Pacific/Port_Moresby',
        'UTC+10:00 - Asia/Vladivostok',
        'UTC+10:30 - Australia/Lord_Howe',
        'UTC+11:00 - Pacific/Noumea',
        'UTC+11:00 - Pacific/Guadalcanal',
        'UTC+11:00 - Asia/Sakhalin',
        'UTC+12:00 - Pacific/Auckland',
        'UTC+12:00 - Pacific/Fiji',
        'UTC+12:00 - Asia/Kamchatka',
        'UTC+12:45 - Pacific/Chatham',
        'UTC+13:00 - Pacific/Tongatapu',
        'UTC+13:00 - Pacific/Enderbury',
        'UTC+13:00 - Pacific/Fakaofo',
        'UTC+14:00 - Pacific/Kiritimati'
    ];

    return (
        <TeacherLayout
            teacher={teacher}
            title="Create Live Class - STUDIFY"
            pageTitle="Create Live Class"
            pageSubtitle="Set up a new live class with Zoom integration"
            activeMenuItem="live-classes"
        >
            <Head title="Create Live Class" />

            <div className="max-w-8xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                        <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Class Title *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-gray-600"
                                    placeholder="Enter class title"
                                />
                                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Category *
                                </label>
                                <select
                                    value={data.live_class_category_id}
                                    onChange={e => setData('live_class_category_id', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-gray-600"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.live_class_category_id && <p className="text-red-400 text-sm mt-1">{errors.live_class_category_id}</p>}
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description *
                            </label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-gray-600"
                                placeholder="Describe your live class"
                            />
                            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                        </div>
                    </div>

                    {/* Schedule Settings */}
                    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                        <h3 className="text-xl font-semibold text-white mb-4">Schedule Settings</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Day of Week *
                                </label>
                                <select
                                    value={data.day_of_week}
                                    onChange={e => handleDayOfWeekChange(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-gray-600"
                                >
                                    <option value="">Select Day</option>
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Every Day'].map(day => (
                                        <option key={day} value={day}>
                                            {day === 'Every Day' ? 'Every Day (For daily classes)' : day}
                                        </option>
                                    ))}
                                </select>
                                {errors.day_of_week && <p className="text-red-400 text-sm mt-1">{errors.day_of_week}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Start Time *
                                </label>
                                <input
                                    type="time"
                                    value={data.start_time}
                                    onChange={e => setData('start_time', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-gray-600"
                                />
                                {errors.start_time && <p className="text-red-400 text-sm mt-1">{errors.start_time}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Duration *
                                </label>
                                <select
                                    value={data.duration_minutes}
                                    onChange={e => setData('duration_minutes', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-gray-600"
                                >
                                    {durationOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.duration_minutes && <p className="text-red-400 text-sm mt-1">{errors.duration_minutes}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Timezone *
                                </label>
                                <select
                                    value={data.timezone}
                                    onChange={e => setData('timezone', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-gray-600"
                                >
                                    {timezones.map(timezone => (
                                        <option key={timezone} value={timezone}>{timezone}</option>
                                    ))}
                                </select>
                                {errors.timezone && <p className="text-red-400 text-sm mt-1">{errors.timezone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Repeat *
                                </label>
                                <select
                                    value={data.repeat_frequency}
                                    onChange={e => handleRepeatFrequencyChange(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-gray-600"
                                    disabled={isEveryDay}
                                >
                                    {/* Show different options based on day selection */}
                                    {isEveryDay ? (
                                        <option value="daily">Daily</option>
                                    ) : isSpecificDay ? (
                                        <>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </>
                                    )}
                                </select>
                                {errors.repeat_frequency && <p className="text-red-400 text-sm mt-1">{errors.repeat_frequency}</p>}
                                {isEveryDay && (
                                    <p className="text-yellow-400 text-xs mt-1">
                                        Locked to "Daily" because "Every Day" is selected
                                    </p>
                                )}
                                {isSpecificDay && (
                                    <p className="text-blue-400 text-xs mt-1">
                                        Only Weekly and Monthly options available for specific days
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Monthly Schedule Options - Only Week Selection */}
                        {showMonthlyOptions && (
                            <div className="mt-6">
                                <h4 className="text-lg font-medium text-white mb-4">Monthly Schedule Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Which Week of the Month? *
                                        </label>
                                        <select
                                            value={data.monthly_week}
                                            onChange={e => setData('monthly_week', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-gray-600"
                                        >
                                            <option value="">Select Week</option>
                                            {weekOptions.map(week => (
                                                <option key={week.value} value={week.value}>
                                                    {week.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.monthly_week && <p className="text-red-400 text-sm mt-1">{errors.monthly_week}</p>}
                                    </div>
                                </div>
                                <div className="mt-3 p-3 bg-blue-900/30 border border-blue-700 rounded-md">
                                    <p className="text-blue-300 text-sm">
                                        <strong>Example:</strong> If you select "First Week", the class will occur on the first {data.day_of_week} of every month.
                                        <br />
                                        <strong>Schedule:</strong> {data.monthly_week && `${weekOptions.find(w => w.value === data.monthly_week)?.label} ${data.day_of_week} of every month`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Subscription Settings */}
                    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                        <h3 className="text-xl font-semibold text-white mb-4">Subscription Settings</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Subscription Fee (LKR) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.subscription_fee}
                                    onChange={e => setData('subscription_fee', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-gray-600"
                                    placeholder="0.00"
                                />
                                {errors.subscription_fee && <p className="text-red-400 text-sm mt-1">{errors.subscription_fee}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Subscription Duration *
                                </label>
                                <select
                                    value={data.subscription_duration_value}
                                    onChange={e => setData('subscription_duration_value', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:bg-gray-600"
                                >
                                    {subscriptionDurationOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.subscription_duration_value && <p className="text-red-400 text-sm mt-1">{errors.subscription_duration_value}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {processing ? 'Creating...' : 'Create Live Class'}
                        </button>
                    </div>
                </form>
            </div>
        </TeacherLayout>
    );
}
