<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Room::with('creator:id_user,name');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by active only
        if ($request->boolean('active_only')) {
            $query->active();
        }

        // Filter by capacity
        if ($request->has('min_capacity')) {
            $query->byCapacity($request->min_capacity);
        }

        // Search by name or location
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('room_name', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        $rooms = $query->orderBy('room_name')->get();

        return response()->json([
            'success' => true,
            'data' => $rooms,
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
            'room_name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:available,occupied,maintenance',
            'is_active' => 'boolean',
        ]);

        $validated['created_by'] = auth()->id();

        $room = Room::create($validated);

        // Log action
        AuditLog::log('create', 'rooms', $room->id_room, null, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Room created successfully',
            'data' => $room,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $room = Room::with(['creator', 'upcomingBookings.request.user'])
                    ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $room,
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
        $room = Room::findOrFail($id);

        $validated = $request->validate([
            'room_name' => 'string|max:255',
            'capacity' => 'integer|min:1',
            'location' => 'string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:available,occupied,maintenance',
            'is_active' => 'boolean',
        ]);

        $oldValues = $room->toArray();
        $room->update($validated);

        // Log action
        AuditLog::log('update', 'rooms', $room->id_room, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Room updated successfully',
            'data' => $room,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $room = Room::findOrFail($id);

        // Check if room has upcoming bookings
        $hasUpcomingBookings = $room->upcomingBookings()->exists();

        if ($hasUpcomingBookings) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete room with upcoming bookings',
            ], 422);
        }

        $oldValues = $room->toArray();
        $room->delete();

        // Log action
        AuditLog::log('delete', 'rooms', $room->id_room, $oldValues, null);

        return response()->json([
            'success' => true,
            'message' => 'Room deleted successfully',
        ]);
    }

    public function checkAvailability($id, Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $room = Room::findOrFail($id);

        $isAvailable = $room->isAvailableAt(
            $request->date,
            $request->start_time,
            $request->end_time
        );

        return response()->json([
            'success' => true,
            'data' => [
                'is_available' => $isAvailable,
                'room' => $room,
            ],
        ]);
    }
}
