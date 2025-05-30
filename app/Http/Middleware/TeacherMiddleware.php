<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TeacherMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // Debug log to see what's happening
        Log::info('TeacherMiddleware check', [
            'is_teacher_authenticated' => Auth::guard('teacher')->check(),
            'teacher_id' => Auth::guard('teacher')->id(),
            'requested_url' => $request->url(),
            'session_id' => session()->getId(),
        ]);

        if (!Auth::guard('teacher')->check()) {
            Log::info('Teacher not authenticated, redirecting to login');
            return redirect()->route('teacher.login')
                ->with('error', 'Please log in to access this page.');
        }

        $teacher = Auth::guard('teacher')->user();

        if (!$teacher->email_verified_at) {
            Log::info('Teacher email not verified');
            Auth::guard('teacher')->logout();
            return redirect()->route('teacher.login')
                ->with('error', 'Please verify your email first.');
        }

        if (!$teacher->isApproved()) {
            Log::info('Teacher not approved', ['status' => $teacher->status]);
            Auth::guard('teacher')->logout();
            return redirect()->route('teacher.login')
                ->with('error', 'Your account is not yet approved by the administrator.');
        }

        Log::info('Teacher middleware passed successfully');
        return $next($request);
    }
}
