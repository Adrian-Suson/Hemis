<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ReportYear;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReportYearController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $reportYears = ReportYear::all();
        return response()->json($reportYears);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'year' => 'required|integer|unique:report_years,year',
        ]);

        $reportYear = ReportYear::create($validated);
        return response()->json($reportYear, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ReportYear $reportYear): JsonResponse
    {
        return response()->json($reportYear);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ReportYear $reportYear): JsonResponse
    {
        $validated = $request->validate([
            'year' => 'required|integer|unique:report_years,year,' . $reportYear->id,
        ]);

        $reportYear->update($validated);
        return response()->json($reportYear);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ReportYear $reportYear): JsonResponse
    {
        $reportYear->delete();
        return response()->json(['message' => 'Report year deleted successfully.']);
    }
}
