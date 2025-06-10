<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ResearchTb3;
use Illuminate\Http\Request;

class ResearchTb3Controller extends Controller
{
    public function index()
    {
        $researchTb3s = ResearchTb3::with('hei')->get();
        return response()->json($researchTb3s);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hei_uiid' => 'required|string',
            'inventions' => 'required|string',
            'patent_number' => 'required|string',
            'date_of_issue' => 'nullable|date',
            'utilization_development' => 'nullable|boolean',
            'utilization_service' => 'nullable|boolean',
            'name_of_commercial_product' => 'nullable|string',
            'points' => 'nullable|numeric'
        ]);

        $researchTb3 = ResearchTb3::create($validated);
        return response()->json($researchTb3, 201);
    }

    public function show(ResearchTb3 $researchTb3)
    {
        return response()->json($researchTb3->load('hei'));
    }

    public function update(Request $request, ResearchTb3 $researchTb3)
    {
        $validated = $request->validate([
            'hei_uiid' => 'string',
            'inventions' => 'string',
            'patent_number' => 'string',
            'date_of_issue' => 'date',
            'utilization_development' => 'boolean',
            'utilization_service' => 'boolean',
            'name_of_commercial_product' => 'string',
            'points' => 'numeric'
        ]);

        $researchTb3->update($validated);
        return response()->json($researchTb3);
    }

    public function destroy(ResearchTb3 $researchTb3)
    {
        $researchTb3->delete();
        return response()->json(null, 204);
    }

    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'records' => 'required|array',
            'records.*.hei_uiid' => 'required|string',
            'records.*.inventions' => 'required|string',
            'records.*.patent_number' => 'required|string',
            'records.*.date_of_issue' => 'nullable|date',
            'records.*.utilization_development' => 'nullable|boolean',
            'records.*.utilization_service' => 'nullable|boolean',
            'records.*.name_of_commercial_product' => 'nullable|string',
            'records.*.points' => 'nullable|numeric'
        ]);

        $records = collect($validated['records'])->map(function ($record) {
            return ResearchTb3::create($record);
        });

        return response()->json($records, 201);
    }
}
