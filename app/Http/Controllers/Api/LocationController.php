<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Region;
use App\Models\Province;
use App\Models\Municipality;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    /**
     * Display a listing of regions.
     */
    public function getRegions()
    {
        try {
            $regions = Region::with('provinces')->get();
            return response()->json($regions, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch regions'], 500);
        }
    }

    /**
     * Display a listing of provinces.
     */
    public function getProvinces()
    {
        try {
            $provinces = Province::with(['region', 'municipalities'])->get();
            return response()->json($provinces, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch provinces'], 500);
        }
    }

    /**
     * Display a listing of municipalities.
     */
    public function getMunicipalities()
    {
        try {
            $municipalities = Municipality::with('province')->get();
            return response()->json($municipalities, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch municipalities'], 500);
        }
    }

    /**
     * Display a specific region.
     */
    public function showRegion($id)
    {
        try {
            $region = Region::with('provinces')->findOrFail($id);
            return response()->json($region, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Region not found'], 404);
        }
    }

    /**
     * Display a specific province.
     */
    public function showProvince($id)
    {
        try {
            $province = Province::with(['region', 'municipalities'])->findOrFail($id);
            return response()->json($province, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Province not found'], 404);
        }
    }

    /**
     * Display a specific municipality.
     */
    public function showMunicipality($id)
    {
        try {
            $municipality = Municipality::with('province')->findOrFail($id);
            return response()->json($municipality, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Municipality not found'], 404);
        }
    }

    /**
     * Store a new region.
     */
    public function storeRegion(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        try {
            $region = Region::create($validatedData);
            return response()->json($region, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create region'], 500);
        }
    }

    /**
     * Store a new province.
     */
    public function storeProvince(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'region_id' => 'required|exists:regions,id',
        ]);

        try {
            $province = Province::create($validatedData);
            return response()->json($province, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create province'], 500);
        }
    }

    /**
     * Store a new municipality.
     */
    public function storeMunicipality(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'province_id' => 'required|exists:provinces,id',
        ]);

        try {
            $municipality = Municipality::create($validatedData);
            return response()->json($municipality, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create municipality'], 500);
        }
    }

    /**
     * Update a region.
     */
    public function updateRegion(Request $request, $id)
    {
        $region = Region::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
        ]);

        try {
            $region->update($validatedData);
            return response()->json($region, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update region'], 500);
        }
    }

    /**
     * Update a province.
     */
    public function updateProvince(Request $request, $id)
    {
        $province = Province::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'region_id' => 'sometimes|exists:regions,id',
        ]);

        try {
            $province->update($validatedData);
            return response()->json($province, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update province'], 500);
        }
    }

    /**
     * Update a municipality.
     */
    public function updateMunicipality(Request $request, $id)
    {
        $municipality = Municipality::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'province_id' => 'sometimes|exists:provinces,id',
        ]);

        try {
            $municipality->update($validatedData);
            return response()->json($municipality, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update municipality'], 500);
        }
    }

    /**
     * Delete a region.
     */
    public function deleteRegion($id)
    {
        try {
            $region = Region::findOrFail($id);
            $region->delete();
            return response()->json(['message' => 'Region deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete region'], 500);
        }
    }

    /**
     * Delete a province.
     */
    public function deleteProvince($id)
    {
        try {
            $province = Province::findOrFail($id);
            $province->delete();
            return response()->json(['message' => 'Province deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete province'], 500);
        }
    }

    /**
     * Delete a municipality.
     */
    public function deleteMunicipality($id)
    {
        try {
            $municipality = Municipality::findOrFail($id);
            $municipality->delete();
            return response()->json(['message' => 'Municipality deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete municipality'], 500);
        }
    }
}
