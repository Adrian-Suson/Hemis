<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Institution;
use Illuminate\Http\Request;
use App\Models\Campus;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

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

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                '*.suc_name' => 'nullable|string|max:255',
                '*.campus_type' => 'nullable|string|max:255',
                '*.institutional_code' => 'nullable|string|max:255',
                '*.region_id' => 'nullable|string|max:255',
                '*.municipality_id' => 'nullable|string|max:255',
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

            // Add timestamps to each record
            $currentTime = Carbon::now('Asia/Manila');
            $validatedData = array_map(function ($campus) use ($currentTime) {
                $campus['created_at'] = $currentTime;
                $campus['updated_at'] = $currentTime;
                return $campus;
            }, $validatedData);

            // Perform bulk insert
            Campus::insert($validatedData);

            return response()->json(['message' => 'Campuses added successfully'], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Error inserting campuses: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'exception' => $e,
            ]);

            return response()->json([
                'message' => 'Failed to add campuses. Please try again.',
                'error' => $e->getMessage(), // Include error message for debugging (remove in production)
            ], 500);
        }
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

        $validated = $request->validate([
            'suc_name' => 'nullable|string|max:255',
            'campus_type' => 'nullable|string|max:255',
            'institutional_code' => 'nullable|string|max:255',
            'region_id' => 'nullable|integer|exists:regions,id',          // updated key
            'province_id' => 'nullable|integer|exists:provinces,id',       // new key
            'municipality_id' => 'nullable|integer|exists:municipalities,id',// updated key
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
                    'region_id' => $campus->region_id,       // updated key
                    'province_id' => $campus->province_id,     // new key
                    'municipality_id' => $campus->municipality_id, // updated key
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
