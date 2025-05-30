<?php
// filepath: app/Http/Controllers/Admin/DashboardController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Course;
use App\Models\LiveClass;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Schema;

class DashboardController extends Controller
{
    public function index()
    {
        // Get current admin
        $admin = auth()->guard('admin')->user();

        // Calculate statistics with fallbacks for missing columns
        $stats = [
            'totalStudents' => User::count(),
            'totalTeachers' => Teacher::count(),
            'totalCourses' => Course::count(),
            'totalLiveClasses' => LiveClass::count(),
            'pendingApprovals' => $this->getPendingApprovals(),
            'activeUsers' => $this->getActiveUsers(),
            'monthlyRevenue' => 450000, // Placeholder - implement based on your payment system
            'completionRate' => 78, // Placeholder - implement based on your course completion tracking

            // Calculate growth percentages (compared to last month)
            'studentsGrowth' => $this->calculateGrowth(User::class),
            'teachersGrowth' => $this->calculateGrowth(Teacher::class),
            'coursesGrowth' => $this->calculateGrowth(Course::class),
            'revenueGrowth' => 23.1, // Placeholder
        ];

        // Recent activities (placeholder data for now)
        $recentActivities = $this->getRecentActivities();

        // Pending approvals
        $pendingApprovals = $this->getPendingApprovalsList();

        return Inertia::render('Admin/Dashboard', [
            'admin' => $admin,
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'pendingApprovals' => $pendingApprovals,
        ]);
    }

    private function getPendingApprovals()
    {
        $coursesPending = 0;
        $liveClassesPending = 0;

        // Check if courses table exists and has status column
        if (Schema::hasTable('courses') && Schema::hasColumn('courses', 'status')) {
            $coursesPending = Course::where('status', 'pending')->count();
        }

        // Check if live_classes table exists and has status column
        if (Schema::hasTable('live_classes') && Schema::hasColumn('live_classes', 'status')) {
            $liveClassesPending = LiveClass::where('status', 'pending_approval')->count();
        }

        return $coursesPending + $liveClassesPending;
    }

    private function getActiveUsers()
    {
        // Check if last_login_at column exists before using it
        if (Schema::hasColumn('users', 'last_login_at')) {
            return User::where('last_login_at', '>=', Carbon::now()->subDays(30))->count();
        }

        // Fallback: use recently created users if last_login_at doesn't exist
        return User::where('created_at', '>=', Carbon::now()->subDays(30))->count();
    }

    private function calculateGrowth($model)
    {
        try {
            $currentMonth = $model::whereMonth('created_at', Carbon::now()->month)
                                  ->whereYear('created_at', Carbon::now()->year)
                                  ->count();

            $lastMonth = $model::whereMonth('created_at', Carbon::now()->subMonth()->month)
                               ->whereYear('created_at', Carbon::now()->subMonth()->year)
                               ->count();

            if ($lastMonth == 0) return $currentMonth > 0 ? 100 : 0;

            return round((($currentMonth - $lastMonth) / $lastMonth) * 100, 1);
        } catch (\Exception $e) {
            // Return 0 if there's any error calculating growth
            return 0;
        }
    }

    private function getRecentActivities()
    {
        // For now, return sample data. You can implement real activity tracking later
        return [
            [
                'user' => 'John Doe',
                'action' => 'created a new course',
                'time' => '2 minutes ago',
                'type' => 'course'
            ],
            [
                'user' => 'Jane Smith',
                'action' => 'submitted live class for approval',
                'time' => '15 minutes ago',
                'type' => 'approval'
            ],
            [
                'user' => 'Mike Johnson',
                'action' => 'registered as a new teacher',
                'time' => '1 hour ago',
                'type' => 'registration'
            ]
        ];
    }

    private function getPendingApprovalsList()
    {
        $pendingItems = collect();

        try {
            // Get pending courses if the table exists
            if (Schema::hasTable('courses') && Schema::hasColumn('courses', 'status')) {
                $pendingCourses = Course::where('status', 'pending')
                    ->with('teacher')
                    ->latest()
                    ->take(5)
                    ->get()
                    ->map(function($course) {
                        return [
                            'id' => $course->id,
                            'title' => $course->title,
                            'teacher' => $course->teacher->name ?? 'Unknown',
                            'type' => 'Course',
                            'submitted' => $course->created_at->diffForHumans()
                        ];
                    });

                $pendingItems = $pendingItems->merge($pendingCourses);
            }

            // Get pending live classes if the table exists
            if (Schema::hasTable('live_classes') && Schema::hasColumn('live_classes', 'status')) {
                $pendingLiveClasses = LiveClass::where('status', 'pending_approval')
                    ->with('teacher')
                    ->latest()
                    ->take(5)
                    ->get()
                    ->map(function($liveClass) {
                        return [
                            'id' => $liveClass->id,
                            'title' => $liveClass->title,
                            'teacher' => $liveClass->teacher->name ?? 'Unknown',
                            'type' => 'Live Class',
                            'submitted' => $liveClass->created_at->diffForHumans()
                        ];
                    });

                $pendingItems = $pendingItems->merge($pendingLiveClasses);
            }
        } catch (\Exception $e) {
            // Return empty collection if there's any error
            return collect();
        }

        return $pendingItems->take(10);
    }
}
