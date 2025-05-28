<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Municipality;
use Illuminate\Http\Request;

class MunicipalityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $municipalities = Municipality::with('province')->get();
        return response()->json($municipalities);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'province_id' => 'required|exists:provinces,id',
        ]);

        $municipality = Municipality::create($validatedData);
        return response()->json($municipality, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $municipality = Municipality::with('province')->findOrFail($id);
        return response()->json($municipality);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $municipality = Municipality::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'province_id' => 'sometimes|exists:provinces,id',
        ]);

        $municipality->update($validatedData);
        return response()->json($municipality);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $municipality = Municipality::findOrFail($id);
        $municipality->delete();

        return response()->json(['message' => 'Municipality deleted successfully']);
    }
}
