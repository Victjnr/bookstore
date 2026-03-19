<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'cart_id',
        'book_id',
        'quantity',
    ];

    protected $casts = [
        'added_at' => 'datetime',
    ];

    /**
     * Get the cart that owns this item
     */
    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    /**
     * Get the book for this cart item
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }
}
