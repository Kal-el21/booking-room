<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $table = 'rooms';
    protected $primaryKey = 'id_room';

    protected $fillable = [
        'nama_ruangan',
        'kapasitas',
        'lokasi',
        'deskripsi',
        'status',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'kapasitas' => 'integer',
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
                    ->whereDate('tanggal', today())
                    ->orderBy('jam_mulai');
    }

    // Room punya upcoming bookings
    public function upcomingBookings()
    {
        return $this->hasMany(RoomBooking::class, 'id_room', 'id_room')
                    ->where('tanggal', '>=', today())
                    ->orderBy('tanggal')
                    ->orderBy('jam_mulai');
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
        return $query->where('kapasitas', '>=', $minCapacity);
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
    public function isAvailableAt($tanggal, $jamMulai, $jamSelesai, $excludeBookingId = null)
    {
        if (!$this->isAvailable()) {
            return false;
        }

        $query = $this->bookings()
            ->where('tanggal', $tanggal)
            ->where(function ($q) use ($jamMulai, $jamSelesai) {
                $q->whereBetween('jam_mulai', [$jamMulai, $jamSelesai])
                  ->orWhereBetween('jam_selesai', [$jamMulai, $jamSelesai])
                  ->orWhere(function ($q2) use ($jamMulai, $jamSelesai) {
                      $q2->where('jam_mulai', '<=', $jamMulai)
                         ->where('jam_selesai', '>=', $jamSelesai);
                  });
            });

        if ($excludeBookingId) {
            $query->where('id_booking', '!=', $excludeBookingId);
        }

        return $query->count() === 0;
    }
}
