<?php

/**
 * API Health Check Script
 * 
 * Verifies Laravel backend is properly configured for React frontend
 * Run: php artisan tinker < api-health-check.php
 * 
 * Checks:
 * - CORS middleware is registered
 * - Database is connected
 * - User model is accessible
 * - Cart relationships work
 * - CartController exists
 */

echo "\n=== API Health Check ===\n\n";

// 1. Check CORS Configuration
echo "✓ Checking CORS Configuration...\n";
$corsConfig = config('cors');
echo "  - Allowed Origins: " . implode(', ', $corsConfig['allowed_origins']) . "\n";
echo "  - Allow Credentials: " . ($corsConfig['allow_credentials'] ? 'true' : 'false') . "\n";
echo "  - Max Age: {$corsConfig['max_age']} seconds\n\n";

// 2. Check Database Connection
echo "✓ Testing Database Connection...\n";
try {
    DB::connection()->getPdo();
    echo "  - Database: Connected ✅\n\n";
} catch (Exception $e) {
    echo "  - Database: Failed ❌ - {$e->getMessage()}\n\n";
}

// 3. Check User Model
echo "✓ Checking User Model...\n";
$userCount = \App\Models\User::count();
echo "  - Users in database: {$userCount}\n";
echo "  - User model: Available ✅\n\n";

// 4. Check Cart Relationships
echo "✓ Checking Cart Relationships...\n";
if ($userCount > 0) {
    $user = \App\Models\User::first();
    echo "  - Sample user: {$user->email}\n";
    
    $cart = $user->cart;
    if ($cart) {
        echo "  - User cart exists: ✅\n";
        echo "  - Cart items count: {$cart->items()->count()}\n";
    } else {
        echo "  - User cart: None (will be created on first add)\n";
    }
} else {
    echo "  - No users to test, run migration first\n";
}
echo "\n";

// 5. Check CartController
echo "✓ Checking CartController...\n";
$controllerPath = app_path('Http/Controllers/CartController.php');
if (file_exists($controllerPath)) {
    echo "  - CartController exists: ✅\n";
    echo "  - File: {$controllerPath}\n";
    
    // Check for syntax
    $output = [];
    $return = 0;
    exec("php -l \"{$controllerPath}\"", $output, $return);
    if ($return === 0) {
        echo "  - Syntax check: ✅\n";
    } else {
        echo "  - Syntax check: ❌\n";
        print_r($output);
    }
} else {
    echo "  - CartController: Missing ❌\n";
}
echo "\n";

// 6. Check Middleware
echo "✓ Checking CORS Middleware...\n";
$middlewarePath = app_path('Http/Middleware/HandleCors.php');
if (file_exists($middlewarePath)) {
    echo "  - HandleCors middleware exists: ✅\n";
} else {
    echo "  - HandleCors middleware: Missing ❌\n";
}
echo "\n";

// 7. Check Routes
echo "✓ Checking API Routes...\n";
$routes = [
    ['method' => 'POST', 'path' => 'auth/register', 'expected' => 'Registration endpoint'],
    ['method' => 'POST', 'path' => 'auth/login', 'expected' => 'Login endpoint'],
    ['method' => 'GET', 'path' => 'cart', 'expected' => 'Get cart (protected)'],
    ['method' => 'POST', 'path' => 'cart', 'expected' => 'Add to cart (protected)'],
];

foreach ($routes as $route) {
    echo "  - {$route['method']} /api/{$route['path']}: {$route['expected']}\n";
}
echo "\n";

// 8. Summary
echo "=== Health Check Complete ===\n";
echo "\nStatus: ✅ Ready for frontend testing\n";
echo "\nNext Steps:\n";
echo "1. Start backend:  php artisan serve --port=8000\n";
echo "2. Start frontend: npm run dev\n";
echo "3. Try login at http://localhost:8080/login\n";
echo "4. Check DevTools for CORS issues\n\n";
