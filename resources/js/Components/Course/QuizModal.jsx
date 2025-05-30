import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function QuizModal({ isOpen, onClose, course, section, quiz, onQuizCreated }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [passingScore, setPassingScore] = useState(70);
    const [timeLimit, setTimeLimit] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (quiz) {
            setTitle(quiz.title || '');
            setDescription(quiz.description || '');
            setPassingScore(quiz.passing_score || 70);
            setTimeLimit(quiz.time_limit || '');
            setQuestions(quiz.questions || []);
        } else {
            setTitle('');
            setDescription('');
            setPassingScore(70);
            setTimeLimit('');
            setQuestions([createEmptyQuestion()]);
        }
        setErrors({});
    }, [quiz, isOpen]);

    const createEmptyQuestion = () => ({
        id: Date.now() + Math.random(),
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: 'A'
    });

    const addQuestion = () => {
        setQuestions([...questions, createEmptyQuestion()]);
    };

    const removeQuestion = (index) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index));
        }
    };

    const updateQuestion = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
        setQuestions(updatedQuestions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            title,
            description,
            passing_score: passingScore,
            time_limit: timeLimit,
            questions
        };

        const url = quiz
            ? route('teacher.courses.sections.quizzes.update', [course.id, section.id, quiz.id])
            : route('teacher.courses.sections.quizzes.store', [course.id, section.id]);

        const method = quiz ? 'put' : 'post';

        router[method](url, data, {
            onSuccess: () => {
                // Only reload if we're creating/updating, not just opening to edit
                window.location.reload();
            },
            onError: (errors) => {
                setErrors(errors);
                setLoading(false);
            }
        });
    };

    // Make sure the modal doesn't submit when just opening for edit
    useEffect(() => {
        if (quiz && isOpen) {
            // Pre-populate form with quiz data for editing
            setTitle(quiz.title || '');
            setDescription(quiz.description || '');
            setPassingScore(quiz.passing_score || 70);
            setTimeLimit(quiz.time_limit || '');

            // Convert quiz questions back to the format expected by the form
            if (quiz.questions && quiz.questions.length > 0) {
                const formattedQuestions = quiz.questions.map(q => ({
                    id: Date.now() + Math.random(),
                    question_text: q.question,
                    option_a: q.options[0] || '',
                    option_b: q.options[1] || '',
                    option_c: q.options[2] || '',
                    option_d: q.options[3] || '',
                    correct_answer: ['A', 'B', 'C', 'D'][q.correct_answer] || 'A'
                }));
                setQuestions(formattedQuestions);
            }
        } else if (!quiz && isOpen) {
            // Reset form for new quiz
            setTitle('');
            setDescription('');
            setPassingScore(70);
            setTimeLimit('');
            setQuestions([{
                id: Date.now(),
                question_text: '',
                option_a: '',
                option_b: '',
                option_c: '',
                option_d: '',
                correct_answer: 'A'
            }]);
        }
    }, [quiz, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-900 opacity-75" onClick={onClose}></div>
                </div>

                <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-gray-800 px-6 pt-6 pb-4">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">
                                    {quiz ? 'Edit Quiz' : 'Add New Quiz'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-300"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Quiz Settings */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Quiz Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                                        placeholder="Enter quiz title (without 'Quiz X:')"
                                        required
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        This will be saved as: Quiz {((section?.quizzes?.length || 0) + 1)}: {title || 'Your Title'}
                                    </p>
                                    {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Passing Score (%)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={passingScore}
                                        onChange={(e) => setPassingScore(parseInt(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                                    />
                                </div>

                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Quiz Description
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                                        placeholder="Optional description for this quiz"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Time Limit (minutes) - Optional
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={timeLimit}
                                        onChange={(e) => setTimeLimit(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                                        placeholder="Leave empty for no time limit"
                                    />
                                </div>
                            </div>

                            {/* Questions Section */}
                            <div className="border-t border-gray-600 pt-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-lg font-bold text-white">Quiz Questions</h4>
                                    <button
                                        type="button"
                                        onClick={addQuestion}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 inline-flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Question
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {questions.map((question, index) => (
                                        <div key={question.id} className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                                            <div className="flex justify-between items-center mb-4">
                                                <h5 className="text-white font-medium">Question {index + 1}</h5>
                                                {questions.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeQuestion(index)}
                                                        className="text-red-400 hover:text-red-300 p-1"
                                                        title="Delete Question"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Question Text *
                                                    </label>
                                                    <textarea
                                                        value={question.question_text}
                                                        onChange={(e) => updateQuestion(index, 'question_text', e.target.value)}
                                                        rows={2}
                                                        className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                                                        placeholder="Enter your question here..."
                                                        required
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                                            Option A *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={question.option_a}
                                                            onChange={(e) => updateQuestion(index, 'option_a', e.target.value)}
                                                            className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                                                            placeholder="Enter option A"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                                            Option B *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={question.option_b}
                                                            onChange={(e) => updateQuestion(index, 'option_b', e.target.value)}
                                                            className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                                                            placeholder="Enter option B"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                                            Option C *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={question.option_c}
                                                            onChange={(e) => updateQuestion(index, 'option_c', e.target.value)}
                                                            className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                                                            placeholder="Enter option C"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                                            Option D *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={question.option_d}
                                                            onChange={(e) => updateQuestion(index, 'option_d', e.target.value)}
                                                            className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                                                            placeholder="Enter option D"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Correct Answer *
                                                    </label>
                                                    <select
                                                        value={question.correct_answer}
                                                        onChange={(e) => updateQuestion(index, 'correct_answer', e.target.value)}
                                                        className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                                                        required
                                                    >
                                                        <option value="A">Option A</option>
                                                        <option value="B">Option B</option>
                                                        <option value="C">Option C</option>
                                                        <option value="D">Option D</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-700 px-6 py-4 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !title.trim() || questions.some(q => !q.question_text.trim())}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Saving...' : (quiz ? 'Update Quiz' : 'Create Quiz')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
