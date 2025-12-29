<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\RoomBooking;
use App\Models\RoomRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    // GET /api/dashboard/stats - Get dashboard statistics
    public function getStats()
    {
        $user = auth()->user();

        if ($user->isUser()) {
            return $this->getUserStats($user);
        } elseif ($user->isRoomAdmin()) {
            return $this->getRoomAdminStats($user);
        } elseif ($user->isGA()) {
            return $this->getGAStats();
        }
    }

    private function getUserStats($user)
    {
        $stats = [
            'total_requests' => $user->roomRequests()->count(),
            'pending_requests' => $user->roomRequests()->pending()->count(),
            'approved_requests' => $user->roomRequests()->approved()->count(),
            'upcoming_bookings' => RoomBooking::whereHas('request', function ($q) use ($user) {
                $q->where('id_user', $user->id_user);
            })->upcoming()->count(),
        ];

        // Upcoming bookings detail
        $upcomingBookings = RoomBooking::whereHas('request', function ($q) use ($user) {
                $q->where('id_user', $user->id_user);
            })
            ->upcoming()
            ->with(['room', 'request'])
            ->orderBy('date')
            ->orderBy('start_time')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'upcoming_bookings' => $upcomingBookings,
            ],
        ]);
    }

    private function getRoomAdminStats($user)
    {
        $stats = [
            'total_rooms' => $user->managedRooms()->count(),
            'available_rooms' => $user->managedRooms()->available()->count(),
            'occupied_rooms' => $user->managedRooms()->where('status', 'occupied')->count(),
            'maintenance_rooms' => $user->managedRooms()->where('status', 'maintenance')->count(),
        ];

        // Rooms with today's bookings
        $roomsToday = $user->managedRooms()
                           ->with(['activeBookings.request.user'])
                           ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'rooms_today' => $roomsToday,
            ],
        ]);
    }

    private function getGAStats()
    {
        $stats = [
            'total_rooms' => Room::count(),
            'available_rooms' => Room::available()->count(),
            'pending_requests' => RoomRequest::pending()->count(),
            'today_bookings' => RoomBooking::today()->count(),
            'upcoming_bookings' => RoomBooking::upcoming()->count(),
        ];

        // Pending requests for GA
        $pendingRequests = RoomRequest::pending()
                                      ->upcoming()
                                      ->with(['user'])
                                      ->orderBy('date')
                                      ->orderBy('start_time')
                                      ->limit(10)
                                      ->get();

        // Room utilization (bookings today)
        $todayBookings = RoomBooking::today()
                                    ->with(['room', 'request.user'])
                                    ->orderBy('start_time')
                                    ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'pending_requests' => $pendingRequests,
                'today_bookings' => $todayBookings,
            ],
        ]);
    }

    // GET /api/dashboard/room-utilization - Get room utilization stats
    public function getRoomUtilization(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $startDate = $request->get('start_date', Carbon::now()->startOfMonth());
        $endDate = $request->get('end_date', Carbon::now()->endOfMonth());

        $rooms = Room::with([
            'bookings' => function ($query) use ($startDate, $endDate) {
                $query->betweenDates($startDate, $endDate);
            }
        ])->get();

        $utilization = $rooms->map(function ($room) use ($startDate, $endDate) {
            $totalBookings = $room->bookings->count();

            // Calculate total booked hours
            $totalHours = $room->bookings->sum(function ($booking) {
                $start = Carbon::parse($booking->start_time);
                $end = Carbon::parse($booking->end_time);
                return $start->diffInHours($end);
            });

            // Calculate working days in period
            $workingDays = Carbon::parse($startDate)
                                 ->diffInDaysFiltered(function (Carbon $date) {
                                     return $date->isWeekday();
                                 }, Carbon::parse($endDate));

            // Assume 8 working hours per day
            $availableHours = $workingDays * 8;
            $utilizationRate = $availableHours > 0 ? ($totalHours / $availableHours) * 100 : 0;

            return [
                'room_id' => $room->id_room,
                'room_name' => $room->room_name,
                'total_bookings' => $totalBookings,
                'total_hours' => $totalHours,
                'utilization_rate' => round($utilizationRate, 2),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $utilization,
        ]);
    }

    // GET /api/dashboard/popular-rooms - Get most booked rooms
    public function getPopularRooms(Request $request)
    {
        $limit = $request->get('limit', 5);

        $popularRooms = Room::withCount([
            'bookings' => function ($query) {
                $query->where('date', '>=', Carbon::now()->subMonth());
            }
        ])
        ->orderBy('bookings_count', 'desc')
        ->limit($limit)
        ->get();

        return response()->json([
            'success' => true,
            'data' => $popularRooms,
        ]);
    }
}
