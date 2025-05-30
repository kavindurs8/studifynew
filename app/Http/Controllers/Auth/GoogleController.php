<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class GoogleController extends Controller
{
    /**
     * Redirect to Google for authentication
     */
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google callback
     */
    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            // Log the Google user data for debugging
            Log::info('Google User Data:', [
                'id' => $googleUser->getId(),
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'avatar' => $googleUser->getAvatar()
            ]);

            // Check if user already exists with this Google ID
            $user = User::where('google_id', $googleUser->getId())->first();

            if ($user) {
                // User exists, log them in
                Auth::login($user);
                return redirect('/')->with('success', 'Successfully logged in with Google!');
            }

            // Check if user exists with this email
            $existingUser = User::where('email', $googleUser->getEmail())->first();

            if ($existingUser) {
                // Update existing user with Google ID
                $existingUser->update([
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => now(), // Mark as verified since Google emails are verified
                ]);

                Auth::login($existingUser);
                return redirect('/')->with('success', 'Account linked with Google successfully!');
            }

            // Create new user
            $newUser = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'email_verified_at' => now(), // Google emails are automatically verified
                'password' => Hash::make(Str::random(24)), // Random password
            ]);

            Auth::login($newUser);
            return redirect('/')->with('success', 'Account created successfully with Google!');

        } catch (\Laravel\Socialite\Two\InvalidStateException $e) {
            Log::error('Google OAuth Invalid State: ' . $e->getMessage());
            return redirect('/login')->with('error', 'Authentication session expired. Please try again.');
        } catch (\Exception $e) {
            Log::error('Google OAuth Error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return redirect('/login')->with('error', 'Something went wrong with Google authentication. Please try again.');
        }
    }
}
