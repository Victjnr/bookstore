<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function stats(): JsonResponse
    {
        $totalBooks = Book::count();
        $activeOrders = Order::whereIn('status', ['pending', 'shipped'])->count();
        $totalCustomers = User::count();
        $totalRevenue = Order::where('status', '!=', 'cancelled')->sum('total_cents') / 100;

        return response()->json([
            'success' => true,
            'data' => [
                'total_books' => $totalBooks,
                'active_orders' => $activeOrders,
                'total_customers' => $totalCustomers,
                'total_revenue' => number_format($totalRevenue, 2),
            ],
        ]);
    }

    /**
     * Get recent orders with customer and book details
     */
    public function recentOrders(): JsonResponse
    {
        $orders = Order::with(['user', 'items.book'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($order) => [
                'id' => 'ORD-' . str_pad($order->id, 3, '0', STR_PAD_LEFT),
                'customer' => $order->user->name,
                'book' => $order->items->first()?->book->title ?? 'Multiple Books',
                'amount' => '$' . number_format($order->total_cents / 100, 2),
                'status' => $order->status,
            ]);

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    /**
     * Get top-selling books
     */
    public function topSellers(): JsonResponse
    {
        $topBooks = OrderItem::select('book_id')
            ->selectRaw('SUM(quantity) as total_sales')
            ->selectRaw('AVG(price_cents) as avg_price')
            ->where('created_at', '>=', now()->subMonth())
            ->groupBy('book_id')
            ->orderByDesc('total_sales')
            ->take(4)
            ->with('book')
            ->get()
            ->map(function ($orderItem) {
                $book = $orderItem->book;
                return [
                    'title' => $book->title,
                    'author' => $book->author,
                    'rating' => $book->rating,
                    'sales' => $orderItem->total_sales,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $topBooks,
        ]);
    }

    /**
     * Sales over time (last 30 days) - returns date => total
     */
    public function salesOverTime(): JsonResponse
    {
        $sales = Order::selectRaw("DATE(created_at) as day, SUM(total_cents) as total_cents")
            ->where('created_at', '>=', now()->subDays(30))
            ->where('status', '!=', 'cancelled')
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->mapWithKeys(function ($row) {
                return [$row->day => number_format($row->total_cents / 100, 2)];
            });

        return response()->json(['success' => true, 'data' => $sales]);
    }

    /**
     * Orders by status - useful for analytics widgets
     */
    public function ordersByStatus(): JsonResponse
    {
        $counts = Order::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($row) {
                return [$row->status => $row->count];
            });

        return response()->json(['success' => true, 'data' => $counts]);
    }

    /**
     * Books sold by genre (last 30 days)
     */
    public function booksByGenre(): JsonResponse
    {
        $byGenre = DB::table('order_items')
            ->join('books', 'order_items.book_id', '=', 'books.id')
            ->select('books.genre', DB::raw('SUM(order_items.quantity) as sold'))
            ->where('order_items.created_at', '>=', now()->subDays(30))
            ->groupBy('books.genre')
            ->orderByDesc('sold')
            ->get()
            ->mapWithKeys(function ($row) {
                return [$row->genre ?? 'Unknown' => (int) $row->sold];
            });

        return response()->json(['success' => true, 'data' => $byGenre]);
    }

    /**
     * Get all dashboard data at once
     */
    public function getDashboardData(): JsonResponse
    {
        $stats = $this->stats()->getData(true)['data'];
        $recentOrders = $this->recentOrders()->getData(true)['data'];
        $topSellers = $this->topSellers()->getData(true)['data'];

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'recent_orders' => $recentOrders,
                'top_sellers' => $topSellers,
            ],
        ]);
    }
}
