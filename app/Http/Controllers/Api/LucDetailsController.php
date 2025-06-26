<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LucDetail;
use Illuminate\Http\Request;

class LucDetailsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lucDetails = LucDetail::with(['hei', 'reportYear'])->get();
        return response()->json($lucDetails);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'hei_uiid' => 'required|string|max:36',
            'region' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'municipality' => 'nullable|string|max:255',
            'address_street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:10',
            'institutional_telephone' => 'nullable|string|max:20',
            'institutional_fax' => 'nullable|string|max:20',
            'head_telephone' => 'nullable|string|max:20',
            'institutional_email' => 'nullable|string|max:255',
            'institutional_website' => 'nullable|string|max:255',
            'year_established' => 'nullable|integer',
            'report_year' => 'required|integer',
            'head_name' => 'nullable|string|max:255',
            'head_title' => 'nullable|string|max:255',
            'head_education' => 'nullable|string|max:255',
            'sec_registration' => 'nullable|string|max:255',
            'year_granted_approved' => 'nullable|integer',
            'year_converted_college' => 'nullable|integer',
            'year_converted_university' => 'nullable|integer',
            'x_coordinate' => 'nullable|numeric',
            'y_coordinate' => 'nullable|numeric',
        ]);

        $lucDetail = LucDetail::create($validatedData);
        return response()->json($lucDetail, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $lucDetail = LucDetail::with(['hei', 'reportYear', 'prcGraduates', 'formBCs', 'deanProfiles', 'formE5s'])
            ->findOrFail($id);

        return response()->json($lucDetail);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $lucDetail = LucDetail::findOrFail($id);

        $validatedData = $request->validate([
            'hei_uiid' => 'sometimes|string|max:36',
            'region' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'municipality' => 'nullable|string|max:255',
            'address_street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:10',
            'institutional_telephone' => 'nullable|string|max:20',
            'institutional_fax' => 'nullable|string|max:20',
            'head_telephone' => 'nullable|string|max:20',
            'institutional_email' => 'nullable|string|max:255',
            'institutional_website' => 'nullable|string|max:255',
            'year_established' => 'nullable|integer',
            'report_year' => 'sometimes|integer',
            'head_name' => 'nullable|string|max:255',
            'head_title' => 'nullable|string|max:255',
            'head_education' => 'nullable|string|max:255',
            'sec_registration' => 'nullable|string|max:255',
            'year_granted_approved' => 'nullable|integer',
            'year_converted_college' => 'nullable|integer',
            'year_converted_university' => 'nullable|integer',
            'x_coordinate' => 'nullable|numeric',
            'y_coordinate' => 'nullable|numeric',
        ]);

        $lucDetail->update($validatedData);
        return response()->json($lucDetail);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $lucDetail = LucDetail::findOrFail($id);
        $lucDetail->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
