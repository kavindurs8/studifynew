<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseLecture extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'section_id',
        'title',
        'content',
        'video_path',
        'youtube_video_id',
        'youtube_url',
        'youtube_embed_url',
        'thumbnail_url',
        'duration',
        'sort_order',
        'lecture_number',
        'is_preview',
        'is_active'
    ];

    protected $casts = [
        'is_preview' => 'boolean',
        'is_active' => 'boolean'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function section()
    {
        return $this->belongsTo(CourseSection::class, 'section_id');
    }

    public function getFormattedTitleAttribute()
    {
        return "Lecture {$this->lecture_number}: {$this->title}";
    }

    public function getFormattedDurationAttribute()
    {
        if (!$this->duration) return '00:00';

        $hours = floor($this->duration / 3600);
        $minutes = floor(($this->duration % 3600) / 60);
        $seconds = $this->duration % 60;

        if ($hours > 0) {
            return sprintf('%d:%02d:%02d', $hours, $minutes, $seconds);
        }
        return sprintf('%d:%02d', $minutes, $seconds);
    }
}
