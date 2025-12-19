<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomBooking extends Model
{
    protected $table = 'room_bookings';
    protected $primaryKey = 'id_booking';

    protected $fillable = [
        'id_request',
        'id_room',
        'booked_by',
        'tanggal',
        'jam_mulai',
        'jam_selesai',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    // ============================================
    // RELATIONSHIPS
    // ============================================

    // Booking dari request
    public function request()
    {
        return $this->belongsTo(RoomRequest::class, 'id_request', 'id_request');
    }

    // Booking menggunakan room
    public function room()
    {
        return $this->belongsTo(Room::class, 'id_room', 'id_room');
    }

    // Booking dibuat oleh GA
    public function bookedBy()
    {
        return $this->belongsTo(User::class, 'booked_by', 'id_user');
    }

    // Booking punya notifications
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'id_booking', 'id_booking');
    }

    // Booking punya notification schedules
    public function notificationSchedules()
    {
        return $this->hasMany(NotificationSchedule::class, 'id_booking', 'id_booking');
    }

    // ============================================
    // SCOPES
    // ============================================

    public function scopeToday($query)
    {
        return $query->whereDate('tanggal', today());
    }

    public function scopeUpcoming($query)
    {
        return $query->where('tanggal', '>=', today());
    }

    public function scopeByRoom($query, $roomId)
    {
        return $query->where('id_room', $roomId);
    }

    public function scopeByDate($query, $date)
    {
        return $query->whereDate('tanggal', $date);
    }

    public function scopeBetweenDates($query, $startDate, $endDate)
    {
        return $query->whereBetween('tanggal', [$startDate, $endDate]);
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    public function isToday(): bool
    {
        return $this->tanggal->isToday();
    }

    public function isPast(): bool
    {
        return $this->tanggal->isPast();
    }

    public function isUpcoming(): bool
    {
        return $this->tanggal->isFuture();
    }

    public function isHappening(): bool
    {
        if (!$this->isToday()) {
            return false;
        }

        $now = now()->format('H:i:s');
        return $now >= $this->jam_mulai && $now <= $this->jam_selesai;
    }

    // Get user yang booking (dari request)
    public function getUser()
    {
        return $this->request->user ?? null;
    }
}
