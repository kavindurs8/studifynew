<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ZoomService
{
    private $baseUrl;
    private $accountId;
    private $clientId;
    private $clientSecret;
    private $accessToken;

    public function __construct()
    {
        $this->baseUrl = config('services.zoom.base_url', 'https://api.zoom.us/v2');
        $this->accountId = config('services.zoom.account_id');
        $this->clientId = config('services.zoom.client_id');
        $this->clientSecret = config('services.zoom.client_secret');
    }

    /**
     * Get access token for Zoom API
     */
    private function getAccessToken()
    {
        if ($this->accessToken) {
            return $this->accessToken;
        }

        try {
            $response = Http::withBasicAuth($this->clientId, $this->clientSecret)
                ->asForm()
                ->post('https://zoom.us/oauth/token', [
                    'grant_type' => 'account_credentials',
                    'account_id' => $this->accountId,
                ]);

            if ($response->successful()) {
                $this->accessToken = $response->json('access_token');
                return $this->accessToken;
            }

            throw new \Exception('Failed to get Zoom access token: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Zoom API authentication failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Create a Zoom meeting
     */
    public function createMeeting($liveClass)
    {
        try {
            $accessToken = $this->getAccessToken();

            $meetingData = [
                'topic' => $liveClass->title,
                'type' => 2, // Scheduled meeting
                'start_time' => $liveClass->scheduled_at->toISOString(),
                'duration' => $liveClass->duration_minutes,
                'timezone' => config('app.timezone', 'UTC'),
                'agenda' => $liveClass->description,
                'settings' => [
                    'host_video' => true,
                    'participant_video' => true,
                    'join_before_host' => false,
                    'mute_upon_entry' => true,
                    'watermark' => false,
                    'use_pmi' => false,
                    'approval_type' => 0, // Automatically approve
                    'audio' => 'both',
                    'auto_recording' => 'cloud',
                    'enforce_login' => false,
                    'waiting_room' => true,
                ]
            ];

            $response = Http::withToken($accessToken)
                ->post("{$this->baseUrl}/users/me/meetings", $meetingData);

            if ($response->successful()) {
                return $response->json();
            }

            throw new \Exception('Failed to create Zoom meeting: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Failed to create Zoom meeting: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Update a Zoom meeting
     */
    public function updateMeeting($meetingId, $liveClass)
    {
        try {
            $accessToken = $this->getAccessToken();

            $meetingData = [
                'topic' => $liveClass->title,
                'start_time' => $liveClass->scheduled_at->toISOString(),
                'duration' => $liveClass->duration_minutes,
                'agenda' => $liveClass->description,
            ];

            $response = Http::withToken($accessToken)
                ->patch("{$this->baseUrl}/meetings/{$meetingId}", $meetingData);

            if ($response->successful()) {
                return $response->json();
            }

            throw new \Exception('Failed to update Zoom meeting: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Failed to update Zoom meeting: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Delete a Zoom meeting
     */
    public function deleteMeeting($meetingId)
    {
        try {
            $accessToken = $this->getAccessToken();

            $response = Http::withToken($accessToken)
                ->delete("{$this->baseUrl}/meetings/{$meetingId}");

            if ($response->successful()) {
                return true;
            }

            throw new \Exception('Failed to delete Zoom meeting: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Failed to delete Zoom meeting: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get meeting details
     */
    public function getMeeting($meetingId)
    {
        try {
            $accessToken = $this->getAccessToken();

            $response = Http::withToken($accessToken)
                ->get("{$this->baseUrl}/meetings/{$meetingId}");

            if ($response->successful()) {
                return $response->json();
            }

            throw new \Exception('Failed to get Zoom meeting: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Failed to get Zoom meeting: ' . $e->getMessage());
            throw $e;
        }
    }
}
