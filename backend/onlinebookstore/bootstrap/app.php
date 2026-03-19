<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // ✅ CRITICAL: Prepend CORS middleware to run FIRST
        $middleware->prepend(\App\Http\Middleware\HandleCors::class);
        
        // Configure web middleware stack
        $middleware->web(append: [
            \App\Http\Middleware\SessionCorsMiddleware::class,
        ]);
        
        // Exclude public auth endpoints from CSRF verification
        $middleware->validateCsrfTokens(except: [
            'auth/login',
            'auth/register',
            'csrf-token',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
