<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Region;
use Illuminate\Http\Request;

class RegionController extends Controller
{
    public function index()
    {
        return Region::orderBy('name', 'asc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|unique:regions,name',
        ]);
        return Region::create($validated);
    }

    public function show(Region $region)
    {
        return $region;
    }

    public function update(Request $request, Region $region)
    {
        $validated = $request->validate([
            'name' => 'required|unique:regions,name,' . $region->id,
        ]);
        $region->update($validated);
        return $region;
    }

    public function destroy(Region $region)
    {
        $region->delete();
        return response()->noContent();
    }
}
