<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Province;
use Illuminate\Http\Request;

class ProvinceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $provinces = Province::with(['region', 'municipalities'])->get();
        return response()->json($provinces);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'region_id' => 'required|exists:regions,id',
        ]);

        $province = Province::create($validatedData);
        return response()->json($province, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $province = Province::with(['region', 'municipalities'])->findOrFail($id);
        return response()->json($province);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $province = Province::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'region_id' => 'sometimes|exists:regions,id',
        ]);

        $province->update($validatedData);
        return response()->json($province);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $province = Province::findOrFail($id);
        $province->delete();

        return response()->json(['message' => 'Province deleted successfully']);
    }
}
