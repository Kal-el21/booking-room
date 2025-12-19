<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\RoomRequestController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DashboardController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// ============================================
// PUBLIC ROUTES (No Authentication Required)
// ============================================

// Auth Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // OAuth Routes
    Route::get('/google', [AuthController::class, 'redirectToGoogle']);
    Route::get('/google/callback', [AuthController::class, 'handleGoogleCallback']);
    Route::get('/microsoft', [AuthController::class, 'redirectToMicrosoft']);
    Route::get('/microsoft/callback', [AuthController::class, 'handleMicrosoftCallback']);
});

// ============================================
// PROTECTED ROUTES (Require Authentication)
// ============================================

Route::middleware('auth:sanctum')->group(function () {

    // Auth Routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // ============================================
    // USER ROUTES (All Authenticated Users)
    // ============================================

    // User Profile & Preferences
    Route::get('/users/me', [UserController::class, 'show']);
    Route::put('/users/change-password', [UserController::class, 'changePassword']);
    Route::put('/users/preferences', [UserController::class, 'updatePreferences']);

    // Rooms (Read Only for Users)
    Route::get('/rooms', [RoomController::class, 'index']);
    Route::get('/rooms/{id}', [RoomController::class, 'show']);
    Route::get('/rooms/{id}/availability', [RoomController::class, 'checkAvailability']);

    // Room Requests (Users can create and manage their own)
    Route::get('/room-requests', [RoomRequestController::class, 'index']);
    Route::post('/room-requests', [RoomRequestController::class, 'store']);
    Route::get('/room-requests/{id}', [RoomRequestController::class, 'show']);
    Route::put('/room-requests/{id}', [RoomRequestController::class, 'update']);
    Route::delete('/room-requests/{id}', [RoomRequestController::class, 'destroy']);

    // Bookings (Read Only for Users)
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::get('/bookings/calendar', [BookingController::class, 'calendar']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::put('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);

    // ============================================
    // ADMIN RUANGAN ROUTES
    // ============================================

    Route::middleware('role:admin_ruangan,GA')->group(function () {
        // Room Management
        Route::post('/rooms', [RoomController::class, 'store']);
        Route::put('/rooms/{id}', [RoomController::class, 'update']);
        Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);
    });

    // ============================================
    // GA (General Affairs) ROUTES
    // ============================================

    Route::middleware('role:GA')->group(function () {
        // Approve/Reject Requests
        Route::post('/room-requests/{id}/approve', [RoomRequestController::class, 'approve']);
        Route::post('/room-requests/{id}/reject', [RoomRequestController::class, 'reject']);
        Route::get('/room-requests/{id}/available-rooms', [RoomRequestController::class, 'getAvailableRooms']);

        // Booking Management
        Route::delete('/bookings/{id}', [BookingController::class, 'destroy']);

        // User Management
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        // Advanced Dashboard
        Route::get('/dashboard/room-utilization', [DashboardController::class, 'getRoomUtilization']);
        Route::get('/dashboard/popular-rooms', [DashboardController::class, 'getPopularRooms']);
    });
});

// ============================================
// FALLBACK ROUTE
// ============================================

Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Route not found',
    ], 404);
});
