<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'division' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'division' => $validated['division'] ?? null,
            'role' => 'user',
        ]);

        // Send verification email (optional)
        // $user->sendEmailVerificationNotification();

        // $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            'data' => [
                'user' => $user,
                // 'token' => $token,
            ]
        ], 201);
    }

    // Login dengan email & password
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Your account is inactive. Please contact administrator.',
            ], 403);
        }

        // ✅ CHECK IF EMAIL VERIFIED (OPTIONAL)
        // if (!$user->hasVerifiedEmail()) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Please verify your email address before logging in.',
        //         'needs_verification' => true,
        //     ], 403);
        // }

        // Delete old tokens
        $user->tokens()->delete();

        $token = $user->createToken(
            'token-name', ['*'], now()->plus(weeks: 1)
        )->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $user->load('preference'),
                'token' => $token,
            ]
        ]);
    }

    // Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout successful',
        ]);
    }

    // Get current user
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()->load('preference'),
        ]);
    }

    // ============================================
    // OAUTH GOOGLE
    // ============================================

    // Redirect ke Google
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    // Callback dari Google
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::where('email', $googleUser->email)->first();

            if ($user) {
                // Update google_id jika belum ada
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleUser->id]);
                }
            } else {
                // Create new user
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'email_verified_at' => now(),
                    'role' => 'user',
                ]);
            }

            // Check if active
            if (!$user->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your account is inactive.',
                ], 403);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            // Redirect ke frontend dengan token
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect()->away("{$frontendUrl}/auth/callback?token={$token}");

        } catch (\Exception $e) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect()->away("{$frontendUrl}/auth/error?message=" . urlencode($e->getMessage()));
        }
    }

    // ============================================
    // OAUTH MICROSOFT
    // ============================================

    public function redirectToMicrosoft()
    {
        return Socialite::driver('microsoft')->stateless()->redirect();
    }

    public function handleMicrosoftCallback()
    {
        try {
            $microsoftUser = Socialite::driver('microsoft')->stateless()->user();

            $user = User::where('email', $microsoftUser->email)->first();

            if ($user) {
                if (!$user->microsoft_id) {
                    $user->update(['microsoft_id' => $microsoftUser->id]);
                }
            } else {
                $user = User::create([
                    'name' => $microsoftUser->name,
                    'email' => $microsoftUser->email,
                    'microsoft_id' => $microsoftUser->id,
                    'email_verified_at' => now(),
                    'role' => 'user',
                ]);
            }

            if (!$user->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your account is inactive.',
                ], 403);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect()->away("{$frontendUrl}/auth/callback?token={$token}");

        } catch (\Exception $e) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect()->away("{$frontendUrl}/auth/error?message=" . urlencode($e->getMessage()));
        }
    }
}
