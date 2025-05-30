<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PricingTier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'tier_number',
        'price',
        'currency',
        'description',
        'features',
        'is_active',
        'is_popular',
        'sort_order',
    ];

    protected $casts = [
        'features' => 'array',
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'is_popular' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('tier_number');
    }

    public function scopeForCourseCreation($query)
    {
        // Return only essential tiers for course creation (Free + first 4 paid tiers)
        return $query->active()
            ->whereIn('tier_number', [0, 1, 2, 3, 4])
            ->ordered();
    }

    public function courses()
    {
        return $this->hasMany(Course::class);
    }
}
