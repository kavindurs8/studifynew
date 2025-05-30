<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'avatar',
        'profile_picture',
        'country',
        'city',
        'zip_code',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * The accessors that should be appended to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['profile_image'];

    /**
     * Get the user's profile picture URL
     */
    public function getProfileImageAttribute()
    {
        // If user has uploaded a custom profile picture, use that
        if ($this->profile_picture) {
            return Storage::url($this->profile_picture);
        }

        // If user signed in with Google and has an avatar, use that
        if ($this->avatar) {
            return $this->avatar;
        }

        // Default fallback
        return null;
    }
}
