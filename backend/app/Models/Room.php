<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $table = 'rooms';
    protected $primaryKey = 'id_room';

    protected $fillable = [
        'room_name',
        'capacity',
        'location',
        'description',
        'status',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'is_active' => 'boolean',
    ];

    // ============================================
    // RELATIONSHIPS
    // ============================================

    // Room dibuat oleh admin ruangan
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by', 'id_user');
    }

    // Room punya banyak bookings
    public function bookings()
    {
        return $this->hasMany(RoomBooking::class, 'id_room', 'id_room');
    }

    // Room punya active bookings (hari ini)
    public function activeBookings()
    {
        return $this->hasMany(RoomBooking::class, 'id_room', 'id_room')
                    ->whereDate('date', today())
                    ->orderBy('start_time');
    }

    // Room punya upcoming bookings
    public function upcomingBookings()
    {
        return $this->hasMany(RoomBooking::class, 'id_room', 'id_room')
                    ->where('date', '>=', today())
                    ->orderBy('date')
                    ->orderBy('start_time');
    }

    // ============================================
    // SCOPES
    // ============================================

    public function scopeAvailable($query)
    {
        return $query->where('status', 'available')
                     ->where('is_active', true);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCapacity($query, $minCapacity)
    {
        return $query->where('capacity', '>=', $minCapacity);
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    public function isAvailable(): bool
    {
        return $this->status === 'available' && $this->is_active;
    }

    public function isOccupied(): bool
    {
        return $this->status === 'occupied';
    }

    public function isMaintenance(): bool
    {
        return $this->status === 'maintenance' || !$this->is_active;
    }

    // Check apakah ruangan tersedia di waktu tertentu
    public function isAvailableAt($date, $startDate, $endDate, $excludeBookingId = null)
    {
        if (!$this->isAvailable()) {
            return false;
        }

        $query = $this->bookings()
            ->where('date', $date)
            ->where(function ($q) use ($startDate, $endDate) {
                $q->whereBetween('start_time', [$startDate, $endDate])
                  ->orWhereBetween('end_time', [$startDate, $endDate])
                  ->orWhere(function ($q2) use ($startDate, $endDate) {
                      $q2->where('start_time', '<=', $startDate)
                         ->where('end_time', '>=', $endDate);
                  });
            });

        if ($excludeBookingId) {
            $query->where('id_booking', '!=', $excludeBookingId);
        }

        return $query->count() === 0;
    }
}
