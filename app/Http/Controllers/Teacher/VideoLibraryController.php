<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\VideoLibrary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Google\Client;
use Google\Service\YouTube;
use Google\Service\YouTube\Video;
use Google\Service\YouTube\VideoSnippet;
use Google\Service\YouTube\VideoStatus;
use Google\Http\MediaFileUpload;

class VideoLibraryController extends Controller
{
    /**
     * Display video library
     */
    public function index()
    {
        $videos = VideoLibrary::where('teacher_id', Auth::guard('teacher')->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Teacher/VideoLibrary/Index', [
            'videos' => $videos,
            'teacher' => Auth::guard('teacher')->user()
        ]);
    }

    /**
     * Show upload form
     */
    public function create()
    {
        return Inertia::render('Teacher/VideoLibrary/Create', [
            'teacher' => Auth::guard('teacher')->user()
        ]);
    }

    /**
     * Store video and upload to YouTube
     */
    public function store(Request $request)
    {
        // Override PHP limits for video uploads
        set_time_limit(0);
        ini_set('max_execution_time', 0);
        ini_set('memory_limit', '512M');

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'video_file' => 'required|file|mimes:mp4,avi,mov,wmv,flv,webm,mkv|max:2048000',
            'duration' => 'nullable|string' // Add duration validation
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            $file = $request->file('video_file');
            $teacher = Auth::guard('teacher')->user();

            // Create video library record first with client-side duration
            $videoLibrary = VideoLibrary::create([
                'teacher_id' => $teacher->id,
                'title' => $request->title,
                'description' => $request->description,
                'original_filename' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'duration' => $request->duration, // Save client-side duration
                'upload_status' => 'uploading'
            ]);

            Log::info('Starting YouTube upload for video ID: ' . $videoLibrary->id . ' with duration: ' . $request->duration);

            // Upload to YouTube
            $youtubeData = $this->uploadToYouTube($file, $request->title, $request->description ?? '', $teacher);

            if (!$youtubeData || !isset($youtubeData['id'])) {
                throw new \Exception('YouTube upload failed - no video ID returned');
            }

            // Update record with YouTube data (keep client-side duration if YouTube duration not available)
            $updateData = [
                'youtube_video_id' => $youtubeData['id'],
                'youtube_url' => "https://www.youtube.com/watch?v={$youtubeData['id']}",
                'youtube_embed_url' => "https://www.youtube.com/embed/{$youtubeData['id']}",
                'thumbnail_url' => "https://img.youtube.com/vi/{$youtubeData['id']}/maxresdefault.jpg",
                'upload_status' => 'completed'
            ];

            // Only update duration if YouTube provided one and we don't already have one
            if (isset($youtubeData['duration']) && $youtubeData['duration'] && !$request->duration) {
                $updateData['duration'] = $youtubeData['duration'];
            }

            $videoLibrary->update($updateData);

            Log::info('YouTube upload completed successfully for video ID: ' . $videoLibrary->id);

            return redirect()->route('teacher.video-library.index')
                ->with('success', 'Video uploaded successfully to YouTube!');

        } catch (\Exception $e) {
            Log::error('YouTube upload failed: ' . $e->getMessage());

            // Check for specific YouTube quota/upload limit errors
            $errorMessage = $e->getMessage();
            $userFriendlyMessage = 'Failed to upload video: ';

            if (strpos($errorMessage, 'uploadLimitExceeded') !== false) {
                $userFriendlyMessage = 'YouTube upload limit exceeded. Please try again tomorrow or verify your YouTube channel to increase limits.';
            } elseif (strpos($errorMessage, 'quotaExceeded') !== false) {
                $userFriendlyMessage = 'YouTube API quota exceeded. Please try again later.';
            } else {
                $userFriendlyMessage .= $errorMessage;
            }

            // Update status to failed if record was created
            if (isset($videoLibrary)) {
                $videoLibrary->update([
                    'upload_status' => 'failed',
                    'error_message' => $errorMessage
                ]);
            }

            return back()->withErrors(['error' => $userFriendlyMessage]);
        }
    }

    /**
     * Upload video to centralized YouTube channel
     */
    private function uploadToYouTube($file, $title, $description, $teacher)
    {
        $client = new Client();
        $client->setClientId(config('services.youtube.client_id'));
        $client->setClientSecret(config('services.youtube.client_secret'));

        // Use centralized channel access token
        $accessToken = config('services.youtube.channel_access_token');
        $client->setAccessToken($accessToken);

        // Check if token needs refresh
        if ($client->isAccessTokenExpired()) {
            $refreshToken = config('services.youtube.channel_refresh_token');
            if ($refreshToken) {
                $client->refreshToken($refreshToken);
                $newToken = $client->getAccessToken();
                // You might want to update the token in config or database
            } else {
                throw new \Exception('YouTube access token expired and no refresh token available.');
            }
        }

        $youtube = new YouTube($client);

        // Create video snippet with teacher info
        $videoSnippet = new VideoSnippet();
        $videoSnippet->setTitle($title . ' - by ' . $teacher->name);
        $videoSnippet->setDescription(
            $description . "\n\n" .
            "Uploaded by: " . $teacher->name . "\n" .
            "Teacher ID: " . $teacher->id . "\n" .
            "Expertise: " . $teacher->expertise_area . "\n" .
            "Platform: STUDIFY"
        );
        $videoSnippet->setTags(['education', 'course', 'studify', 'teacher', $teacher->expertise_area]);
        $videoSnippet->setCategoryId('27'); // Education category

        // Create video status (unlisted so only people with link can view)
        $videoStatus = new VideoStatus();
        $videoStatus->setPrivacyStatus('unlisted'); // Unlisted allows sharing via link

        // Create video resource
        $video = new Video();
        $video->setSnippet($videoSnippet);
        $video->setStatus($videoStatus);

        // Prepare for upload
        $client->setDefer(true);
        $insertRequest = $youtube->videos->insert('snippet,status', $video);

        // Create media upload
        $media = new MediaFileUpload(
            $client,
            $insertRequest,
            'video/*',
            null,
            true,
            1024 * 1024 // 1MB chunk size
        );

        // Get file path
        $filePath = $file->getRealPath();
        $media->setFileSize($file->getSize());

        // Upload in chunks
        $status = false;
        $handle = fopen($filePath, "rb");

        while (!$status && !feof($handle)) {
            $chunk = fread($handle, 1024 * 1024);
            $status = $media->nextChunk($chunk);
        }

        fclose($handle);
        $client->setDefer(false);

        // After successful upload, get video duration
        if ($status && isset($status['id'])) {
            try {
                // Fetch video details including duration
                $videoDetails = $youtube->videos->listVideos('contentDetails', [
                    'id' => $status['id']
                ]);

                if (!empty($videoDetails->getItems())) {
                    $duration = $videoDetails->getItems()[0]->getContentDetails()->getDuration();
                    $formattedDuration = $this->formatYouTubeDuration($duration);
                    $status['duration'] = $formattedDuration;
                }
            } catch (\Exception $e) {
                Log::warning('Failed to fetch video duration: ' . $e->getMessage());
            }
        }

        return $status;
    }

    /**
     * Convert YouTube duration format (PT4M13S) to readable format (4:13)
     */
    private function formatYouTubeDuration($duration)
    {
        $interval = new \DateInterval($duration);

        $hours = $interval->h;
        $minutes = $interval->i;
        $seconds = $interval->s;

        if ($hours > 0) {
            return sprintf('%d:%02d:%02d', $hours, $minutes, $seconds);
        } else {
            return sprintf('%d:%02d', $minutes, $seconds);
        }
    }

    /**
     * Show video details
     */
    public function show($id)
    {
        $video = VideoLibrary::where('id', $id)
            ->where('teacher_id', Auth::guard('teacher')->id())
            ->firstOrFail();

        return Inertia::render('Teacher/VideoLibrary/Show', [
            'video' => $video,
            'teacher' => Auth::guard('teacher')->user()
        ]);
    }

    /**
     * Delete video
     */
    public function destroy($id)
    {
        $video = VideoLibrary::where('id', $id)
            ->where('teacher_id', Auth::guard('teacher')->id())
            ->firstOrFail();

        try {
            // Note: Optionally delete from YouTube as well using YouTube API
            // $this->deleteFromYouTube($video->youtube_video_id);

            $video->delete();

            return redirect()->route('teacher.video-library.index')
                ->with('success', 'Video deleted successfully from library!');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete video: ' . $e->getMessage()]);
        }
    }

    /**
     * Get video link for copying
     */
    public function getLink($id)
    {
        $video = VideoLibrary::where('id', $id)
            ->where('teacher_id', Auth::guard('teacher')->id())
            ->firstOrFail();

        return response()->json([
            'youtube_url' => $video->youtube_url,
            'embed_url' => $video->youtube_embed_url,
            'video_id' => $video->youtube_video_id
        ]);
    }
}
