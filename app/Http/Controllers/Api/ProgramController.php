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
        // Start the query with eager loading
        $query = Program::with(['institution', 'enrollments', 'statistics']);

        // Filter by institution_id if provided
        if ($request->has('institution_id')) {
            $query->where('institution_id', $request->query('institution_id'));
        }

        // Filter by program_type if provided
        if ($request->has('program_type')) {
            $query->where('program_type', $request->query('program_type'));
        }

        // Execute the query and get the results
        $programs = $query->get();

        // Return the filtered programs as JSON
        return response()->json($programs);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'institution_id' => 'required|exists:institutions,id',
            'program_name' => 'required|string|max:255',
            'program_code' => 'nullable|numeric',
            'major_name' => 'required|string|max:255',
            'major_code' => 'nullable|numeric',
            'category' => 'nullable|string|max:255',
            'serial' => 'nullable|integer|max:255',
            'year' => 'nullable|integer|min:1900|max:' . date('Y'),
            'is_thesis_dissertation_required' => 'nullable|in:1,2,3',
            'program_status' => 'nullable|in:1,2,3,4',
            'calendar_use_code' => 'nullable|in:1,2,3',
            'program_normal_length_in_years' => 'nullable|integer',
            'lab_units' => 'nullable|numeric',
            'lecture_units' => 'nullable|numeric',
            'total_units' => 'nullable|numeric',
            'tuition_per_unit' => 'nullable|numeric',
            'program_fee' => 'nullable|numeric',
            'program_type' => 'nullable|string|max:255',
        ]);

        $program = Program::create($validated);
        return response()->json($program->load(['institution', 'enrollments', 'statistics']), 201);
    }

    public function show(Program $program): JsonResponse
    {
        return response()->json($program->load(['institution', 'enrollments', 'statistics']));
    }

    public function update(Request $request, Program $program): JsonResponse
    {
        $validated = $request->validate([
            'institution_id' => 'sometimes|required|exists:institutions,id',
            'program_name' => 'sometimes|required|string|max:255',
            'program_code' => 'nullable|string|max:6|unique:programs,program_code,' . $program->id,
            'authority_to_offer_program' => 'nullable|string|max:100',
            'is_thesis_dissertation_required' => 'nullable|in:2-OPTIONAL,3-NOT REQ',
            'program_status' => 'nullable|in:ACTIVE,PHASED OUT,ABOLISHED,4-DISTANCE MODE',
            'calendar_use_code' => 'nullable|in:1-SEM,2-TRISEM,3-QTR SEM',
            'program_normal_length_in_years' => 'nullable|integer',
            'lab_units' => 'nullable|numeric',
            'lecture_units' => 'nullable|numeric',
            'total_units' => 'nullable|numeric',
            'tuition_per_unit' => 'nullable|numeric',
            'program_fee' => 'nullable|numeric',
        ]);

        $program->update($validated);
        return response()->json($program->load(['institution', 'enrollments', 'statistics']));
    }

    public function destroy(Program $program): JsonResponse
    {
        $program->delete();
        return response()->json(null, 204);
    }
}
