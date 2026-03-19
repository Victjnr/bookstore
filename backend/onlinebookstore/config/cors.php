<?php

/**
 * CORS Configuration
 * 
 * Enterprise-grade CORS settings for secure cross-origin requests
 * between React frontend and Laravel backend
 */

return [
    /*
    |--------------------------------------------------------------------------
    | Allowed Origins
    |--------------------------------------------------------------------------
    |
    | Define which origins are allowed to make requests to this API.
    | Use specific origins in production instead of '*'.
    |
    */
    'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:8080,http://localhost:8081,http://127.0.0.1:8080,http://127.0.0.1:8081')),

    /*
    |--------------------------------------------------------------------------
    | Allowed Methods
    |--------------------------------------------------------------------------
    |
    | HTTP methods that are allowed from CORS requests
    |
    */
    'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Headers
    |--------------------------------------------------------------------------
    |
    | Request headers that are allowed in CORS requests
    |
    */
    'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With'],

    /*
    |--------------------------------------------------------------------------
    | Exposed Headers
    |--------------------------------------------------------------------------
    |
    | Response headers that are accessible to the browser
    |
    */
    'exposed_headers' => ['Content-Length', 'X-JSON-Response'],

    /*
    |--------------------------------------------------------------------------
    | Max Age
    |--------------------------------------------------------------------------
    |
    | How long (in seconds) the results of a preflight request can be cached
    |
    */
    'max_age' => 3600,

    /*
    |--------------------------------------------------------------------------
    | Allow Credentials
    |--------------------------------------------------------------------------
    |
    | Whether credentials (cookies, authorization headers) are allowed
    | Must be true for authentication to work with CORS
    |
    */
    'allow_credentials' => true,
];
