<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

// Welcome
Route::get('/', fn() => view('welcome'));

// Prefer cookie-based CSRF for SPA: use sanctum's /sanctum/csrf-cookie OR set XSRF-TOKEN cookie.
// If you keep a custom endpoint, lock it to same-origin or restrict allowed origins in CORS.
Route::get('/csrf-token', function () {
    return response()->json([
        'csrf_token' => csrf_token(),
    ]);
})->middleware('throttle:30,1'); // rate-limit reads of this endpoint

// Public auth endpoints
Route::post('/auth/register', [AuthController::class, 'register'])
    ->middleware('throttle:10,1'); // throttle registration to avoid abuse

Route::post('/auth/login', [AuthController::class, 'login'])
    ->middleware('throttle:10,1'); // protect against brute-force

// Check auth status (doesn't require auth, checks if session exists)
Route::get('/auth/check', [AuthController::class, 'check']);

// Public book endpoints (no authentication required)
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{id}', [BookController::class, 'show']);
Route::get('/books/search', [BookController::class, 'search']);
Route::get('/books/genre/{genre}', [BookController::class, 'byGenre']);

// Public dashboard endpoints (for admin analytics - TODO: restrict with admin middleware)
Route::prefix('dashboard')->name('dashboard.')->group(function () {
    Route::get('/data', [DashboardController::class, 'getDashboardData'])->name('data');
    Route::get('/stats', [DashboardController::class, 'stats'])->name('stats');
    Route::get('/recent-orders', [DashboardController::class, 'recentOrders'])->name('recent-orders');
    Route::get('/top-sellers', [DashboardController::class, 'topSellers'])->name('top-sellers');
    Route::get('/sales-over-time', [DashboardController::class, 'salesOverTime'])->name('sales-over-time');
    Route::get('/orders-by-status', [DashboardController::class, 'ordersByStatus'])->name('orders-by-status');
    Route::get('/books-by-genre', [DashboardController::class, 'booksByGenre'])->name('books-by-genre');
});

/*
|--------------------------------------------------------------------------
| Protected (session-based)
|--------------------------------------------------------------------------
|
| - use 'auth:web' to require session
| - add 'verified' or role middleware if required
| - add throttle for sensitive endpoints where sensible
*/
Route::middleware(['auth:web', 'verified'])->group(function () {
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::post('/auth/logout', [AuthController::class, 'logout']); // POST + CSRF
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);

    // CART (scope actions clearly and enforce ownership in controller/policies)
    // Use explicit route names so you can reference policies or middlewares easily.
    Route::prefix('cart')->name('cart.')->group(function () {
        Route::get('/', [CartController::class, 'index'])->name('index');
        Route::post('/items', [CartController::class, 'store'])->name('store'); // add item
        Route::match(['put','patch'], '/items/{item}', [CartController::class, 'update'])
            ->name('update'); // update quantity (use route-model binding: CartItem $item)
        Route::delete('/items/{item}', [CartController::class, 'destroy'])->name('destroy');
        Route::delete('/', [CartController::class, 'clear'])->name('clear'); // clear cart
    });

    // ORDERS
    Route::prefix('orders')->name('orders.')->group(function () {
        Route::get('/', [\App\Http\Controllers\OrdersController::class, 'index'])->name('index');
        Route::post('/', [\App\Http\Controllers\OrdersController::class, 'store'])->name('store');
        Route::get('/{id}', [\App\Http\Controllers\OrdersController::class, 'show'])->name('show');
    });
});