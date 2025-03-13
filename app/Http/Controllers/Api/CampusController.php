<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Institution;
use App\Models\Campus;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CampusController extends Controller
{
    /**
     * Display a listing of the campuses.
     */
    public function index(Request $request): JsonResponse
    {
        if ($request->has('institution_id')) {
            $institution = Institution::find($request->institution_id);

            if (!$institution) {
                return response()->json(['message' => 'Institution not found'], 404);
            }

            $campuses = Campus::with(['institution', 'region'])
                ->where('institution_id', $request->institution_id)
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'institution_name' => $institution->name,
                    'campuses' => $campuses,
                ],
            ]);
        }

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
            '*.region' => 'nullable|string|max:255', // FIXED: Changed from integer to string
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
            '*.institution_id' => 'required|exists:institutions,id', // Still required
        ]);

        // Bulk insert campuses
        $campuses = Campus::insert($validatedData); // Using insert for batch processing

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
            'region_id' => 'required|integer|exists:regions,id', // Updated to region_id
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
        ];

        if ($isBulk) {
            $validatedData = $request->validate(array_map(function ($key) {
                return "*.$key";
            }, array_keys($rules)), $rules);
            Campus::insert($validatedData);
            $message = 'Campuses added successfully';
        } else {
            $validatedData = $request->validate($rules);
            $campus = Campus::create($validatedData);
            $message = 'Campus added successfully';
        }

        return response()->json([
            'status' => 'success',
            'message' => $message,
        ], 201);
    }

    /**
     * Display the specified campus.
     */
    public function show($id): JsonResponse
    {
        $campus = Campus::with(['institution', 'region'])->find($id);
        if (!$campus) {
            return response()->json(['message' => 'Campus not found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $campus,
        ]);
    }

    /**
     * Update the specified campus in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $campus = Campus::find($id);
        if (!$campus) {
            return response()->json(['message' => 'Campus not found'], 404);
        }

        $validated = $request->validate([
            'suc_name' => 'sometimes|nullable|string|max:255',
            'campus_type' => 'sometimes|nullable|string|max:255',
            'institutional_code' => 'sometimes|nullable|string|max:255',
            'region_id' => 'sometimes|required|integer|exists:regions,id', // Updated to region_id
            'municipality_city_province' => 'sometimes|nullable|string|max:255',
            'year_first_operation' => 'sometimes|nullable|integer|min:1800|max:' . date('Y'),
            'land_area_hectares' => 'sometimes|nullable|numeric|min:0',
            'distance_from_main' => 'sometimes|nullable|numeric|min:0',
            'autonomous_code' => 'sometimes|nullable|string|max:255',
            'position_title' => 'sometimes|nullable|string|max:255',
            'head_full_name' => 'sometimes|nullable|string|max:255',
            'former_name' => 'sometimes|nullable|string|max:255',
            'latitude_coordinates' => 'sometimes|nullable|numeric|between:-90,90',
            'longitude_coordinates' => 'sometimes|nullable|numeric|between:-180,180',
            'institution_id' => 'sometimes|required|exists:institutions,id',
        ]);

        $campus->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Campus updated successfully',
            'data' => $campus->load(['institution', 'region']),
        ]);
    }

    /**
     * Get campuses by institution ID.
     */
    public function getByInstitution($institutionId): JsonResponse
    {
        $campuses = Campus::with('region')->where('institution_id', $institutionId)->get();

        if ($campuses->isEmpty()) {
            return response()->json(['message' => 'No campuses found for this institution'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'institution_name' => optional($campuses->first()->institution)->name ?? 'Unknown Institution',
                'campuses' => $campuses->map(function ($campus) {
                    return [
                        'id' => $campus->id,
                        'suc_name' => $campus->suc_name,
                        'campus_type' => $campus->campus_type,
                        'institutional_code' => $campus->institutional_code,
                        'region_id' => $campus->region_id,
                        'region_name' => optional($campus->region)->name, // Include region name
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
            ],
        ]);
    }

    /**
     * Remove the specified campus from storage.
     */
    public function destroy($id): JsonResponse
    {
        $campus = Campus::find($id);
        if (!$campus) {
            return response()->json(['message' => 'Campus not found'], 404);
        }

        $campus->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Campus deleted successfully',
        ], 204);
    }
}
