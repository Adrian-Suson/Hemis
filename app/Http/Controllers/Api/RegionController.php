<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Region;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RegionController extends Controller
{
    /**
     * Display a listing of the regions.
     */
    public function index(): JsonResponse
    {
        $regions = Region::all();
        return response()->json([
            'status' => 'success',
            'data' => $regions,
        ]);
    }

    /**
     * Store a newly created region in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:regions,name',
            'code' => 'nullable|string|max:50|unique:regions,code',
        ]);

        $region = Region::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Region created successfully',
            'data' => $region,
        ], 201);
    }

    /**
     * Display the specified region.
     */
    public function show(Region $region): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $region,
        ]);
    }

    /**
     * Update the specified region in storage.
     */
    public function update(Request $request, Region $region): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:regions,name,' . $region->id,
            'code' => 'sometimes|nullable|string|max:50|unique:regions,code,' . $region->id,
        ]);

        $region->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Region updated successfully',
            'data' => $region,
        ]);
    }

    /**
     * Remove the specified region from storage.
     */
    public function destroy(Region $region): JsonResponse
    {
        // Check if the region is referenced by other tables
        if ($region->institutions()->exists() || $region->campuses()->exists() || $region->users()->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete region because it is referenced by institutions, campuses, or users.',
            ], 409); // Conflict status
        }

        $region->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Region deleted successfully',
        ], 204);
    }
}
