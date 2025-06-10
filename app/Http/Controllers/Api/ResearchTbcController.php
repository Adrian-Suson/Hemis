<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ResearchTbc;
use App\Models\ResearchTb1;
use App\Models\ResearchTb2;
use App\Models\ResearchTb3;
use App\Models\ResearchTb4;
use App\Models\ResearchTb5;
use Illuminate\Http\Request;

class ResearchTbcController extends Controller
{
    public function index()
    {
        $researchTbcs = ResearchTbc::with('hei')->get();
        return response()->json($researchTbcs);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hei_uiid' => 'required|string',
            'title' => 'required|string',
            'keywords' => 'nullable|string',
            'duration_number_of_hours' => 'required|string',
            'number_of_trainees_beneficiaries' => 'nullable|string',
            'citation_title' => 'nullable|string',
            'citation_confering_agency_body' => 'nullable|string',
            'citation_year_received' => 'nullable|string'
        ]);

        $researchTbc = ResearchTbc::create($validated);
        return response()->json($researchTbc, 201);
    }

    public function show(ResearchTbc $researchTbc)
    {
        return response()->json($researchTbc->load('hei'));
    }

    public function update(Request $request, ResearchTbc $researchTbc)
    {
        $validated = $request->validate([
            'hei_uiid' => 'string',
            'title' => 'string',
            'keywords' => 'string',
            'duration_number_of_hours' => 'string',
            'number_of_trainees_beneficiaries' => 'string',
            'citation_title' => 'string',
            'citation_confering_agency_body' => 'string',
            'citation_year_received' => 'string'
        ]);

        $researchTbc->update($validated);
        return response()->json($researchTbc);
    }

    public function destroy(ResearchTbc $researchTbc)
    {
        $researchTbc->delete();
        return response()->json(null, 204);
    }

    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'records' => 'required|array',
            'records.*.hei_uiid' => 'required|string',
            'records.*.title' => 'required|string',
            'records.*.keywords' => 'nullable|string',
            'records.*.duration_number_of_hours' => 'required|string',
            'records.*.number_of_trainees_beneficiaries' => 'nullable|string',
            'records.*.citation_title' => 'nullable|string',
            'records.*.citation_confering_agency_body' => 'nullable|string',
            'records.*.citation_year_received' => 'nullable|string'
        ]);

        $records = collect($validated['records'])->map(function ($record) {
            return ResearchTbc::create($record);
        });

        return response()->json($records, 201);
    }

    public function getAllResearch($hei_id)
    {
        try {
            $researchData = [
                'research_tb1' => ResearchTb1::where('hei_uiid', $hei_id)->with('hei')->get(),
                'research_tb2' => ResearchTb2::where('hei_uiid', $hei_id)->with('hei')->get(),
                'research_tb3' => ResearchTb3::where('hei_uiid', $hei_id)->with('hei')->get(),
                'research_tb4' => ResearchTb4::where('hei_uiid', $hei_id)->with('hei')->get(),
                'research_tb5' => ResearchTb5::where('hei_uiid', $hei_id)->with('hei')->get(),
                'research_tbc' => ResearchTbc::where('hei_uiid', $hei_id)->with('hei')->get(),
            ];

            return response()->json($researchData);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch research data: ' . $e->getMessage()], 500);
        }
    }
}