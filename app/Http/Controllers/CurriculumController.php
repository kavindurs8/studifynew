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
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class CurriculumController extends Controller
{
    // Section Management
    public function createSection(Request $request, $courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('teacher_id', Auth::id())
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $section = CourseSection::create([
            'course_id' => $course->id,
            'title' => $request->title,
            'description' => $request->description,
            'sort_order' => CourseSection::where('course_id', $course->id)->count() + 1
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Section created successfully',
            'section' => $section
        ]);
    }

    public function updateSection(Request $request, $courseId, $sectionId)
    {
        $course = Course::where('id', $courseId)
            ->where('teacher_id', Auth::id())
            ->firstOrFail();

        $section = CourseSection::where('id', $sectionId)
            ->where('course_id', $course->id)
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $section->update([
            'title' => $request->title,
            'description' => $request->description
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Section updated successfully',
            'section' => $section
        ]);
    }

    public function deleteSection($courseId, $sectionId)
    {
        $course = Course::where('id', $courseId)
            ->where('teacher_id', Auth::id())
            ->firstOrFail();

        $section = CourseSection::where('id', $sectionId)
            ->where('course_id', $course->id)
            ->firstOrFail();

        $section->delete();

        return response()->json([
            'success' => true,
            'message' => 'Section deleted successfully'
        ]);
    }

    // Lecture Management
    public function createLecture(Request $request, $courseId, $sectionId)
    {
        $course = Course::where('id', $courseId)
            ->where('teacher_id', Auth::id())
            ->firstOrFail();

        $section = CourseSection::where('id', $sectionId)
            ->where('course_id', $course->id)
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'video_file' => 'nullable|file|mimes:mp4,avi,mov,wmv|max:2048000',
            'is_preview' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Get lecture number for this section
        $lectureNumber = CourseLecture::where('section_id', $section->id)->count() + 1;

        $lecture = CourseLecture::create([
            'course_id' => $course->id,
            'section_id' => $section->id,
            'title' => $request->title,
            'content' => $request->content,
            'lecture_number' => $lectureNumber,
            'sort_order' => CourseLecture::where('section_id', $section->id)->count() + 1,
            'is_preview' => $request->boolean('is_preview', false)
        ]);

        // Handle video upload if provided
        if ($request->hasFile('video_file')) {
            $videoFile = $request->file('video_file');
            $videoPath = $videoFile->store('course_videos', 'public');

            $lecture->update([
                'video_path' => $videoPath,
                'duration' => $this->getVideoDuration($videoFile) // You'll need to implement this
            ]);
        }

        $course->updateStats();

        return response()->json([
            'success' => true,
            'message' => 'Lecture created successfully',
            'lecture' => $lecture->load('section')
        ]);
    }

    public function updateLecture(Request $request, $courseId, $sectionId, $lectureId)
    {
        $course = Course::where('id', $courseId)
            ->where('teacher_id', Auth::id())
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
            'video_file' => 'nullable|file|mimes:mp4,avi,mov,wmv|max:2048000',
            'is_preview' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $lecture->update([
            'title' => $request->title,
            'content' => $request->content,
            'is_preview' => $request->boolean('is_preview', false)
        ]);

        // Handle video upload if provided
        if ($request->hasFile('video_file')) {
            // Delete old video if exists
            if ($lecture->video_path) {
                Storage::disk('public')->delete($lecture->video_path);
            }

            $videoFile = $request->file('video_file');
            $videoPath = $videoFile->store('course_videos', 'public');

            $lecture->update([
                'video_path' => $videoPath,
                'duration' => $this->getVideoDuration($videoFile)
            ]);
        }

        $course->updateStats();

        return response()->json([
            'success' => true,
            'message' => 'Lecture updated successfully',
            'lecture' => $lecture->load('section')
        ]);
    }

    public function deleteLecture($courseId, $sectionId, $lectureId)
    {
        $course = Course::where('id', $courseId)
            ->where('teacher_id', Auth::id())
            ->firstOrFail();

        $section = CourseSection::where('id', $sectionId)
            ->where('course_id', $course->id)
            ->firstOrFail();

        $lecture = CourseLecture::where('id', $lectureId)
            ->where('section_id', $section->id)
            ->firstOrFail();

        // Delete video file if exists
        if ($lecture->video_path) {
            Storage::disk('public')->delete($lecture->video_path);
        }

        $lecture->delete();
        $course->updateStats();

        return response()->json([
            'success' => true,
            'message' => 'Lecture deleted successfully'
        ]);
    }

    // Quiz Management
    public function createQuiz(Request $request, $courseId, $sectionId)
    {
        $course = Course::where('id', $courseId)
            ->where('teacher_id', Auth::id())
            ->firstOrFail();

        $section = CourseSection::where('id', $sectionId)
            ->where('course_id', $course->id)
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'time_limit' => 'nullable|integer|min:1',
            'passing_score' => 'required|integer|min:1|max:100',
            'questions' => 'required|array|min:1',
            'questions.*.question' => 'required|string',
            'questions.*.options' => 'required|array|size:4',
            'questions.*.options.*' => 'required|string',
            'questions.*.correct_answer' => 'required|integer|min:0|max:3',
            'questions.*.explanation' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Get quiz number for this section
        $quizNumber = CourseQuiz::where('section_id', $section->id)->count() + 1;

        $quiz = CourseQuiz::create([
            'course_id' => $course->id,
            'section_id' => $section->id,
            'title' => $request->title,
            'description' => $request->description,
            'quiz_number' => $quizNumber,
            'time_limit' => $request->time_limit,
            'passing_score' => $request->passing_score,
            'sort_order' => CourseQuiz::where('section_id', $section->id)->count() + 1
        ]);

        // Create questions
        foreach ($request->questions as $index => $questionData) {
            QuizQuestion::create([
                'quiz_id' => $quiz->id,
                'question' => $questionData['question'],
                'options' => $questionData['options'],
                'correct_answer' => $questionData['correct_answer'],
                'explanation' => $questionData['explanation'] ?? null,
                'sort_order' => $index + 1
            ]);
        }

        $course->updateStats();

        return response()->json([
            'success' => true,
            'message' => 'Quiz created successfully',
            'quiz' => $quiz->load(['section', 'questions'])
        ]);
    }

    public function updateQuiz(Request $request, $courseId, $sectionId, $quizId)
    {
        $course = Course::where('id', $courseId)
            ->where('teacher_id', Auth::id())
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
            'time_limit' => 'nullable|integer|min:1',
            'passing_score' => 'required|integer|min:1|max:100',
            'questions' => 'required|array|min:1',
            'questions.*.question' => 'required|string',
            'questions.*.options' => 'required|array|size:4',
            'questions.*.options.*' => 'required|string',
            'questions.*.correct_answer' => 'required|integer|min:0|max:3',
            'questions.*.explanation' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $quiz->update([
            'title' => $request->title,
            'description' => $request->description,
            'time_limit' => $request->time_limit,
            'passing_score' => $request->passing_score
        ]);

        // Delete existing questions and create new ones
        $quiz->questions()->delete();

        foreach ($request->questions as $index => $questionData) {
            QuizQuestion::create([
                'quiz_id' => $quiz->id,
                'question' => $questionData['question'],
                'options' => $questionData['options'],
                'correct_answer' => $questionData['correct_answer'],
                'explanation' => $questionData['explanation'] ?? null,
                'sort_order' => $index + 1
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Quiz updated successfully',
            'quiz' => $quiz->load(['section', 'questions'])
        ]);
    }

    public function deleteQuiz($courseId, $sectionId, $quizId)
    {
        $course = Course::where('id', $courseId)
            ->where('teacher_id', Auth::id())
            ->firstOrFail();

        $section = CourseSection::where('id', $sectionId)
            ->where('course_id', $course->id)
            ->firstOrFail();

        $quiz = CourseQuiz::where('id', $quizId)
            ->where('section_id', $section->id)
            ->firstOrFail();

        $quiz->delete();
        $course->updateStats();

        return response()->json([
            'success' => true,
            'message' => 'Quiz deleted successfully'
        ]);
    }

    private function getVideoDuration($videoFile)
    {
        // This is a simplified version - you might want to use FFmpeg for accurate duration
        // For now, return a default duration
        return 300; // 5 minutes default
    }
}
