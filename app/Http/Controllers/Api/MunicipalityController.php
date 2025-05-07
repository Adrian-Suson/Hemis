<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Municipality;
use Illuminate\Http\Request;

class MunicipalityController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('province_id')) {
            return Municipality::where('province_id', $request->input('province_id'))
                ->orderBy('name', 'asc')
                ->get();
        }
        return Municipality::orderBy('name', 'asc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'province_id' => 'required|exists:provinces,id',
        ]);
        return Municipality::create($validated);
    }

    public function show(Municipality $municipality)
    {
        return $municipality;
    }

    public function update(Request $request, Municipality $municipality)
    {
        $validated = $request->validate([
            'name' => 'required',
            'province_id' => 'required|exists:provinces,id',
        ]);
        $municipality->update($validated);
        return $municipality;
    }

    public function destroy(Municipality $municipality)
    {
        $municipality->delete();
        return response()->noContent();
    }
}