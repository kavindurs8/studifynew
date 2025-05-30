import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
  FaHome,
  FaBook,
  FaUsers,
  FaChartBar,
  FaEnvelope,
  FaCog,
  FaDollarSign,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaGraduationCap,
  FaTachometerAlt,
  FaCalendarAlt,
  FaUserCheck,
  FaPlus,
  FaStar,
  FaVideo,
  FaUserTie,
  FaClipboardList,
  FaFileAlt,
  FaUserGraduate,
  FaShieldAlt,
  FaDatabase,
  FaMoneyBillWave,
  FaBell,
  FaCrown
} from 'react-icons/fa';

export default function AdminLayout({
    children,
    admin,
    title = 'Admin Dashboard - STUDIFY',
    pageTitle = 'Admin Dashboard',
    pageSubtitle = 'Manage your platform, oversee teachers, students, and monitor system performance.',
    activeMenuItem = 'dashboard'
}) {
    const [showSidebar, setShowSidebar] = useState(true);
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { post } = useForm();
    const { route } = usePage().props.ziggy || {};

    // Initialize sidebar state from localStorage
    useEffect(() => {
        const sidebarState = localStorage.getItem('adminSidebarOpen');
        if (sidebarState !== null) {
            setShowSidebar(sidebarState === 'true');
        } else {
            setShowSidebar(window.innerWidth >= 768);
        }
    }, []);

    // Handle sidebar toggle
    const toggleSidebar = () => {
        const newState = !showSidebar;
        setShowSidebar(newState);
        localStorage.setItem('adminSidebarOpen', newState.toString());
    };

    const logout = (e) => {
        e.preventDefault();
        post('/admin/logout');
    };

    // Get current date
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Admin menu items configuration
    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            href: '/admin/dashboard',
            icon: FaHome,
            section: 'main'
        },
        {
            id: 'teachers',
            label: 'Teachers',
            href: '/admin/teachers',
            icon: FaUserTie,
            section: 'management'
        },
        {
            id: 'students',
            label: 'Students',
            href: '/admin/students',
            icon: FaUserGraduate,
            section: 'management'
        },
        {
            id: 'courses',
            label: 'Courses',
            href: '/admin/courses',
            icon: FaBook,
            section: 'content'
        },
        {
            id: 'live-classes',
            label: 'Live Classes',
            href: '/admin/live-classes',
            icon: FaVideo,
            section: 'content'
        },
        {
            id: 'categories',
            label: 'Categories',
            href: '/admin/categories',
            icon: FaClipboardList,
            section: 'content'
        },
        {
            id: 'analytics',
            label: 'Analytics',
            href: '/admin/analytics',
            icon: FaChartBar,
            section: 'insights'
        },
        {
            id: 'reports',
            label: 'Reports',
            href: '/admin/reports',
            icon: FaFileAlt,
            section: 'insights'
        },
        {
            id: 'revenue',
            label: 'Revenue',
            href: '/admin/revenue',
            icon: FaMoneyBillWave,
            section: 'financial'
        },
        {
            id: 'transactions',
            label: 'Transactions',
            href: '/admin/transactions',
            icon: FaDollarSign,
            section: 'financial'
        },
        {
            id: 'notifications',
            label: 'Notifications',
            href: '/admin/notifications',
            icon: FaBell,
            section: 'communication'
        },
        {
            id: 'messages',
            label: 'Messages',
            href: '/admin/messages',
            icon: FaEnvelope,
            section: 'communication'
        },
        {
            id: 'settings',
            label: 'System Settings',
            href: '/admin/settings',
            icon: FaCog,
            section: 'system'
        },
        {
            id: 'database',
            label: 'Database',
            href: '/admin/database',
            icon: FaDatabase,
            section: 'system'
        },
        {
            id: 'security',
            label: 'Security',
            href: '/admin/security',
            icon: FaShieldAlt,
            section: 'system'
        }
    ];

    // Menu sections
    const sections = {
        main: 'Dashboard',
        management: 'User Management',
        content: 'Content Management',
        insights: 'Analytics & Insights',
        financial: 'Financial Management',
        communication: 'Communication',
        system: 'System Administration'
    };

    const renderMenuItem = (item) => {
        const isActive = activeMenuItem === item.id;
        const ItemIcon = item.icon;

        return (
            <li key={item.id} className={`${isActive ? 'menu-item-active' : 'menu-item'} rounded-md overflow-hidden`}>
                <Link
                    href={item.href}
                    className="flex items-center text-gray-200 py-3 px-3 rounded-md group transition-all duration-200"
                >
                    <span className="w-8 h-8 flex items-center justify-center bg-purple-900 group-hover:bg-purple-700 rounded-md transition-colors mr-3">
                        <ItemIcon className="text-purple-300 group-hover:text-yellow-400 transition-colors" />
                    </span>
                    <span>{item.label}</span>
                </Link>
            </li>
        );
    };

    const renderMenuSection = (sectionKey) => {
        const sectionItems = menuItems.filter(item => item.section === sectionKey);
        if (sectionItems.length === 0) return null;

        return (
            <div key={sectionKey}>
                <div className="text-xs uppercase text-gray-500 font-semibold px-3 mb-2 mt-6">
                    {sections[sectionKey]}
                </div>
                {sectionItems.map(renderMenuItem)}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 font-sans">
            <Head title={title} />

            {/* Hamburger Button */}
            <div className="fixed top-0 left-0 z-30 m-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-md bg-gray-800 text-white focus:outline-none border border-gray-700 hover:bg-gray-700 transition-all duration-300 shadow-lg group"
                >
                    {!showSidebar ? (
                        <FaBars className="h-6 w-6 text-purple-400 group-hover:text-yellow-400 transition-colors duration-300" />
                    ) : (
                        <FaTimes className="h-6 w-6 text-purple-400 group-hover:text-yellow-400 transition-colors duration-300" />
                    )}
                </button>
            </div>

            {/* Sidebar Overlay for Mobile */}
            {showSidebar && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-200"
                    onClick={() => setShowSidebar(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`w-64 fixed inset-y-0 left-0 z-20 bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-lg border-r border-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
                    showSidebar ? 'translate-x-0' : '-translate-x-full'
                }`}
                style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)'
                }}
            >
                {/* Logo Area */}
                <div className="px-6 py-6 border-b border-gray-800">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <span className="bg-gradient-to-r from-purple-500 to-purple-700 p-1.5 rounded mr-2 shadow-md">
                                <FaCrown className="text-white" />
                            </span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                                Admin Portal
                            </span>
                        </h2>
                    </div>
                </div>

                {/* Admin Profile Section */}
                <div className="px-6 py-4 border-b border-gray-800">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">
                                {admin?.name?.charAt(0).toUpperCase() || 'A'}
                            </span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white">{admin?.name || 'Administrator'}</p>
                            <p className="text-xs text-gray-400">{admin?.email || 'admin@studify.com'}</p>
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 bg-purple-900 text-purple-300">
                                Super Admin
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="mt-4 px-3">
                    {/* Dashboard */}
                    {renderMenuSection('main')}

                    {/* User Management */}
                    {renderMenuSection('management')}

                    {/* Content Management */}
                    {renderMenuSection('content')}

                    {/* Analytics & Insights */}
                    {renderMenuSection('insights')}

                    {/* Financial Management */}
                    {renderMenuSection('financial')}

                    {/* Communication */}
                    {renderMenuSection('communication')}

                    {/* System Administration */}
                    {renderMenuSection('system')}

                    {/* Logout */}
                    <div className="mt-6">
                        <li className="menu-item rounded-md overflow-hidden">
                            <button
                                onClick={logout}
                                className="w-full flex items-center text-gray-200 py-3 px-3 rounded-md group transition-all duration-200"
                            >
                                <span className="w-8 h-8 flex items-center justify-center bg-red-900 group-hover:bg-red-700 rounded-md transition-colors mr-3">
                                    <FaSignOutAlt className="text-red-300 group-hover:text-white transition-colors" />
                                </span>
                                <span>Logout</span>
                            </button>
                        </li>
                    </div>
                </nav>

                {/* Bottom System Status Box */}
                <div className="mt-6 mx-3 mb-6">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-purple-900 to-purple-800 shadow-lg border border-purple-700">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-white">System Status</div>
                            <div className="px-2 py-1 rounded text-xs font-medium bg-green-700 text-white">
                                Online
                            </div>
                        </div>
                        <div className="text-xs text-purple-200 mb-2">
                            All systems operational
                        </div>
                        <div className="w-full bg-purple-800 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={`transition-all duration-300 ${
                    showSidebar ? 'md:ml-64' : 'ml-0'
                } md:pt-6 px-4 md:px-6 bg-gray-900`}
            >
                {/* Enhanced Professional Header */}
                <header className="relative mb-8">
                    <div className="rounded-lg overflow-hidden shadow-2xl">
                        <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 h-64 relative">
                            {/* Abstract Pattern */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                                    backgroundPosition: 'center center'
                                }}
                            />

                            {/* Content Container */}
                            <div className="h-full flex items-center relative z-10">
                                <div className="px-8 md:px-12 w-full">
                                    <div className="max-w-4xl">
                                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight">
                                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-gray-300">
                                                {pageTitle}
                                            </span>
                                        </h1>
                                        <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-purple-400 rounded mb-4"></div>
                                        <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl">
                                            {pageSubtitle}
                                        </p>
                                    </div>
                                </div>

                                {/* 3D floating objects design element */}
                                <div className="absolute right-8 bottom-8 opacity-20 hidden lg:block">
                                    <div className="relative">
                                        <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-purple-500 opacity-10 animate-pulse"></div>
                                        <div className="absolute top-5 -right-5 w-16 h-16 rounded-full bg-yellow-500 opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
                                        <FaCrown className="text-9xl text-white opacity-80" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Statistics Bar */}
                        <div className="bg-gray-800 bg-opacity-95 py-4 px-8 flex flex-wrap items-center justify-between border-t border-gray-700 shadow-inner">
                            <div className="flex items-center text-sm text-gray-300 mr-6 my-1">
                                <div className="w-8 h-8 rounded-md bg-gray-700 flex items-center justify-center mr-2 shadow-inner">
                                    <FaCalendarAlt className="text-purple-500" />
                                </div>
                                <span>{currentDate}</span>
                            </div>

                            <div className="flex items-center text-sm text-gray-300 mr-6 my-1">
                                <div className="w-8 h-8 rounded-md bg-gray-700 flex items-center justify-center mr-2 shadow-inner">
                                    <FaUserCheck className="text-purple-500" />
                                </div>
                                <span>{admin?.name || 'Administrator'}</span>
                            </div>

                            <div className="flex items-center text-sm text-gray-300 my-1">
                                <div className="w-8 h-8 rounded-md bg-gray-700 flex items-center justify-center mr-2 shadow-inner">
                                    <FaShieldAlt className="text-purple-500" />
                                </div>
                                <span>System Administrator</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="content pb-8">
                    {children}
                </div>
            </main>

            {/* Custom Styles */}
            <style jsx>{`
                .menu-item-active {
                    background: linear-gradient(90deg, #8B5CF6 0%, #7C3AED 100%);
                    border-left: 3px solid #FACC15;
                }
                .menu-item:hover {
                    background: linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
                }
            `}</style>
        </div>
    );
}
