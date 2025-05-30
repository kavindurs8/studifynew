import AppLayout from '@/Layouts/AppLayoutTeacher';
import HeroSection from './Home_Hero';

export default function Home() {
    return (
        <AppLayout title="Home - STUDIFY">
            {/* Hero Section from new.jsx */}
            <HeroSection />

            {/* Additional sections can be added here */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">
                            Why Choose STUDIFY?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-6">
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Instructors</h3>
                                <p className="text-gray-600">Learn from industry professionals with years of experience.</p>
                            </div>
                            <div className="p-6">
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Certified Courses</h3>
                                <p className="text-gray-600">Get certificates upon completion to boost your career.</p>
                            </div>
                            <div className="p-6">
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Learning</h3>
                                <p className="text-gray-600">Learn at your own pace, anytime and anywhere.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Courses Section */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Courses</h2>
                        <p className="text-lg text-gray-600">Discover our most popular courses</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Course Card 1 */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img
                                src="https://via.placeholder.com/400x200"
                                alt="Course"
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">React Development</h3>
                                <p className="text-gray-600 mb-4">Master React.js from basics to advanced concepts</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-blue-600">$99</span>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Course Card 2 */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img
                                src="https://via.placeholder.com/400x200"
                                alt="Course"
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Python Programming</h3>
                                <p className="text-gray-600 mb-4">Learn Python programming from scratch</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-blue-600">$79</span>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Course Card 3 */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img
                                src="https://via.placeholder.com/400x200"
                                alt="Course"
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">UI/UX Design</h3>
                                <p className="text-gray-600 mb-4">Create beautiful and functional user interfaces</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-blue-600">$89</span>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
