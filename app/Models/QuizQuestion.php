<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'question',
        'options',
        'correct_answer',
        'explanation',
        'sort_order'
    ];

    protected $casts = [
        'options' => 'array',
        'correct_answer' => 'integer',
        'sort_order' => 'integer'
    ];

    public function quiz()
    {
        return $this->belongsTo(CourseQuiz::class, 'quiz_id');
    }

    public function getCorrectOptionAttribute()
    {
        return $this->options[$this->correct_answer] ?? null;
    }

    // Helper method to get correct answer as letter
    public function getCorrectAnswerLetterAttribute()
    {
        $letters = ['A', 'B', 'C', 'D'];
        return $letters[$this->correct_answer] ?? null;
    }

    // Helper method to get options with letters
    public function getOptionsWithLettersAttribute()
    {
        $letters = ['A', 'B', 'C', 'D'];
        $result = [];

        foreach ($this->options as $index => $option) {
            $result[$letters[$index]] = $option;
        }

        return $result;
    }
}
