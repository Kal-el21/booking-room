<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomRequest extends Model
{
    protected $table = 'room_requests';
    protected $primaryKey = 'id_request';

    protected $fillable = [
        'id_user',
        'nama_peminjam',
        'kapasitas_dibutuhkan',
        'kebutuhan',
        'notes',
        'tanggal',
        'jam_mulai',
        'jam_selesai',
        'status',
        'id_assigned_by',
        'rejected_reason',
    ];

    protected $casts = [
        'kapasitas_dibutuhkan' => 'integer',
        'tanggal' => 'date',
    ];

    // ============================================
    // RELATIONSHIPS
    // ============================================

    // Request dibuat oleh user
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    // Request di-assign oleh GA
    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'id_assigned_by', 'id_user');
    }

    // Request punya booking (one-to-one)
    public function booking()
    {
        return $this->hasOne(RoomBooking::class, 'id_request', 'id_request');
    }

    // ============================================
    // SCOPES
    // ============================================

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('tanggal', '>=', today());
    }

    public function scopeByDate($query, $date)
    {
        return $query->whereDate('tanggal', $date);
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    public function canBeApproved(): bool
    {
        return $this->isPending() && $this->tanggal >= today();
    }

    public function canBeCancelled(): bool
    {
        return $this->isPending() || ($this->isApproved() && $this->tanggal >= today());
    }
}
