<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hei;
use Illuminate\Http\Request;

class HeiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Get the type from the query parameter
        $type = $request->query('type');

        // Fetch HEIs with related details filtered by type if provided
        $heis = Hei::with(['lucDetails', 'privateDetails', 'otherDetails']) // Eager load relationships
            ->when($type, function ($query, $type) {
                return $query->where('type', $type);
            })
            ->get();

        return response()->json($heis);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'uiid' => 'required|string|unique:heis,uiid',
            'name' => 'required|string|max:255',
            'type' => 'required|string',
        ]);

        $hei = Hei::create($validatedData);
        return response()->json($hei, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $hei = Hei::findOrFail($id);
        return response()->json($hei);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $hei = Hei::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string',
        ]);

        $hei->update($validatedData);
        return response()->json($hei);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $hei = Hei::findOrFail($id);
        $hei->delete();

        return response()->json(['message' => 'Hei deleted successfully']);
    }
}
