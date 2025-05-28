<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SucNfResearchForm;
use Illuminate\Http\Request;

class SucNfResearchFormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $researchForms = SucNfResearchForm::with(['sucDetail'])->get();
        return response()->json($researchForms);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'suc_details_id' => 'required|exists:suc_details,id',
            'title_of_article' => 'required|string|max:255',
            'keywords' => 'nullable|string|max:255',
            'authors' => 'nullable|string|max:255',
            'book_or_journal_name' => 'nullable|string|max:255',
            'editors' => 'nullable|string|max:255',
            'volume_or_issue' => 'nullable|string|max:255',
            'number_of_pages' => 'nullable|integer',
            'year_of_publication' => 'nullable|integer',
            'type_of_publication' => 'nullable|string|max:255',
        ]);

        $researchForm = SucNfResearchForm::create($validatedData);
        return response()->json($researchForm, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $researchForm = SucNfResearchForm::with(['sucDetail'])->findOrFail($id);
        return response()->json($researchForm);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $researchForm = SucNfResearchForm::findOrFail($id);

        $validatedData = $request->validate([
            'suc_details_id' => 'sometimes|exists:suc_details,id',
            'title_of_article' => 'sometimes|string|max:255',
            'keywords' => 'nullable|string|max:255',
            'authors' => 'nullable|string|max:255',
            'book_or_journal_name' => 'nullable|string|max:255',
            'editors' => 'nullable|string|max:255',
            'volume_or_issue' => 'nullable|string|max:255',
            'number_of_pages' => 'nullable|integer',
            'year_of_publication' => 'nullable|integer',
            'type_of_publication' => 'nullable|string|max:255',
        ]);

        $researchForm->update($validatedData);
        return response()->json($researchForm);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $researchForm = SucNfResearchForm::findOrFail($id);
        $researchForm->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
