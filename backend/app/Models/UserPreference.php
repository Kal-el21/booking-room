<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    protected $table = 'user_preferences';
    protected $primaryKey = 'id_preference';

    protected $fillable = [
        'id_user',
        'notification_24h',
        'notification_3h',
        'notification_30m',
        'email_notifications',
    ];

    protected $casts = [
        'notification_24h' => 'boolean',
        'notification_3h' => 'boolean',
        'notification_30m' => 'boolean',
        'email_notifications' => 'boolean',
    ];

    // ============================================
    // RELATIONSHIPS
    // ============================================

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    public function shouldNotify($type): bool
    {
        switch ($type) {
            case '24h_before':
                return $this->notification_24h;
            case '3h_before':
                return $this->notification_3h;
            case '30m_before':
                return $this->notification_30m;
            default:
                return false;
        }
    }

    public function canSendEmail(): bool
    {
        return $this->email_notifications;
    }
}
