<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hei;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HeiController extends Controller
{
    /**
     * Display a listing of the HEIs.
     */
    public function index()
    {
        $heis = Hei::with(['cluster', 'lucDetails', 'privateDetails', 'sucDetails'])->get();
        return response()->json($heis);
    }

    /**
     * Store a newly created HEI in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'uiid' => 'required|string|max:36|unique:heis',
            'name' => 'required|string|max:255',
            'type' => 'required|in:SUC,LUC,Private',
            'cluster_id' => 'required|exists:clusters,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $hei = Hei::create($request->all());
        return response()->json($hei, 201);
    }

    /**
     * Display the specified HEI.
     */
    public function show(Hei $hei)
    {
        return response()->json($hei->load(['cluster', 'lucDetails', 'privateDetails', 'sucDetails']));
    }

    /**
     * Update the specified HEI in storage.
     */
    public function update(Request $request, Hei $hei)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'type' => 'in:SUC,LUC,Private',
            'cluster_id' => 'exists:clusters,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $hei->update($request->all());
        return response()->json($hei);
    }

    /**
     * Remove the specified HEI from storage.
     */
    public function destroy(Hei $hei)
    {
        $hei->delete();
        return response()->json(null, 204);
    }

    /**
     * Get HEIs by type.
     */
    public function getByType($type)
    {
        $validator = Validator::make(['type' => $type], [
            'type' => 'required|in:SUC,LUC,Private'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $heis = Hei::where('type', $type)
            ->with(['cluster', 'lucDetails', 'privateDetails', 'sucDetails'])
            ->get();
        return response()->json($heis);
    }

    /**
     * Get HEIs by cluster.
     */
    public function getByCluster($clusterId)
    {
        $heis = Hei::where('cluster_id', $clusterId)
            ->with(['cluster', 'lucDetails', 'privateDetails', 'sucDetails'])
            ->get();
        return response()->json($heis);
    }

    /**
     * Search HEIs by name.
     */
    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'query' => 'required|string|min:3'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $heis = Hei::where('name', 'like', '%' . $request->query . '%')
            ->with(['cluster', 'lucDetails', 'privateDetails', 'sucDetails'])
            ->get();
        return response()->json($heis);
    }
}
