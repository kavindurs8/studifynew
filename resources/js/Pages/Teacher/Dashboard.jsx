import React from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import {
  FaBook,
  FaUsers,
  FaDollarSign,
  FaStar,
  FaPlus,
  FaChartBar,
  FaEnvelope,
  FaCog,
  FaBell
} from 'react-icons/fa';

export default function TeacherDashboard({ teacher }) {
    return (
        <TeacherLayout
            teacher={teacher}
            title="Instructor Dashboard - STUDIFY"
            pageTitle="Instructor Dashboard"
            pageSubtitle="Welcome back! Manage your courses, track student progress, and grow your teaching impact."
            activeMenuItem="dashboard"
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* My Courses Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">My Courses</p>
                            <p className="text-3xl font-bold text-white mt-2">0</p>
                            <p className="text-green-400 text-sm mt-1">
                                <span className="font-medium">+0%</span> from last month
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <FaBook className="text-white text-xl" />
                        </div>
                    </div>
                </div>

                {/* Students Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Total Students</p>
                            <p className="text-3xl font-bold text-white mt-2">0</p>
                            <p className="text-green-400 text-sm mt-1">
                                <span className="font-medium">+0%</span> from last month
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                            <FaUsers className="text-white text-xl" />
                        </div>
                    </div>
                </div>

                {/* Earnings Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Total Earnings</p>
                            <p className="text-3xl font-bold text-white mt-2">$0</p>
                            <p className="text-green-400 text-sm mt-1">
                                <span className="font-medium">+0%</span> from last month
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                            <FaDollarSign className="text-white text-xl" />
                        </div>
                    </div>
                </div>

                {/* Reviews Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Avg Rating</p>
                            <p className="text-3xl font-bold text-white mt-2">0.0</p>
                            <p className="text-yellow-400 text-sm mt-1">
                                <FaStar className="inline mr-1" />
                                <span className="font-medium">0 reviews</span>
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                            <FaStar className="text-white text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions & Profile Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg">
                    <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors duration-200 text-center">
                            <FaPlus className="text-2xl mb-2 mx-auto" />
                            <span className="text-sm font-medium">Create Course</span>
                        </button>

                        <button className="p-4 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors duration-200 text-center">
                            <FaChartBar className="text-2xl mb-2 mx-auto" />
                            <span className="text-sm font-medium">View Analytics</span>
                        </button>

                        <button className="p-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors duration-200 text-center">
                            <FaEnvelope className="text-2xl mb-2 mx-auto" />
                            <span className="text-sm font-medium">Messages</span>
                        </button>

                        <button className="p-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white transition-colors duration-200 text-center">
                            <FaCog className="text-2xl mb-2 mx-auto" />
                            <span className="text-sm font-medium">Settings</span>
                        </button>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg">
                    <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                            <p className="text-white">{teacher?.name || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                            <p className="text-white">{teacher?.email || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Expertise Area</label>
                            <p className="text-white">{teacher?.expertise_area || 'Not specified'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Account Status</label>
                            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                                teacher?.status === 'Approved'
                                    ? 'bg-green-900 text-green-300'
                                    : 'bg-yellow-900 text-yellow-300'
                            }`}>
                                {teacher?.status || 'Pending'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                <div className="text-center py-12">
                    <FaBell className="text-6xl text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No recent activity to display</p>
                    <p className="text-gray-500 text-sm mt-2">Your activities will appear here once you start creating courses</p>
                </div>
            </div>
        </TeacherLayout>
    );
}
