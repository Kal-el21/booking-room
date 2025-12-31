<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // GET /api/users - List users (GA/Admin only)
    public function index(Request $request)
    {
        $query = User::with('preference');

        // Filter by role
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        // Filter by active
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('division', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('name')->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    // GET /api/users/{id}
    public function show($id)
    {
        $user = User::with(['preference', 'roomRequests', 'managedRooms'])
                    ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    // PUT /api/users/{id} - Update user (Admin only atau user sendiri)
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Check authorization
        if (auth()->id() !== (int)$id && !auth()->user()->isRoomAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'string|max:255',
            'division' => 'nullable|string|max:255',
            'email' => 'email|unique:users,email,' . $id . ',id_user',
        ]);

        // Only Room Admin can update role and is_active
        if (auth()->user()->isRoomAdmin()) {
            if ($request->has('role')) {
                $validated['role'] = $request->validate([
                    'role' => 'in:user,room_admin,GA'
                ])['role'];
            }
            if ($request->has('is_active')) {
                $validated['is_active'] = $request->validate([
                    'is_active' => 'boolean'
                ])['is_active'];
            }
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'data' => $user,
        ]);
    }

    // PUT /api/users/change-password - Change own password
    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = auth()->user();

        // Check current password
        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully',
        ]);
    }

    // PUT /api/users/preferences - Update user preferences
    public function updatePreferences(Request $request)
    {
        $validated = $request->validate([
            'notification_24h' => 'boolean',
            'notification_3h' => 'boolean',
            'notification_30m' => 'boolean',
            'email_notifications' => 'boolean',
        ]);

        $user = auth()->user();
        $user->preference->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Preferences updated successfully',
            'data' => $user->preference,
        ]);
    }

    // DELETE /api/users/{id} - Soft delete user (GA only)
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Cannot delete self
        if (auth()->id() === (int)$id) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete your own account',
            ], 422);
        }

        // Check if user has upcoming bookings
        $hasUpcomingBookings = $user->roomRequests()
                                    ->whereIn('status', ['pending', 'approved'])
                                    ->where('date', '>=', today())
                                    ->exists();

        if ($hasUpcomingBookings) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete user with upcoming bookings',
            ], 422);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully',
        ]);
    }
}
