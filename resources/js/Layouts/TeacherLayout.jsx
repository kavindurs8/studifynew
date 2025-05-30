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
  FaVideo
} from 'react-icons/fa';


export default function TeacherLayout({
    children,
    teacher,
    title = 'Teacher Portal - STUDIFY',
    pageTitle = 'Teacher Dashboard',
    pageSubtitle = 'Welcome back! Manage your courses, track student progress, and grow your teaching impact.',
    activeMenuItem = 'dashboard'
}) {
    const [showSidebar, setShowSidebar] = useState(true);
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { post } = useForm();
    const { route } = usePage().props.ziggy || {}; // Add ziggy route helper

    // Initialize sidebar state from localStorage
    useEffect(() => {
        const sidebarState = localStorage.getItem('sidebarOpen');
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
        localStorage.setItem('sidebarOpen', newState.toString());
    };

    const logout = (e) => {
        e.preventDefault();
        post('/teacher/logout'); // Use direct URL instead of route helper for now
    };

    // Get current date
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Menu items configuration
    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            href: '/teacher/dashboard',
            icon: FaHome,
            section: 'main'
        },
        {
            id: 'courses',
            label: 'My Courses',
            href: '/teacher/courses',
            icon: FaBook,
            section: 'main'
        },
        {
            id: 'students',
            label: 'Students',
            href: '#',
            icon: FaUsers,
            section: 'main'
        },
        {
            id: 'performance',
            label: 'Performance',
            href: '#',
            icon: FaChartBar,
            section: 'analytics'
        },
        {
            id: 'reviews',
            label: 'Reviews',
            href: '#',
            icon: FaStar,
            section: 'analytics'
        },
        {
            id: 'messages',
            label: 'Messages',
            href: '#',
            icon: FaEnvelope,
            section: 'communication'
        },
        {
            id: 'settings',
            label: 'Settings',
            href: '#',
            icon: FaCog,
            section: 'account'
        },
        {
            id: 'earnings',
            label: 'Earnings',
            href: '#',
            icon: FaDollarSign,
            section: 'account'
        },
        {
            id: 'video-library',
            label: 'Video Library',
            href: '/teacher/video-library',
            icon: FaVideo,
            section: 'main'
        }
    ];

    // Menu sections
    const sections = {
        main: 'Main Menu',
        analytics: 'Analytics',
        communication: 'Communication',
        account: 'Account'
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
                    <span className="w-8 h-8 flex items-center justify-center bg-blue-900 group-hover:bg-blue-700 rounded-md transition-colors mr-3">
                        <ItemIcon className="text-blue-300 group-hover:text-yellow-400 transition-colors" />
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
                        <FaBars className="h-6 w-6 text-blue-400 group-hover:text-yellow-400 transition-colors duration-300" />
                    ) : (
                        <FaTimes className="h-6 w-6 text-blue-400 group-hover:text-yellow-400 transition-colors duration-300" />
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
                            <span className="bg-gradient-to-r from-blue-500 to-blue-700 p-1.5 rounded mr-2 shadow-md">
                                <FaTachometerAlt className="text-white" />
                            </span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                                Teacher Portal
                            </span>
                        </h2>
                    </div>
                </div>

                {/* Teacher Profile Section */}
                <div className="px-6 py-4 border-b border-gray-800">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">
                                {teacher?.name?.charAt(0).toUpperCase() || 'T'}
                            </span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white">{teacher?.name || 'Teacher'}</p>
                            <p className="text-xs text-gray-400">{teacher?.email || 'teacher@example.com'}</p>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                                teacher?.status === 'Approved'
                                    ? 'bg-green-900 text-green-300'
                                    : 'bg-yellow-900 text-yellow-300'
                            }`}>
                                {teacher?.status || 'Pending'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="mt-4 px-3">
                    <div className="text-xs uppercase text-gray-500 font-semibold px-3 mb-2">Main Menu</div>
                    <ul className="space-y-1">
                        {renderMenuItem(menuItems[0])} {/* Dashboard */}
                        {renderMenuItem(menuItems[1])} {/* My Courses */}
                        {renderMenuItem(menuItems[2])} {/* Students */}
                        {renderMenuItem(menuItems[8])} {/* Video Library */}
                    </ul>

                    {renderMenuSection('analytics')}
                    {renderMenuSection('communication')}
                    {renderMenuSection('account')}

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

                {/* Bottom Promo Box */}
                <div className="mt-6 mx-3 mb-6">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-blue-900 to-blue-800 shadow-lg border border-blue-700">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-white">Teaching Plan</div>
                            <div className="px-2 py-1 rounded text-xs font-medium bg-blue-700 text-white">
                                Premium
                            </div>
                        </div>
                        <a href="#" className="mt-2 flex items-center justify-center px-3 py-2 text-sm text-white bg-yellow-600 hover:bg-yellow-500 transition-colors rounded-md font-medium">
                            <FaPlus className="mr-1" /> Upgrade Plan
                        </a>
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
                        <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 h-64 relative">
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
                                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-300">
                                                {pageTitle}
                                            </span>
                                        </h1>
                                        <div className="w-20 h-1 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded mb-4"></div>
                                        <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl">
                                            {pageSubtitle}
                                        </p>
                                    </div>
                                </div>

                                {/* 3D floating objects design element */}
                                <div className="absolute right-8 bottom-8 opacity-20 hidden lg:block">
                                    <div className="relative">
                                        <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-blue-500 opacity-10 animate-pulse"></div>
                                        <div className="absolute top-5 -right-5 w-16 h-16 rounded-full bg-yellow-500 opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
                                        <FaGraduationCap className="text-9xl text-white opacity-80" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Statistics Bar */}
                        <div className="bg-gray-800 bg-opacity-95 py-4 px-8 flex flex-wrap items-center justify-between border-t border-gray-700 shadow-inner">
                            <div className="flex items-center text-sm text-gray-300 mr-6 my-1">
                                <div className="w-8 h-8 rounded-md bg-gray-700 flex items-center justify-center mr-2 shadow-inner">
                                    <FaCalendarAlt className="text-yellow-500" />
                                </div>
                                <span>{currentDate}</span>
                            </div>

                            <div className="flex items-center text-sm text-gray-300 mr-6 my-1">
                                <div className="w-8 h-8 rounded-md bg-gray-700 flex items-center justify-center mr-2 shadow-inner">
                                    <FaUserCheck className="text-yellow-500" />
                                </div>
                                <span>{teacher?.name || 'Teacher'}</span>
                            </div>

                            <div className="flex items-center text-sm text-gray-300 my-1">
                                <div className="w-8 h-8 rounded-md bg-gray-700 flex items-center justify-center mr-2 shadow-inner">
                                    <FaGraduationCap className="text-yellow-500" />
                                </div>
                                <span>{teacher?.expertise_area || 'Teaching'}</span>
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
                    background: linear-gradient(90deg, #3B82F6 0%, #1E40AF 100%);
                    border-left: 3px solid #FACC15;
                }
                .menu-item:hover {
                    background: linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(30, 64, 175, 0.1) 100%);
                }
            `}</style>
        </div>
    );
}
