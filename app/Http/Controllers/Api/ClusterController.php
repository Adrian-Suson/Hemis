<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cluster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClusterController extends Controller
{
    /**
     * Display a listing of the clusters.
     */
    public function index()
    {
        $clusters = Cluster::with('region')->get();
        return response()->json($clusters);
    }

    /**
     * Store a newly created cluster in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'regionID' => 'required|exists:regions,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cluster = Cluster::create($request->all());
        return response()->json($cluster, 201);
    }

    /**
     * Display the specified cluster.
     */
    public function show(Cluster $cluster)
    {
        return response()->json($cluster->load('region', 'heis'));
    }

    /**
     * Update the specified cluster in storage.
     */
    public function update(Request $request, Cluster $cluster)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'regionID' => 'exists:regions,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cluster->update($request->all());
        return response()->json($cluster);
    }

    /**
     * Remove the specified cluster from storage.
     */
    public function destroy(Cluster $cluster)
    {
        $cluster->delete();
        return response()->json(null, 204);
    }

    /**
     * Get all HEIs in a specific cluster.
     */
    public function getHeis(Cluster $cluster)
    {
        $heis = $cluster->heis()->with(['lucDetails', 'privateDetails', 'sucDetails'])->get();
        return response()->json($heis);
    }
}
