<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Region;
use Illuminate\Http\Request;

class RegionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $regions = Region::with('provinces')->get();
        return response()->json($regions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $region = Region::create($validatedData);
        return response()->json($region, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $region = Region::with('provinces')->findOrFail($id);
        return response()->json($region);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $region = Region::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
        ]);

        $region->update($validatedData);
        return response()->json($region);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $region = Region::findOrFail($id);
        $region->delete();

        return response()->json(['message' => 'Region deleted successfully']);
    }
}
