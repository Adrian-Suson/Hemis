<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hei;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HeiController extends Controller
{
    /**
     * Display a listing of HEIs.
     */
    public function index(): JsonResponse
    {
        $heis = Hei::with(['sucDetails', 'lucDetails', 'privateDetails'])->get();
        return response()->json($heis);
    }

    /**
     * Store a newly created HEI in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'uiid' => 'required|unique:heis,uiid',
            'name' => 'required|string|max:255',
        ]);

        $hei = Hei::create($validated);
        return response()->json($hei, 201);
    }

    /**
     * Display the specified HEI.
     */
    public function show($uiid): JsonResponse
    {
        $hei = Hei::with(['sucDetails', 'lucDetails', 'privateDetails'])->findOrFail($uiid);
        return response()->json($hei);
    }

    /**
     * Update the specified HEI in storage.
     */
    public function update(Request $request, $uiid): JsonResponse
    {
        $hei = Hei::findOrFail($uiid);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
        ]);

        $hei->update($validated);
        return response()->json($hei);
    }

    /**
     * Remove the specified HEI from storage.
     */
    public function destroy($uiid): JsonResponse
    {
        $hei = Hei::findOrFail($uiid);
        $hei->delete();
        return response()->json(['message' => 'HEI deleted successfully']);
    }

    /**
     * Add a SUC detail to the specified HEI.
     */
    public function addSucDetail(Request $request, $uiid): JsonResponse
    {
        $hei = Hei::findOrFail($uiid);

        $validated = $request->validate([
            'region' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'municipality' => 'nullable|string|max:255',
            'address_street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:10',
            'institutional_telephone' => 'nullable|string|max:20',
            'institutional_fax' => 'nullable|string|max:20',
            'head_telephone' => 'nullable|string|max:20',
            'institutional_email' => 'nullable|email|max:255',
            'institutional_website' => 'nullable|string|max:255',
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

        $sucDetail = $hei->sucDetails()->create($validated);
        return response()->json($sucDetail, 201);
    }

    /**
     * Add a LUC detail to the specified HEI.
     */
    public function addLucDetail(Request $request, $uiid): JsonResponse
    {
        $hei = Hei::findOrFail($uiid);

        $validated = $request->validate([
            'region' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'municipality' => 'nullable|string|max:255',
            'address_street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:10',
            'institutional_telephone' => 'nullable|string|max:20',
            'institutional_fax' => 'nullable|string|max:20',
            'head_telephone' => 'nullable|string|max:20',
            'institutional_email' => 'nullable|email|max:255',
            'institutional_website' => 'nullable|string|max:255',
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

        $lucDetail = $hei->lucDetails()->create($validated);
        return response()->json($lucDetail, 201);
    }

    /**
     * Add a Private detail to the specified HEI.
     */
    public function addPrivateDetail(Request $request, $uiid): JsonResponse
    {
        $hei = Hei::findOrFail($uiid);

        $validated = $request->validate([
            'region' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'municipality' => 'nullable|string|max:255',
            'address_street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:10',
            'institutional_telephone' => 'nullable|string|max:20',
            'institutional_fax' => 'nullable|string|max:20',
            'head_telephone' => 'nullable|string|max:20',
            'institutional_email' => 'nullable|email|max:255',
            'institutional_website' => 'nullable|string|max:255',
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

        $privateDetail = $hei->privateDetails()->create($validated);
        return response()->json($privateDetail, 201);
    }
}
