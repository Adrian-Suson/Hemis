<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Institution;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class InstitutionController extends Controller
{
    /**
     * Display a listing of the institutions.
     */
    public function index(Request $request): JsonResponse
    {
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
        // Check if type is provided
        if ($request->has('type')) {
            $institutions = Institution::where('institution_type', $request->type)
                ->with('region') // Include region relationship
                ->get();
        } else {
            $institutions = Institution::with('region')->get();
        }

        return response()->json([
            'status' => 'success',
            'data' => $institutions,
        ]);
    }

    /**
     * Store a newly created institution in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'region_id' => 'required|integer|exists:regions,id', // Updated to region_id
            'address_street' => 'nullable|string|max:255',
            'municipality_city' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:10',
            'institutional_telephone' => 'nullable|string|max:20',
            'institutional_fax' => 'nullable|string|max:20',
            'head_telephone' => 'nullable|string|max:20',
            'institutional_email' => 'nullable|email|max:255',
            'institutional_website' => 'nullable|string|max:255',
            'year_established' => 'nullable|integer',
            'sec_registration' => 'nullable|string|max:255',
            'year_granted_approved' => 'nullable|integer',
            'year_converted_college' => 'nullable|integer',
            'year_converted_university' => 'nullable|integer',
            'head_name' => 'nullable|string|max:255',
            'head_title' => 'nullable|string|max:255',
            'head_education' => 'nullable|string|max:255',
            'institution_type' => 'nullable|string|max:255',
        ]);

        $institution = Institution::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Institution created successfully',
            'data' => $institution->load('region'), // Include region in response
        ], 201);
    }

    /**
     * Display the specified institution.
     */
    public function show(Institution $institution): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $institution->load('region'), // Include region
        ]);
    }

    /**
     * Update the specified institution in storage.
     */
    public function update(Request $request, Institution $institution): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'region_id' => 'sometimes|required|integer|exists:regions,id', // Updated to region_id
            'address_street' => 'nullable|string|max:255',
            'municipality_city' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:10',
            'institutional_telephone' => 'nullable|string|max:20',
            'institutional_fax' => 'nullable|string|max:20',
            'head_telephone' => 'nullable|string|max:20',
            'institutional_email' => 'nullable|email|max:255',
            'institutional_website' => 'nullable|string|max:255',
            'year_established' => 'nullable|integer',
            'sec_registration' => 'nullable|string|max:255',
            'year_granted_approved' => 'nullable|integer',
            'year_converted_college' => 'nullable|integer',
            'year_converted_university' => 'nullable|integer',
            'head_name' => 'nullable|string|max:255',
            'head_title' => 'nullable|string|max:255',
            'head_education' => 'nullable|string|max:255',
            'institution_type' => 'nullable|string|max:255',
        ]);

        $institution->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Institution updated successfully',
            'data' => $institution->load('region'), // Include region
        ]);
    }

<<<<<<< Updated upstream


=======
    /**
     * Remove the specified institution from storage.
     */
>>>>>>> Stashed changes
    public function destroy(Institution $institution): JsonResponse
    {
        $institution->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Institution deleted successfully',
        ], 204);
    }
}
