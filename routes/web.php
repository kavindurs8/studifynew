<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\Teacher\VideoLibraryController;
use App\Http\Controllers\Teacher\LiveClassController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AuthController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Home page route (accessible to both guests and authenticated users)
Route::get('/', function () {
    return Inertia::render('User_Site/Home_Page/Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

// Google OAuth routes
Route::get('/login/google', [GoogleController::class, 'redirect'])->name('google.redirect');
Route::get('/login/google/callback', [GoogleController::class, 'callback'])->name('google.callback');

// Dashboard route (only for authenticated and verified users)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Profile routes (require verification)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/remove-picture', [ProfileController::class, 'removePicture'])->name('profile.remove-picture');
});

// Teacher Authentication Routes
Route::get('/teacher/login', [TeacherController::class, 'showLoginForm'])->name('teacher.login');
Route::post('/teacher/login', [TeacherController::class, 'login']);
Route::post('/teacher/logout', [TeacherController::class, 'logout'])->name('teacher.logout');

// Teacher Registration Routes
Route::get('/teacher/register', [TeacherController::class, 'showRegistrationForm'])->name('teacher.register');
Route::post('/teacher/register', [TeacherController::class, 'register']);

// Teacher Email Verification Routes
Route::post('/teacher/verify-otp', [TeacherController::class, 'verifyOtp'])->name('teacher.verify-otp');
Route::post('/teacher/resend-otp', [TeacherController::class, 'resendOtp'])->name('teacher.resend-otp');
Route::post('/teacher/resend-verification', [TeacherController::class, 'resendVerificationFromLogin'])->name('teacher.resend-verification');

// Teacher Password Reset Routes
Route::get('/teacher/forgot-password', [App\Http\Controllers\Auth\TeacherPasswordResetController::class, 'create'])
    ->middleware('guest:teacher')
    ->name('teacher.password.request');

Route::post('/teacher/forgot-password', [App\Http\Controllers\Auth\TeacherPasswordResetController::class, 'store'])
    ->middleware('guest:teacher')
    ->name('teacher.password.email');

Route::get('/teacher/reset-password/{token}', [App\Http\Controllers\Auth\TeacherPasswordResetController::class, 'edit'])
    ->middleware('guest:teacher')
    ->name('teacher.password.reset');

Route::post('/teacher/reset-password', [App\Http\Controllers\Auth\TeacherPasswordResetController::class, 'update'])
    ->middleware('guest:teacher')
    ->name('teacher.password.update');

// Teacher Dashboard (with manual authentication check - no middleware)
Route::get('/teacher/dashboard', [TeacherController::class, 'dashboard'])->name('teacher.dashboard');

// Teacher Home Page
Route::get('/teacher/home', function () {
    return Inertia::render('Teacher/Home');
})->name('teacher.home');

// Teacher Course Management Routes
Route::middleware(['auth:teacher'])->prefix('teacher')->name('teacher.')->group(function () {
    // Course CRUD routes
    Route::get('/courses', [App\Http\Controllers\Teacher\CourseController::class, 'index'])->name('courses.index');
    Route::get('/courses/create', [App\Http\Controllers\Teacher\CourseController::class, 'create'])->name('courses.create');
    Route::post('/courses', [App\Http\Controllers\Teacher\CourseController::class, 'store'])->name('courses.store');
    Route::get('/courses/{course}', [App\Http\Controllers\Teacher\CourseController::class, 'show'])->name('courses.show');
    Route::get('/courses/{course}/edit', [App\Http\Controllers\Teacher\CourseController::class, 'edit'])->name('courses.edit');
    Route::put('/courses/{course}', [App\Http\Controllers\Teacher\CourseController::class, 'update'])->name('courses.update');
    Route::delete('/courses/{course}', [App\Http\Controllers\Teacher\CourseController::class, 'destroy'])->name('courses.destroy');
    Route::post('/courses/{course}/submit', [App\Http\Controllers\Teacher\CourseController::class, 'submit'])->name('courses.submit');

    // Curriculum management routes - CLEAN VERSION
    Route::prefix('courses/{course}')->name('courses.')->group(function () {
        // Section routes
        Route::post('/sections', [App\Http\Controllers\Teacher\CurriculumController::class, 'storeSection'])->name('sections.store');
        Route::put('/sections/{section}', [App\Http\Controllers\Teacher\CurriculumController::class, 'updateSection'])->name('sections.update');
        Route::delete('/sections/{section}', [App\Http\Controllers\Teacher\CurriculumController::class, 'destroySection'])->name('sections.destroy');

        // Lecture routes
        Route::post('/sections/{section}/lectures', [App\Http\Controllers\Teacher\CurriculumController::class, 'storeLecture'])->name('sections.lectures.store');
        Route::put('/sections/{section}/lectures/{lecture}', [App\Http\Controllers\Teacher\CurriculumController::class, 'updateLecture'])->name('sections.lectures.update');
        Route::delete('/sections/{section}/lectures/{lecture}', [App\Http\Controllers\Teacher\CurriculumController::class, 'destroyLecture'])->name('sections.lectures.destroy');

        // Quiz routes
        Route::post('/sections/{section}/quizzes', [App\Http\Controllers\Teacher\CurriculumController::class, 'storeQuiz'])->name('sections.quizzes.store');
        Route::put('/sections/{section}/quizzes/{quiz}', [App\Http\Controllers\Teacher\CurriculumController::class, 'updateQuiz'])->name('sections.quizzes.update');
        Route::delete('/sections/{section}/quizzes/{quiz}', [App\Http\Controllers\Teacher\CurriculumController::class, 'destroyQuiz'])->name('sections.quizzes.destroy');
    });

    // Video Library routes
    Route::resource('video-library', VideoLibraryController::class)->except(['edit', 'update']);
    Route::get('video-library/{video}/link', [VideoLibraryController::class, 'getLink'])->name('video-library.link');

    // Live Class routes
    Route::resource('live-classes', LiveClassController::class);
    Route::post('live-classes/{liveClass}/extra-dates', [LiveClassController::class, 'addExtraDate'])
        ->name('live-classes.add-extra-date');
    Route::delete('live-classes/{liveClass}/extra-dates/{extraDate}', [LiveClassController::class, 'removeExtraDate'])
        ->name('live-classes.remove-extra-date');
    Route::patch('live-classes/{liveClass}/submit-for-approval', [LiveClassController::class, 'submitForApproval'])
        ->name('live-classes.submit-for-approval');
});

// Authentication routes (includes email verification routes)
require __DIR__.'/auth.php';

// Admin Authentication Routes
Route::get('/admin/login', [AuthController::class, 'showLoginForm'])->name('admin.login');
Route::post('/admin/login', [AuthController::class, 'login']);
Route::post('/admin/logout', [AuthController::class, 'logout'])->name('admin.logout');

// Admin routes
Route::middleware(['auth:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Live Classes management
    Route::get('/live-classes', [App\Http\Controllers\Admin\LiveClassController::class, 'index'])->name('live-classes.index');
    Route::get('/live-classes/pending', [App\Http\Controllers\Admin\LiveClassController::class, 'pendingApprovals'])->name('live-classes.pending-approvals');
    Route::get('/live-classes/{liveClass}', [App\Http\Controllers\Admin\LiveClassController::class, 'show'])->name('live-classes.show');
    Route::post('/live-classes/{liveClass}/approve', [App\Http\Controllers\Admin\LiveClassController::class, 'approve'])->name('live-classes.approve');
    Route::post('/live-classes/{liveClass}/reject', [App\Http\Controllers\Admin\LiveClassController::class, 'reject'])->name('live-classes.reject');
    Route::patch('/live-classes/{liveClass}/reschedule', [App\Http\Controllers\Admin\LiveClassController::class, 'reschedule'])->name('live-classes.reschedule');
    Route::patch('/live-classes/{liveClass}/cancel', [App\Http\Controllers\Admin\LiveClassController::class, 'cancel'])->name('live-classes.cancel');
});

// Debug route (you can remove later)
Route::get('/test-storage', function() {
    $user = auth()->user();
    return [
        'user' => $user->only(['id', 'name', 'email', 'profile_picture', 'avatar', 'google_id']),
        'profile_image_accessor' => $user->profile_image, // This should now work for both cases
        'profile_picture_path' => $user->profile_picture ? Storage::url($user->profile_picture) : null,
        'google_avatar_url' => $user->avatar,
        'storage_path' => storage_path('app/public'),
        'public_path' => public_path('storage'),
        'directories_exist' => [
            'storage_app_public' => is_dir(storage_path('app/public')),
            'storage_app_public_profile_pictures' => is_dir(storage_path('app/public/profile-pictures')),
            'public_storage' => is_dir(public_path('storage')),
        ],
        'symlink_check' => [
            'is_link' => is_link(public_path('storage')),
            'target' => is_link(public_path('storage')) ? readlink(public_path('storage')) : 'Not a symlink'
        ]
    ];
})->middleware(['auth']);
