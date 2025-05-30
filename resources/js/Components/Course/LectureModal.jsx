import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function LectureModal({ isOpen, onClose, course, section, lecture, onLectureCreated }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [isPreview, setIsPreview] = useState(false);
    const [contentType, setContentType] = useState('text'); // text, video, youtube
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (lecture && isOpen) {
            // Pre-populate form with lecture data for editing
            setTitle(lecture.title || '');
            setContent(lecture.content || '');
            setContentType(lecture.youtube_url ? 'youtube' : (lecture.video_path ? 'video' : 'text'));
            setYoutubeUrl(lecture.youtube_url || '');
            setIsPreview(lecture.is_preview || false);
            setVideoFile(null); // Reset file input
        } else if (!lecture && isOpen) {
            // Reset form for new lecture
            setTitle('');
            setContent('');
            setContentType('text');
            setYoutubeUrl('');
            setIsPreview(false);
            setVideoFile(null);
        }
        setErrors({});
    }, [lecture, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Make sure all required fields are included
        const formData = new FormData();
        formData.append('title', title); // Ensure title is being sent
        formData.append('content', content || '');
        formData.append('content_type', contentType);
        formData.append('is_preview', isPreview ? '1' : '0');

        // Add conditional fields based on content type
        if (contentType === 'video' && videoFile) {
            formData.append('video_file', videoFile);
        } else if (contentType === 'youtube' && youtubeUrl) {
            formData.append('youtube_url', youtubeUrl);
        }

        // For PUT requests, add the method override
        if (lecture) {
            formData.append('_method', 'PUT');
        }

        const url = lecture
            ? route('teacher.courses.sections.lectures.update', [course.id, section.id, lecture.id])
            : route('teacher.courses.sections.lectures.store', [course.id, section.id]);

        const method = lecture ? 'post' : 'post'; // Use POST for both because of FormData

        router[method](url, formData, {
            onSuccess: () => {
                window.location.reload();
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
                setErrors(errors);
                setLoading(false);
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-900 opacity-75" onClick={onClose}></div>
                </div>

                <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-gray-800 px-6 pt-6 pb-4">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">
                                    {lecture ? 'Edit Lecture' : 'Add New Lecture'}
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

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Lecture Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                                            placeholder="Enter lecture title"
                                            required
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            This will be saved as: Lecture {((section?.lectures?.length || 0) + 1)}: {title || 'Your Title'}
                                        </p>
                                        {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Content Type *
                                        </label>
                                        <select
                                            value={contentType}
                                            onChange={(e) => setContentType(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                                        >
                                            <option value="text">Text Content</option>
                                            <option value="video">Video Upload</option>
                                            <option value="youtube">YouTube URL</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_preview"
                                            checked={isPreview}
                                            onChange={(e) => setIsPreview(e.target.checked)}
                                            className="mr-3 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="is_preview" className="text-sm text-gray-300">
                                            Make this lecture a free preview
                                        </label>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    {contentType === 'video' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Video File
                                            </label>
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={(e) => setVideoFile(e.target.files[0])}
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                            />
                                            {lecture?.video_path && (
                                                <p className="text-xs text-green-400 mt-1">
                                                    Current: {lecture.video_path.split('/').pop()}
                                                </p>
                                            )}
                                            {errors.video_file && <p className="text-red-400 text-sm mt-1">{errors.video_file}</p>}
                                        </div>
                                    )}

                                    {contentType === 'youtube' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                YouTube URL
                                            </label>
                                            <input
                                                type="url"
                                                value={youtubeUrl}
                                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                                                placeholder="https://www.youtube.com/watch?v=..."
                                            />
                                            {errors.youtube_url && <p className="text-red-400 text-sm mt-1">{errors.youtube_url}</p>}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Text Content Area */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Lecture Content
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={8}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors"
                                    placeholder="Enter lecture content, notes, or description..."
                                />
                                {errors.content && <p className="text-red-400 text-sm mt-1">{errors.content}</p>}
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
                                disabled={loading || !title.trim()}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Saving...' : (lecture ? 'Update Lecture' : 'Create Lecture')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
