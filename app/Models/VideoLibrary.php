<?php
// filepath: e:\pil55\ST New folder (13)\STUDIFY\app\Models\VideoLibrary.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoLibrary extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'title',
        'description',
        'youtube_video_id',
        'youtube_url',
        'youtube_embed_url',
        'thumbnail_url',
        'duration', // Add this
        'original_filename',
        'file_size',
        'upload_status',
        'error_message'
    ];

    protected $casts = [
        'file_size' => 'integer'
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function getFormattedFileSizeAttribute()
    {
        if (!$this->file_size) return 'Unknown';

        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }
}
