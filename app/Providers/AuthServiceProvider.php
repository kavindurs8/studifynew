<?php

namespace App\Providers;

use App\Models\LiveClass;
use App\Policies\LiveClassPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        // ... existing policies
        LiveClass::class => LiveClassPolicy::class,
    ];

    public function boot()
    {
        $this->registerPolicies();
    }
}
