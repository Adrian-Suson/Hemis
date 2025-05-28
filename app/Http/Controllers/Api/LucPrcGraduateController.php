<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LucPrcGraduate;
use Illuminate\Http\Request;

class LucPrcGraduateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $graduates = LucPrcGraduate::with(['lucDetail'])->get();
        return response()->json($graduates);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'luc_detail_id' => 'required|exists:luc_details,id',
            'student_id' => 'required|string|max:255',
            'date_of_birth' => 'nullable|date',
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'sex' => 'nullable|string|max:10',
            'date_graduated' => 'nullable|date',
            'program_name' => 'nullable|string|max:255',
            'program_major' => 'nullable|string|max:255',
            'authority_number' => 'nullable|string|max:255',
            'year_granted' => 'nullable|integer',
        ]);

        $graduate = LucPrcGraduate::create($validatedData);
        return response()->json($graduate, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $graduate = LucPrcGraduate::with(['lucDetail'])->findOrFail($id);
        return response()->json($graduate);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $graduate = LucPrcGraduate::findOrFail($id);

        $validatedData = $request->validate([
            'luc_detail_id' => 'sometimes|exists:luc_details,id',
            'student_id' => 'sometimes|string|max:255',
            'date_of_birth' => 'nullable|date',
            'last_name' => 'sometimes|string|max:255',
            'first_name' => 'sometimes|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'sex' => 'nullable|string|max:10',
            'date_graduated' => 'nullable|date',
            'program_name' => 'nullable|string|max:255',
            'program_major' => 'nullable|string|max:255',
            'authority_number' => 'nullable|string|max:255',
            'year_granted' => 'nullable|integer',
        ]);

        $graduate->update($validatedData);
        return response()->json($graduate);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $graduate = LucPrcGraduate::findOrFail($id);
        $graduate->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
