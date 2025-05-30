<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SucCampus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SucCampusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $sucDetailsId = $request->query('suc_details_id');
            if (!$sucDetailsId) {
                return response()->json(['error' => 'suc_details_id is required'], 400);
            }

            // Log the incoming request
            Log::info("Fetching campuses for suc_details_id: $sucDetailsId");

            $sucCampuses = SucCampus::with(['sucDetail', 'reportYear'])
                ->where('suc_details_id', $sucDetailsId)
                ->get();

            // Log the retrieved data
            Log::info("Retrieved campuses: ", $sucCampuses->toArray());

            return response()->json($sucCampuses);
        } catch (\Exception $e) {
            Log::error("Error fetching campuses: " . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info('Incoming request data:', $request->all());

        $validatedData = $request->validate([
            '*.suc_details_id' => 'required|exists:suc_details,id',
            '*.name' => 'required|string|max:255',
            '*.campus_type' => 'nullable|string|max:255',
            '*.institutional_code' => 'nullable|string|max:255',
            '*.region' => 'nullable|string|max:255',
            '*.province_municipality' => 'nullable|string|max:255',
            '*.year_first_operation' => 'nullable|integer',
            '*.land_area_hectares' => 'nullable|numeric',
            '*.distance_from_main' => 'nullable|numeric',
            '*.autonomous_code' => 'nullable|string|max:255',
            '*.position_title' => 'nullable|string|max:255',
            '*.head_full_name' => 'nullable|string|max:255',
            '*.former_name' => 'nullable|string|max:255',
            '*.latitude_coordinates' => 'nullable|numeric',
            '*.longitude_coordinates' => 'nullable|numeric',
            '*.report_year' => 'nullable|exists:report_years,year',
        ]);

        $createdCampuses = [];
        foreach ($validatedData as $campusData) {
            $createdCampuses[] = SucCampus::create($campusData);
        }

        return response()->json($createdCampuses, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $sucCampus = SucCampus::with(['sucDetail', 'reportYear'])->findOrFail($id);
        return response()->json($sucCampus);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $sucCampus = SucCampus::findOrFail($id);

        $validatedData = $request->validate([
            'suc_details_id' => 'sometimes|exists:suc_details,id',
            'name' => 'sometimes|string|max:255',
            'campus_type' => 'nullable|string|max:255',
            'institutional_code' => 'nullable|string|max:255',
            'region' => 'nullable|string|max:255',
            'province_municipality' => 'nullable|string|max:255',
            'year_first_operation' => 'nullable|integer',
            'land_area_hectares' => 'nullable|numeric',
            'distance_from_main' => 'nullable|numeric',
            'autonomous_code' => 'nullable|string|max:255',
            'position_title' => 'nullable|string|max:255',
            'head_full_name' => 'nullable|string|max:255',
            'former_name' => 'nullable|string|max:255',
            'latitude_coordinates' => 'nullable|numeric',
            'longitude_coordinates' => 'nullable|numeric',
            'report_year' => 'nullable|exists:report_years,year',
        ]);

        $sucCampus->update($validatedData);
        return response()->json($sucCampus);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $sucCampus = SucCampus::findOrFail($id);
        $sucCampus->delete();
        return response()->json(['message' => 'SucCampus deleted successfully']);
    }
}
