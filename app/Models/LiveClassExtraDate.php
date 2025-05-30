<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiveClassExtraDate extends Model
{
    use HasFactory;

    protected $fillable = [
        'live_class_id',
        'day_of_week',
        'start_time',
        'timezone',
        'repeat_frequency',
        'zoom_meeting_id',
        'zoom_join_url',
        'zoom_start_url',
        'zoom_password',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function liveClass()
    {
        return $this->belongsTo(LiveClass::class);
    }
}
