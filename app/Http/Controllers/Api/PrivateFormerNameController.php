<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrivateFormerName;
use Illuminate\Http\Request;

class PrivateFormerNameController extends Controller
{
    public function index()
    {
        return PrivateFormerName::all();
    }

    public function show($id)
    {
        return PrivateFormerName::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'private_detail_id' => 'required|exists:private_details,id',
            'former_name' => 'required|string|max:255',
            'year_used' => 'nullable|integer',
        ]);
        $formerName = PrivateFormerName::create($validated);
        return response()->json($formerName, 201);
    }

    public function update(Request $request, $id)
    {
        $formerName = PrivateFormerName::findOrFail($id);
        $validated = $request->validate([
            'private_detail_id' => 'sometimes|exists:private_details,id',
            'former_name' => 'sometimes|string|max:255',
            'year_used' => 'nullable|integer',
        ]);
        $formerName->update($validated);
        return response()->json($formerName);
    }

    public function destroy($id)
    {
        $formerName = PrivateFormerName::findOrFail($id);
        $formerName->delete();
        return response()->json(null, 204);
    }
}