import React from 'react';
import { Head, Link } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Show({ course, teacher }) {
    return (
        <TeacherLayout
            teacher={teacher}
            title={`${course.title} - Course Details`}
            pageTitle="Course Details"
            pageSubtitle={`Manage and view details for "${course.title}". Track progress, update content, and monitor student engagement.`}
            activeMenuItem="courses"
        >
            <Head title={course.title} />

            <div className="space-y-6">
                {/* Action Buttons */}
                <div className="flex justify-between items-center bg-gray-800 rounded-lg p-4 shadow-lg">
                    <h2 className="text-xl font-semibold text-white">
                        {course.title}
                    </h2>
                    <div className="flex space-x-3">
                        <Link
                            href={route('teacher.courses.edit', course.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 shadow-md"
                        >
                            Edit Course
                        </Link>
                        <Link
                            href={route('teacher.courses.index')}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors duration-200 shadow-md"
                        >
                            Back to Courses
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Course Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status and Basic Info */}
                        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                            <div className="flex items-start justify-between mb-4">
                                <h1 className="text-2xl font-bold text-white">{course.title}</h1>
                                <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                                    course.status === 'published' ? 'bg-green-900 text-green-300' :
                                    course.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                                    'bg-gray-700 text-gray-300'
                                }`}>
                                    {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                                </span>
                            </div>
                            <p className="text-gray-300 leading-relaxed">{course.description}</p>
                        </div>

                        {/* Learning Objectives */}
                        {course.learning_objectives && course.learning_objectives.length > 0 && (
                            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <svg className="h-5 w-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                    What Students Will Learn
                                </h3>
                                <ul className="space-y-3">
                                    {course.learning_objectives.map((objective, index) => (
                                        <li key={index} className="flex items-start">
                                            <svg className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-gray-300">{objective}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Course Content */}
                        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <svg className="h-5 w-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                                </svg>
                                Course Content
                            </h3>
                            {course.sections && course.sections.length > 0 ? (
                                <div className="space-y-4">
                                    {course.sections.map((section, index) => (
                                        <div key={section.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-white mb-2">
                                                        Section {index + 1}: {section.title}
                                                    </h4>
                                                    {section.description && (
                                                        <p className="text-gray-400 text-sm mb-3">{section.description}</p>
                                                    )}
                                                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                                                        <span className="flex items-center">
                                                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                            </svg>
                                                            {section.lectures?.length || 0} lectures
                                                        </span>
                                                        <span className="flex items-center">
                                                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                            </svg>
                                                            {section.quizzes?.length || 0} quizzes
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-gray-600 rounded-lg">
                                    <svg className="mx-auto h-12 w-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <p className="text-gray-400 mb-4">No content added yet</p>
                                    <Link
                                        href={route('teacher.courses.edit', course.id)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                                    >
                                        Add Content
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Course Stats */}
                        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                            <div className="text-center mb-6">
                                <div className="text-3xl font-bold text-white">${course.price}</div>
                                <div className="text-sm text-gray-400">{course.pricing_tier?.name || 'Standard'}</div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                                    <span className="text-gray-400">Category:</span>
                                    <span className="font-medium text-white">{course.category}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                                    <span className="text-gray-400">Level:</span>
                                    <span className="font-medium text-white capitalize">{course.level}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                                    <span className="text-gray-400">Language:</span>
                                    <span className="font-medium text-white">{course.language}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                                    <span className="text-gray-400">Sections:</span>
                                    <span className="font-medium text-white">{course.sections?.length || 0}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                                    <span className="text-gray-400">Lectures:</span>
                                    <span className="font-medium text-white">{course.lectures?.length || 0}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-400">Quizzes:</span>
                                    <span className="font-medium text-white">{course.quizzes?.length || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link
                                    href={route('teacher.courses.edit', course.id)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 text-center block"
                                >
                                    Edit Course Content
                                </Link>

                                {course.status === 'draft' && (
                                    <button
                                        onClick={() => {
                                            // Submit for review logic
                                            alert('Submit for review functionality coming soon!');
                                        }}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                                    >
                                        Submit for Review
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        // Preview course logic
                                        alert('Course preview functionality coming soon!');
                                    }}
                                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                                >
                                    Preview Course
                                </button>
                            </div>
                        </div>

                        {/* Course Performance (if published) */}
                        {course.status === 'published' && (
                            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Enrolled Students:</span>
                                        <span className="font-bold text-blue-400">{course.enrolled_count || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Completion Rate:</span>
                                        <span className="font-bold text-green-400">{course.completion_rate || 0}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Average Rating:</span>
                                        <span className="font-bold text-yellow-400">
                                            {course.average_rating || 'N/A'}
                                            {course.average_rating && ' ⭐'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
