<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ResearchTb5;
use Illuminate\Http\Request;

class ResearchTb5Controller extends Controller
{
    public function index()
    {
        $researchTb5s = ResearchTb5::with('hei')->get();
        return response()->json($researchTb5s);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hei_uiid' => 'required|string',
            'name_of_researcher' => 'required|string',
            'title_of_research_output_award' => 'required|string',
            'year_published_accepted_presented_received' => 'nullable|string',
            'publisher_conference_organizer_confering_body' => 'nullable|string'
        ]);

        $researchTb5 = ResearchTb5::create($validated);
        return response()->json($researchTb5, 201);
    }

    public function show(ResearchTb5 $researchTb5)
    {
        return response()->json($researchTb5->load('hei'));
    }

    public function update(Request $request, ResearchTb5 $researchTb5)
    {
        $validated = $request->validate([
            'hei_uiid' => 'string',
            'name_of_researcher' => 'string',
            'title_of_research_output_award' => 'string',
            'year_published_accepted_presented_received' => 'string',
            'publisher_conference_organizer_confering_body' => 'string'
        ]);

        $researchTb5->update($validated);
        return response()->json($researchTb5);
    }

    public function destroy(ResearchTb5 $researchTb5)
    {
        $researchTb5->delete();
        return response()->json(null, 204);
    }

    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'records' => 'required|array',
            'records.*.hei_uiid' => 'required|string',
            'records.*.name_of_researcher' => 'required|string',
            'records.*.title_of_research_output_award' => 'required|string',
            'records.*.year_published_accepted_presented_received' => 'nullable|string',
            'records.*.publisher_conference_organizer_confering_body' => 'nullable|string'
        ]);

        $records = collect($validated['records'])->map(function ($record) {
            return ResearchTb5::create($record);
        });

        return response()->json($records, 201);
    }
}