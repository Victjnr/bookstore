<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleCors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $allowedOrigins = config('cors.allowed_origins', [
            'http://localhost:8080',
            'http://localhost:8081',
            'http://127.0.0.1:8080',
            'http://127.0.0.1:8081',
        ]);

        $origin = $request->header('Origin');
        
        // Check if origin is allowed
        $isAllowed = in_array($origin, $allowedOrigins) || in_array('*', $allowedOrigins);

        // ✅ CRITICAL: Handle preflight OPTIONS requests FIRST, even before routing
        if ($request->getMethod() === 'OPTIONS') {
            if ($isAllowed) {
                // Return with CORS headers for allowed origins
                $response = response('', 200);
            } else {
                // If origin not allowed, return 403
                $response = response('Forbidden', 403);
            }
            
            // Add CORS headers to preflight response
            $response->header('Access-Control-Allow-Origin', $origin ?? '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-CSRF-TOKEN')
                ->header('Access-Control-Max-Age', '3600')
                ->header('Access-Control-Allow-Credentials', 'true');
            
            return $response;
        }

        // ✅ Process the actual request
        $response = $next($request);

        // ✅ Add CORS headers to response if origin is allowed
        if ($isAllowed && $origin) {
            $response->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-CSRF-TOKEN')
                ->header('Access-Control-Allow-Credentials', 'true')
                ->header('Access-Control-Expose-Headers', 'Content-Length, Content-Range');
        }

        return $response;
    }
}
