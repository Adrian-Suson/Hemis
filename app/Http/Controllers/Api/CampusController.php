<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Institution;
use Illuminate\Http\Request;
use App\Models\Campus;
use Carbon\Carbon;

class CampusController extends Controller
{
    // Get all campuses
    public function index(Request $request)
    {
        // Check if institution_id is provided
        if ($request->has('institution_id')) {
            $institution = Institution::find($request->institution_id);

            if (!$institution) {
                return response()->json(['message' => 'Institution not found'], 404);
            }

            $campuses = Campus::with('institution')
                ->where('institution_id', $request->institution_id)
                ->get();

            return response()->json([
                'institution_name' => $institution->name, // Send institution name
                'campuses' => $campuses, // Wrap campuses inside a key
            ]);
        }

        // Return all campuses if no institution_id is provided
        return response()->json([
            'institution_name' => 'All Institutions',
            'campuses' => Campus::with('institution')->get(),
        ]);
    }

    // Create a new campus
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            '*.suc_name' => 'nullable|string|max:255',
            '*.campus_type' => 'nullable|string|max:255',
            '*.institutional_code' => 'nullable|string|max:255',
            '*.region' => 'nullable|string|max:255',
            '*.municipality_city_province' => 'nullable|string|max:255',
            '*.year_first_operation' => 'nullable|integer|min:1800|max:' . date('Y'),
            '*.land_area_hectares' => 'nullable|numeric|min:0',
            '*.distance_from_main' => 'nullable|numeric|min:0',
            '*.autonomous_code' => 'nullable|string|max:255',
            '*.position_title' => 'nullable|string|max:255',
            '*.head_full_name' => 'nullable|string|max:255',
            '*.former_name' => 'nullable|string|max:255',
            '*.latitude_coordinates' => 'nullable|numeric|between:-90,90',
            '*.longitude_coordinates' => 'nullable|numeric|between:-180,180',
            '*.institution_id' => 'required|exists:institutions,id',
        ]);

        // Ensure the timezone is set to Asia/Manila (redundant if already set in config/app.php)
        date_default_timezone_set('Asia/Manila');

        // Add timestamps to each record in the validated data
        $currentTime = Carbon::now('Asia/Manila'); // Explicitly set timezone to Philippine time
        $validatedData = array_map(function ($campus) use ($currentTime) {
            $campus['created_at'] = $currentTime;
            $campus['updated_at'] = $currentTime;
            return $campus;
        }, $validatedData);

        // Bulk insert campuses
        $campuses = Campus::insert($validatedData);

        return response()->json(['message' => 'Campuses added successfully'], 201);
    }
    // Get a single campus
    public function show($id)
    {
        $campus = Campus::with('institution')->find($id);
        if (!$campus) {
            return response()->json(['message' => 'Campus not found'], 404);
        }
        return response()->json($campus);
    }

    // Update a campus
    public function update(Request $request, $id)
    {
        $campus = Campus::find($id);
        if (!$campus) {
            return response()->json(['message' => 'Campus not found'], 404);
        }

        $validated = $request->validate(rules: [
            'suc_name' => 'nullable|string|max:255',
            'campus_type' => 'nullable|string|max:255',
            'institutional_code' => 'nullable|string|max:255',
            'region' => 'nullable|string|max:255', // FIXED: Changed from integer to string
            'municipality_city_province' => 'nullable|string|max:255',
            'year_first_operation' => 'nullable|integer|min:1800|max:' . date('Y'),
            'land_area_hectares' => 'nullable|numeric|min:0',
            'distance_from_main' => 'nullable|numeric|min:0',
            'autonomous_code' => 'nullable|string|max:255',
            'position_title' => 'nullable|string|max:255',
            'head_full_name' => 'nullable|string|max:255',
            'former_name' => 'nullable|string|max:255',
            'latitude_coordinates' => 'nullable|numeric|between:-90,90',
            'longitude_coordinates' => 'nullable|numeric|between:-180,180',
            'institution_id' => 'required|exists:institutions,id',
        ]);

        $campus->update($validated);

        return response()->json($campus);
    }

    // Get campuses by institution ID
    public function getByInstitution($institutionId)
    {
        $campuses = Campus::where('institution_id', $institutionId)->get();

        if ($campuses->isEmpty()) {
            return response()->json(['message' => 'No campuses found for this institution'], 404);
        }

        return response()->json([
            'institution_name' => optional($campuses->first()->institution)->name ?? 'Unknown Institution',
            'campuses' => $campuses->map(function ($campus) {
                return [
                    'id' => $campus->id,
                    'suc_name' => $campus->suc_name,
                    'campus_type' => $campus->campus_type,
                    'institutional_code' => $campus->institutional_code,
                    'region' => $campus->region,
                    'municipality_city_province' => $campus->municipality_city_province,
                    'year_first_operation' => $campus->year_first_operation,
                    'land_area_hectares' => $campus->land_area_hectares,
                    'distance_from_main' => $campus->distance_from_main,
                    'autonomous_code' => $campus->autonomous_code,
                    'position_title' => $campus->position_title,
                    'head_full_name' => $campus->head_full_name,
                    'former_name' => $campus->former_name,
                    'latitude_coordinates' => $campus->latitude_coordinates,
                    'longitude_coordinates' => $campus->longitude_coordinates,
                ];
            }),
        ]);
    }



    // Delete a campus
    public function destroy($id)
    {
        $campus = Campus::find($id);
        if (!$campus) {
            return response()->json(['message' => 'Campus not found'], 404);
        }

        $campus->delete();
        return response()->json(['message' => 'Campus deleted successfully']);
    }
}
