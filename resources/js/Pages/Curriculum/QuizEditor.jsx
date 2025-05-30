import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaPlus, FaTrash, FaQuestionCircle } from 'react-icons/fa';

export default function QuizEditor({ courseId, sectionId, quiz, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        time_limit: 30,
        passing_score: 70
    });
    const [questions, setQuestions] = useState([
        {
            question: '',
            options: ['', '', '', ''],
            correct_answer: 0,
            explanation: ''
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [quizNumber, setQuizNumber] = useState(1);

    useEffect(() => {
        if (quiz) {
            setFormData({
                title: quiz.title || '',
                description: quiz.description || '',
                time_limit: quiz.time_limit || 30,
                passing_score: quiz.passing_score || 70
            });
            setQuizNumber(quiz.quiz_number);
            if (quiz.questions && quiz.questions.length > 0) {
                setQuestions(quiz.questions.map(q => ({
                    question: q.question,
                    options: q.options,
                    correct_answer: q.correct_answer,
                    explanation: q.explanation || ''
                })));
            }
        } else {
            fetchNextQuizNumber();
        }
    }, [quiz, sectionId]);

    const fetchNextQuizNumber = async () => {
        try {
            const response = await fetch(`/teacher/courses/${courseId}/sections/${sectionId}/next-quiz-number`);
            const data = await response.json();
            if (data.success) {
                setQuizNumber(data.next_number);
            }
        } catch (error) {
            console.error('Error fetching quiz number:', error);
        }
    };

    const addQuestion = () => {
        setQuestions([...questions, {
            question: '',
            options: ['', '', '', ''],
            correct_answer: 0,
            explanation: ''
        }]);
    };

    const removeQuestion = (index) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index));
        }
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const updateOption = (questionIndex, optionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Validate questions
        const validQuestions = questions.filter(q =>
            q.question.trim() &&
            q.options.every(opt => opt.trim()) &&
            q.correct_answer >= 0 && q.correct_answer <= 3
        );

        if (validQuestions.length === 0) {
            setErrors({ questions: ['At least one complete question is required'] });
            setLoading(false);
            return;
        }

        try {
            const submitData = {
                ...formData,
                questions: validQuestions
            };

            const url = quiz
                ? `/teacher/courses/${courseId}/sections/${sectionId}/quizzes/${quiz.id}`
                : `/teacher/courses/${courseId}/sections/${sectionId}/quizzes`;

            const method = quiz ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(submitData)
            });

            const data = await response.json();

            if (data.success) {
                onSave();
            } else {
                setErrors(data.errors || {});
            }
        } catch (error) {
            console.error('Error saving quiz:', error);
            setErrors({ general: 'An error occurred while saving the quiz.' });
        } finally {
            setLoading(false);
        }
    };

    const displayTitle = formData.title
        ? `Quiz ${quizNumber}: ${formData.title}`
        : `Quiz ${quizNumber}: [Enter title]`;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-5 mx-auto p-5 border max-w-4xl shadow-lg rounded-md bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        {quiz ? 'Edit Quiz' : 'Add New Quiz'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <FaTimes className="h-5 w-5" />
                    </button>
                </div>

                <div className="mb-4 p-3 bg-purple-50 rounded-md">
                    <p className="text-sm text-purple-700 font-medium flex items-center">
                        <FaQuestionCircle className="mr-2" />
                        {displayTitle}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Quiz Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter quiz title"
                                required
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title[0]}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="time_limit" className="block text-sm font-medium text-gray-700">
                                Time Limit (minutes)
                            </label>
                            <input
                                type="number"
                                id="time_limit"
                                value={formData.time_limit}
                                onChange={(e) => setFormData({ ...formData, time_limit: parseInt(e.target.value) || 30 })}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                min="1"
                                max="180"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Describe what this quiz covers..."
                            />
                        </div>

                        <div>
                            <label htmlFor="passing_score" className="block text-sm font-medium text-gray-700">
                                Passing Score (%)
                            </label>
                            <input
                                type="number"
                                id="passing_score"
                                value={formData.passing_score}
                                onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) || 70 })}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                min="1"
                                max="100"
                                required
                            />
                        </div>
                    </div>

                    {/* Questions Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-medium text-gray-900">Questions</h4>
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <FaPlus className="h-3 w-3 mr-2" />
                                Add Question
                            </button>
                        </div>

                        <div className="space-y-6">
                            {questions.map((question, questionIndex) => (
                                <div key={questionIndex} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className="font-medium text-gray-900">Question {questionIndex + 1}</h5>
                                        {questions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(questionIndex)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FaTrash className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Question Text *
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={question.question}
                                                onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter your question here..."
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Answer Options *
                                            </label>
                                            <div className="space-y-2">
                                                {question.options.map((option, optionIndex) => (
                                                    <div key={optionIndex} className="flex items-center space-x-3">
                                                        <input
                                                            type="radio"
                                                            name={`correct_answer_${questionIndex}`}
                                                            checked={question.correct_answer === optionIndex}
                                                            onChange={() => updateQuestion(questionIndex, 'correct_answer', optionIndex)}
                                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700 w-6">
                                                            {String.fromCharCode(65 + optionIndex)}.
                                                        </span>
                                                        <input
                                                            type="text"
                                                            value={option}
                                                            onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                                                            className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                                            required
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Select the radio button next to the correct answer
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Explanation (optional)
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={question.explanation}
                                                onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Explain why this is the correct answer..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {errors.questions && (
                            <p className="mt-2 text-sm text-red-600">{errors.questions[0]}</p>
                        )}
                    </div>

                    {errors.general && (
                        <div className="text-red-600 text-sm">{errors.general}</div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                            <FaSave className="h-4 w-4 mr-2" />
                            {loading ? 'Saving...' : 'Save Quiz'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
