<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ResearchTb4;
use Illuminate\Http\Request;

class ResearchTb4Controller extends Controller
{
    public function index()
    {
        $researchTb4s = ResearchTb4::with('hei')->get();
        return response()->json($researchTb4s);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hei_uiid' => 'required|string',
            'keywords' => 'nullable|string',
            'researchers' => 'nullable|string',
            'citing_authors' => 'required|string',
            'citing_article_title' => 'required|string',
            'journal_title' => 'nullable|string',
            'vol_issue_page_no' => 'nullable|string',
            'city_year_published' => 'nullable|string',
            'publisher_name' => 'nullable|string'
        ]);

        $researchTb4 = ResearchTb4::create($validated);
        return response()->json($researchTb4, 201);
    }

    public function show(ResearchTb4 $researchTb4)
    {
        return response()->json($researchTb4->load('hei'));
    }

    public function update(Request $request, ResearchTb4 $researchTb4)
    {
        $validated = $request->validate([
            'hei_uiid' => 'string',
            'keywords' => 'string',
            'researchers' => 'string',
            'citing_authors' => 'string',
            'citing_article_title' => 'string',
            'journal_title' => 'string',
            'vol_issue_page_no' => 'string',
            'city_year_published' => 'string',
            'publisher_name' => 'string'
        ]);

        $researchTb4->update($validated);
        return response()->json($researchTb4);
    }

    public function destroy(ResearchTb4 $researchTb4)
    {
        $researchTb4->delete();
        return response()->json(null, 204);
    }

    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'records' => 'required|array',
            'records.*.hei_uiid' => 'required|string',
            'records.*.keywords' => 'nullable|string',
            'records.*.researchers' => 'nullable|string',
            'records.*.citing_authors' => 'required|string',
            'records.*.citing_article_title' => 'required|string',
            'records.*.journal_title' => 'nullable|string',
            'records.*.vol_issue_page_no' => 'nullable|string',
            'records.*.city_year_published' => 'nullable|string',
            'records.*.publisher_name' => 'nullable|string'
        ]);

        $records = collect($validated['records'])->map(function ($record) {
            return ResearchTb4::create($record);
        });

        return response()->json($records, 201);
    }
}
