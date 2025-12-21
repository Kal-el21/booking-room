<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Room;
use App\Models\RoomRequest;
use Illuminate\Http\Request;

class RoomRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index( Request $request )
    {
        $query = RoomRequest::with(['user:id_user,nama,email,divisi', 'assignedBy:id_user,nama', 'booking.room']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by user (untuk user melihat request sendiri)
        if ($request->has('my_requests') && $request->boolean('my_requests')) {
            $query->where('id_user', auth()->id());
        }

        // Filter by date
        if ($request->has('date')) {
            $query->byDate($request->date);
        }

        // Only upcoming
        if ($request->boolean('upcoming_only')) {
            $query->upcoming();
        }

        $requests = $query->orderBy('tanggal')->orderBy('jam_mulai')->get();

        return response()->json([
            'success' => true,
            'data' => $requests,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_peminjam' => 'required|string|max:255',
            'kapasitas_dibutuhkan' => 'required|integer|min:1',
            'kebutuhan' => 'required|string',
            'notes' => 'nullable|string',
            'tanggal' => 'required|date|after_or_equal:today',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
        ]);

        $validated['id_user'] = auth()->id();
        $validated['status'] = 'pending';

        $roomRequest = RoomRequest::create($validated);

        // Log action
        AuditLog::log('create', 'room_requests', $roomRequest->id_request, null, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Room request submitted successfully',
            'data' => $roomRequest->load('user'),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $request = RoomRequest::with(['user', 'assignedBy', 'booking.room'])
                              ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $request,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $roomRequest = RoomRequest::findOrFail($id);

        // Check authorization
        if ($roomRequest->id_user !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        // Can only update if pending
        if (!$roomRequest->isPending()) {
            return response()->json([
                'success' => false,
                'message' => 'Can only update pending requests',
            ], 422);
        }

        $validated = $request->validate([
            'nama_peminjam' => 'string|max:255',
            'kapasitas_dibutuhkan' => 'integer|min:1',
            'kebutuhan' => 'string',
            'notes' => 'nullable|string',
            'tanggal' => 'date|after_or_equal:today',
            'jam_mulai' => 'date_format:H:i',
            'jam_selesai' => 'date_format:H:i|after:jam_mulai',
        ]);

        $oldValues = $roomRequest->toArray();
        $roomRequest->update($validated);

        // Log action
        AuditLog::log('update', 'room_requests', $roomRequest->id_request, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Request updated successfully',
            'data' => $roomRequest,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $roomRequest = RoomRequest::findOrFail($id);

        // Check authorization
        if ($roomRequest->id_user !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        if (!$roomRequest->canBeCancelled()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot cancel this request',
            ], 422);
        }

        $oldValues = $roomRequest->toArray();
        $roomRequest->update(['status' => 'cancelled']);

        // If has booking, delete it
        if ($roomRequest->booking) {
            $roomRequest->booking->delete();
        }

        // Log action
        AuditLog::log('cancel', 'room_requests', $roomRequest->id_request, $oldValues, ['status' => 'cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'Request cancelled successfully',
        ]);
    }

    // POST /api/room-requests/{id}/approve - Approve request (GA only)
    public function approve($id, Request $request)
    {
        $validated = $request->validate([
            'id_room' => 'required|exists:rooms,id_room',
        ]);

        $roomRequest = RoomRequest::findOrFail($id);

        if (!$roomRequest->canBeApproved()) {
            return response()->json([
                'success' => false,
                'message' => 'Request cannot be approved',
            ], 422);
        }

        $room = Room::findOrFail($validated['id_room']);

        if (!$room->isAvailableAt($roomRequest->tanggal, $roomRequest->jam_mulai, $roomRequest->jam_selesai)) {
            return response()->json([
                'success' => false,
                'message' => 'Room is not available at the requested time',
            ], 422);
        }

        $roomRequest->update([
            'status' => 'approved',
            'id_assigned_by' => auth()->id(),
        ]);

        $booking = $roomRequest->booking()->create([
            'id_room' => $room->id_room,
            'booked_by' => auth()->id(),
            'tanggal' => $roomRequest->tanggal,
            'jam_mulai' => $roomRequest->jam_mulai,
            'jam_selesai' => $roomRequest->jam_selesai,
        ]);

        AuditLog::log('approve', 'room_requests', $roomRequest->id_request,
            ['status' => 'pending'],
            ['status' => 'approved', 'id_assigned_by' => auth()->id()]
        );

        // ✅ DISPATCH JOB - SendBookingConfirmationJob
        \App\Jobs\SendBookingConfirmationJob::dispatch($booking);

        return response()->json([
            'success' => true,
            'message' => 'Request approved successfully',
            'data' => $roomRequest->load(['booking.room', 'assignedBy']),
        ]);
    }


    // public function approve($id, Request $request)
    // {
    //     $validated = $request->validate([
    //         'id_room' => 'required|exists:rooms,id_room',
    //     ]);

    //     $roomRequest = RoomRequest::findOrFail($id);

    //     if (!$roomRequest->canBeApproved()) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Request cannot be approved',
    //         ], 422);
    //     }

    //     $room = Room::findOrFail($validated['id_room']);

    //     // Check room availability
    //     if (!$room->isAvailableAt($roomRequest->tanggal, $roomRequest->jam_mulai, $roomRequest->jam_selesai)) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Room is not available at the requested time',
    //         ], 422);
    //     }

    //     // Update request
    //     $roomRequest->update([
    //         'status' => 'approved',
    //         'id_assigned_by' => auth()->id(),
    //     ]);

    //     // Create booking
    //     $booking = $roomRequest->booking()->create([
    //         'id_room' => $room->id_room,
    //         'booked_by' => auth()->id(),
    //         'tanggal' => $roomRequest->tanggal,
    //         'jam_mulai' => $roomRequest->jam_mulai,
    //         'jam_selesai' => $roomRequest->jam_selesai,
    //     ]);

    //     // Update room status (akan di-handle di observer/job)
    //     // $room->update(['status' => 'occupied']);

    //     // Log action
    //     AuditLog::log('approve', 'room_requests', $roomRequest->id_request,
    //         ['status' => 'pending'],
    //         ['status' => 'approved', 'id_assigned_by' => auth()->id()]
    //     );

    //     // TODO: Create notification & schedule
    //     // TODO: Send email notification

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Request approved successfully',
    //         'data' => $roomRequest->load(['booking.room', 'assignedBy']),
    //     ]);
    // }

    // POST /api/room-requests/{id}/reject - Reject request (GA only)
    public function reject($id, Request $request)
    {
        $validated = $request->validate([
            'rejected_reason' => 'required|string',
        ]);

        $roomRequest = RoomRequest::findOrFail($id);

        if (!$roomRequest->isPending()) {
            return response()->json([
                'success' => false,
                'message' => 'Can only reject pending requests',
            ], 422);
        }

        $roomRequest->update([
            'status' => 'rejected',
            'id_assigned_by' => auth()->id(),
            'rejected_reason' => $validated['rejected_reason'],
        ]);

        AuditLog::log('reject', 'room_requests', $roomRequest->id_request,
            ['status' => 'pending'],
            ['status' => 'rejected', 'rejected_reason' => $validated['rejected_reason']]
        );

        // ✅ DISPATCH JOB - SendBookingRejectedJob
        \App\Jobs\SendBookingRejectedJob::dispatch($roomRequest->load(['user', 'assignedBy']));

        return response()->json([
            'success' => true,
            'message' => 'Request rejected',
            'data' => $roomRequest,
        ]);
    }

    // public function reject($id, Request $request)
    // {
    //     $validated = $request->validate([
    //         'rejected_reason' => 'required|string',
    //     ]);

    //     $roomRequest = RoomRequest::findOrFail($id);

    //     if (!$roomRequest->isPending()) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Can only reject pending requests',
    //         ], 422);
    //     }

    //     $roomRequest->update([
    //         'status' => 'rejected',
    //         'id_assigned_by' => auth()->id(),
    //         'rejected_reason' => $validated['rejected_reason'],
    //     ]);

    //     // Log action
    //     AuditLog::log('reject', 'room_requests', $roomRequest->id_request,
    //         ['status' => 'pending'],
    //         ['status' => 'rejected', 'rejected_reason' => $validated['rejected_reason']]
    //     );

    //     // TODO: Send notification to user

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Request rejected',
    //         'data' => $roomRequest,
    //     ]);
    // }

    // GET /api/room-requests/{id}/available-rooms - Get available rooms for request
    public function getAvailableRooms($id)
    {
        $roomRequest = RoomRequest::findOrFail($id);

        $rooms = Room::available()
                     ->byCapacity($roomRequest->kapasitas_dibutuhkan)
                     ->get()
                     ->filter(function ($room) use ($roomRequest) {
                         return $room->isAvailableAt(
                             $roomRequest->tanggal,
                             $roomRequest->jam_mulai,
                             $roomRequest->jam_selesai
                         );
                     })
                     ->values();

        return response()->json([
            'success' => true,
            'data' => $rooms,
        ]);
    }
}
