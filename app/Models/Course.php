<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'title',
        'description',
        'category',
        'intended_learners',
        'learning_objectives',
        'requirements',
        'target_audience',
        'pricing_tier_id',
        'price',
        'currency',
        'status',
        'rejection_reason',
        'thumbnail',
        'level',
        'language',
        'total_duration',
        'total_lectures',
        'total_quizzes',
        'is_published',
        'submitted_at',
        'approved_at'
    ];

    protected $casts = [
        'learning_objectives' => 'array',
        'price' => 'decimal:2',
        'is_published' => 'boolean',
        'submitted_at' => 'datetime',
        'approved_at' => 'datetime'
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function pricingTier()
    {
        return $this->belongsTo(PricingTier::class);
    }

    public function sections()
    {
        return $this->hasMany(CourseSection::class)->orderBy('sort_order');
    }

    public function lectures()
    {
        return $this->hasMany(CourseLecture::class)->orderBy('sort_order');
    }

    public function quizzes()
    {
        return $this->hasMany(CourseQuiz::class)->orderBy('sort_order');
    }

    public function updateStats()
    {
        $this->total_lectures = $this->lectures()->count();
        $this->total_quizzes = $this->quizzes()->count();
        $this->total_duration = $this->lectures()->sum('duration');
        $this->save();
    }

    public function submitForReview()
    {
        $this->update([
            'status' => 'pending_approval',
            'submitted_at' => now()
        ]);
    }

    public function approve()
    {
        $this->update([
            'status' => 'approved',
            'approved_at' => now(),
            'is_published' => true
        ]);
    }

    public function reject($reason)
    {
        $this->update([
            'status' => 'rejected',
            'rejection_reason' => $reason
        ]);
    }
}
