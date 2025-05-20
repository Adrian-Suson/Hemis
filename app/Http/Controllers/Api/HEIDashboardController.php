<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Institution;
use Illuminate\Http\Request;

class HeiDashboardController extends Controller
{
    public function getDashboardData(Request $request)
    {
        $uuid = $request->query('uuid');

        try {
            // Validate UUID
            if (!$uuid) {
                return response()->json(['error' => 'UUID parameter is required'], 400);
            }

            // Fetch institutions with the specified UUID
            $institutions = Institution::where('uuid', $uuid)
                ->with(['users', 'facultyProfiles', 'programs'])
                ->get();

            // Check if institutions exist
            if ($institutions->isEmpty()) {
                return response()->json(['error' => 'No institutions found for the provided UUID'], 404);
            }

            // Transform data to nest related models under each institution
            $response = $institutions->map(function ($institution) {
                return [
                    'institution' => $institution->toArray(),
                    'users' => $institution->users->toArray(),
                    'facultyProfiles' => $institution->facultyProfiles->toArray(),
                    'programs' => $institution->programs->toArray(),
                ];
            })->toArray();

            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch dashboard data',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
