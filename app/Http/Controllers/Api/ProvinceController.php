<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Province;
use Illuminate\Http\Request;

class ProvinceController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('region_id')) {
            return Province::where('region_id', $request->input('region_id'))
                ->orderBy('name', 'asc')
                ->get();
        }
        return Province::orderBy('name', 'asc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'region_id' => 'required|exists:regions,id',
        ]);
        return Province::create($validated);
    }

    public function show(Province $province)
    {
        return $province;
    }

    public function update(Request $request, Province $province)
    {
        $validated = $request->validate([
            'name' => 'required',
            'region_id' => 'required|exists:regions,id',
        ]);
        $province->update($validated);
        return $province;
    }

    public function destroy(Province $province)
    {
        $province->delete();
        return response()->noContent();
    }
}