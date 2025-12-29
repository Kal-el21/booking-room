<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Prunable;

class Notification extends Model
{
    protected $table = 'notifications';
    protected $primaryKey = 'id_notification';
    use Prunable;

    protected $fillable = [
        'id_user',
        'id_booking',
        'title',
        'message',
        'type',
        'channel',
        'is_read',
        'read_at',
        'sent_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    // ============================================
    // RELATIONSHIPS
    // ============================================

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function booking()
    {
        return $this->belongsTo(RoomBooking::class, 'id_booking', 'id_booking');
    }

    // ============================================
    // SCOPES
    // ============================================

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('id_user', $userId);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    public function markAsRead()
    {
        $this->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    public function markAsUnread()
    {
        $this->update([
            'is_read' => false,
            'read_at' => null,
        ]);
    }

    public function prunable()
    {
        return static::where('created_at', '<=', now()->subDays(30));
    }
}
