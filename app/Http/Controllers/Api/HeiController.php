<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hei;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HeiController extends Controller
{
    public function index(): JsonResponse
    {
        $heis = Hei::with(['details' => function ($query) {
            $query->orderBy('report_year', 'desc');
        }])->get()->map(function ($hei) {
            return [
                'uiid' => $hei->uiid,
                'name' => $hei->name,
                'current_details' => $hei->details->first(),
                'all_details' => $hei->details,
                'created_at' => $hei->created_at,
                'updated_at' => $hei->updated_at
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $heis
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $hei = Hei::create($validated);
        return response()->json($hei, 201);
    }

    public function show(Hei $hei): JsonResponse
    {
        $hei->load(['details' => function ($query) {
            $query->orderBy('report_year', 'desc');
        }]);

        $data = [
            'uiid' => $hei->uiid,
            'name' => $hei->name,
            'current_details' => $hei->details->first(),
            'all_details' => $hei->details,
            'created_at' => $hei->created_at,
            'updated_at' => $hei->updated_at
        ];

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    public function update(Request $request, Hei $hei): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $hei->update($validated);
        return response()->json($hei);
    }

    public function destroy(Hei $hei): JsonResponse
    {
        $hei->delete();
        return response()->json(null, 204);
    }
}