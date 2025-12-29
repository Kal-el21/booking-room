<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // GET /api/notifications - List user notifications
    public function index(Request $request)
    {
        $query = Notification::forUser(auth()->id())
                             ->with('booking.room');

        // Filter by read/unread
        if ($request->has('unread_only') && $request->boolean('unread_only')) {
            $query->unread();
        }

        // Filter by type
        if ($request->has('type')) {
            $query->byType($request->type);
        }

        $notifications = $query->orderBy('created_at', 'desc')
                               ->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ]);
    }

    // GET /api/notifications/unread-count
    public function unreadCount()
    {
        $count = Notification::forUser(auth()->id())
                             ->unread()
                             ->count();

        return response()->json([
            'success' => true,
            'data' => ['count' => $count],
        ]);
    }

    // PUT /api/notifications/{id}/mark-as-read
    public function markAsRead($id)
    {
        $notification = Notification::forUser(auth()->id())
                                    ->findOrFail($id);

        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read',
            'data' => $notification,
        ]);
    }

    // POST /api/notifications/mark-all-as-read
    public function markAllAsRead()
    {
        $notifications = Notification::forUser(auth()->id())
                                     ->unread()
                                     ->get();

        foreach ($notifications as $notification) {
            $notification->markAsRead();
        }

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read',
        ]);
    }

    // DELETE /api/notifications/{id}
    public function destroy($id)
    {
        $notification = Notification::forUser(auth()->id())
                                    ->findOrFail($id);

        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notification deleted',
        ]);
    }
}
