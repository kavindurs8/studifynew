<?php

namespace App\Policies;

use App\Models\LiveClass;
use App\Models\User;

class LiveClassPolicy
{
    public function view(User $user, LiveClass $liveClass)
    {
        // Check if user is a teacher (either by role column or teacher table check)
        return $user->id === $liveClass->teacher_id;
    }

    public function create(User $user)
    {
        // Since you're using auth:teacher middleware, this should be fine
        // But you might want to check if the authenticated user is from teachers table
        return true; // The middleware already ensures this is a teacher
    }

    public function update(User $user, LiveClass $liveClass)
    {
        return $user->id === $liveClass->teacher_id;
    }

    public function delete(User $user, LiveClass $liveClass)
    {
        return $user->id === $liveClass->teacher_id;
    }
}
