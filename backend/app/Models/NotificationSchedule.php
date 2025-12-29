<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationSchedule extends Model
{
    protected $table = 'notification_schedules';
    protected $primaryKey = 'id_schedule';

    protected $fillable = [
        'id_booking',
        'notify_type',
        'notify_at',
        'channel',
        'is_sent',
        'sent_at',
    ];

    protected $casts = [
        'notify_at' => 'datetime',
        'is_sent' => 'boolean',
        'sent_at' => 'datetime',
    ];

    // ============================================
    // RELATIONSHIPS
    // ============================================

    public function booking()
    {
        return $this->belongsTo(RoomBooking::class, 'id_booking', 'id_booking');
    }

    // ============================================
    // SCOPES
    // ============================================

    public function scopePending($query)
    {
        return $query->where('is_sent', false);
    }

    public function scopeDue($query)
    {
        return $query->where('is_sent', false)
                     ->where('notify_at', '<=', now());
    }

    public function scopeSent($query)
    {
        return $query->where('is_sent', true);
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    public function markAsSent()
    {
        $this->update([
            'is_sent' => true,
            'sent_at' => now(),
        ]);
    }

    public function isDue(): bool
    {
        return !$this->is_sent && $this->notify_at <= now();
    }
}
