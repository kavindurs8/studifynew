<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function showRegistrationForm()
    {
        return Inertia::render('Teacher/Register');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:teachers'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'nationality' => ['required', 'string', 'max:255'],
            'contact_no' => ['required', 'string', 'max:20'],
            'linkedin_id' => ['nullable', 'string', 'max:255'],
            'expertise_area' => ['required', 'in:Development,Business,Finance & Accounting,IT & Software,Office Productivity,Personal Development,Design,Marketing,Lifestyle,Photography & Video,Health & Fitness,Music,Teaching & Academics,Other'],
            'teaching_experience' => ['required', 'in:0,0 - 1,1 - 3,3 - 5,5 + years'],
            'recent_company' => ['required', 'string', 'max:255'],
            'recent_qualification' => ['required', 'string', 'max:255'],
            'university_name' => ['required', 'string', 'max:255'],
            'specialization' => ['nullable', 'string'],
            'cv' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'], // 5MB max
        ]);

        // Handle CV upload
        $cvPath = null;
        if ($request->hasFile('cv')) {
            $cvPath = $request->file('cv')->store('teacher-cvs', 'public');
        }

        $teacher = Teacher::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'nationality' => $validated['nationality'],
            'contact_no' => $validated['contact_no'],
            'linkedin_id' => $validated['linkedin_id'],
            'expertise_area' => $validated['expertise_area'],
            'teaching_experience' => $validated['teaching_experience'],
            'recent_company' => $validated['recent_company'],
            'recent_qualification' => $validated['recent_qualification'],
            'university_name' => $validated['university_name'],
            'specialization' => $validated['specialization'],
            'cv_path' => $cvPath,
        ]);

        // Generate and send OTP
        $otp = $teacher->generateOtp();
        $this->sendOtpEmail($teacher, $otp);

        // Return Inertia response instead of JSON
        return Inertia::render('Teacher/Register', [
            'success' => true,
            'message' => 'Registration successful! Please check your email for OTP verification.',
            'teacher_id' => $teacher->id,
            'show_otp_form' => true,
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'teacher_id' => ['required', 'exists:teachers,id'],
            'otp' => ['required', 'string', 'size:6'],
        ]);

        $teacher = Teacher::find($request->teacher_id);

        if (!$teacher->isOtpValid($request->otp)) {
            return back()->withErrors([
                'otp' => 'Invalid or expired OTP.',
            ]);
        }

        // Try direct property assignment and save
        $teacher->email_verified_at = now();
        $teacher->otp_code = null;
        $teacher->otp_expires_at = null;
        $saveResult = $teacher->save();

        Log::info('Direct save result', [
            'teacher_id' => $teacher->id,
            'save_result' => $saveResult,
            'email_verified_at' => $teacher->email_verified_at,
        ]);

        // Double-check by fetching fresh from database
        $freshTeacher = Teacher::find($teacher->id);
        Log::info('Fresh teacher from database', [
            'teacher_id' => $freshTeacher->id,
            'email_verified_at' => $freshTeacher->email_verified_at,
            'otp_code' => $freshTeacher->otp_code,
        ]);

        // Check if teacher is approved and auto-login
        if ($teacher->status === 'Approved') {
            auth()->guard('teacher')->login($teacher);
            $request->session()->regenerate();

            return redirect()->route('teacher.dashboard')->with([
                'status' => 'Welcome! Your email has been verified and you are now logged in.',
            ]);
        }

        // If not approved, redirect to login with pending message
        return redirect()->route('teacher.login')->with([
            'status' => 'Email verified successfully! Your account is pending admin approval.',
            'account_status' => $teacher->status,
        ]);
    }

    public function resendOtp(Request $request)
    {
        $request->validate([
            'teacher_id' => ['required', 'exists:teachers,id'],
        ]);

        $teacher = Teacher::find($request->teacher_id);
        $otp = $teacher->generateOtp();
        $this->sendOtpEmail($teacher, $otp);

        return Inertia::render('Teacher/Register', [
            'success' => true,
            'message' => 'OTP resent successfully!',
            'teacher_id' => $teacher->id,
            'show_otp_form' => true,
        ]);
    }

    private function sendOtpEmail(Teacher $teacher, string $otp)
    {
        // Log the OTP for testing
        Log::info('Teacher OTP Generated', [
            'teacher_id' => $teacher->id,
            'email' => $teacher->email,
            'otp' => $otp
        ]);

        // Send actual email
        try {
            Mail::send('emails.teacher-otp', ['teacher' => $teacher, 'otp' => $otp], function ($message) use ($teacher) {
                $message->to($teacher->email)
                       ->subject('Verify Your Teacher Account - OTP');
            });
        } catch (\Exception $e) {
            Log::error('Failed to send OTP email: ' . $e->getMessage());
        }
    }

    public function showLoginForm()
    {
        return Inertia::render('Teacher/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $teacher = Teacher::where('email', $credentials['email'])->first();

        // Check if teacher exists
        if (!$teacher) {
            return back()->withErrors([
                'email' => 'No account found with this email address.',
            ]);
        }

        // Check password
        if (!Hash::check($credentials['password'], $teacher->password)) {
            return back()->withErrors([
                'email' => 'Invalid credentials.',
            ]);
        }

        // Check if email is verified (done during registration)
        if (!$teacher->email_verified_at) {
            return back()->withErrors([
                'email' => 'Please verify your email first. Check your inbox for the verification email sent during registration.',
            ]);
        }

        // Check if account is approved
        if ($teacher->status !== 'Approved') {
            $statusMessage = match($teacher->status) {
                'Not Approved' => 'Your account is pending admin approval. You will receive an email once approved.',
                'Rejected' => 'Your account has been rejected. Please contact support for more information.',
                default => 'Your account status does not allow login.',
            };

            return back()->withErrors([
                'email' => $statusMessage,
            ]);
        }

        // All checks passed - login successful
        auth()->guard('teacher')->login($teacher, $request->boolean('remember'));
        $request->session()->regenerate();

        // Debug log to see what's happening
        Log::info('Teacher logged in successfully', [
            'teacher_id' => $teacher->id,
            'email' => $teacher->email,
            'intended_url' => session()->pull('url.intended', route('teacher.dashboard')),
        ]);

        // Redirect to dashboard
        return redirect()->intended(route('teacher.dashboard'));
    }

    public function logout(Request $request)
    {
        auth()->guard('teacher')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('teacher.login');
    }

    public function dashboard()
    {
        // Manual authentication check
        if (!auth()->guard('teacher')->check()) {
            return redirect()->route('teacher.login')->withErrors([
                'email' => 'Please log in to access the dashboard.',
            ]);
        }

        $teacher = auth()->guard('teacher')->user();

        // Check if email is verified
        if (!$teacher->email_verified_at) {
            auth()->guard('teacher')->logout();
            return redirect()->route('teacher.login')->withErrors([
                'email' => 'Please verify your email first.',
            ]);
        }

        // Check if account is approved
        if ($teacher->status !== 'Approved') {
            auth()->guard('teacher')->logout();
            return redirect()->route('teacher.login')->withErrors([
                'email' => 'Your account is pending admin approval.',
            ]);
        }

        return Inertia::render('Teacher/Dashboard', [
            'teacher' => $teacher,
        ]);
    }

    // Add method to resend verification from login page
    public function resendVerificationFromLogin(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', 'exists:teachers,email'],
        ]);

        $teacher = Teacher::where('email', $request->email)->first();

        if ($teacher->email_verified_at) {
            return back()->withErrors([
                'email' => 'Email is already verified.',
            ]);
        }

        $otp = $teacher->generateOtp();
        $this->sendOtpEmail($teacher, $otp);

        return Inertia::render('Teacher/VerifyEmail', [
            'teacher_id' => $teacher->id,
            'message' => 'Verification email sent successfully!',
        ]);
    }
}
