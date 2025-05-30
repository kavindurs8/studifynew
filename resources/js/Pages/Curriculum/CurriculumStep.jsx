import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaArrowLeft, FaPlus, FaEdit, FaTrash, FaBook, FaQuestionCircle, FaPlay } from 'react-icons/fa';
import SectionEditor from './SectionEditor';
import LectureEditor from './LectureEditor';
import QuizEditor from './QuizEditor';

export default function CurriculumStep({ courseId, onNext, onPrev }) {
    const [sections, setSections] = useState([]);
    const [showSectionModal, setShowSectionModal] = useState(false);
    const [showLectureModal, setShowLectureModal] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [editingSection, setEditingSection] = useState(null);
    const [editingLecture, setEditingLecture] = useState(null);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [currentSectionId, setCurrentSectionId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (courseId) {
            loadCurriculum();
        }
    }, [courseId]);

    const loadCurriculum = async () => {
        try {
            const response = await fetch(`/teacher/courses/${courseId}/curriculum`);
            const data = await response.json();
            if (data.success) {
                setSections(data.curriculum);
            }
        } catch (error) {
            console.error('Error loading curriculum:', error);
        } finally {
            setLoading(false);
        }
    };

    const addSection = () => {
        setEditingSection(null);
        setShowSectionModal(true);
    };

    const editSection = (section) => {
        setEditingSection(section);
        setShowSectionModal(true);
    };

    const addLecture = (sectionId) => {
        setCurrentSectionId(sectionId);
        setEditingLecture(null);
        setShowLectureModal(true);
    };

    const editLecture = (lecture) => {
        setCurrentSectionId(lecture.section_id);
        setEditingLecture(lecture);
        setShowLectureModal(true);
    };

    const addQuiz = (sectionId) => {
        setCurrentSectionId(sectionId);
        setEditingQuiz(null);
        setShowQuizModal(true);
    };

    const editQuiz = (quiz) => {
        setCurrentSectionId(quiz.section_id);
        setEditingQuiz(quiz);
        setShowQuizModal(true);
    };

    const deleteSection = async (sectionId) => {
        if (confirm('Are you sure you want to delete this section? This will also delete all lectures and quizzes in this section.')) {
            try {
                const response = await fetch(`/teacher/courses/${courseId}/sections/${sectionId}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    }
                });

                if (response.ok) {
                    loadCurriculum();
                }
            } catch (error) {
                console.error('Error deleting section:', error);
            }
        }
    };

    const deleteLecture = async (sectionId, lectureId) => {
        if (confirm('Are you sure you want to delete this lecture?')) {
            try {
                const response = await fetch(`/teacher/courses/${courseId}/sections/${sectionId}/lectures/${lectureId}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    }
                });

                if (response.ok) {
                    loadCurriculum();
                }
            } catch (error) {
                console.error('Error deleting lecture:', error);
            }
        }
    };

    const deleteQuiz = async (sectionId, quizId) => {
        if (confirm('Are you sure you want to delete this quiz?')) {
            try {
                const response = await fetch(`/teacher/courses/${courseId}/sections/${sectionId}/quizzes/${quizId}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    }
                });

                if (response.ok) {
                    loadCurriculum();
                }
            } catch (error) {
                console.error('Error deleting quiz:', error);
            }
        }
    };

    const totalLectures = sections.reduce((total, section) =>
        total + (section.lectures?.length || 0), 0
    );

    const totalQuizzes = sections.reduce((total, section) =>
        total + (section.quizzes?.length || 0), 0
    );

    const canProceed = sections.length > 0 && totalLectures >= 5;

    if (loading) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white shadow rounded-lg p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Curriculum</h2>
                    <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <FaBook className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    Here's where you add course content—like lectures, course sections, assignments, and more.
                                    Click a + icon on the left to get started.
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-2">
                        Start putting together your course by creating sections, lectures and practice activities (quizzes, coding exercises and assignments).
                        Use your course outline to structure your content and label your sections and lectures clearly.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-gray-900">{sections.length}</div>
                        <div className="text-sm text-gray-600">Sections</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-gray-900">{totalLectures}</div>
                        <div className="text-sm text-gray-600">Lectures</div>
                        {totalLectures < 5 && (
                            <div className="text-xs text-red-500 mt-1">Minimum 5 required</div>
                        )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-gray-900">{totalQuizzes}</div>
                        <div className="text-sm text-gray-600">Quizzes</div>
                    </div>
                </div>

                {/* Add Section Button */}
                <div className="mb-6">
                    <button
                        onClick={addSection}
                        className="inline-flex items-center px-4 py-2 border border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <FaPlus className="h-4 w-4 mr-2" />
                        Add Section
                    </button>
                </div>

                {/* Curriculum Content */}
                <div className="space-y-6">
                    {sections.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <FaBook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No sections yet</h3>
                            <p className="text-gray-600 mb-4">Create your first section to start building your curriculum</p>
                            <button
                                onClick={addSection}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <FaPlus className="h-4 w-4 mr-2" />
                                Create First Section
                            </button>
                        </div>
                    ) : (
                        sections.map((section, sectionIndex) => (
                            <div key={section.id} className="border border-gray-200 rounded-lg">
                                {/* Section Header */}
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3">
                                                Section {sectionIndex + 1}
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => editSection(section)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <FaEdit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteSection(section.id)}
                                                className="text-red-400 hover:text-red-600"
                                            >
                                                <FaTrash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    {section.description && (
                                        <p className="text-sm text-gray-600 mt-2">{section.description}</p>
                                    )}
                                </div>

                                {/* Section Content */}
                                <div className="p-6">
                                    {/* Lectures and Quizzes */}
                                    <div className="space-y-3">
                                        {/* Lectures */}
                                        {section.lectures?.map((lecture, lectureIndex) => (
                                            <div key={lecture.id} className="flex items-center justify-between py-3 px-4 bg-white border border-gray-200 rounded-md">
                                                <div className="flex items-center">
                                                    <FaPlay className="h-4 w-4 text-green-500 mr-3" />
                                                    <div>
                                                        <span className="font-medium text-gray-900">
                                                            Lecture {lecture.lecture_number}: {lecture.title}
                                                        </span>
                                                        {lecture.duration && (
                                                            <span className="text-sm text-gray-500 ml-2">
                                                                ({Math.floor(lecture.duration / 60)}:{(lecture.duration % 60).toString().padStart(2, '0')})
                                                            </span>
                                                        )}
                                                        {lecture.is_preview && (
                                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full ml-2">
                                                                Preview
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => editLecture(lecture)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <FaEdit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteLecture(section.id, lecture.id)}
                                                        className="text-red-400 hover:text-red-600"
                                                    >
                                                        <FaTrash className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Quizzes */}
                                        {section.quizzes?.map((quiz, quizIndex) => (
                                            <div key={quiz.id} className="flex items-center justify-between py-3 px-4 bg-white border border-gray-200 rounded-md">
                                                <div className="flex items-center">
                                                    <FaQuestionCircle className="h-4 w-4 text-purple-500 mr-3" />
                                                    <div>
                                                        <span className="font-medium text-gray-900">
                                                            Quiz {quiz.quiz_number}: {quiz.title}
                                                        </span>
                                                        <span className="text-sm text-gray-500 ml-2">
                                                            ({quiz.questions_count || 0} questions)
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => editQuiz(quiz)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <FaEdit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteQuiz(section.id, quiz.id)}
                                                        className="text-red-400 hover:text-red-600"
                                                    >
                                                        <FaTrash className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Content Buttons */}
                                    <div className="mt-4 flex space-x-3">
                                        <button
                                            onClick={() => addLecture(section.id)}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            <FaPlus className="h-3 w-3 mr-2" />
                                            Add Lecture
                                        </button>
                                        <button
                                            onClick={() => addQuiz(section.id)}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            <FaPlus className="h-3 w-3 mr-2" />
                                            Add Quiz
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Requirements Check */}
                {!canProceed && (
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <FaBook className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">
                                    Course Requirements Not Met
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <ul className="list-disc list-inside space-y-1">
                                        {sections.length === 0 && <li>Your course must have at least one section</li>}
                                        {totalLectures < 5 && <li>Your course must have at least 5 lectures (currently {totalLectures})</li>}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-between pt-8 border-t mt-8">
                    <button
                        type="button"
                        onClick={onPrev}
                        className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <FaArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                    </button>

                    <button
                        type="button"
                        onClick={onNext}
                        disabled={!canProceed}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Continue to Pricing
                        <FaArrowRight className="ml-2 h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Modals */}
            {showSectionModal && (
                <SectionEditor
                    courseId={courseId}
                    section={editingSection}
                    onClose={() => setShowSectionModal(false)}
                    onSave={() => {
                        setShowSectionModal(false);
                        loadCurriculum();
                    }}
                />
            )}

            {showLectureModal && (
                <LectureEditor
                    courseId={courseId}
                    sectionId={currentSectionId}
                    lecture={editingLecture}
                    onClose={() => setShowLectureModal(false)}
                    onSave={() => {
                        setShowLectureModal(false);
                        loadCurriculum();
                    }}
                />
            )}

            {showQuizModal && (
                <QuizEditor
                    courseId={courseId}
                    sectionId={currentSectionId}
                    quiz={editingQuiz}
                    onClose={() => setShowQuizModal(false)}
                    onSave={() => {
                        setShowQuizModal(false);
                        loadCurriculum();
                    }}
                />
            )}
        </>
    );
}
