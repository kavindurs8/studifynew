<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\LiveClass;
use App\Models\LiveClassCategory;
use App\Models\LiveClassExtraDate;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class LiveClassController extends Controller
{
    use AuthorizesRequests; // Add this trait

    public function index()
    {
        $liveClasses = LiveClass::where('teacher_id', Auth::guard('teacher')->id())
            ->with(['category', 'extraDates'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Teacher/LiveClasses/Index', [
            'liveClasses' => $liveClasses,
            'teacher' => Auth::guard('teacher')->user()
        ]);
    }

    public function create()
    {
        $categories = LiveClassCategory::where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Teacher/LiveClasses/Create', [
            'categories' => $categories,
            'teacher' => Auth::guard('teacher')->user()
        ]);
    }

    public function store(Request $request)
    {
        $validationRules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'live_class_category_id' => 'required|exists:live_class_categories,id',
            'day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Every Day',
            'start_time' => 'required|date_format:H:i',
            'duration_minutes' => 'required|integer|min:15|max:480',
            'timezone' => 'required|string',
            'repeat_frequency' => 'required|in:daily,weekly,monthly',
            'subscription_fee' => 'required|numeric|min:0',
            'subscription_duration_type' => 'required|in:day',
            'subscription_duration_value' => 'required|integer|in:1,30,60,90,120,180,365',
        ];

        // Add monthly validation rules if needed
        if ($request->repeat_frequency === 'monthly' && $request->day_of_week !== 'Every Day') {
            $validationRules['monthly_week'] = 'required|in:first,second,third,fourth,last';
        }

        $validator = Validator::make($request->all(), $validationRules);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $liveClassData = [
            'teacher_id' => Auth::guard('teacher')->id(),
            'title' => $request->title,
            'description' => $request->description,
            'live_class_category_id' => $request->live_class_category_id,
            'day_of_week' => $request->day_of_week,
            'start_time' => $request->start_time,
            'duration_minutes' => $request->duration_minutes,
            'timezone' => $request->timezone,
            'repeat_frequency' => $request->repeat_frequency,
            'subscription_fee' => $request->subscription_fee,
            'subscription_duration_type' => 'day',
            'subscription_duration_value' => $request->subscription_duration_value,
            'is_active' => true,
            'status' => LiveClass::STATUS_DRAFT, // Set default status
        ];

        // Add monthly scheduling data if applicable
        if ($request->repeat_frequency === 'monthly' && $request->monthly_week) {
            $liveClassData['monthly_week'] = $request->monthly_week;
        }

        $liveClass = LiveClass::create($liveClassData);

        return redirect()->route('teacher.live-classes.index')
            ->with('success', 'Live class created successfully as draft!');
    }

    // Add method to submit for approval
    public function submitForApproval(LiveClass $liveClass)
    {
        // Check if the teacher owns this live class
        if ($liveClass->teacher_id !== Auth::guard('teacher')->id()) {
            abort(403, 'Unauthorized action.');
        }

        if ($liveClass->isDraft()) {
            $liveClass->update(['status' => LiveClass::STATUS_PENDING_APPROVAL]);

            return redirect()->back()
                ->with('success', 'Live class submitted for approval successfully!');
        }

        return redirect()->back()
            ->with('error', 'Only draft classes can be submitted for approval.');
    }

    public function show(LiveClass $liveClass)
    {
        $this->authorize('view', $liveClass);

        $liveClass->load(['category', 'extraDates', 'teacher']);

        return Inertia::render('Teacher/LiveClasses/Show', [
            'liveClass' => $liveClass,
            'teacher' => Auth::guard('teacher')->user()
        ]);
    }

    public function edit(LiveClass $liveClass)
    {
        $this->authorize('update', $liveClass);

        $categories = LiveClassCategory::where('is_active', true)
            ->orderBy('name')
            ->get();

        $liveClass->load(['category', 'extraDates']);

        return Inertia::render('Teacher/LiveClasses/Edit', [
            'liveClass' => $liveClass,
            'categories' => $categories,
            'teacher' => Auth::guard('teacher')->user()
        ]);
    }

    public function update(Request $request, LiveClass $liveClass)
    {
        $this->authorize('update', $liveClass);

        $validationRules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'live_class_category_id' => 'required|exists:live_class_categories,id',
            'day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Every Day',
            'start_time' => 'required|date_format:H:i',
            'duration_minutes' => 'required|integer|min:15|max:480',
            'timezone' => 'required|string',
            'repeat_frequency' => 'required|in:daily,weekly,monthly',
            'subscription_fee' => 'required|numeric|min:0',
            'subscription_duration_type' => 'required|in:day',
            'subscription_duration_value' => 'required|integer|in:1,30,60,90,120,180,365',
        ];

        // Add monthly validation rules if needed
        if ($request->repeat_frequency === 'monthly' && $request->day_of_week !== 'Every Day') {
            $validationRules['monthly_week'] = 'required|in:first,second,third,fourth,last';
        }

        $validator = Validator::make($request->all(), $validationRules);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $updateData = [
            'title' => $request->title,
            'description' => $request->description,
            'live_class_category_id' => $request->live_class_category_id,
            'day_of_week' => $request->day_of_week,
            'start_time' => $request->start_time,
            'duration_minutes' => $request->duration_minutes,
            'timezone' => $request->timezone,
            'repeat_frequency' => $request->repeat_frequency,
            'subscription_fee' => $request->subscription_fee,
            'subscription_duration_type' => 'day',
            'subscription_duration_value' => $request->subscription_duration_value,
        ];

        // Add or clear monthly scheduling data
        if ($request->repeat_frequency === 'monthly' && $request->monthly_week) {
            $updateData['monthly_week'] = $request->monthly_week;
        } else {
            $updateData['monthly_week'] = null;
        }

        $liveClass->update($updateData);

        return redirect()->route('teacher.live-classes.index')
            ->with('success', 'Live class updated successfully!');
    }

    public function destroy(LiveClass $liveClass)
    {
        $this->authorize('delete', $liveClass);

        $liveClass->delete();

        return redirect()->route('teacher.live-classes.index')
            ->with('success', 'Live class deleted successfully!');
    }
}
