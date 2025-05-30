import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Index({ courses }) {
    const { auth } = usePage().props;
    const teacher = auth.teacher;

    return (
        <TeacherLayout
            teacher={teacher}
            title="My Courses - STUDIFY"
            pageTitle="My Courses"
            pageSubtitle="Manage and monitor your course portfolio. Create engaging content and track your teaching success."
            activeMenuItem="courses"
        >
            <Head title="My Courses" />

            <div className="mx-auto max-w-8xl">
                {/* Header Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Course Management</h2>
                            <p className="text-gray-400">
                                {courses.length > 0
                                    ? `You have ${courses.length} course${courses.length !== 1 ? 's' : ''} in your portfolio`
                                    : 'Start building your course portfolio today'
                                }
                            </p>
                        </div>
                        <Link
                            href="/teacher/courses/create"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg inline-flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create New Course
                        </Link>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 shadow-lg">
                    <div className="p-8">
                        {courses.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-gray-400 mb-6">
                                    <svg className="mx-auto h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">No courses yet</h3>
                                <p className="text-gray-400 mb-8 text-lg">Ready to share your knowledge? Create your first course and start teaching!</p>
                                <Link
                                    href={route('teacher.courses.create')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg inline-flex items-center font-medium text-lg transition-all duration-200 hover:shadow-lg"
                                >
                                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Your First Course
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {courses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="bg-gray-700 border border-gray-600 rounded-lg p-6 hover:shadow-xl transition-all duration-300 hover:border-gray-500 hover:bg-gray-650"
                                    >
                                        {/* Course Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                course.status === 'published' ? 'bg-green-600 text-white' :
                                                course.status === 'pending' ? 'bg-yellow-600 text-white' :
                                                course.status === 'draft' ? 'bg-gray-600 text-white' :
                                                'bg-red-600 text-white'
                                            }`}>
                                                {course.status?.charAt(0).toUpperCase() + course.status?.slice(1) || 'Draft'}
                                            </span>
                                            <span className="text-sm text-gray-400 bg-gray-600 px-2 py-1 rounded">
                                                {course.category}
                                            </span>
                                        </div>

                                        {/* Course Title & Description */}
                                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                                            {course.title}
                                        </h3>
                                        <p className="text-gray-300 text-sm mb-6 line-clamp-3">
                                            {course.description}
                                        </p>

                                        {/* Course Stats */}
                                        <div className="bg-gray-600 rounded-lg p-4 mb-6">
                                            <div className="grid grid-cols-3 gap-4 text-center">
                                                <div>
                                                    <div className="text-lg font-bold text-white">
                                                        {course.sections?.length || 0}
                                                    </div>
                                                    <div className="text-xs text-gray-400">Sections</div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-bold text-white">
                                                        {course.lectures?.length || 0}
                                                    </div>
                                                    <div className="text-xs text-gray-400">Lectures</div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-bold text-green-400">
                                                        ${course.price || '0.00'}
                                                    </div>
                                                    <div className="text-xs text-gray-400">Price</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Course Actions */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <Link
                                                href={route('teacher.courses.show', course.id)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-center text-sm font-medium transition-all duration-200 hover:shadow-lg"
                                            >
                                                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                View
                                            </Link>
                                            <Link
                                                href={route('teacher.courses.edit', course.id)}
                                                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-3 rounded-lg text-center text-sm font-medium transition-all duration-200 hover:shadow-lg"
                                            >
                                                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </Link>
                                        </div>

                                        {/* Course Meta Info */}
                                        <div className="mt-4 pt-4 border-t border-gray-600">
                                            <div className="flex items-center justify-between text-xs text-gray-400">
                                                <span>Level: {course.level?.charAt(0).toUpperCase() + course.level?.slice(1) || 'Beginner'}</span>
                                                <span>Language: {course.language || 'English'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats Card */}
                {courses.length > 0 && (
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg mt-8">
                        <h3 className="text-lg font-bold text-white mb-4">Quick Statistics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400">
                                    {courses.length}
                                </div>
                                <div className="text-sm text-gray-400">Total Courses</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-400">
                                    {courses.filter(c => c.status === 'published').length}
                                </div>
                                <div className="text-sm text-gray-400">Published</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-400">
                                    {courses.filter(c => c.status === 'draft').length}
                                </div>
                                <div className="text-sm text-gray-400">Drafts</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-400">
                                    {courses.reduce((total, course) => total + (course.sections?.length || 0), 0)}
                                </div>
                                <div className="text-sm text-gray-400">Total Sections</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}
