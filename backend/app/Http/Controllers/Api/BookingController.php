<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RoomBooking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    // GET /api/bookings - List all bookings
    public function index(Request $request)
    {
        $query = RoomBooking::with(['room', 'request.user', 'bookedBy']);

        // Filter by room
        if ($request->has('room_id')) {
            $query->byRoom($request->room_id);
        }

        // Filter by date
        if ($request->has('date')) {
            $query->byDate($request->date);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->betweenDates($request->start_date, $request->end_date);
        }

        // Only upcoming
        if ($request->boolean('upcoming_only')) {
            $query->upcoming();
        }

        // Only today
        if ($request->boolean('today_only')) {
            $query->today();
        }

        $bookings = $query->orderBy('date')->orderBy('start_time')->get();

        return response()->json([
            'success' => true,
            'data' => $bookings,
        ]);
    }

    // GET /api/bookings/calendar - Get bookings untuk calendar view
    public function calendar(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'room_id' => 'nullable|exists:rooms,id_room',
        ]);

        $query = RoomBooking::with(['room', 'request.user'])
                            ->betweenDates($request->start_date, $request->end_date);

        if ($request->has('room_id')) {
            $query->byRoom($request->room_id);
        }

        $bookings = $query->orderBy('date')->orderBy('start_time')->get();

        // Format untuk FullCalendar
        $events = $bookings->map(function ($booking) {
            return [
                'id' => $booking->id_booking,
                'title' => $booking->request->borrower_name . ' - ' . $booking->room->room_name,
                'start' => $booking->date->format('Y-m-d') . 'T' . $booking->start_time,
                'end' => $booking->date->format('Y-m-d') . 'T' . $booking->end_time,
                'resourceId' => $booking->id_room,
                'extendedProps' => [
                    'room_name' => $booking->room->room_name,
                    'user_name' => $booking->request->user->name,
                    'user_email' => $booking->request->user->email,
                    'division' => $booking->request->user->division,
                    'purpose' => $booking->request->purpose,
                ],
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $events,
        ]);
    }

    // GET /api/bookings/{id}
    public function show($id)
    {
        $booking = RoomBooking::with(['room', 'request.user', 'bookedBy'])
                              ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $booking,
        ]);
    }

    // DELETE /api/bookings/{id} - Cancel booking (GA only)
    public function destroy($id)
    {
        $booking = RoomBooking::with(['request.user', 'room'])->findOrFail($id);

        if ($booking->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot cancel past bookings',
            ], 422);
        }

        // Collect data sebelum delete
        $bookingData = [
            'room_name' => $booking->room->room_name,
            'date' => $booking->date->format('d/m/Y'),
            'start_time' => $booking->start_time,
            'end_time' => $booking->end_time,
        ];

        $userId = $booking->request->user->id_user;
        $cancelledBy = auth()->user()->name;

        // Update request status
        $booking->request->update(['status' => 'cancelled']);

        // Delete notification schedules
        $booking->notificationSchedules()->delete();

        $booking->delete();

        // ✅ DISPATCH JOB - SendBookingCancellationJob
        \App\Jobs\SendBookingCancellationJob::dispatch($userId, $bookingData, $cancelledBy);

        return response()->json([
            'success' => true,
            'message' => 'Booking cancelled successfully',
        ]);
    }

    // public function destroy($id)
    // {
    //     $booking = RoomBooking::findOrFail($id);

    //     // Check if past
    //     if ($booking->isPast()) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Cannot cancel past bookings',
    //         ], 422);
    //     }

    //     // Update request status
    //     $booking->request->update(['status' => 'cancelled']);

    //     // Delete notification schedules
    //     $booking->notificationSchedules()->delete();

    //     $booking->delete();

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Booking cancelled successfully',
    //     ]);
    // }
}
