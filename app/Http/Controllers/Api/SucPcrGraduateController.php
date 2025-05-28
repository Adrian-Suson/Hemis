<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SucPcrGraduate;
use Illuminate\Http\Request;

class SucPcrGraduateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $graduates = SucPcrGraduate::with(['sucDetail', 'reportYear'])->get();
        return response()->json($graduates);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'suc_details_id' => 'required|exists:suc_details,id',
            'student_id' => 'required|string|max:255',
            'date_of_birth' => 'nullable|date',
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'sex' => 'nullable|string|max:10',
            'date_graduated' => 'nullable|date',
            'program_name' => 'nullable|string|max:255',
            'program_major' => 'nullable|string|max:255',
            'program_authority_to_operate_graduate' => 'nullable|string|max:255',
            'year_granted' => 'nullable|integer',
            'report_year' => 'required|integer|exists:report_years,year',
        ]);

        $graduate = SucPcrGraduate::create($validatedData);
        return response()->json($graduate, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $graduate = SucPcrGraduate::with(['sucDetail', 'reportYear'])->findOrFail($id);
        return response()->json($graduate);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $graduate = SucPcrGraduate::findOrFail($id);

        $validatedData = $request->validate([
            'suc_details_id' => 'sometimes|exists:suc_details,id',
            'student_id' => 'sometimes|string|max:255',
            'date_of_birth' => 'nullable|date',
            'last_name' => 'sometimes|string|max:255',
            'first_name' => 'sometimes|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'sex' => 'nullable|string|max:10',
            'date_graduated' => 'nullable|date',
            'program_name' => 'nullable|string|max:255',
            'program_major' => 'nullable|string|max:255',
            'program_authority_to_operate_graduate' => 'nullable|string|max:255',
            'year_granted' => 'nullable|integer',
            'report_year' => 'sometimes|integer|exists:report_years,year',
        ]);

        $graduate->update($validatedData);
        return response()->json($graduate);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $graduate = SucPcrGraduate::findOrFail($id);
        $graduate->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
