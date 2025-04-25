<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class CurricularProgramController extends Controller
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
            Log::error("Error fetching programs: {$e->getMessage()}", [
                'request' => $request->all(),
                'exception' => $e,
            ]);
            return response()->json(['error' => 'Failed to fetch programs.'], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'institution_id' => 'required|exists:institutions,id',
                'data_date' => 'required|date',
                'program_name' => [
                    'required',
                    'string',
                    'max:255',
                    'not_regex:/please enumerate/i',
                ],
                'program_code' => 'nullable|integer',
                'major_name' => 'nullable|string|max:255',
                'major_code' => 'nullable|integer',
                'category' => 'nullable|string|max:255',
                'serial' => 'nullable|string|max:255',
                'Year' => 'nullable|string|max:255',
                'is_thesis_dissertation_required' => 'nullable|string|max:255',
                'program_status' => 'nullable|string|max:255',
                'calendar_use_code' => 'nullable|string|max:255',
                'program_normal_length_in_years' => 'nullable|integer|min:0',
                'lab_units' => 'nullable|integer|min:0',
                'lecture_units' => 'nullable|integer|min:0',
                'total_units' => 'nullable|integer|min:0',
                'tuition_per_unit' => 'nullable|numeric|min:0',
                'program_fee' => 'nullable|numeric|min:0',
                'program_type' => 'nullable|string|max:255',
                'new_students_freshmen_male' => 'nullable|integer|min:0',
                'new_students_freshmen_female' => 'nullable|integer|min:0',
                '1st_year_male' => 'nullable|integer|min:0',
                '1st_year_female' => 'nullable|integer|min:0',
                '2nd_year_male' => 'nullable|integer|min:0',
                '2nd_year_female' => 'nullable|integer|min:0',
                '3rd_year_male' => 'nullable|integer|min:0',
                '3rd_year_female' => 'nullable|integer|min:0',
                '4th_year_male' => 'nullable|integer|min:0',
                '4th_year_female' => 'nullable|integer|min:0',
                '5th_year_male' => 'nullable|integer|min:0',
                '5th_year_female' => 'nullable|integer|min:0',
                '6th_year_male' => 'nullable|integer|min:0',
                '6th_year_female' => 'nullable|integer|min:0',
                '7th_year_male' => 'nullable|integer|min:0',
                '7th_year_female' => 'nullable|integer|min:0',
                'subtotal_male' => 'nullable|integer|min:0',
                'subtotal_female' => 'nullable|integer|min:0',
                'grand_total' => 'nullable|integer|min:0',
                'lecture_units_actual' => 'nullable|integer|min:0',
                'laboratory_units_actual' => 'nullable|integer|min:0',
                'total_units_actual' => 'nullable|integer|min:0',
                'graduates_males' => 'nullable|integer|min:0',
                'graduates_females' => 'nullable|integer|min:0',
                'graduates_total' => 'nullable|integer|min:0',
                'externally_funded_merit_scholars' => 'nullable|integer|min:0',
                'internally_funded_grantees' => 'nullable|integer|min:0',
                'suc_funded_grantees' => 'nullable|integer|min:0',
            ]);

            // Calculate enrollment totals
            $maleTotal =
                ($validated['new_students_freshmen_male'] ?? 0) +
                ($validated['1st_year_male'] ?? 0) +
                ($validated['2nd_year_male'] ?? 0) +
                ($validated['3rd_year_male'] ?? 0) +
                ($validated['4th_year_male'] ?? 0) +
                ($validated['5th_year_male'] ?? 0) +
                ($validated['6th_year_male'] ?? 0) +
                ($validated['7th_year_male'] ?? 0);
            $femaleTotal =
                ($validated['new_students_freshmen_female'] ?? 0) +
                ($validated['1st_year_female'] ?? 0) +
                ($validated['2nd_year_female'] ?? 0) +
                ($validated['3rd_year_female'] ?? 0) +
                ($validated['4th_year_female'] ?? 0) +
                ($validated['5th_year_female'] ?? 0) +
                ($validated['6th_year_female'] ?? 0) +
                ($validated['7th_year_female'] ?? 0);
            $validated['subtotal_male'] = $maleTotal;
            $validated['subtotal_female'] = $femaleTotal;
            $validated['grand_total'] = $maleTotal + $femaleTotal;

            // Calculate statistics totals
            $validated['total_units_actual'] =
                ($validated['lecture_units_actual'] ?? 0) +
                ($validated['laboratory_units_actual'] ?? 0);
            $validated['graduates_total'] =
                ($validated['graduates_males'] ?? 0) +
                ($validated['graduates_females'] ?? 0);

            $program = Program::create($validated);
            return response()->json($program->load(['institution']), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error("Validation error storing program: {$e->getMessage()}", [
                'request' => $request->all(),
                'errors' => $e->errors(),
            ]);
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error("Error storing program: {$e->getMessage()}", [
                'request' => $request->all(),
                'exception' => $e,
            ]);
            return response()->json(['error' => 'Failed to store program.'], 500);
        }
    }

    public function show(Program $program): JsonResponse
    {
        return response()->json($program->load(['institution']));
    }

    public function update(Request $request, Program $program): JsonResponse
    {
        try {
            $validated = $request->validate([
                'institution_id' => 'required|exists:institutions,id',
                'data_date' => 'required|date',
                'program_name' => [
                    'required',
                    'string',
                    'max:255',
                    'not_regex:/please enumerate/i',
                ],
                'program_code' => 'nullable|integer',
                'major_name' => 'nullable|string|max:255',
                'major_code' => 'nullable|integer',
                'category' => 'nullable|string|max:255',
                'serial' => 'nullable|string|max:255',
                'Year' => 'nullable|string|max:255',
                'is_thesis_dissertation_required' => 'nullable|string|max:255',
                'program_status' => 'nullable|string|max:255',
                'calendar_use_code' => 'nullable|string|max:255',
                'program_normal_length_in_years' => 'nullable|integer|min:0',
                'lab_units' => 'nullable|integer|min:0',
                'lecture_units' => 'nullable|integer|min:0',
                'total_units' => 'nullable|integer|min:0',
                'tuition_per_unit' => 'nullable|numeric|min:0',
                'program_fee' => 'nullable|numeric|min:0',
                'program_type' => 'nullable|string|max:255',
                'new_students_freshmen_male' => 'nullable|integer|min:0',
                'new_students_freshmen_female' => 'nullable|integer|min:0',
                '1st_year_male' => 'nullable|integer|min:0',
                '1st_year_female' => 'nullable|integer|min:0',
                '2nd_year_male' => 'nullable|integer|min:0',
                '2nd_year_female' => 'nullable|integer|min:0',
                '3rd_year_male' => 'nullable|integer|min:0',
                '3rd_year_female' => 'nullable|integer|min:0',
                '4th_year_male' => 'nullable|integer|min:0',
                '4th_year_female' => 'nullable|integer|min:0',
                '5th_year_male' => 'nullable|integer|min:0',
                '5th_year_female' => 'nullable|integer|min:0',
                '6th_year_male' => 'nullable|integer|min:0',
                '6th_year_female' => 'nullable|integer|min:0',
                '7th_year_male' => 'nullable|integer|min:0',
                '7th_year_female' => 'nullable|integer|min:0',
                'subtotal_male' => 'nullable|integer|min:0',
                'subtotal_female' => 'nullable|integer|min:0',
                'grand_total' => 'nullable|integer|min:0',
                'lecture_units_actual' => 'nullable|integer|min:0',
                'laboratory_units_actual' => 'nullable|integer|min:0',
                'total_units_actual' => 'nullable|integer|min:0',
                'graduates_males' => 'nullable|integer|min:0',
                'graduates_females' => 'nullable|integer|min:0',
                'graduates_total' => 'nullable|integer|min:0',
                'externally_funded_merit_scholars' => 'nullable|integer|min:0',
                'internally_funded_grantees' => 'nullable|integer|min:0',
                'suc_funded_grantees' => 'nullable|integer|min:0',
            ]);

            // Calculate enrollment totals
            $maleTotal =
                ($validated['new_students_freshmen_male'] ?? 0) +
                ($validated['1st_year_male'] ?? 0) +
                ($validated['2nd_year_male'] ?? 0) +
                ($validated['3rd_year_male'] ?? 0) +
                ($validated['4th_year_male'] ?? 0) +
                ($validated['5th_year_male'] ?? 0) +
                ($validated['6th_year_male'] ?? 0) +
                ($validated['7th_year_male'] ?? 0);
            $femaleTotal =
                ($validated['new_students_freshmen_female'] ?? 0) +
                ($validated['1st_year_female'] ?? 0) +
                ($validated['2nd_year_female'] ?? 0) +
                ($validated['3rd_year_female'] ?? 0) +
                ($validated['4th_year_female'] ?? 0) +
                ($validated['5th_year_female'] ?? 0) +
                ($validated['6th_year_female'] ?? 0) +
                ($validated['7th_year_female'] ?? 0);
            $validated['subtotal_male'] = $maleTotal;
            $validated['subtotal_female'] = $femaleTotal;
            $validated['grand_total'] = $maleTotal + $femaleTotal;

            // Calculate statistics totals
            $validated['total_units_actual'] =
                ($validated['lecture_units_actual'] ?? 0) +
                ($validated['laboratory_units_actual'] ?? 0);
            $validated['graduates_total'] =
                ($validated['graduates_males'] ?? 0) +
                ($validated['graduates_females'] ?? 0);

            $program->update($validated);
            return response()->json($program->load(['institution']));
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error("Validation error updating program ID {$program->id}: {$e->getMessage()}", [
                'request' => $request->all(),
                'errors' => $e->errors(),
            ]);
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error("Error updating program ID {$program->id}: {$e->getMessage()}", [
                'request' => $request->all(),
                'exception' => $e,
            ]);
            return response()->json(['error' => 'Failed to update program.'], 500);
        }
    }

    public function destroy(Program $program): JsonResponse
    {
        try {
            $program->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            Log::error("Error deleting program ID {$program->id}: {$e->getMessage()}", [
                'exception' => $e,
            ]);
            return response()->json(['error' => 'Failed to delete program.'], 500);
        }
    }
}