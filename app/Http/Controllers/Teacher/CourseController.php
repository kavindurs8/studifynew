<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Category;
use App\Models\PricingTier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::where('teacher_id', Auth::guard('teacher')->id())
            ->with(['sections', 'lectures', 'quizzes'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Teacher/Courses/Index', [
            'courses' => $courses
        ]);
    }

    public function create()
    {
        $categories = Category::active()->ordered()->get();
        $pricingTiers = PricingTier::active()->ordered()->get();
        $teacher = Auth::guard('teacher')->user();

        return Inertia::render('Teacher/Courses/Create', [
            'categories' => $categories,
            'pricingTiers' => $pricingTiers,
            'teacher' => $teacher // Add this line
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string|min:50',
            'category' => 'required|string',
            'intended_learners' => 'nullable|string',
            'learning_objectives' => 'required|array|min:4',
            'learning_objectives.*' => 'required|string|min:10',
            'requirements' => 'nullable|string',
            'target_audience' => 'required|string|min:20',
            'pricing_tier_id' => 'required|exists:pricing_tiers,id',
            'level' => 'required|in:beginner,intermediate,advanced',
            'language' => 'required|string'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $pricingTier = PricingTier::find($request->pricing_tier_id);

        $course = Course::create([
            'teacher_id' => Auth::guard('teacher')->id(),
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'intended_learners' => $request->intended_learners,
            'learning_objectives' => $request->learning_objectives,
            'requirements' => $request->requirements,
            'target_audience' => $request->target_audience,
            'pricing_tier_id' => $pricingTier->id,
            'price' => $pricingTier->price,
            'currency' => $pricingTier->currency,
            'level' => $request->level,
            'language' => $request->language,
            'status' => 'draft'
        ]);

        // Changed this line to redirect to courses index instead of show
        return redirect()->route('teacher.courses.index')
            ->with('success', 'Course created successfully!');
    }

    /**
     * Display the specified course
     */
    public function show($id)
    {
        $course = Course::with(['sections.lectures', 'sections.quizzes'])
            ->where('id', $id)
            ->where('teacher_id', Auth::guard('teacher')->id())
            ->firstOrFail();

        return Inertia::render('Teacher/Courses/Show', [
            'course' => $course,
            'teacher' => Auth::guard('teacher')->user()
        ]);
    }

    public function edit($id)
    {
        $course = Course::where('id', $id)
            ->where('teacher_id', Auth::guard('teacher')->id())
            ->with([
                'sections' => function($query) {
                    $query->orderBy('sort_order')->with([
                        'lectures' => function($query) {
                            $query->orderBy('sort_order');
                        },
                        'quizzes' => function($query) {
                            $query->orderBy('sort_order')->with('questions');
                        }
                    ]);
                }
            ])
            ->firstOrFail();

        return Inertia::render('Teacher/Courses/Edit', [
            'course' => $course,
            'sections' => $course->sections
        ]);
    }

    public function update(Request $request, Course $course)
    {
        // Ensure the course belongs to the authenticated teacher
        if ($course->teacher_id !== Auth::guard('teacher')->id()) {
            abort(403, 'Unauthorized');
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string|min:50',
            'category' => 'required|string',
            'intended_learners' => 'nullable|string',
            'learning_objectives' => 'required|array|min:4',
            'learning_objectives.*' => 'required|string|min:10',
            'requirements' => 'nullable|string',
            'target_audience' => 'required|string|min:20',
            'pricing_tier_id' => 'required|exists:pricing_tiers,id',
            'level' => 'required|in:beginner,intermediate,advanced',
            'language' => 'required|string'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $pricingTier = PricingTier::find($request->pricing_tier_id);

        $course->update([
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'intended_learners' => $request->intended_learners,
            'learning_objectives' => $request->learning_objectives,
            'requirements' => $request->requirements,
            'target_audience' => $request->target_audience,
            'pricing_tier_id' => $pricingTier->id,
            'price' => $pricingTier->price,
            'currency' => $pricingTier->currency,
            'level' => $request->level,
            'language' => $request->language
        ]);

        return redirect()->route('teacher.courses.show', $course->id)
            ->with('success', 'Course updated successfully!');
    }

    public function destroy(Course $course)
    {
        // Ensure the course belongs to the authenticated teacher
        if ($course->teacher_id !== Auth::guard('teacher')->id()) {
            abort(403, 'Unauthorized');
        }

        $course->delete();

        return redirect()->route('teacher.courses.index')
            ->with('success', 'Course deleted successfully!');
    }

    public function submitForReview(Course $course)
    {
        // Ensure the course belongs to the authenticated teacher
        if ($course->teacher_id !== Auth::guard('teacher')->id()) {
            abort(403, 'Unauthorized');
        }

        // Check if course has minimum requirements
        if ($course->sections()->count() < 1) {
            return back()->with('error', 'Course must have at least one section before submission.');
        }

        if ($course->lectures()->count() < 5) {
            return back()->with('error', 'Course must have at least 5 lectures before submission.');
        }

        $course->submitForReview();

        return back()->with('success', 'Course submitted for review successfully!');
    }

    public function submit($id)
    {
        $course = Course::where('id', $id)
            ->where('teacher_id', Auth::guard('teacher')->id())
            ->firstOrFail();

        // Check if course has required content
        $sectionsCount = $course->sections()->count();
        $lecturesCount = $course->lectures()->count();
        $quizzesCount = $course->quizzes()->count();

        if ($sectionsCount === 0) {
            return back()->withErrors(['error' => 'Course must have at least one section before submission.']);
        }

        if ($lecturesCount === 0 && $quizzesCount === 0) {
            return back()->withErrors(['error' => 'Course must have at least one lecture or quiz before submission.']);
        }

        $course->submitForReview();

        return redirect()->route('teacher.courses.index')
            ->with('success', 'Course submitted for review successfully!');
    }
}
