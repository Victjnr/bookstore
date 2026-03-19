<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Book;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Get the authenticated user's cart with items
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $cart = $user->cart()->with('items.book')->first();

        if (!$cart) {
            // Create a new cart if it doesn't exist
            $cart = Cart::create(['user_id' => $user->id]);
        }

        return response()->json([
            'success' => true,
            'cart' => [
                'id' => $cart->id,
                'items' => $cart->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'book_id' => $item->book_id,
                        'quantity' => $item->quantity,
                        'book' => [
                            'id' => $item->book->id,
                            'title' => $item->book->title,
                            'price' => $item->book->price_cents / 100, // Convert cents to dollars
                            'cover' => $item->book->cover_image ?? '',
                            'author' => $item->book->author ?? '',
                        ],
                    ];
                }),
            ],
        ]);
    }

    /**
     * Add an item to cart
     */
    public function store(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();
        $cart = $user->cart()->firstOrCreate(['user_id' => $user->id]);

        $existingItem = CartItem::where('cart_id', $cart->id)
            ->where('book_id', $request->book_id)
            ->first();

        if ($existingItem) {
            $existingItem->increment('quantity', $request->quantity);
            $item = $existingItem;
        } else {
            $item = CartItem::create([
                'cart_id' => $cart->id,
                'book_id' => $request->book_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Item added to cart',
            'item' => $item,
        ]);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $item = CartItem::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found',
            ], 404);
        }

        // Verify the item belongs to the authenticated user's cart
        if ($item->cart->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        if ($request->quantity <= 0) {
            $item->delete();
            return response()->json([
                'success' => true,
                'message' => 'Item removed from cart',
            ]);
        }

        $item->update(['quantity' => $request->quantity]);

        return response()->json([
            'success' => true,
            'message' => 'Cart updated',
            'item' => $item,
        ]);
    }

    /**
     * Remove an item from cart
     */
    public function destroy(Request $request, string $id)
    {
        $item = CartItem::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found',
            ], 404);
        }

        // Verify the item belongs to the authenticated user's cart
        if ($item->cart->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart',
        ]);
    }

    /**
     * Clear all items from cart
     */
    public function clear(Request $request)
    {
        $cart = $request->user()->cart();
        if ($cart) {
            $cart->items()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared',
        ]);
    }
}
