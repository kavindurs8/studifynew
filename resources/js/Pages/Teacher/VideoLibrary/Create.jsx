import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Create({ teacher }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        title: '',
        description: '',
        video_file: null,
        duration: null // Add duration to form data
    });

    const [dragActive, setDragActive] = useState(false);
    const [videoInfo, setVideoInfo] = useState(null); // Store video metadata

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('teacher.video-library.store'));
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setData('video_file', file);
            extractVideoMetadata(file);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            setData('video_file', file);
            extractVideoMetadata(file);
        }
    };

    // Function to extract video metadata including duration
    const extractVideoMetadata = (file) => {
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = function() {
            window.URL.revokeObjectURL(video.src);

            const duration = video.duration;
            const formattedDuration = formatDuration(duration);

            // Set duration in form data
            setData('duration', formattedDuration);

            // Store video info for display
            setVideoInfo({
                duration: formattedDuration,
                size: (file.size / (1024 * 1024)).toFixed(2), // Size in MB
                type: file.type,
                width: video.videoWidth,
                height: video.videoHeight
            });
        };

        video.src = URL.createObjectURL(file);
    };

    // Format duration from seconds to HH:MM:SS or MM:SS
    const formatDuration = (seconds) => {
        if (!seconds || isNaN(seconds)) return null;

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    };

    return (
        <TeacherLayout
            teacher={teacher}
            title="Upload Video - STUDIFY"
            pageTitle="Upload Video"
            pageSubtitle="Upload your video to YouTube and add it to your library"
            activeMenuItem="video-library"
        >
            <Head title="Upload Video" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Back Button */}
                <div className="flex items-center">
                    <Link
                        href={route('teacher.video-library.index')}
                        className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Video Library
                    </Link>
                </div>

                {/* Upload Form */}
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Video File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Video File *
                            </label>
                            <div
                                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors duration-200 ${
                                    dragActive
                                        ? 'border-blue-400 bg-blue-900/20'
                                        : 'border-gray-600 hover:border-gray-500'
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    id="video_file"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-400 mb-2">
                                        {data.video_file
                                            ? `Selected: ${data.video_file.name}`
                                            : 'Drop your video file here, or click to browse'
                                        }
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Supported formats: MP4, AVI, MOV, WMV, FLV, WEBM (Max: 2GB)
                                    </p>
                                </div>
                            </div>
                            {errors.video_file && (
                                <p className="text-red-400 text-sm mt-1">{errors.video_file}</p>
                            )}
                        </div>

                        {/* Video Information Display */}
                        {videoInfo && (
                            <div className="bg-gray-700 rounded-lg p-4">
                                <h4 className="text-white font-medium mb-2">Video Information</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-400">Duration:</span>
                                        <p className="text-white font-medium">{videoInfo.duration}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Size:</span>
                                        <p className="text-white font-medium">{videoInfo.size} MB</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Resolution:</span>
                                        <p className="text-white font-medium">{videoInfo.width}x{videoInfo.height}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Format:</span>
                                        <p className="text-white font-medium">{videoInfo.type.split('/')[1].toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                Video Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter video title"
                                maxLength="255"
                            />
                            {errors.title && (
                                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                                Description (Optional)
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter video description"
                                maxLength="5000"
                            />
                            {errors.description && (
                                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>

                        {/* Upload Progress */}
                        {progress && (
                            <div>
                                <div className="flex justify-between text-sm text-gray-400 mb-1">
                                    <span>Uploading...</span>
                                    <span>{progress.percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progress.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Privacy Notice */}
                        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h4 className="text-blue-400 font-medium mb-1">Privacy Notice</h4>
                                    <p className="text-blue-300 text-sm">
                                        Your video will be uploaded to STUDIFY video library as an unlisted video. You can share the link with your students.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-4">
                            <Link
                                href={route('teacher.video-library.index')}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing || !data.title || !data.video_file}
                                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                                {processing ? 'Uploading...' : 'Upload to YouTube'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </TeacherLayout>
    );
}
