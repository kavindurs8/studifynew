<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'sort_order',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function lectures()
    {
        return $this->hasMany(CourseLecture::class, 'section_id')->orderBy('sort_order');
    }

    public function quizzes()
    {
        return $this->hasMany(CourseQuiz::class, 'section_id')->orderBy('sort_order');
    }

    public function items()
    {
        $lectures = $this->lectures()->get()->map(function ($lecture) {
            $lecture->type = 'lecture';
            return $lecture;
        });

        $quizzes = $this->quizzes()->get()->map(function ($quiz) {
            $quiz->type = 'quiz';
            return $quiz;
        });

        return collect()
            ->merge($lectures)
            ->merge($quizzes)
            ->sortBy('sort_order')
            ->values();
    }
}
