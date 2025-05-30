<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class LiveClass extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'title',
        'description',
        'live_class_category_id',
        'day_of_week',
        'start_time',
        'duration_minutes',
        'timezone',
        'repeat_frequency',
        'monthly_week',
        'subscription_fee',
        'subscription_duration_type',
        'subscription_duration_value',
        'is_active',
        'status', // Add this field
        'zoom_meeting_id',
        'zoom_join_url',
        'zoom_start_url',
        'zoom_password',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'subscription_fee' => 'decimal:2',
        'duration_minutes' => 'integer',
    ];

    // Status constants for easy reference
    const STATUS_DRAFT = 'draft';
    const STATUS_PENDING_APPROVAL = 'pending_approval';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';

    // Status helper methods
    public function isDraft()
    {
        return $this->status === self::STATUS_DRAFT;
    }

    public function isPendingApproval()
    {
        return $this->status === self::STATUS_PENDING_APPROVAL;
    }

    public function isApproved()
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isRejected()
    {
        return $this->status === self::STATUS_REJECTED;
    }

    // Get status badge color for UI
    public function getStatusBadgeColorAttribute()
    {
        return match($this->status) {
            self::STATUS_DRAFT => 'bg-gray-500',
            self::STATUS_PENDING_APPROVAL => 'bg-yellow-500',
            self::STATUS_APPROVED => 'bg-green-500',
            self::STATUS_REJECTED => 'bg-red-500',
            default => 'bg-gray-500'
        };
    }

    // Get formatted status label
    public function getStatusLabelAttribute()
    {
        return match($this->status) {
            self::STATUS_DRAFT => 'Draft',
            self::STATUS_PENDING_APPROVAL => 'Pending Approval',
            self::STATUS_APPROVED => 'Approved',
            self::STATUS_REJECTED => 'Rejected',
            default => 'Unknown'
        };
    }

    // Add this method to calculate end time
    public function getEndTimeAttribute()
    {
        if ($this->start_time && $this->duration_minutes) {
            $startTime = \Carbon\Carbon::createFromFormat('H:i:s', $this->start_time);
            return $startTime->addMinutes($this->duration_minutes)->format('H:i:s');
        }
        return null;
    }

    // Add this method to format duration
    public function getFormattedDurationAttribute()
    {
        if (!$this->duration_minutes) return '';

        $hours = intval($this->duration_minutes / 60);
        $minutes = $this->duration_minutes % 60;

        if ($hours > 0 && $minutes > 0) {
            return "{$hours}h {$minutes}m";
        } elseif ($hours > 0) {
            return "{$hours}h";
        } else {
            return "{$minutes}m";
        }
    }

    // Add this method to get formatted monthly schedule
    public function getMonthlyScheduleAttribute()
    {
        if ($this->repeat_frequency === 'monthly' && $this->monthly_week && $this->day_of_week) {
            $weekLabels = [
                'first' => 'First',
                'second' => 'Second',
                'third' => 'Third',
                'fourth' => 'Fourth',
                'last' => 'Last'
            ];

            $weekLabel = $weekLabels[$this->monthly_week] ?? ucfirst($this->monthly_week);
            return "{$weekLabel} {$this->day_of_week} of every month";
        }
        return null;
    }

    // Relationships
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function category()
    {
        return $this->belongsTo(LiveClassCategory::class, 'live_class_category_id');
    }

    public function extraDates()
    {
        return $this->hasMany(LiveClassExtraDate::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByTeacher($query, $teacherId)
    {
        return $query->where('teacher_id', $teacherId);
    }

    // Helper methods
    public function getNextClassDateTime()
    {
        $now = Carbon::now($this->timezone);
        $targetDay = Carbon::parse("next {$this->day_of_week}", $this->timezone);
        $targetTime = Carbon::createFromFormat('H:i:s', $this->start_time, $this->timezone);

        $nextClass = $targetDay->setTime($targetTime->hour, $targetTime->minute, $targetTime->second);

        return $nextClass;
    }

    public function getFormattedSubscriptionDuration()
    {
        $value = $this->subscription_duration_value;
        $type = $this->subscription_duration_type;

        return $value . ' ' . ($value > 1 ? \Illuminate\Support\Str::plural($type) : $type);
    }
}
