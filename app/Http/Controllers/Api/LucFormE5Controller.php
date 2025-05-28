<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LucFormE5;
use Illuminate\Http\Request;

class LucFormE5Controller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lucFormE5s = LucFormE5::with(['lucDetail'])->get();
        return response()->json($lucFormE5s);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'luc_detail_id' => 'required|exists:luc_details,id',
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

        $lucFormE5 = LucFormE5::create($validatedData);
        return response()->json($lucFormE5, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $lucFormE5 = LucFormE5::with(['lucDetail'])->findOrFail($id);
        return response()->json($lucFormE5);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $lucFormE5 = LucFormE5::findOrFail($id);

        $validatedData = $request->validate([
            'luc_detail_id' => 'sometimes|exists:luc_details,id',
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

        $lucFormE5->update($validatedData);
        return response()->json($lucFormE5);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $lucFormE5 = LucFormE5::findOrFail($id);
        $lucFormE5->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
