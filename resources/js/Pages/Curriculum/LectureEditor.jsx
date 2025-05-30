import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaSave, FaUpload, FaPlay } from 'react-icons/fa';

export default function LectureEditor({ courseId, sectionId, lecture, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        is_preview: false
    });
    const [videoFile, setVideoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);
    const [lectureNumber, setLectureNumber] = useState(1);

    useEffect(() => {
        if (lecture) {
            setFormData({
                title: lecture.title || '',
                content: lecture.content || '',
                is_preview: lecture.is_preview || false
            });
            setLectureNumber(lecture.lecture_number);
        } else {
            // Get next lecture number
            fetchNextLectureNumber();
        }
    }, [lecture, sectionId]);

    const fetchNextLectureNumber = async () => {
        try {
            const response = await fetch(`/teacher/courses/${courseId}/sections/${sectionId}/next-lecture-number`);
            const data = await response.json();
            if (data.success) {
                setLectureNumber(data.next_number);
            }
        } catch (error) {
            console.error('Error fetching lecture number:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('content', formData.content);
            formDataToSend.append('is_preview', formData.is_preview ? '1' : '0');

            if (videoFile) {
                formDataToSend.append('video_file', videoFile);
            }

            const url = lecture
                ? `/teacher/courses/${courseId}/sections/${sectionId}/lectures/${lecture.id}`
                : `/teacher/courses/${courseId}/sections/${sectionId}/lectures`;

            const method = lecture ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: formDataToSend
            });

            const data = await response.json();

            if (data.success) {
                onSave();
            } else {
                setErrors(data.errors || {});
            }
        } catch (error) {
            console.error('Error saving lecture:', error);
            setErrors({ general: 'An error occurred while saving the lecture.' });
        } finally {
            setLoading(false);
        }
    };

    const displayTitle = formData.title
        ? `Lecture ${lectureNumber}: ${formData.title}`
        : `Lecture ${lectureNumber}: [Enter title]`;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        {lecture ? 'Edit Lecture' : 'Add New Lecture'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <FaTimes className="h-5 w-5" />
                    </button>
                </div>

                <div className="mb-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-700 font-medium">{displayTitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Lecture Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter lecture title"
                            required
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title[0]}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Lecture Content
                        </label>
                        <textarea
                            id="content"
                            rows={6}
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Add lecture notes, transcript, or additional content here..."
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            This text content will be available to students alongside the video.
                        </p>
                        {errors.content && (
                            <p className="mt-1 text-sm text-red-600">{errors.content[0]}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Video Upload
                        </label>
                        <div className="flex items-center space-x-4">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <FaUpload className="h-4 w-4 mr-2" />
                                Choose Video
                            </button>
                            {videoFile && (
                                <div className="flex items-center text-sm text-gray-600">
                                    <FaPlay className="h-4 w-4 mr-2" />
                                    {videoFile.name}
                                    <span className="ml-2 text-xs">
                                        ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                </div>
                            )}
                            {lecture?.video_path && !videoFile && (
                                <div className="flex items-center text-sm text-green-600">
                                    <FaPlay className="h-4 w-4 mr-2" />
                                    Video uploaded
                                </div>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            onChange={(e) => setVideoFile(e.target.files[0])}
                            className="hidden"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Supported formats: MP4, AVI, MOV, WMV. Maximum size: 2GB
                        </p>
                        {errors.video_file && (
                            <p className="mt-1 text-sm text-red-600">{errors.video_file[0]}</p>
                        )}
                    </div>

                    <div className="flex items-center">
                        <input
                            id="is_preview"
                            type="checkbox"
                            checked={formData.is_preview}
                            onChange={(e) => setFormData({ ...formData, is_preview: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_preview" className="ml-2 block text-sm text-gray-900">
                            Allow as preview (visible to non-enrolled students)
                        </label>
                    </div>

                    {errors.general && (
                        <div className="text-red-600 text-sm">{errors.general}</div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
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
                            {loading ? 'Saving...' : 'Save Lecture'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
