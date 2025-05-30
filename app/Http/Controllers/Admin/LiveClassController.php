<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LiveClass;
use App\Services\ZoomService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LiveClassController extends Controller
{
    protected $zoomService;

    public function __construct(ZoomService $zoomService)
    {
        $this->zoomService = $zoomService;
    }

    /**
     * Display pending live classes for approval
     */
    public function index()
    {
        $liveClasses = LiveClass::with(['teacher'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/LiveClasses/Index', [
            'liveClasses' => $liveClasses,
        ]);
    }

    /**
     * Display pending live classes for approval
     */
    public function pendingApprovals()
    {
        $pendingClasses = LiveClass::pendingApproval()
            ->with(['teacher'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/LiveClasses/PendingApprovals', [
            'pendingClasses' => $pendingClasses,
        ]);
    }

    /**
     * Show live class details
     */
    public function show(LiveClass $liveClass)
    {
        $liveClass->load(['teacher', 'approvedBy']);

        return Inertia::render('Admin/LiveClasses/Show', [
            'liveClass' => $liveClass,
        ]);
    }

    /**
     * Approve a live class and create Zoom meeting
     */
    public function approve(Request $request, LiveClass $liveClass)
    {
        $request->validate([
            'scheduled_at' => 'required|date|after:now',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        if (!$liveClass->isPendingApproval()) {
            return back()->withErrors(['error' => 'This live class is not pending approval.']);
        }

        DB::beginTransaction();

        try {
            // Update the live class with scheduled time
            $liveClass->update([
                'scheduled_at' => $request->scheduled_at,
                'admin_notes' => $request->admin_notes,
            ]);

            // Create Zoom meeting
            $zoomMeeting = $this->zoomService->createMeeting($liveClass);

            // Update live class with Zoom meeting details
            $liveClass->update([
                'status' => LiveClass::STATUS_SCHEDULED,
                'zoom_meeting_id' => $zoomMeeting['id'],
                'zoom_join_url' => $zoomMeeting['join_url'],
                'zoom_start_url' => $zoomMeeting['start_url'],
                'zoom_password' => $zoomMeeting['password'] ?? null,
                'zoom_meeting_data' => $zoomMeeting,
                'approved_at' => now(),
                'approved_by' => auth()->guard('admin')->id(),
            ]);

            DB::commit();

            return redirect()
                ->route('admin.live-classes.show', $liveClass)
                ->with('success', 'Live class has been approved and Zoom meeting created successfully!');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors([
                'error' => 'Failed to approve live class: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Reject a live class
     */
    public function reject(Request $request, LiveClass $liveClass)
    {
        $request->validate([
            'admin_notes' => 'required|string|max:1000',
        ]);

        if (!$liveClass->isPendingApproval()) {
            return back()->withErrors(['error' => 'This live class is not pending approval.']);
        }

        $liveClass->update([
            'status' => LiveClass::STATUS_REJECTED,
            'admin_notes' => $request->admin_notes,
            'approved_at' => now(),
            'approved_by' => auth()->guard('admin')->id(),
        ]);

        return redirect()
            ->route('admin.live-classes.pending-approvals')
            ->with('success', 'Live class has been rejected.');
    }

    /**
     * Reschedule a live class
     */
    public function reschedule(Request $request, LiveClass $liveClass)
    {
        $request->validate([
            'scheduled_at' => 'required|date|after:now',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        if (!$liveClass->isApproved() && !$liveClass->hasZoomMeeting()) {
            return back()->withErrors(['error' => 'This live class cannot be rescheduled.']);
        }

        DB::beginTransaction();

        try {
            // Update the live class schedule
            $liveClass->update([
                'scheduled_at' => $request->scheduled_at,
                'admin_notes' => $request->admin_notes,
            ]);

            // Update Zoom meeting
            if ($liveClass->zoom_meeting_id) {
                $zoomMeeting = $this->zoomService->updateMeeting($liveClass->zoom_meeting_id, $liveClass);

                $liveClass->update([
                    'zoom_meeting_data' => $zoomMeeting,
                ]);
            }

            DB::commit();

            return back()->with('success', 'Live class has been rescheduled successfully!');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors([
                'error' => 'Failed to reschedule live class: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Cancel a live class
     */
    public function cancel(Request $request, LiveClass $liveClass)
    {
        $request->validate([
            'admin_notes' => 'required|string|max:1000',
        ]);

        DB::beginTransaction();

        try {
            // Delete Zoom meeting if exists
            if ($liveClass->zoom_meeting_id) {
                $this->zoomService->deleteMeeting($liveClass->zoom_meeting_id);
            }

            // Update live class status
            $liveClass->update([
                'status' => LiveClass::STATUS_CANCELLED,
                'admin_notes' => $request->admin_notes,
            ]);

            DB::commit();

            return back()->with('success', 'Live class has been cancelled successfully!');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors([
                'error' => 'Failed to cancel live class: ' . $e->getMessage()
            ]);
        }
    }
}
