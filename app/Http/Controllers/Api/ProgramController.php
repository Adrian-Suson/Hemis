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
        $programs = Program::with('institution', 'enrollment', 'programStatistic')->get();
        return response()->json([
            'status' => 'success',
            'data' => $programs
        ], 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'institution_id' => 'required|exists:institutions,id',
            'program_name' => 'required|string|max:255',
            'program_code' => 'nullable|integer',
            'major_name' => 'nullable|string|max:255',
            'major_code' => 'nullable|integer',
            'category' => 'nullable|string|max:100',
            'serial' => 'nullable|string|max:255',
            'year' => 'nullable|integer',
            'is_thesis_dissertation_required' => 'nullable|in:1,2,3',
            'program_status' => 'nullable|in:1,2,3,4',
            'calendar_use_code' => 'nullable|in:1,2,3',
            'program_normal_length_in_years' => 'nullable|integer',
            'lab_units' => 'nullable|integer',
            'lecture_units' => 'nullable|integer',
            'total_units' => 'nullable|integer',
            'tuition_per_unit' => 'nullable|numeric',
            'program_fee' => 'nullable|numeric',
            'program_type' => 'nullable|string|max:255',
        ]);

        $program = Program::create($validated);
        return response()->json([
            'status' => 'success',
            'message' => 'Program created successfully',
            'data' => $program->load('institution')
        ], 201);
    }

    public function show(Program $program): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $program->load('institution', 'enrollment', 'programStatistic')
        ], 200);
    }

    public function update(Request $request, Program $program): JsonResponse
    {
        $validated = $request->validate([
            'institution_id' => 'sometimes|exists:institutions,id',
            'program_name' => 'sometimes|string|max:255',
            'program_code' => 'nullable|integer',
            'major_name' => 'nullable|string|max:255',
            'major_code' => 'nullable|integer',
            'category' => 'nullable|string|max:100',
            'serial' => 'nullable|string|max:255',
            'year' => 'nullable|integer',
            'is_thesis_dissertation_required' => 'nullable|in:1,2,3',
            'program_status' => 'nullable|in:1,2,3,4',
            'calendar_use_code' => 'nullable|in:1,2,3',
            'program_normal_length_in_years' => 'nullable|integer',
            'lab_units' => 'nullable|integer',
            'lecture_units' => 'nullable|integer',
            'total_units' => 'nullable|integer',
            'tuition_per_unit' => 'nullable|numeric',
            'program_fee' => 'nullable|numeric',
            'program_type' => 'nullable|string|max:255',
        ]);

        $program->update($validated);
        return response()->json([
            'status' => 'success',
            'message' => 'Program updated successfully',
            'data' => $program->load('institution')
        ], 200);
    }

    public function destroy(Program $program): JsonResponse
    {
        $program->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Program deleted successfully'
        ], 204);
    }
}
