<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    protected $table = 'users';
    protected $primaryKey = 'id_user';

    protected $fillable = [
        'nama',
        'email',
        'password',
        'role',
        'divisi',
        'is_active',
        'google_id',
        'microsoft_id',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    // ============================================
    // RELATIONSHIPS
    // ============================================

    // User membuat banyak room requests
    public function roomRequests()
    {
        return $this->hasMany(RoomRequest::class, 'id_user', 'id_user');
    }

    // User (GA) meng-assign banyak requests
    public function assignedRequests()
    {
        return $this->hasMany(RoomRequest::class, 'id_assigned_by', 'id_user');
    }

    // User (GA) membuat banyak bookings
    public function bookings()
    {
        return $this->hasMany(RoomBooking::class, 'booked_by', 'id_user');
    }

    // User (Admin Ruangan) mengelola banyak rooms
    public function managedRooms()
    {
        return $this->hasMany(Room::class, 'created_by', 'id_user');
    }

    // User menerima banyak notifications
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'id_user', 'id_user');
    }

    // User punya unread notifications
    public function unreadNotifications()
    {
        return $this->hasMany(Notification::class, 'id_user', 'id_user')
                    ->where('is_read', false)
                    ->orderBy('created_at', 'desc');
    }

    // User memiliki preference (one-to-one)
    public function preference()
    {
        return $this->hasOne(UserPreference::class, 'id_user', 'id_user');
    }

    // User melakukan banyak audit logs
    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class, 'user_id', 'id_user');
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    public function isAdminRuangan(): bool
    {
        return $this->role === 'admin_ruangan';
    }

    public function isGA(): bool
    {
        return $this->role === 'GA';
    }

    public function hasVerifiedEmail(): bool
    {
        return !is_null($this->email_verified_at);
    }

    // Auto create preference saat user dibuat
    protected static function booted()
    {
        static::created(function ($user) {
            $user->preference()->create([
                'notification_24h' => true,
                'notification_3h' => true,
                'notification_30m' => true,
                'email_notifications' => true,
            ]);
        });
    }

}
