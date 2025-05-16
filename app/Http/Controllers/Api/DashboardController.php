<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CurricularProgram;
use App\Models\User;
use App\Models\FacultyProfile;
use App\Models\Institution;
use App\Models\Program;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getDashboardData(Request $request)
    {
        $institutionId = $request->query('institution_id');

        try {
            if ($institutionId) {
                // Fetch data for a specific institution
                $users = User::where('institution_id', $institutionId)->get();
                $facultyProfiles = FacultyProfile::where('institution_id', $institutionId)->get();
                $programs = CurricularProgram::where('institution_id', $institutionId)->get();
                $institutions = Institution::where('id', $institutionId)->get();
            } else {
                // Fetch all data for SuperAdmin
                $users = User::all();
                $facultyProfiles = FacultyProfile::all();
                $programs = CurricularProgram::all();
                $institutions = Institution::all();
            }

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
