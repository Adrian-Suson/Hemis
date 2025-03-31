<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProgramStatistic;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProgramStatisticController extends Controller
{
    /**
     * Display a listing of all program statistics.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $statistics = ProgramStatistic::with('program')->get();
        return response()->json($statistics);
    }

    /**
     * Store a newly created program statistic in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
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

    /**
     * Update the specified program statistic in storage.
     *
     * @param Request $request
     * @param ProgramStatistic $statistic
     * @return JsonResponse
     */
    public function update(Request $request, ProgramStatistic $statistic): JsonResponse
    {
        $validated = $request->validate([
            'program_id' => 'sometimes|required|exists:programs,id|unique:program_statistics,program_id,' . $statistic->id,
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

        $statistic->update($validated);
        return response()->json($statistic->load('program'));
    }
}
