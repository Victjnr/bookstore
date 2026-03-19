<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrdersController extends Controller
{
    /**
     * List orders. Admins see all orders, users see only theirs.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Order::with(['user', 'items.book'])->latest();

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        $orders = $query->get()->map(function ($order) {
            return [
                'id' => 'ORD-' . str_pad($order->id, 3, '0', STR_PAD_LEFT),
                'user_id' => $order->user_id,
                'customer' => $order->user->name,
                'items' => $order->items->map(function ($item) {
                    return [
                        'book_id' => $item->book_id,
                        'title' => $item->book->title,
                        'quantity' => $item->quantity,
                        'price' => $item->price_cents / 100,
                    ];
                }),
                'total' => $order->total_cents / 100,
                'status' => $order->status,
                'payment_method' => $order->payment_method,
                'shipping_address' => $order->shipping_address,
                'created_at' => $order->created_at->toDateTimeString(),
            ];
        });

        return response()->json(['success' => true, 'data' => $orders]);
    }

    /**
     * Show a single order (admin can view any, user only their own)
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        $order = Order::with(['user', 'items.book'])->find($id);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        if ($user->role !== 'admin' && $order->user_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $payload = [
            'id' => 'ORD-' . str_pad($order->id, 3, '0', STR_PAD_LEFT),
            'customer' => $order->user->name,
            'items' => $order->items->map(function ($item) {
                return [
                    'book_id' => $item->book_id,
                    'title' => $item->book->title,
                    'quantity' => $item->quantity,
                    'price' => $item->price_cents / 100,
                ];
            }),
            'total' => $order->total_cents / 100,
            'status' => $order->status,
            'payment_method' => $order->payment_method,
            'shipping_address' => $order->shipping_address,
            'created_at' => $order->created_at->toDateTimeString(),
        ];

        return response()->json(['success' => true, 'data' => $payload]);
    }

    /**
     * Create an order from the authenticated user's cart
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // Load cart and items
        $cart = $user->cart()->with('items.book')->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['success' => false, 'message' => 'Cart is empty'], 400);
        }

        DB::beginTransaction();
        try {
            $totalCents = 0;
            foreach ($cart->items as $item) {
                $price = $item->book->price_cents;
                $totalCents += $price * $item->quantity;
            }

            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'total_cents' => $totalCents,
                'status' => 'paid', // assume payment is completed for now
                'payment_method' => $request->input('payment_method', 'card'),
                'shipping_address' => $request->input('shipping_address', $user->name . ', 123 Main St'),
            ]);

            // Create order items
            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'book_id' => $item->book_id,
                    'quantity' => $item->quantity,
                    'price_cents' => $item->book->price_cents,
                ]);
            }

            // Clear cart items
            $cart->items()->delete();

            DB::commit();

            return response()->json(['success' => true, 'message' => 'Order created', 'data' => ['order_id' => $order->id]]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Failed to create order: ' . $e->getMessage()], 500);
        }
    }
}
