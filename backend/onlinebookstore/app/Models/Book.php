<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'title',
        'author',
        'price_cents',
        'original_price_cents',
        'cover_image',
        'rating',
        'reviews',
        'genre',
        'description',
        'pages',
        'published',
        'isbn',
        'in_stock',
    ];

    protected $casts = [
        'price_cents' => 'integer',
        'original_price_cents' => 'integer',
        'rating' => 'float',
        'reviews' => 'integer',
        'pages' => 'integer',
        'in_stock' => 'boolean',
    ];

    /**
     * Get the price in dollars
     */
    public function getPriceAttribute()
    {
        return $this->price_cents / 100;
    }

    /**
     * Get cart items for this book
     */
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Get order items for this book (sales)
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
