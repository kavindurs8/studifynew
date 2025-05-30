<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseSection;
use App\Models\CourseLecture;
use App\Models\CourseQuiz;
use App\Models\QuizQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CurriculumController extends Controller
{
    // Section Management
    public function storeSection(Request $request, $courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('teacher_id', Auth::guard('teacher')->id())
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return redirect()->route('teacher.courses.edit', $courseId)
                ->withErrors($validator)->withInput();
        }

        $section = CourseSection::create([
            'course_id' => $course->id,
            'title' => $request->title,
            'description' => $request->description,
            'sort_order' => $course->sections()->max('sort_order') + 1,
            'is_active' => true
        ]);

        return redirect()->route('teacher.courses.edit', $courseId)
            ->with('success', 'Section created successfully');
    }

    public function updateSection(Request $request, $courseId, $sectionId)
    {
        $course = Course::where('id', $courseId)
            ->where('teacher_id', Auth::guard('teacher')->id())
            ->firstOrFail();

        $section = CourseSection::where('id', $sectionId)
            ->where('course_id', $course->id)
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return redirect()->route('teacher.courses.edit', $courseId)
                ->withErrors($validator)->withInput();
        }

        $section->update([
            'title' => $request->title,
            'description' => $request->description
        ]);

        return redirect()->route('teacher.courses.edit', $courseId)
            ->with('success', 'Section updated successfully');
    }

    public function destroySection($courseId, $sectionId)
    {
        $course = Course::where('id', $courseId)
            ->where('teacher_id', Auth::guard('teacher')->id())
            ->firstOrFail();

        $section = CourseSection::where('id', $sectionId)
            ->where('course_id', $course->id)
            ->firstOrFail();

        // Delete associated files
        foreach ($section->lectures as $lecture) {
            if ($lecture->video_path) {
                Storage::delete($lecture->video_path);
            }
        }

        $section->delete();

        return redirect()->route('teacher.courses.edit', $courseId)
            ->with('success', 'Section deleted successfully');
    }

    // Lecture Management
    public function storeLecture(Request $request, $courseId, $sectionId)
    {
        $course = Course::where('id', $courseId)
            ->where('teacher_id', Auth::guard('teacher')->id())
            ->firstOrFail();

        $section = CourseSection::where('id', $sectionId)
            ->where('course_id', $course->id)
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'video_file' => 'nullable|file|mimes:mp4,avi,mov,wmv|max:512000',
            'youtube_url' => 'nullable|string|url',
            'is_preview' => 'boolean',
            'content_type' => 'required|in:text,video,youtube'
        ]);

        if ($validator->fails()) {
            return redirect()->route('teacher.courses.edit', $courseId)
                ->withErrors($validator)->withInput();
        }

        // Calculate lecture number
        $lectureCount = $section->lectures()->count();
        $lectureNumber = $lectureCount + 1;

        $lectureData = [
            'course_id' => $course->id,
            'section_id' => $section->id,
            'title' => $request->title,
            'content' => $request->content,
            'lecture_number' => $lectureNumber,
            'is_preview' => $request->boolean('is_preview'),
            'is_active' => true,
            'sort_order' => $section->lectures()->max('sort_order') + 1
        ];

        // Handle file uploads based on content type
        if ($request->content_type === 'video' && $request->hasFile('video_file')) {
            $videoPath = $request->file('video_file')->store('courses/videos', 'public');
            $lectureData['video_path'] = $videoPath;
        } elseif ($request->content_type === 'youtube' && $request->youtube_url) {
            $youtubeId = $this->extractYouTubeId($request->youtube_url);
            $lectureData['youtube_url'] = $request->youtube_url;
            $lectureData['youtube_video_id'] = $youtubeId;
            $lectureData['youtube_embed_url'] = "https://www.youtube.com/embed/{$youtubeId}";
            $lectureData['thumbnail_url'] = "https://img.youtube.com/vi/{$youtubeId}/maxresdefault.jpg";
        }

        $lecture = CourseLecture::create($lectureData);

        // Update course stats
        $course->updateStats();

        return redirect()->route('teacher.courses.edit', $courseId)
            ->with('success', 'Lecture created successfully');
    }

    public function updateLecture(Request $request, $courseId, $sectionId, $lectureId)
    {
        // Add debugging to see what data is being received
        \Log::info('Lecture update request data:', $request->all());

        $course = Course::where('id', $courseId)
            ->where('teacher_id', Auth::guard('teacher')->id())
            ->firstOrFail();

        $section = CourseSection::where('id', $sectionId)
            ->where('course_id', $course->id)
            ->firstOrFail();

        $lecture = CourseLecture::where('id', $lectureId)
            ->where('section_id', $section->id)
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'video_file' => 'nullable|file|mimes:mp4,avi,mov,wmv|max:512000',
            'youtube_url' => 'nullable|string|url',
            'is_preview' => 'nullable|boolean',
            'content_type' => 'required|in:text,video,youtube'
        ]);

        if ($validator->fails()) {
            \Log::error('Lecture validation failed:', $validator->errors()->toArray());
            return redirect()->route('teacher.courses.edit', $courseId)
                ->withErrors($validator)->withInput();
        }

        $lectureData = [
            'title' => $request->title,
            'content' => $request->content,
            'is_preview' => $request->boolean('is_preview')
        ];

        // Handle file uploads based on content type
        if ($request->content_type === 'video' && $request->hasFile('video_file')) {
            // Delete old video if exists
            if ($lecture->video_path) {
                Storage::delete($lecture->video_path);
            }
            $videoPath = $request->file('video_file')->store('courses/videos', 'public');
            $lectureData['video_path'] = $videoPath;
            $lectureData['youtube_url'] = null;
            $lectureData['youtube_video_id'] = null;
            $lectureData['youtube_embed_url'] = null;
            $lectureData['thumbnail_url'] = null;
        } elseif ($request->content_type === 'youtube' && $request->youtube_url) {
            $youtubeId = $this->extractYouTubeId($request->youtube_url);
            $lectureData['youtube_url'] = $request->youtube_url;
            $lectureData['youtube_video_id'] = $youtubeId;
            $lectureData['youtube_embed_url'] = "https://www.youtube.com/embed/{$youtubeId}";
            $lectureData['thumbnail_url'] = "https://img.youtube.com/vi/{$youtubeId}/maxresdefault.jpg";
            $lectureData['video_path'] = null;
        } elseif ($request->content_type === 'text') {
            // Clear all video/youtube data for text-only content
            $lectureData['video_path'] = null;
            $lectureData['youtube_url'] = null;
            $lectureData['youtube_video_id'] = null;
            $lectureData['youtube_embed_url'] = null;
            $lectureData['thumbnail_url'] = null;
        }

        $lecture->update($lectureData);

        // Update course stats
        $course->updateStats();

        return redirect()->route('teacher.courses.edit', $courseId)
            ->with('success', 'Lecture updated successfully');
    }

    public function destroyLecture($courseId, $sectionId, $lectureId)
    {
        $course = Course::where('id', $courseId)
            ->where('teacher_id', Auth::guard('teacher')->id())
            ->firstOrFail();

        $section = CourseSection::where('id', $sectionId)
            ->where('course_id', $course->id)
            ->firstOrFail();

        $lecture = CourseLecture::where('id', $lectureId)
            ->where('section_id', $section->id)
            ->firstOrFail();

        // Delete associated files
        if ($lecture->video_path) {
            Storage::delete($lecture->video_path);
        }

        $lecture->delete();

        // Re-number remaining lectures in this section
        $remainingLectures = $section->lectures()->orderBy('sort_order')->get();
        foreach ($remainingLectures as $index => $remainingLecture) {
            $remainingLecture->update(['lecture_number' => $index + 1]);
        }

        // Update course stats
        $course->updateStats();

        return redirect()->route('teacher.courses.edit', $courseId)
            ->with('success', 'Lecture deleted successfully');
    }

    // Quiz Management
    public function storeQuiz(Request $request, $courseId, $sectionId)
    {
        $course = Course::where('id', $courseId)
            ->where('teacher_id', Auth::guard('teacher')->id())
            ->firstOrFail();

        $section = CourseSection::where('id', $sectionId)
            ->where('course_id', $course->id)
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'passing_score' => 'required|integer|min:1|max:100',
            'time_limit' => 'nullable|integer|min:1',
            'questions' => 'required|array|min:1',
            'questions.*.question_text' => 'required|string',
            'questions.*.option_a' => 'required|string',
            'questions.*.option_b' => 'required|string',
            'questions.*.option_c' => 'required|string',
            'questions.*.option_d' => 'required|string',
            'questions.*.correct_answer' => 'required|in:A,B,C,D'
        ]);

        if ($validator->fails()) {
            return redirect()->route('teacher.courses.edit', $courseId)
                ->withErrors($validator)->withInput();
        }

        // Calculate quiz number
        $quizCount = $section->quizzes()->count();
        $quizNumber = $quizCount + 1;

        $quiz = CourseQuiz::create([
            'course_id' => $course->id,
            'section_id' => $section->id,
            'title' => $request->title,
            'description' => $request->description,
            'quiz_number' => $quizNumber,
            'passing_score' => $request->passing_score,
            'time_limit' => $request->time_limit,
            'is_active' => true,
            'sort_order' => $section->quizzes()->max('sort_order') + 1
        ]);

        // Create quiz questions with correct answer mapping
        foreach ($request->questions as $index => $questionData) {
            // Convert A,B,C,D to 0,1,2,3
            $correctAnswerMap = ['A' => 0, 'B' => 1, 'C' => 2, 'D' => 3];

            QuizQuestion::create([
                'quiz_id' => $quiz->id,
                'question' => $questionData['question_text'],
                'options' => [
                    $questionData['option_a'],
                    $questionData['option_b'],
                    $questionData['option_c'],
                    $questionData['option_d']
                ],
                'correct_answer' => $correctAnswerMap[$questionData['correct_answer']],
                'sort_order' => $index + 1
            ]);
        }

        // Update course stats
        $course->updateStats();

        return redirect()->route('teacher.courses.edit', $courseId)
            ->with('success', 'Quiz created successfully');
    }

    public function updateQuiz(Request $request, $courseId, $sectionId, $quizId)
    {
        $course = Course::where('id', $courseId)
            ->where('teacher_id', Auth::guard('teacher')->id())
            ->firstOrFail();

        $section = CourseSection::where('id', $sectionId)
            ->where('course_id', $course->id)
            ->firstOrFail();

        $quiz = CourseQuiz::where('id', $quizId)
            ->where('section_id', $section->id)
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'passing_score' => 'required|integer|min:1|max:100',
            'time_limit' => 'nullable|integer|min:1',
            'questions' => 'required|array|min:1',
            'questions.*.question_text' => 'required|string',
            'questions.*.option_a' => 'required|string',
            'questions.*.option_b' => 'required|string',
            'questions.*.option_c' => 'required|string',
            'questions.*.option_d' => 'required|string',
            'questions.*.correct_answer' => 'required|in:A,B,C,D'
        ]);

        if ($validator->fails()) {
            return redirect()->route('teacher.courses.edit', $courseId)
                ->withErrors($validator)->withInput();
        }

        $quiz->update([
            'title' => $request->title,
            'description' => $request->description,
            'passing_score' => $request->passing_score,
            'time_limit' => $request->time_limit
        ]);

        // Delete existing questions and create new ones
        $quiz->questions()->delete();

        foreach ($request->questions as $index => $questionData) {
            // Convert A,B,C,D to 0,1,2,3
            $correctAnswerMap = ['A' => 0, 'B' => 1, 'C' => 2, 'D' => 3];

            QuizQuestion::create([
                'quiz_id' => $quiz->id,
                'question' => $questionData['question_text'],
                'options' => [
                    $questionData['option_a'],
                    $questionData['option_b'],
                    $questionData['option_c'],
                    $questionData['option_d']
                ],
                'correct_answer' => $correctAnswerMap[$questionData['correct_answer']],
                'sort_order' => $index + 1
            ]);
        }

        // Update course stats
        $course->updateStats();

        return redirect()->route('teacher.courses.edit', $courseId)
            ->with('success', 'Quiz updated successfully');
    }

    public function destroyQuiz($courseId, $sectionId, $quizId)
    {
        $course = Course::where('id', $courseId)
            ->where('teacher_id', Auth::guard('teacher')->id())
            ->firstOrFail();

        $section = CourseSection::where('id', $sectionId)
            ->where('course_id', $course->id)
            ->firstOrFail();

        $quiz = CourseQuiz::where('id', $quizId)
            ->where('section_id', $section->id)
            ->firstOrFail();

        $quiz->delete();

        // Re-number remaining quizzes in this section
        $remainingQuizzes = $section->quizzes()->orderBy('sort_order')->get();
        foreach ($remainingQuizzes as $index => $remainingQuiz) {
            $remainingQuiz->update(['quiz_number' => $index + 1]);
        }

        // Update course stats
        $course->updateStats();

        return redirect()->route('teacher.courses.edit', $courseId)
            ->with('success', 'Quiz deleted successfully');
    }

    /**
     * Extract YouTube video ID from URL
     */
    private function extractYouTubeId($url)
    {
        $pattern = '/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/';
        preg_match($pattern, $url, $matches);
        return $matches[1] ?? null;
    }
}
