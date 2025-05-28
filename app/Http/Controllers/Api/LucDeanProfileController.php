<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LucDeanProfile;
use Illuminate\Http\Request;

class LucDeanProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $deanProfiles = LucDeanProfile::with(['lucDetail'])->get();
        return response()->json($deanProfiles);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'luc_detail_id' => 'required|exists:luc_details,id',
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_initial' => 'nullable|string|max:10',
            'designation' => 'nullable|string|max:255',
            'college_discipline_assignment' => 'nullable|string|max:255',
            'baccalaureate_degree' => 'nullable|string|max:255',
            'masters_degree' => 'nullable|string|max:255',
            'doctorate_degree' => 'nullable|string|max:255',
        ]);

        $deanProfile = LucDeanProfile::create($validatedData);
        return response()->json($deanProfile, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $deanProfile = LucDeanProfile::with(['lucDetail'])->findOrFail($id);
        return response()->json($deanProfile);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $deanProfile = LucDeanProfile::findOrFail($id);

        $validatedData = $request->validate([
            'luc_detail_id' => 'sometimes|exists:luc_details,id',
            'last_name' => 'sometimes|string|max:255',
            'first_name' => 'sometimes|string|max:255',
            'middle_initial' => 'nullable|string|max:10',
            'designation' => 'nullable|string|max:255',
            'college_discipline_assignment' => 'nullable|string|max:255',
            'baccalaureate_degree' => 'nullable|string|max:255',
            'masters_degree' => 'nullable|string|max:255',
            'doctorate_degree' => 'nullable|string|max:255',
        ]);

        $deanProfile->update($validatedData);
        return response()->json($deanProfile);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $deanProfile = LucDeanProfile::findOrFail($id);
        $deanProfile->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
