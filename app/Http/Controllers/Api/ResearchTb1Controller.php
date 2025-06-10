<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ResearchTb1;
use Illuminate\Http\Request;

class ResearchTb1Controller extends Controller
{
    public function index()
    {
        $researchTb1s = ResearchTb1::with('hei')->get();
        return response()->json($researchTb1s);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hei_uiid' => 'required|string',
            'title_of_article' => 'required|string',
            'authors' => 'required|string',
            'keywords' => 'nullable|string',
            'name_of_book_journal' => 'nullable|string',
            'editors' => 'nullable|string',
            'vol_no_issue_no' => 'nullable|string',
            'no_of_pages' => 'nullable|string',
            'year_of_publication' => 'nullable|string'
        ]);

        $researchTb1 = ResearchTb1::create($validated);
        return response()->json($researchTb1, 201);
    }

    public function show(ResearchTb1 $researchTb1)
    {
        return response()->json($researchTb1->load('hei'));
    }

    public function update(Request $request, ResearchTb1 $researchTb1)
    {
        $validated = $request->validate([
            'hei_uiid' => 'string',
            'title_of_article' => 'string',
            'keywords' => 'string',
            'authors' => 'string',
            'name_of_book_journal' => 'string',
            'editors' => 'string',
            'vol_no_issue_no' => 'string',
            'no_of_pages' => 'string',
            'year_of_publication' => 'string'
        ]);

        $researchTb1->update($validated);
        return response()->json($researchTb1);
    }

    public function destroy(ResearchTb1 $researchTb1)
    {
        $researchTb1->delete();
        return response()->json(null, 204);
    }

    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'records' => 'required|array',
            'records.*.hei_uiid' => 'required|string',
            'records.*.title_of_article' => 'required|string',
            'records.*.authors' => 'required|string',
            'records.*.keywords' => 'nullable|string',
            'records.*.name_of_book_journal' => 'nullable|string',
            'records.*.editors' => 'nullable|string',
            'records.*.vol_no_issue_no' => 'nullable|string',
            'records.*.no_of_pages' => 'nullable|string',
            'records.*.year_of_publication' => 'nullable|string'
        ]);

        $records = collect($validated['records'])->map(function ($record) {
            return ResearchTb1::create($record);
        });

        return response()->json($records, 201);
    }
}