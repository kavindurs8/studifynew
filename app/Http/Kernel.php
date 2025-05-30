<?php
// Add this to your $middlewareAliases array
protected $middlewareAliases = [
    // ... existing middleware ...
    'teacher' => \App\Http\Middleware\TeacherMiddleware::class,
];
