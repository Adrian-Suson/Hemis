<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProgramStatistic;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProgramStatisticController extends Controller
{
    public function index(): JsonResponse
    {
        $statistics = ProgramStatistic::with('program')->get();
        return response()->json([
            'status' => 'success',
            'data' => $statistics
        ], 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'program_id' => 'required|exists:programs,id',
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

        $statistic = ProgramStatistic::create($validated);
        return response()->json([
            'status' => 'success',
            'message' => 'Program statistic created successfully',
            'data' => $statistic->load('program')
        ], 201);
    }

    public function show(ProgramStatistic $programStatistic): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $programStatistic->load('program')
        ], 200);
    }

    public function update(Request $request, ProgramStatistic $programStatistic): JsonResponse
    {
        $validated = $request->validate([
            'program_id' => 'sometimes|exists:programs,id',
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

        $programStatistic->update($validated);
        return response()->json([
            'status' => 'success',
            'message' => 'Program statistic updated successfully',
            'data' => $programStatistic->load('program')
        ], 200);
    }

    public function destroy(ProgramStatistic $programStatistic): JsonResponse
    {
        $programStatistic->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Program statistic deleted successfully'
        ], 204);
    }
}
