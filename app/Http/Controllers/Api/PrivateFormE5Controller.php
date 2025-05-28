<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrivateFormE5;
use Illuminate\Http\Request;

class PrivateFormE5Controller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $privateFormE5s = PrivateFormE5::with(['privateDetail'])->get();
        return response()->json($privateFormE5s);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'private_detail_id' => 'required|exists:private_details,id',
            'faculty_name' => 'required|string|max:255',
            'full_time_part_time_code' => 'nullable|string|max:255',
            'gender_code' => 'nullable|string|max:255',
            'primary_teaching_discipline_code' => 'nullable|string|max:255',
            'highest_degree_attained_code' => 'nullable|string|max:255',
            'bachelors_program_name' => 'nullable|string|max:255',
            'bachelors_program_code' => 'nullable|string|max:255',
            'masters_program_name' => 'nullable|string|max:255',
            'masters_program_code' => 'nullable|string|max:255',
            'doctorate_program_name' => 'nullable|string|max:255',
            'doctorate_program_code' => 'nullable|string|max:255',
            'professional_license_code' => 'nullable|string|max:255',
            'tenure_of_employment_code' => 'nullable|string|max:255',
            'faculty_rank_code' => 'nullable|string|max:255',
            'teaching_load_code' => 'nullable|string|max:255',
            'subjects_taught' => 'nullable|string|max:255',
            'annual_salary_code' => 'nullable|string|max:255',
        ]);

        $privateFormE5 = PrivateFormE5::create($validatedData);
        return response()->json($privateFormE5, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $privateFormE5 = PrivateFormE5::with(['privateDetail'])->findOrFail($id);
        return response()->json($privateFormE5);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $privateFormE5 = PrivateFormE5::findOrFail($id);

        $validatedData = $request->validate([
            'private_detail_id' => 'sometimes|exists:private_details,id',
            'faculty_name' => 'sometimes|string|max:255',
            'full_time_part_time_code' => 'nullable|string|max:255',
            'gender_code' => 'nullable|string|max:255',
            'primary_teaching_discipline_code' => 'nullable|string|max:255',
            'highest_degree_attained_code' => 'nullable|string|max:255',
            'bachelors_program_name' => 'nullable|string|max:255',
            'bachelors_program_code' => 'nullable|string|max:255',
            'masters_program_name' => 'nullable|string|max:255',
            'masters_program_code' => 'nullable|string|max:255',
            'doctorate_program_name' => 'nullable|string|max:255',
            'doctorate_program_code' => 'nullable|string|max:255',
            'professional_license_code' => 'nullable|string|max:255',
            'tenure_of_employment_code' => 'nullable|string|max:255',
            'faculty_rank_code' => 'nullable|string|max:255',
            'teaching_load_code' => 'nullable|string|max:255',
            'subjects_taught' => 'nullable|string|max:255',
            'annual_salary_code' => 'nullable|string|max:255',
        ]);

        $privateFormE5->update($validatedData);
        return response()->json($privateFormE5);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $privateFormE5 = PrivateFormE5::findOrFail($id);
        $privateFormE5->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
