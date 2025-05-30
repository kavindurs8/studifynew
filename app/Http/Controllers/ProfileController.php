<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'countries' => $this->getCountries(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $request->user()->id],
            'profile_picture' => ['nullable', 'image', 'max:2048'], // 2MB max
            'country' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'zip_code' => ['nullable', 'string', 'max:20'],
        ]);

        $user = $request->user();

        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            // Get the file
            $file = $request->file('profile_picture');

            // Delete old profile picture if it exists
            if ($user->profile_picture && !str_contains($user->profile_picture, 'tmp') && !str_contains($user->profile_picture, 'C:')) {
                Storage::disk('public')->delete($user->profile_picture);
            }

            // Generate a unique filename
            $filename = time() . '_' . $file->getClientOriginalName();

            // Store the new file in public storage with a unique name
            $path = $file->storeAs('profile-pictures', $filename, 'public');

            // Store the path in the database
            $user->profile_picture = $path;

            Log::info('Profile picture uploaded', [
                'user_id' => $user->id,
                'path' => $path,
                'full_url' => asset('storage/' . $path)
            ]);
        }

        // Update other fields
        $user->name = $request->name;
        if ($user->email !== $request->email) {
            $user->email = $request->email;
            $user->email_verified_at = null;
        }
        $user->country = $request->country;
        $user->city = $request->city;
        $user->zip_code = $request->zip_code;

        $user->save();

        return redirect()->back()->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        // Delete profile picture if it exists
        if ($user->profile_picture && Storage::disk('public')->exists($user->profile_picture)) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Remove the user's profile picture.
     */
    public function removePicture(Request $request)
    {
        $user = $request->user();

        // Log for debugging
        Log::info('Removing profile picture', [
            'user_id' => $user->id,
            'profile_picture' => $user->profile_picture
        ]);

        // Delete the actual file if it exists and isn't a temp path
        if ($user->profile_picture &&
            !str_contains($user->profile_picture, 'tmp') &&
            !str_contains($user->profile_picture, 'C:')) {
            Log::info('Attempting to delete file', [
                'path' => storage_path('app/public/' . $user->profile_picture)
            ]);
            Storage::disk('public')->delete($user->profile_picture);
        }

        // Clear the profile picture in database
        $user->profile_picture = null;
        $user->save();

        return response()->json(['success' => true]);
    }

    /**
     * Get list of countries
     */
    private function getCountries(): array
    {
        return [
            'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia',
            'Austria', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Belarus', 'Belgium',
            'Bolivia', 'Bosnia and Herzegovina', 'Brazil', 'Bulgaria', 'Cambodia',
            'Canada', 'Chile', 'China', 'Colombia', 'Costa Rica', 'Croatia',
            'Czech Republic', 'Denmark', 'Ecuador', 'Egypt', 'Estonia', 'Finland',
            'France', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Hungary', 'Iceland',
            'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
            'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia', 'Lebanon',
            'Lithuania', 'Luxembourg', 'Malaysia', 'Mexico', 'Morocco', 'Netherlands',
            'New Zealand', 'Nigeria', 'Norway', 'Pakistan', 'Peru', 'Philippines',
            'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Saudi Arabia',
            'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea',
            'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Thailand', 'Turkey',
            'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
            'Uruguay', 'Venezuela', 'Vietnam'
        ];
    }
}
