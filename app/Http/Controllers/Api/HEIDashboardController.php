<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CurricularProgram;
use App\Models\User;
use App\Models\FacultyProfile;
use App\Models\Institution;
use Illuminate\Http\Request;

class HeiDashboardController extends Controller
{
    public function getDashboardData(Request $request)
    {
        $uuid = $request->query('uuid');

        try {
            if (!$uuid) {
                return response()->json(['error' => 'UUID parameter is required'], 400);
            }

            // Fetch institutions with the specified UUID
            $institutions = Institution::where('uuid', $uuid)->get();

            if ($institutions->isEmpty()) {
                return response()->json(['error' => 'No institutions found for the provided UUID'], 404);
            }

            // Get institution IDs for filtering related data
            $institutionIds = $institutions->pluck('id')->toArray();

            // Fetch related data for institutions with the matching UUID
            $users = User::whereIn('institution_id', $institutionIds)->get();
            $facultyProfiles = FacultyProfile::whereIn('institution_id', $institutionIds)->get();
            $programs = CurricularProgram::whereIn('institution_id', $institutionIds)->get();

            return response()->json([
                'users' => $users,
                'facultyProfiles' => $facultyProfiles,
                'programs' => $programs,
                'institutions' => $institutions,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch dashboard data', 'message' => $e->getMessage()], 500);
        }
    }
}
