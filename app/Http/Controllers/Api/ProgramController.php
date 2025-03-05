<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProgramController extends Controller
{
    public function index(): JsonResponse
    {
        $programs = Program::with(['institution', 'enrollments', 'statistics'])->get();
        return response()->json($programs);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'institution_id' => 'required|exists:institutions,id',
            'program_name' => 'required|string|max:255',
            'program_code' => 'nullable|string|max:6|unique:programs',
            'major_name' => 'required|string|max:255',
            'major_code' => 'nullable|string|max:6|unique:programs',
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
