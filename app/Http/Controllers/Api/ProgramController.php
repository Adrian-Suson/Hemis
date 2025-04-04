<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProgramController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Program::with(['institution']);

            if ($request->has('institution_id')) {
                $query->where('institution_id', $request->query('institution_id'));
            }

            if ($request->has('program_type')) {
                $query->where('program_type', $request->query('program_type'));
            }

            $programs = $query->get();

            return response()->json($programs);
        } catch (\Exception $e) {
            // Log the error for debugging

            // Return a 500 response with an error message
            return response()->json(['error' => 'Failed to fetch programs.'], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'institution_id' => 'required|exists:institutions,id',
            'data_date' => 'sometimes|required|date',
            'program_name' => 'required|string|max:255',
            'program_code' => 'nullable|integer',
            'major_name' => 'nullable|string|max:255',
            'major_code' => 'nullable|integer',
            'category' => 'nullable|string|max:255',
            'serial' => 'nullable|string|max:255',
            'year' => 'nullable|string|max:255',
            'is_thesis_dissertation_required' => 'nullable|integer|max:255',
            'program_status' => 'nullable|integer|max:255',
            'calendar_use_code' => 'nullable|integer|max:255',
            'program_normal_length_in_years' => 'nullable|integer',
            'lab_units' => 'nullable|integer',
            'lecture_units' => 'nullable|integer',
            'total_units' => 'nullable|integer',
            'tuition_per_unit' => 'nullable|numeric',
            'program_fee' => 'nullable|numeric',
            'program_type' => 'nullable|string|max:255',
            'new_students_freshmen_male' => 'nullable|integer',
            'new_students_freshmen_female' => 'nullable|integer',
            'first_year_old_male' => 'nullable|integer',
            'first_year_old_female' => 'nullable|integer',
            'second_year_male' => 'nullable|integer',
            'second_year_female' => 'nullable|integer',
            'third_year_male' => 'nullable|integer',
            'third_year_female' => 'nullable|integer',
            'fourth_year_male' => 'nullable|integer',
            'fourth_year_female' => 'nullable|integer',
            'fifth_year_male' => 'nullable|integer',
            'fifth_year_female' => 'nullable|integer',
            'sixth_year_male' => 'nullable|integer',
            'sixth_year_female' => 'nullable|integer',
            'seventh_year_male' => 'nullable|integer',
            'seventh_year_female' => 'nullable|integer',
            'subtotal_male' => 'nullable|integer',
            'subtotal_female' => 'nullable|integer',
            'grand_total' => 'nullable|integer',
            'lecture_units_actual' => 'nullable|integer',
            'laboratory_units_actual' => 'nullable|integer',
            'total_units_actual' => 'nullable|integer',
            'graduates_males' => 'nullable|integer',
            'graduates_females' => 'nullable|integer',
            'graduates_total' => 'nullable|integer',
            'externally_funded_merit_scholars' => 'nullable|integer',
            'internally_funded_grantees' => 'nullable|integer',
            'suc_funded_grantees' => 'nullable|integer',
        ]);

        $program = Program::create($validated);
        return response()->json($program->load(['institution']), 201);
    }

    public function show(Program $program): JsonResponse
    {
        return response()->json($program->load(['institution']));
    }

    public function update(Request $request, Program $program): JsonResponse
    {
        $validated = $request->validate([
            'institution_id' => 'sometimes|required|exists:institutions,id',
            'data_date' => 'sometimes|required|date',
            'program_name' => 'required|string|max:255',
            'program_code' => 'nullable|integer',
            'major_name' => 'nullable|string|max:255',
            'major_code' => 'nullable|integer',
            'category' => 'nullable|string|max:255',
            'serial' => 'nullable|string|max:255',
            'is_thesis_dissertation_required' => 'nullable|string|max:255',
            'program_status' => 'nullable|string|max:255',
            'calendar_use_code' => 'nullable|string|max:255',
            'program_normal_length_in_years' => 'nullable|integer',
            'lab_units' => 'nullable|integer',
            'lecture_units' => 'nullable|integer',
            'total_units' => 'nullable|integer',
            'tuition_per_unit' => 'nullable|numeric',
            'program_fee' => 'nullable|numeric',
            'program_type' => 'nullable|string|max:255',
            'new_students_freshmen_male' => 'nullable|integer',
            'new_students_freshmen_female' => 'nullable|integer',
            'first_year_old_male' => 'nullable|integer',
            'first_year_old_female' => 'nullable|integer',
            'second_year_male' => 'nullable|integer',
            'second_year_female' => 'nullable|integer',
            'third_year_male' => 'nullable|integer',
            'third_year_female' => 'nullable|integer',
            'fourth_year_male' => 'nullable|integer',
            'fourth_year_female' => 'nullable|integer',
            'fifth_year_male' => 'nullable|integer',
            'fifth_year_female' => 'nullable|integer',
            'sixth_year_male' => 'nullable|integer',
            'sixth_year_female' => 'nullable|integer',
            'seventh_year_male' => 'nullable|integer',
            'seventh_year_female' => 'nullable|integer',
            'subtotal_male' => 'nullable|integer',
            'subtotal_female' => 'nullable|integer',
            'grand_total' => 'nullable|integer',
            'lecture_units_actual' => 'nullable|integer',
            'laboratory_units_actual' => 'nullable|integer',
            'total_units_actual' => 'nullable|integer',
            'graduates_males' => 'nullable|integer',
            'graduates_females' => 'nullable|integer',
            'graduates_total' => 'nullable|integer',
            'externally_funded_merit_scholars' => 'nullable|integer',
            'internally_funded_grantees' => 'nullable|integer',
            'suc_funded_grantees' => 'nullable|integer',
        ]);

        $program->update($validated);
        return response()->json($program->load(['institution']));
    }

    public function destroy(Program $program): JsonResponse
    {
        $program->delete();
        return response()->json(null, 204);
    }
}
