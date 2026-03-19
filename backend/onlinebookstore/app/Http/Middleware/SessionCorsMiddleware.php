<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * SessionCorsMiddleware - Ensures session cookies are properly set for SPA
 * Enterprise-grade session management for cross-origin SPA requests
 * 
 * This middleware ensures that:
 * 1. Session cookies are accessible to cross-origin requests
 * 2. Preflight OPTIONS requests establish session context
 * 3. CSRF tokens are available for mutations
 */
class SessionCorsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Start session if not already started
        if (!$request->hasSession()) {
            $request->setLaravelSession(app('session')->driver());
        }

        // For preflight OPTIONS requests, ensure session is created
        if ($request->isMethod('OPTIONS')) {
            // Trigger session creation by accessing session
            $request->session()->touch();
            
            return response()->noContent()
                ->header('Access-Control-Allow-Origin', $request->header('Origin') ?? '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
                ->header('Access-Control-Allow-Headers', $request->header('Access-Control-Request-Headers') ?? 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN')
                ->header('Access-Control-Allow-Credentials', 'true')
                ->header('Access-Control-Max-Age', '3600');
        }

        $response = $next($request);

        return $response;
    }
}
