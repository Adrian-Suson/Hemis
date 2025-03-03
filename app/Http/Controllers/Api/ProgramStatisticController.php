<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProgramStatistic;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProgramStatisticController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'program_id' => 'required|exists:programs,id|unique:program_statistics',
            'lecture_units_actual' => 'nullable|numeric',
            'laboratory_units_actual' => 'nullable|numeric',
            'total_units_actual' => 'nullable|numeric',
            'graduates_males' => 'nullable|integer',
            'graduates_females' => 'nullable|integer',
            'graduates_total' => 'nullable|integer',
            'externally_funded_merit_scholars' => 'nullable|integer',
            'internally_funded_grantees' => 'nullable|integer',
            'suc_funded_grantees' => 'nullable|integer',
        ]);

        $statistic = ProgramStatistic::create($validated);
        return response()->json($statistic->load('program'), 201);
    }
}
