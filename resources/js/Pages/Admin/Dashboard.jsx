import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    FaUsers,
    FaUserTie,
    FaBook,
    FaVideo,
    FaMoneyBillWave,
    FaArrowUp,
    FaArrowDown,
    FaEye,
    FaEdit,
    FaTrash,
    FaCheck,
    FaTimes,
    FaClock,
    FaChartLine
} from 'react-icons/fa';

export default function Dashboard({
    admin,
    stats = {},
    recentActivities = [],
    pendingApprovals = [],
    topCourses = [],
    recentRegistrations = []
}) {
    // Sample data if not provided
    const defaultStats = {
        totalStudents: stats.totalStudents || 1248,
        totalTeachers: stats.totalTeachers || 89,
        totalCourses: stats.totalCourses || 156,
        totalLiveClasses: stats.totalLiveClasses || 34,
        monthlyRevenue: stats.monthlyRevenue || 450000,
        pendingApprovals: stats.pendingApprovals || 12,
        activeUsers: stats.activeUsers || 892,
        completionRate: stats.completionRate || 78,
        // Growth percentages
        studentsGrowth: stats.studentsGrowth || 12.5,
        teachersGrowth: stats.teachersGrowth || 8.3,
        coursesGrowth: stats.coursesGrowth || 15.7,
        revenueGrowth: stats.revenueGrowth || 23.1
    };

    const StatCard = ({ title, value, icon: Icon, growth, color = "purple" }) => (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-400 text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-white mt-2">{value.toLocaleString()}</p>
                    {growth !== undefined && (
                        <div className="flex items-center mt-2">
                            {growth >= 0 ? (
                                <FaArrowUp className="text-green-500 text-sm mr-1" />
                            ) : (
                                <FaArrowDown className="text-red-500 text-sm mr-1" />
                            )}
                            <span className={`text-sm font-medium ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {Math.abs(growth)}%
                            </span>
                            <span className="text-gray-400 text-sm ml-1">vs last month</span>
                        </div>
                    )}
                </div>
                <div className={`p-4 rounded-lg bg-${color}-900/30`}>
                    <Icon className={`text-3xl text-${color}-400`} />
                </div>
            </div>
        </div>
    );

    const QuickActionCard = ({ title, description, action, buttonText, color = "purple" }) => (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm mb-4">{description}</p>
            <button
                onClick={action}
                className={`w-full py-2 px-4 bg-${color}-600 hover:bg-${color}-700 text-white rounded-md transition-colors`}
            >
                {buttonText}
            </button>
        </div>
    );

    return (
        <AdminLayout
            admin={admin}
            title="Admin Dashboard - STUDIFY"
            pageTitle="Dashboard Overview"
            pageSubtitle="Monitor platform performance, manage users, and track system metrics"
            activeMenuItem="dashboard"
        >
            <Head title="Admin Dashboard" />

            <div className="space-y-8">
                {/* Key Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Students"
                        value={defaultStats.totalStudents}
                        icon={FaUsers}
                        growth={defaultStats.studentsGrowth}
                        color="blue"
                    />
                    <StatCard
                        title="Total Teachers"
                        value={defaultStats.totalTeachers}
                        icon={FaUserTie}
                        growth={defaultStats.teachersGrowth}
                        color="green"
                    />
                    <StatCard
                        title="Total Courses"
                        value={defaultStats.totalCourses}
                        icon={FaBook}
                        growth={defaultStats.coursesGrowth}
                        color="yellow"
                    />
                    <StatCard
                        title="Monthly Revenue"
                        value={`LKR ${defaultStats.monthlyRevenue.toLocaleString()}`}
                        icon={FaMoneyBillWave}
                        growth={defaultStats.revenueGrowth}
                        color="purple"
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Live Classes"
                        value={defaultStats.totalLiveClasses}
                        icon={FaVideo}
                        color="red"
                    />
                    <StatCard
                        title="Pending Approvals"
                        value={defaultStats.pendingApprovals}
                        icon={FaClock}
                        color="orange"
                    />
                    <StatCard
                        title="Active Users"
                        value={defaultStats.activeUsers}
                        icon={FaChartLine}
                        color="teal"
                    />
                    <StatCard
                        title="Completion Rate"
                        value={`${defaultStats.completionRate}%`}
                        icon={FaCheck}
                        color="indigo"
                    />
                </div>

                {/* Quick Actions & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white">Quick Actions</h2>

                        <QuickActionCard
                            title="Review Pending Courses"
                            description="12 courses waiting for approval"
                            buttonText="Review Now"
                            color="yellow"
                        />

                        <QuickActionCard
                            title="Manage Teachers"
                            description="View and manage teacher accounts"
                            buttonText="Go to Teachers"
                            color="blue"
                        />

                        <QuickActionCard
                            title="System Settings"
                            description="Configure platform settings"
                            buttonText="Open Settings"
                            color="gray"
                        />
                    </div>

                    {/* Recent Activity */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
                        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                            <div className="p-6">
                                <div className="space-y-4">
                                    {/* Sample activities */}
                                    {[
                                        { user: "John Doe", action: "created a new course", time: "2 minutes ago", type: "course" },
                                        { user: "Jane Smith", action: "submitted live class for approval", time: "15 minutes ago", type: "approval" },
                                        { user: "Mike Johnson", action: "registered as a new teacher", time: "1 hour ago", type: "registration" },
                                        { user: "Sarah Wilson", action: "completed course certification", time: "2 hours ago", type: "completion" },
                                        { user: "David Brown", action: "reported a technical issue", time: "3 hours ago", type: "issue" }
                                    ].map((activity, index) => (
                                        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                                            <div className="flex items-center">
                                                <div className={`w-2 h-2 rounded-full mr-3 ${
                                                    activity.type === 'course' ? 'bg-blue-500' :
                                                    activity.type === 'approval' ? 'bg-yellow-500' :
                                                    activity.type === 'registration' ? 'bg-green-500' :
                                                    activity.type === 'completion' ? 'bg-purple-500' :
                                                    'bg-red-500'
                                                }`}></div>
                                                <div>
                                                    <p className="text-white text-sm">
                                                        <span className="font-medium">{activity.user}</span> {activity.action}
                                                    </p>
                                                    <p className="text-gray-400 text-xs">{activity.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className="text-gray-400 hover:text-white transition-colors">
                                                    <FaEye className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pending Approvals & Top Courses */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pending Approvals */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-6">Pending Approvals</h2>
                        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                            <div className="p-6">
                                <div className="space-y-4">
                                    {[
                                        { title: "Advanced React Course", teacher: "John Doe", type: "Course", submitted: "2 days ago" },
                                        { title: "Python for Beginners", teacher: "Jane Smith", type: "Course", submitted: "1 day ago" },
                                        { title: "Live JavaScript Session", teacher: "Mike Johnson", type: "Live Class", submitted: "3 hours ago" }
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                                            <div>
                                                <p className="text-white font-medium">{item.title}</p>
                                                <p className="text-gray-400 text-sm">by {item.teacher} • {item.type}</p>
                                                <p className="text-gray-500 text-xs">{item.submitted}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                                                    <FaCheck className="text-sm" />
                                                </button>
                                                <button className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">
                                                    <FaTimes className="text-sm" />
                                                </button>
                                                <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                                                    <FaEye className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Performing Courses */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-6">Top Performing Courses</h2>
                        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                            <div className="p-6">
                                <div className="space-y-4">
                                    {[
                                        { title: "Complete Web Development", students: 245, rating: 4.8, revenue: "LKR 125,000" },
                                        { title: "Data Science Fundamentals", students: 189, rating: 4.7, revenue: "LKR 98,500" },
                                        { title: "Mobile App Development", students: 156, rating: 4.9, revenue: "LKR 87,200" }
                                    ].map((course, index) => (
                                        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                                            <div>
                                                <p className="text-white font-medium">{course.title}</p>
                                                <div className="flex items-center space-x-4 mt-1">
                                                    <span className="text-gray-400 text-sm">{course.students} students</span>
                                                    <span className="text-yellow-400 text-sm">★ {course.rating}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-green-400 font-medium">{course.revenue}</p>
                                                <p className="text-gray-400 text-sm">this month</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Health Status */}
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-6">System Health</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">99.9%</div>
                            <div className="text-gray-400 text-sm">Uptime</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-500">1.2s</div>
                            <div className="text-gray-400 text-sm">Avg Response Time</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-500">2.3GB</div>
                            <div className="text-gray-400 text-sm">Storage Used</div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
