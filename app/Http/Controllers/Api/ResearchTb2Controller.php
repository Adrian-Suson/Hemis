<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ResearchTb2;
use Illuminate\Http\Request;

class ResearchTb2Controller extends Controller
{
    public function index()
    {
        $researchTb2s = ResearchTb2::with('hei')->get();
        return response()->json($researchTb2s);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hei_uiid' => 'required|string',
            'title_of_research_paper' => 'required|string',
            'researchers' => 'required|string',
            'keywords' => 'nullable|string',
            'conference_title' => 'nullable|string',
            'conference_venue' => 'nullable|string',
            'conference_date' => 'nullable|string',
            'conference_organizer' => 'nullable|string',
            'type_of_conference' => 'nullable|string'
        ]);

        $researchTb2 = ResearchTb2::create($validated);
        return response()->json($researchTb2, 201);
    }

    public function show(ResearchTb2 $researchTb2)
    {
        return response()->json($researchTb2->load('hei'));
    }

    public function update(Request $request, ResearchTb2 $researchTb2)
    {
        $validated = $request->validate([
            'hei_uiid' => 'string',
            'title_of_research_paper' => 'string',
            'keywords' => 'string',
            'researchers' => 'string',
            'conference_title' => 'string',
            'conference_venue' => 'string',
            'conference_date' => 'string',
            'conference_organizer' => 'string',
            'type_of_conference' => 'string'
        ]);

        $researchTb2->update($validated);
        return response()->json($researchTb2);
    }

    public function destroy(ResearchTb2 $researchTb2)
    {
        $researchTb2->delete();
        return response()->json(null, 204);
    }

    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'records' => 'required|array',
            'records.*.hei_uiid' => 'required|string',
            'records.*.title_of_research_paper' => 'required|string',
            'records.*.researchers' => 'required|string',
            'records.*.keywords' => 'nullable|string',
            'records.*.conference_title' => 'nullable|string',
            'records.*.conference_venue' => 'nullable|string',
            'records.*.conference_date' => 'nullable|string',
            'records.*.conference_organizer' => 'nullable|string',
            'records.*.type_of_conference' => 'nullable|string'
        ]);

        $records = collect($validated['records'])->map(function ($record) {
            return ResearchTb2::create($record);
        });

        return response()->json($records, 201);
    }
}
