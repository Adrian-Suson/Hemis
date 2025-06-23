<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LucFormerName;
use Illuminate\Http\Request;

class LucFormerNameController extends Controller
{
    public function index()
    {
        return LucFormerName::all();
    }

    public function show($id)
    {
        return LucFormerName::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'luc_detail_id' => 'required|exists:luc_details,id',
            'former_name' => 'required|string|max:255',
            'year_used' => 'nullable|integer',
        ]);
        $formerName = LucFormerName::create($validated);
        return response()->json($formerName, 201);
    }

    public function update(Request $request, $id)
    {
        $formerName = LucFormerName::findOrFail($id);
        $validated = $request->validate([
            'luc_detail_id' => 'sometimes|exists:luc_details,id',
            'former_name' => 'sometimes|string|max:255',
            'year_used' => 'nullable|integer',
        ]);
        $formerName->update($validated);
        return response()->json($formerName);
    }

    public function destroy($id)
    {
        $formerName = LucFormerName::findOrFail($id);
        $formerName->delete();
        return response()->json(null, 204);
    }
}