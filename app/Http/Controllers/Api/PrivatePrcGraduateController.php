<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrivatePrcGraduate;
use Illuminate\Http\Request;

class PrivatePrcGraduateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $graduates = PrivatePrcGraduate::with(['privateDetail'])->get();
        return response()->json($graduates);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'private_detail_id' => 'required|exists:private_details,id',
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

        $graduate = PrivatePrcGraduate::create($validatedData);
        return response()->json($graduate, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $graduate = PrivatePrcGraduate::with(['privateDetail'])->findOrFail($id);
        return response()->json($graduate);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $graduate = PrivatePrcGraduate::findOrFail($id);

        $validatedData = $request->validate([
            'private_detail_id' => 'sometimes|exists:private_details,id',
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
        $graduate = PrivatePrcGraduate::findOrFail($id);
        $graduate->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
