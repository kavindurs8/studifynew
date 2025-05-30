<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Support\Facades\Log;
use App\Notifications\TeacherResetPasswordNotification;

class Teacher extends Authenticatable implements CanResetPasswordContract
{
    use HasFactory, Notifiable, CanResetPassword;

    protected $fillable = [
        'name',
        'email',
        'password',
        'nationality',
        'contact_no',
        'linkedin_id',
        'expertise_area',
        'teaching_experience',
        'recent_company',
        'recent_qualification',
        'university_name',
        'specialization',
        'cv_path',
        'status',
        'otp_code',
        'otp_expires_at',
    ];

    protected $hidden = [
        'password',
        'otp_code',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'otp_expires_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function isApproved()
    {
        return $this->status === 'Approved';
    }

    public function isOtpValid($otp)
    {
        $isMatch = $this->otp_code === $otp;
        $isNotExpired = $this->otp_expires_at && $this->otp_expires_at->isFuture();

        Log::info('OTP Validation Details', [
            'teacher_id' => $this->id,
            'submitted_otp' => $otp,
            'submitted_otp_type' => gettype($otp),
            'stored_otp' => $this->otp_code,
            'stored_otp_type' => gettype($this->otp_code),
            'otp_match' => $isMatch,
            'expires_at' => $this->otp_expires_at,
            'is_future' => $isNotExpired,
            'current_time' => now(),
            'final_result' => $isMatch && $isNotExpired,
        ]);

        return $isMatch && $isNotExpired;
    }

    public function generateOtp()
    {
        $this->otp_code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $this->otp_expires_at = now()->addMinutes(10);
        $this->save();

        return $this->otp_code;
    }

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new TeacherResetPasswordNotification($token));
    }

    /**
     * Get the e-mail address where password reset links are sent.
     *
     * @return string
     */
    public function getEmailForPasswordReset()
    {
        return $this->email;
    }
}
