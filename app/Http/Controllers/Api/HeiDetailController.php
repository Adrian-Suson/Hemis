<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeiDetail;
use App\Models\Hei;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HeiDetailController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'institution_uiid' => 'required|string|exists:institutions,uiid',
            'region' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'municipality' => 'nullable|string|max:255',
            'address_street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:10',
            'institutional_telephone' => 'nullable|string|max:20',
            'institutional_fax' => 'nullable|string|max:20',
            'head_telephone' => 'nullable|string|max:20',
            'institutional_email' => 'nullable|string|max:255|email',
            'institutional_website' => 'nullable|string|max:255|url',
            'year_established' => 'nullable|integer',
            'report_year' => 'required|integer',
            'head_name' => 'nullable|string|max:255',
            'head_title' => 'nullable|string|max:255',
            'head_education' => 'nullable|string|max:255',
            'institution_type' => 'nullable|string|max:255',
            'sec_registration' => 'nullable|string|max:255',
            'year_granted_approved' => 'nullable|integer',
            'year_converted_college' => 'nullable|integer',
            'year_converted_university' => 'nullable|integer',
        ]);

        $detail = HeiDetail::create($validated);
        return response()->json($detail, 201);
    }

    public function show(HeiDetail $detail): JsonResponse
    {
        $detail->load('hei');
        return response()->json($detail);
    }

    public function update(Request $request, HeiDetail $detail): JsonResponse
    {
        $validated = $request->validate([
            'region' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'municipality' => 'nullable|string|max:255',
            'address_street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:10',
            'institutional_telephone' => 'nullable|string|max:20',
            'institutional_fax' => 'nullable|string|max:20',
            'head_telephone' => 'nullable|string|max:20',
            'institutional_email' => 'nullable|string|max:255|email',
            'institutional_website' => 'nullable|string|max:255|url',
            'year_established' => 'nullable|integer',
            'report_year' => 'required|integer',
            'head_name' => 'nullable|string|max:255',
            'head_title' => 'nullable|string|max:255',
            'head_education' => 'nullable|string|max:255',
            'institution_type' => 'nullable|string|max:255',
            'sec_registration' => 'nullable|string|max:255',
            'year_granted_approved' => 'nullable|integer',
            'year_converted_college' => 'nullable|integer',
            'year_converted_university' => 'nullable|integer',
        ]);

        $detail->update($validated);
        return response()->json($detail);
    }

    public function destroy(HeiDetail $detail): JsonResponse
    {
        $detail->delete();
        return response()->json(null, 204);
    }

    public function getByHei(Hei $hei): JsonResponse
    {
        $details = $hei->details()->orderBy('report_year', 'desc')->get();
        return response()->json($details);
    }
}