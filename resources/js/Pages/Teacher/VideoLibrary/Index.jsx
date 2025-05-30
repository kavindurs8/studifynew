import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import TeacherLayout from '@/Layouts/TeacherLayout';

export default function Index({ videos, teacher }) {
    const [copying, setCopying] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const videosPerPage = 8;

    // Calculate pagination
    const totalPages = Math.ceil(videos.length / videosPerPage);
    const startIndex = (currentPage - 1) * videosPerPage;
    const endIndex = startIndex + videosPerPage;
    const currentVideos = videos.slice(startIndex, endIndex);

    const copyToClipboard = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopying(type);
            setTimeout(() => setCopying(null), 2000);
        } catch (err) {
            alert('Failed to copy to clipboard');
        }
    };

    const deleteVideo = (videoId) => {
        if (confirm('Are you sure you want to delete this video from your library?')) {
            router.delete(route('teacher.video-library.destroy', videoId));
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    return (
        <TeacherLayout
            teacher={teacher}
            title="Video Library - STUDIFY"
            pageTitle="Video Library"
            pageSubtitle="Upload videos to STUDIFY YouTube channel and manage your video links."
            activeMenuItem="video-library"
        >
            <Head title="Video Library" />

            <div className="space-y-6">
                {/* Header with Upload Button */}
                <div className="flex justify-between items-center bg-gray-800 rounded-lg p-6 shadow-lg">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Your Video Library</h2>
                        <p className="text-gray-400">
                            Total Videos: {videos.length} |
                            Storage Used: {(videos.reduce((total, video) => total + (video.file_size || 0), 0) / (1024*1024)).toFixed(2)}MB
                        </p>
                    </div>
                    <Link
                        href={route('teacher.video-library.create')}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-md flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        Upload to YouTube
                    </Link>
                </div>

                {/* Info Notice */}
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h4 className="text-blue-400 font-medium mb-1">Upload Information</h4>
                            <p className="text-blue-300 text-sm">
                                Videos are uploaded to the STUDIFY video library as private videos. You can use the links in your courses.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Videos Grid */}
                {videos.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {currentVideos.map((video) => (
                                <div key={video.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg relative group hover:shadow-xl transition-all duration-300 border border-gray-700">
                                    {/* Video Thumbnail with Overlay */}
                                    <div className="relative">
                                        <div className="w-full h-44 bg-gray-700 flex items-center justify-center">
                                            {video.thumbnail_url ? (
                                                <img
                                                    src={video.thumbnail_url}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div className="w-full h-full flex items-center justify-center" style={{display: video.thumbnail_url ? 'none' : 'flex'}}>
                                                <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Always Visible Play Button */}
                                        <a href={video.youtube_url} target="_blank" rel="noopener noreferrer"
                                           className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center hover:scale-110 transition-transform duration-200 hover:bg-red-600 shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </a>

                                        {/* Duration Badge */}
                                        {video.duration && (
                                            <div className="absolute bottom-2 right-2">
                                                <span className="bg-black/70 text-white px-2 py-0.5 text-xs rounded font-medium">
                                                    {video.duration}
                                                </span>
                                            </div>
                                        )}

                                        {/* Quality Badge */}
                                        <div className="absolute bottom-2 left-2 flex space-x-2">
                                            <span className="bg-black/70 text-white px-2 py-0.5 text-xs rounded font-medium">
                                                HD
                                            </span>
                                        </div>

                                        {/* Favorite/Heart Icon */}
                                        <div className="absolute top-2 right-2 opacity-80 hover:opacity-100">
                                            <svg className="w-6 h-6 text-white hover:text-red-500 cursor-pointer transition-colors duration-200 drop-shadow-md"
                                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Video Info Panel */}
                                    <div className="p-4">
                                        {/* Title with Rating and Status Row */}
                                        <div className="mb-3">
                                            <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2">{video.title}</h3>

                                            {/* Rating and Status Row */}
                                            <div className="flex items-center justify-between">
                                                {/* Rating Stars - Left Side */}
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <svg
                                                            key={star}
                                                            className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-600'}`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>

                                                {/* Status Badge - Right Side */}
                                                <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                                                    video.upload_status === 'completed'
                                                        ? 'bg-green-900/50 text-green-300 border border-green-700'
                                                        : video.upload_status === 'uploading'
                                                        ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700'
                                                        : video.upload_status === 'pending'
                                                        ? 'bg-blue-900/50 text-blue-300 border border-blue-700'
                                                        : 'bg-red-900/50 text-red-300 border border-red-700'
                                                }`}>
                                                    <span className="flex items-center">
                                                        {video.upload_status === 'completed' ? (
                                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        ) : video.upload_status === 'uploading' || video.upload_status === 'pending' ? (
                                                            <svg className="animate-spin w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                        {video.upload_status}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px bg-gray-700 mb-3"></div>

                                        {/* Video Metadata in Two-Column Layout */}
                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                                            <div>
                                                <span className="text-gray-500">Size:</span>
                                                <p className="font-medium text-gray-300">{video.formatted_file_size || `${Math.round(video.file_size / (1024*1024))} MB`}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Date:</span>
                                                <p className="font-medium text-gray-300">{new Date(video.created_at).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Resolution:</span>
                                                <p className="font-medium text-gray-300">1024×576</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Format:</span>
                                                <p className="font-medium text-gray-300">mp4</p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        {video.upload_status === 'completed' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => copyToClipboard(video.youtube_url, `url-${video.id}`)}
                                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-md text-xs transition-colors duration-200 flex items-center justify-center"
                                                >
                                                    <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                                                        <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                                                    </svg>
                                                    {copying === `url-${video.id}` ? 'Copied!' : 'Copy Link'}
                                                </button>
                                                <button
                                                    onClick={() => copyToClipboard(video.youtube_embed_url, `embed-${video.id}`)}
                                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-md text-xs transition-colors duration-200 flex items-center justify-center"
                                                >
                                                    <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                    {copying === `embed-${video.id}` ? 'Copied!' : 'Embed'}
                                                </button>
                                                <button
                                                    onClick={() => deleteVideo(video.id)}
                                                    className="bg-red-600/70 hover:bg-red-600 text-white p-1.5 rounded-md text-xs transition-colors duration-200"
                                                    title="Remove from library"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}

                                        {video.upload_status === 'failed' && (
                                            <div className="text-red-400 text-xs bg-red-900/20 p-2 rounded border border-red-900">
                                                <div className="flex items-center">
                                                    <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>Upload failed: {video.error_message}</span>
                                                </div>
                                            </div>
                                        )}

                                        {(video.upload_status === 'pending' || video.upload_status === 'uploading') && (
                                            <div className="text-blue-300 text-xs bg-blue-900/20 p-2 rounded border border-blue-900">
                                                <div className="flex items-center">
                                                    <svg className="animate-spin mr-2 h-3 w-3 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    {video.upload_status === 'uploading' ? 'Video is uploading to YouTube...' : 'Processing video...'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
                                <div className="flex items-center text-sm text-gray-400">
                                    <span>
                                        Showing {startIndex + 1} to {Math.min(endIndex, videos.length)} of {videos.length} videos
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    {/* Previous Button */}
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                                            currentPage === 1
                                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                : 'bg-gray-700 text-white hover:bg-gray-600'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="flex space-x-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={`px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                                                    currentPage === page
                                                        ? 'bg-red-600 text-white'
                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Next Button */}
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                                            currentPage === totalPages
                                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                : 'bg-gray-700 text-white hover:bg-gray-600'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12 bg-gray-800 rounded-lg">
                        <svg className="mx-auto h-16 w-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-white mb-2">No videos uploaded yet</h3>
                        <p className="text-gray-400 mb-6">Upload your first video to the STUDIFY YouTube channel</p>
                        <Link
                            href={route('teacher.video-library.create')}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 inline-flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                            Upload to YouTube
                        </Link>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}
