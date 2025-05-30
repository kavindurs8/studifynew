import React from 'react';
import { router } from '@inertiajs/react';

export default function SectionManager({
    course,
    sections,
    setSections,
    onAddSection,
    onEditSection,
    onAddLecture,
    onEditLecture,
    onAddQuiz,
    onEditQuiz
}) {

    const deleteSection = (sectionId) => {
        if (confirm('Are you sure you want to delete this section?')) {
            router.delete(route('teacher.courses.sections.destroy', [course.id, sectionId]), {
                onSuccess: () => {
                    // Force a full page reload
                    window.location.reload();
                },
                onError: (errors) => {
                    console.error('Error deleting section:', errors);
                    alert('Error deleting section. Please try again.');
                }
            });
        }
    };

    const deleteLecture = (sectionId, lectureId) => {
        if (confirm('Are you sure you want to delete this lecture?')) {
            router.delete(route('teacher.courses.sections.lectures.destroy', [course.id, sectionId, lectureId]), {
                onSuccess: () => {
                    // Force a full page reload
                    window.location.reload();
                },
                onError: (errors) => {
                    console.error('Error deleting lecture:', errors);
                    alert('Error deleting lecture. Please try again.');
                }
            });
        }
    };

    const deleteQuiz = (sectionId, quizId) => {
        if (confirm('Are you sure you want to delete this quiz?')) {
            router.delete(route('teacher.courses.sections.quizzes.destroy', [course.id, sectionId, quizId]), {
                onSuccess: () => {
                    // Force a full page reload
                    window.location.reload();
                },
                onError: (errors) => {
                    console.error('Error deleting quiz:', errors);
                    alert('Error deleting quiz. Please try again.');
                }
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-white">Course Curriculum</h3>
                    <p className="text-gray-400 mt-1">
                        Add sections, lectures, and quizzes to build your course content
                    </p>
                </div>
                <button
                    onClick={onAddSection}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 inline-flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Section
                </button>
            </div>

            {sections.length === 0 ? (
                <div className="text-center py-12 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">No sections yet</h4>
                    <p className="text-gray-400 mb-6">Start building your course by adding your first section</p>
                    <button
                        onClick={onAddSection}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
                    >
                        Add Your First Section
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {sections.map((section, index) => (
                        <div key={section.id} className="bg-gray-700 rounded-lg border border-gray-600">
                            {/* Section Header */}
                            <div className="p-6 border-b border-gray-600">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-white mb-2">
                                            Section {index + 1}: {section.title}
                                        </h4>
                                        {section.description && (
                                            <p className="text-gray-300">{section.description}</p>
                                        )}
                                    </div>
                                    <div className="flex space-x-2 ml-4">
                                        <button
                                            onClick={() => onEditSection(section)}
                                            className="text-blue-400 hover:text-blue-300 p-2"
                                            title="Edit Section"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => deleteSection(section.id)}
                                            className="text-red-400 hover:text-red-300 p-2"
                                            title="Delete Section"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Section Content */}
                            <div className="p-6">
                                {/* Add Content Buttons */}
                                <div className="flex space-x-4 mb-6">
                                    <button
                                        onClick={() => onAddLecture(section)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 inline-flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1M4 6h16M4 10h16M4 14h16M4 18h16" />
                                        </svg>
                                        Add Lecture
                                    </button>
                                    <button
                                        onClick={() => onAddQuiz(section)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 inline-flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        Add Quiz
                                    </button>
                                </div>

                                {/* Lectures */}
                                {section.lectures && section.lectures.length > 0 && (
                                    <div className="space-y-3 mb-6">
                                        <h5 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Lectures</h5>
                                        {section.lectures.map((lecture, lectureIndex) => (
                                            <div key={lecture.id} className="bg-gray-600 p-4 rounded-lg flex justify-between items-center">
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-green-600 text-white p-2 rounded">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1M4 6h16M4 10h16M4 14h16M4 18h16" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h6 className="text-white font-medium">
                                                            Lecture {lectureIndex + 1}: {lecture.title}
                                                        </h6>
                                                        {lecture.duration && (
                                                            <p className="text-gray-400 text-sm">{lecture.formatted_duration}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => onEditLecture(lecture, section)}
                                                        className="text-blue-400 hover:text-blue-300 p-1"
                                                        title="Edit Lecture"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteLecture(section.id, lecture.id)}
                                                        className="text-red-400 hover:text-red-300 p-1"
                                                        title="Delete Lecture"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Quizzes */}
                                {section.quizzes && section.quizzes.length > 0 && (
                                    <div className="space-y-3">
                                        <h5 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Quizzes</h5>
                                        {section.quizzes.map((quiz, quizIndex) => (
                                            <div key={quiz.id} className="bg-gray-600 p-4 rounded-lg flex justify-between items-center">
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-purple-600 text-white p-2 rounded">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h6 className="text-white font-medium">
                                                            Quiz {quizIndex + 1}: {quiz.title}
                                                        </h6>
                                                        <p className="text-gray-400 text-sm">
                                                            {quiz.questions?.length || 0} questions • {quiz.passing_score}% to pass
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => onEditQuiz(quiz, section)}
                                                        className="text-blue-400 hover:text-blue-300 p-1"
                                                        title="Edit Quiz"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteQuiz(section.id, quiz.id)}
                                                        className="text-red-400 hover:text-red-300 p-1"
                                                        title="Delete Quiz"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Empty State */}
                                {(!section.lectures || section.lectures.length === 0) &&
                                 (!section.quizzes || section.quizzes.length === 0) && (
                                    <div className="text-center py-8 text-gray-400">
                                        <p>No content added yet. Add lectures or quizzes to get started.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
