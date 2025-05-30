import React, { useState, useEffect } from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import SectionManager from '@/Components/Course/SectionManager';
import LectureModal from '@/Components/Course/LectureModal';
import QuizModal from '@/Components/Course/QuizModal';
import SectionModal from '@/Components/Course/SectionModal';

export default function Edit({ course, sections }) {
    const { auth } = usePage().props;
    const teacher = auth.teacher;

    const [activeTab, setActiveTab] = useState('curriculum');
    const [courseSections, setCourseSections] = useState(sections || []);
    const [showSectionModal, setShowSectionModal] = useState(false);
    const [showLectureModal, setShowLectureModal] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [editingSection, setEditingSection] = useState(null);
    const [editingLecture, setEditingLecture] = useState(null);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);

    const { post, processing } = useForm();

    const handleAddSection = () => {
        setEditingSection(null);
        setShowSectionModal(true);
    };

    const handleEditSection = (section) => {
        setEditingSection(section);
        setShowSectionModal(true);
    };

    const handleAddLecture = (section) => {
        setSelectedSection(section);
        setEditingLecture(null);
        setShowLectureModal(true);
    };

    const handleEditLecture = (lecture, section) => {
        setSelectedSection(section);
        setEditingLecture(lecture);
        setShowLectureModal(true);
    };

    const handleAddQuiz = (section) => {
        setSelectedSection(section);
        setEditingQuiz(null);
        setShowQuizModal(true);
    };

    const handleEditQuiz = (quiz, section) => {
        setSelectedSection(section);
        setEditingQuiz(quiz);
        setShowQuizModal(true);
    };

    const submitForReview = () => {
        if (confirm('Are you sure you want to submit this course for review?')) {
            post(route('teacher.courses.submit', course.id), {
                onSuccess: () => {
                    alert('Course submitted for review successfully!');
                }
            });
        }
    };

    const canSubmitForReview = () => {
        return courseSections.length >= 1 &&
               courseSections.some(section =>
                   (section.lectures && section.lectures.length > 0) ||
                   (section.quizzes && section.quizzes.length > 0)
               );
    };

    return (
        <TeacherLayout
            teacher={teacher}
            title={`Edit Course: ${course.title} - STUDIFY`}
            pageTitle={`Edit Course: ${course.title}`}
            pageSubtitle="Create engaging content and curriculum for your course"
            activeMenuItem="courses"
        >
            <Head title={`Edit Course: ${course.title}`} />

            <div className="mx-auto max-w-8xl">
                {/* Course Header */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700 shadow-lg mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{course.title}</h2>
                            <p className="text-gray-400 mb-4">{course.description}</p>
                            <div className="flex items-center space-x-4">
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                    course.status === 'published' ? 'bg-green-600 text-white' :
                                    course.status === 'pending_approval' ? 'bg-yellow-600 text-white' :
                                    course.status === 'draft' ? 'bg-gray-600 text-white' :
                                    'bg-red-600 text-white'
                                }`}>
                                    {course.status?.charAt(0).toUpperCase() + course.status?.slice(1) || 'Draft'}
                                </span>
                                <span className="text-gray-400">{course.category}</span>
                                <span className="text-green-400 font-bold">${course.price}</span>
                            </div>
                        </div>
                        <div className="space-x-4">
                            {course.status === 'draft' && canSubmitForReview() && (
                                <button
                                    onClick={submitForReview}
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                                >
                                    {processing ? 'Submitting...' : 'Submit for Review'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 shadow-lg">
                    <div className="border-b border-gray-600">
                        <nav className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('curriculum')}
                                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === 'curriculum'
                                        ? 'border-blue-500 text-blue-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-300'
                                }`}
                            >
                                Curriculum
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === 'settings'
                                        ? 'border-blue-500 text-blue-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-300'
                                }`}
                            >
                                Course Settings
                            </button>
                        </nav>
                    </div>

                    <div className="p-8">
                        {activeTab === 'curriculum' && (
                            <SectionManager
                                course={course}
                                sections={courseSections}
                                setSections={setCourseSections}
                                onAddSection={handleAddSection}
                                onEditSection={handleEditSection}
                                onAddLecture={handleAddLecture}
                                onEditLecture={handleEditLecture}
                                onAddQuiz={handleAddQuiz}
                                onEditQuiz={handleEditQuiz}
                            />
                        )}

                        {activeTab === 'settings' && (
                            <div className="text-center py-12">
                                <p className="text-gray-400">Course settings coming soon...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showSectionModal && (
                <SectionModal
                    isOpen={showSectionModal}
                    onClose={() => setShowSectionModal(false)}
                    course={course}
                    section={editingSection}
                    onSectionCreated={(section) => {
                        if (editingSection) {
                            setCourseSections(prev => prev.map(s => s.id === section.id ? section : s));
                        } else {
                            setCourseSections(prev => [...prev, section]);
                        }
                        setShowSectionModal(false);
                    }}
                />
            )}

            {showLectureModal && (
                <LectureModal
                    isOpen={showLectureModal}
                    onClose={() => setShowLectureModal(false)}
                    course={course}
                    section={selectedSection}
                    lecture={editingLecture}
                    onLectureCreated={(lecture) => {
                        setCourseSections(prev => prev.map(section => {
                            if (section.id === selectedSection.id) {
                                const lectures = section.lectures || [];
                                if (editingLecture) {
                                    return {
                                        ...section,
                                        lectures: lectures.map(l => l.id === lecture.id ? lecture : l)
                                    };
                                } else {
                                    return {
                                        ...section,
                                        lectures: [...lectures, lecture]
                                    };
                                }
                            }
                            return section;
                        }));
                        setShowLectureModal(false);
                    }}
                />
            )}

            {showQuizModal && (
                <QuizModal
                    isOpen={showQuizModal}
                    onClose={() => setShowQuizModal(false)}
                    course={course}
                    section={selectedSection}
                    quiz={editingQuiz}
                    onQuizCreated={(quiz) => {
                        setCourseSections(prev => prev.map(section => {
                            if (section.id === selectedSection.id) {
                                const quizzes = section.quizzes || [];
                                if (editingQuiz) {
                                    return {
                                        ...section,
                                        quizzes: quizzes.map(q => q.id === quiz.id ? quiz : q)
                                    };
                                } else {
                                    return {
                                        ...section,
                                        quizzes: [...quizzes, quiz]
                                    };
                                }
                            }
                            return section;
                        }));
                        setShowQuizModal(false);
                    }}
                />
            )}
        </TeacherLayout>
    );
}
